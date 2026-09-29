import { getCollection, type CollectionEntry } from 'astro:content';
import { rotas } from '../rotas';

export type Secao = CollectionEntry<'secoes'>;
export type Parte = CollectionEntry<'partes'>;
export type Destino = { href: string; rotulo: string; titulo: string };

export async function getSecoes() {
  return (await getCollection('secoes')).sort((a, b) => a.data.ordem - b.data.ordem);
}

export async function getPartes() {
  return (await getCollection('partes')).sort((a, b) => a.data.numero - b.data.numero);
}

/** Sumário: cada parte com as suas seções, na ordem. */
export async function getSumario() {
  const [partes, secoes] = await Promise.all([getPartes(), getSecoes()]);
  return partes.map((parte) => ({
    parte,
    secoes: secoes.filter((s) => s.data.parte === parte.data.numero),
  }));
}

/**
 * Anterior e próxima de uma seção. Nas bordas de uma parte, leva à abertura
 * da parte; depois da última seção do manual, leva ao Quiz.
 */
export function vizinhos(secao: Secao, secoes: Secao[]): { anterior: Destino; proxima: Destino } {
  const i = secoes.findIndex((s) => s.id === secao.id);
  const ant = secoes[i - 1];
  const prox = secoes[i + 1];
  const { parte } = secao.data;

  const anterior: Destino =
    ant && ant.data.parte === parte
      ? { href: rotas.secao(ant.data), rotulo: 'Seção anterior', titulo: `${ant.data.numero} ${ant.data.titulo}` }
      : { href: rotas.parte(parte), rotulo: 'Voltar à abertura', titulo: `Parte ${parte} · ${secao.data.parteTitulo}` };

  const proxima: Destino = prox
    ? prox.data.parte === parte
      ? { href: rotas.secao(prox.data), rotulo: 'Próxima seção', titulo: `${prox.data.numero} ${prox.data.titulo}` }
      : { href: rotas.parte(prox.data.parte), rotulo: 'Próxima parte', titulo: `Parte ${prox.data.parte} · ${prox.data.parteTitulo}` }
    : { href: rotas.quiz, rotulo: 'Fim do manual', titulo: 'Testar o que aprendi no Quiz' };

  return { anterior, proxima };
}

/** Anterior e próxima da abertura de uma parte: última seção da parte anterior e primeira desta. */
export function vizinhosDaParte(parte: Parte, secoes: Secao[]): { anterior: Destino; proxima: Destino } {
  const n = parte.data.numero;
  const ultimaAnterior = secoes.filter((s) => s.data.parte < n).at(-1);
  const primeira = secoes.find((s) => s.data.parte === n);

  const anterior: Destino = ultimaAnterior
    ? { href: rotas.secao(ultimaAnterior.data), rotulo: 'Seção anterior', titulo: `${ultimaAnterior.data.numero} ${ultimaAnterior.data.titulo}` }
    : { href: rotas.manual, rotulo: 'Voltar à', titulo: 'Capa do manual' };
  const proxima: Destino = primeira
    ? { href: rotas.secao(primeira.data), rotulo: 'Começar a leitura', titulo: `${primeira.data.numero} ${primeira.data.titulo}` }
    : { href: rotas.manual, rotulo: 'Voltar à', titulo: 'Capa do manual' };

  return { anterior, proxima };
}

/** Posição (0 a 1) de uma seção, ou da abertura de uma parte, no manual inteiro. */
export function progressoNoManual(alvo: Secao | Parte, secoes: Secao[]) {
  const i =
    'slug' in alvo.data
      ? secoes.findIndex((s) => s.id === alvo.id)
      : secoes.findIndex((s) => s.data.parte === (alvo as Parte).data.numero) - 0.5;
  return Math.min(1, Math.max(0, i / Math.max(1, secoes.length - 1)));
}
