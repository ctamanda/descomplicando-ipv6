import { readFileSync } from 'node:fs';
import path from 'node:path';
import { slugify } from '../slug';

/**
 * Liga termos do glossário ao texto das seções do manual, na primeira
 * ocorrência de cada termo na página. Regras:
 * - só em texto corrido: nunca em títulos, código, links ou blocos didáticos;
 * - palavra inteira (não liga "rede" dentro de "redes" nem de "subrede");
 * - siglas e nomes com maiúsculas (DAD, Router Advertisement) diferenciam
 *   maiúsculas; termos comuns (roteador) não, e aceitam plural em -s/-es;
 * - termos mais longos têm prioridade ("endereço IP" antes de "IP").
 */

type Termo = { termo: string; sinonimos?: string[]; definicao: string };
type No = { type: string; value?: string; url?: string; title?: string; children?: No[]; data?: Record<string, unknown> };

const ARQUIVO = path.resolve('conteudo/dados/glossario.json');
const PULAR = new Set(['heading', 'inlineCode', 'code', 'link', 'linkReference', 'bloco', 'resposta', 'html', 'table']);

function carregar(): Termo[] {
  try {
    return JSON.parse(readFileSync(ARQUIVO, 'utf-8'));
  } catch {
    return [];
  }
}

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

type Padrao = { slug: string; definicao: string; re: RegExp };

function montarPadroes(termos: Termo[]): Padrao[] {
  const padroes: (Padrao & { tamanho: number })[] = [];
  for (const t of termos) {
    const slug = slugify(t.termo);
    // "unique local (ULA)" -> também "unique local" e "ULA"
    const formas = new Set([t.termo, ...(t.sinonimos ?? [])]);
    const parenteses = t.termo.match(/^(.+?)\s*\((.+)\)$/);
    if (parenteses) {
      formas.add(parenteses[1]);
      formas.add(parenteses[2]);
    }
    for (const forma of formas) {
      const temMaiuscula = /[A-Z]/.test(forma);
      const plural = !temMaiuscula && !/\s/.test(forma) ? '(?:e?s)?' : '';
      const re = new RegExp(`(?<![\\p{L}\\p{N}_:./-])${escapar(forma)}${plural}(?![\\p{L}\\p{N}_])`, temMaiuscula ? 'u' : 'iu');
      padroes.push({ slug, definicao: t.definicao, re, tamanho: forma.length });
    }
  }
  return padroes.sort((a, b) => b.tamanho - a.tamanho);
}

export default function remarkGlossario(opcoes: { base?: string } = {}) {
  const base = (opcoes.base ?? '/').replace(/\/?$/, '/');
  const padroes = montarPadroes(carregar());

  return (raiz: No, arquivo: { path?: string; history?: string[] }) => {
    const origem = arquivo.path ?? arquivo.history?.[0] ?? '';
    if (!padroes.length || !/conteudo[\\/]manual/.test(origem)) return; // só nas páginas do manual

    const usados = new Set<string>();

    const percorrer = (no: No) => {
      if (!no.children) return;
      for (let i = 0; i < no.children.length; i++) {
        const filho = no.children[i];
        if (PULAR.has(filho.type)) continue;
        if (filho.type !== 'text') {
          percorrer(filho);
          continue;
        }

        // Primeiro termo ainda não usado que aparece neste texto (o mais à esquerda)
        let melhor: { p: Padrao; inicio: number; fim: number } | null = null;
        for (const p of padroes) {
          if (usados.has(p.slug)) continue;
          const m = p.re.exec(filho.value!);
          if (m && (!melhor || m.index < melhor.inicio)) melhor = { p, inicio: m.index, fim: m.index + m[0].length };
        }
        if (!melhor) continue;

        usados.add(melhor.p.slug);
        const texto = filho.value!;
        const novos: No[] = [];
        if (melhor.inicio > 0) novos.push({ type: 'text', value: texto.slice(0, melhor.inicio) });
        novos.push({
          type: 'link',
          url: `${base}glossario/#${melhor.p.slug}`,
          title: melhor.p.definicao,
          data: { hProperties: { className: ['termo-glossario'] } },
          children: [{ type: 'text', value: texto.slice(melhor.inicio, melhor.fim) }],
        });
        if (melhor.fim < texto.length) novos.push({ type: 'text', value: texto.slice(melhor.fim) });
        no.children.splice(i, 1, ...novos);
        // o resto do texto (depois do link) volta para a fila e pode ter outro termo
        i += novos.length - (melhor.fim < texto.length ? 2 : 1);
      }
    };
    percorrer(raiz);
  };
}
