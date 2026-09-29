import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Loader } from 'astro/loaders';

const PASTA = path.resolve('conteudo/paginas');

/**
 * Páginas avulsas (conteudo/paginas/*.md), id = nome do arquivo ("sobre").
 * Se o arquivo tem um único "## Título" logo no começo (caso de referencias.md),
 * ele vira o título da página e sai do corpo, para não repetir o título.
 */
export function loaderPaginas(): Loader {
  return {
    name: 'paginas',
    async load(ctx) {
      const sincronizar = async () => {
        ctx.store.clear();
        const arquivos = (await readdir(PASTA)).filter((a) => a.endsWith('.md'));
        for (const arquivo of arquivos) {
          const id = arquivo.replace(/\.md$/, '');
          const texto = (await readFile(path.join(PASTA, arquivo), 'utf-8')).replace(/\r\n/g, '\n');
          const titulos = [...texto.matchAll(/^## (.+)$/gm)];

          let titulo = id.charAt(0).toUpperCase() + id.slice(1);
          let corpo = texto;
          if (titulos.length === 1 && texto.trimStart().startsWith('## ')) {
            titulo = titulos[0][1].trim();
            corpo = texto.replace(titulos[0][0], '').trim();
          }

          const data = await ctx.parseData({ id, data: { titulo } });
          ctx.store.set({
            id,
            data,
            body: corpo,
            rendered: await ctx.renderMarkdown(corpo, { fileURL: pathToFileURL(path.join(PASTA, arquivo)) }),
            digest: ctx.generateDigest(corpo),
          });
        }
      };
      await sincronizar();
      ctx.watcher?.add(PASTA);
      ctx.watcher?.on('change', async (p) => {
        if (path.resolve(p).startsWith(PASTA)) await sincronizar();
      });
    },
  };
}
