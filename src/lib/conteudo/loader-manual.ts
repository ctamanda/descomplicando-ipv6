import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Loader, LoaderContext } from 'astro/loaders';
import { slugify } from '../slug';

const PASTA_MANUAL = path.resolve('conteudo/manual');
const ARQUIVO_PARTES = path.resolve('conteudo/dados/partes.json');

/**
 * Na página da seção, o título "## N.M" vira o <h1>; os "###" de dentro dela
 * sobem um nível (<h2>) para a hierarquia de títulos não pular do h1 ao h3.
 * Não mexe em linhas dentro de blocos de código.
 */
function subirTitulos(md: string) {
  let emCodigo = false;
  return md
    .split('\n')
    .map((linha) => {
      if (/^\s*(```|~~~)/.test(linha)) emCodigo = !emCodigo;
      return !emCodigo && /^#{3,6} /.test(linha) ? linha.slice(1) : linha;
    })
    .join('\n');
}

type TrechoSecao = { numero: string; ordem: number; titulo: string; corpo: string };
type ParteLida = {
  numero: number;
  titulo: string;
  descricao: string;
  arquivo: string;
  antesDeComecar: string;
  secoes: TrechoSecao[];
  avisos: string[];
};

/** Remove linhas "---" soltas no começo e no fim de um trecho. */
function limparSeparadores(texto: string) {
  return texto.replace(/^(\s*---\s*\n)+/, '').replace(/(\n\s*---\s*)+\s*$/, '').trim();
}

/** Divide um arquivo de parte em "Antes de começar" + seções "## N.M Título". */
export function dividirParte(textoBruto: string, numeroParte: number) {
  const texto = textoBruto
    .replace(/\r\n/g, '\n')
    .replace(/^---\n[\s\S]*?\n---\n/, ''); // cabeçalho YAML opcional

  const titulos = [...texto.matchAll(/^## (.+)$/gm)];
  const avisos: string[] = [];
  let antesDeComecar = '';
  const secoes: TrechoSecao[] = [];

  titulos.forEach((titulo, i) => {
    const inicio = titulo.index! + titulo[0].length;
    const fim = titulos[i + 1]?.index ?? texto.length;
    const corpo = limparSeparadores(texto.slice(inicio, fim));
    const rotulo = titulo[1].trim();

    if (/^Antes de começar$/i.test(rotulo)) {
      antesDeComecar = corpo;
      return;
    }
    const m = rotulo.match(/^(\d+)\.(\d+)\s+(.+)$/);
    if (!m) {
      avisos.push(`título "## ${rotulo}" não segue o padrão "## N.M Título" e foi ignorado`);
      return;
    }
    if (Number(m[1]) !== numeroParte) {
      avisos.push(`seção ${m[1]}.${m[2]} está no arquivo da Parte ${numeroParte}`);
    }
    secoes.push({ numero: `${m[1]}.${m[2]}`, ordem: Number(m[1]) * 1000 + Number(m[2]), titulo: m[3].trim(), corpo });
  });

  return { antesDeComecar, secoes, avisos };
}

async function lerManual(): Promise<ParteLida[]> {
  const titulos: { numero: number; titulo: string; descricao?: string }[] = JSON.parse(await readFile(ARQUIVO_PARTES, 'utf-8'));
  const arquivos = (await readdir(PASTA_MANUAL)).filter((a) => /^parte-\d+-.*\.md$/.test(a));

  const partes = await Promise.all(
    arquivos.map(async (arquivo) => {
      const numero = Number(arquivo.match(/^parte-(\d+)-/)![1]);
      const texto = await readFile(path.join(PASTA_MANUAL, arquivo), 'utf-8');
      const dados = titulos.find((t) => t.numero === numero);
      const titulo = dados?.titulo ?? `Parte ${numero}`;
      return { numero, titulo, descricao: dados?.descricao ?? '', arquivo, ...dividirParte(texto, numero) };
    }),
  );
  return partes.sort((a, b) => a.numero - b.numero);
}

function observar(ctx: LoaderContext, recarregar: () => Promise<void>) {
  ctx.watcher?.add([PASTA_MANUAL, ARQUIVO_PARTES]);
  ctx.watcher?.on('change', async (alterado) => {
    const p = path.resolve(alterado);
    if (p.startsWith(PASTA_MANUAL) || p === ARQUIVO_PARTES) await recarregar();
  });
}

/** Uma entrada por seção do manual (id "3.5"). */
export function loaderSecoes(): Loader {
  return {
    name: 'manual-secoes',
    async load(ctx) {
      const sincronizar = async () => {
        const partes = await lerManual();
        ctx.store.clear();
        const slugs = new Map<string, string>();

        for (const parte of partes) {
          parte.avisos.forEach((a) => ctx.logger.warn(`${parte.arquivo}: ${a}`));
          const fileURL = pathToFileURL(path.join(PASTA_MANUAL, parte.arquivo));

          for (const s of parte.secoes) {
            const slug = slugify(`${s.numero} ${s.titulo}`);
            if (slugs.has(slug)) throw new Error(`Slug repetido "${slug}" (seções ${slugs.get(slug)} e ${s.numero}).`);
            slugs.set(slug, s.numero);

            const data = await ctx.parseData({
              id: s.numero,
              data: { numero: s.numero, titulo: s.titulo, slug, ordem: s.ordem, parte: parte.numero, parteTitulo: parte.titulo },
            });
            ctx.store.set({
              id: s.numero,
              data,
              body: s.corpo,
              rendered: await ctx.renderMarkdown(subirTitulos(s.corpo), { fileURL }),
              digest: ctx.generateDigest(s.corpo + JSON.stringify(data)),
            });
          }
        }
      };
      await sincronizar();
      observar(ctx, sincronizar);
    },
  };
}

/** Uma entrada por parte (id "parte-3"), com o texto de "Antes de começar". */
export function loaderPartes(): Loader {
  return {
    name: 'manual-partes',
    async load(ctx) {
      const sincronizar = async () => {
        const partes = await lerManual();
        ctx.store.clear();
        for (const parte of partes) {
          const id = `parte-${parte.numero}`;
          const data = await ctx.parseData({
            id,
            data: { numero: parte.numero, titulo: parte.titulo, descricao: parte.descricao, secoes: parte.secoes.map((s) => s.numero) },
          });
          ctx.store.set({
            id,
            data,
            body: parte.antesDeComecar,
            rendered: await ctx.renderMarkdown(parte.antesDeComecar, {
              fileURL: pathToFileURL(path.join(PASTA_MANUAL, parte.arquivo)),
            }),
            digest: ctx.generateDigest(parte.antesDeComecar + JSON.stringify(data)),
          });
        }
      };
      await sincronizar();
      observar(ctx, sincronizar);
    },
  };
}
