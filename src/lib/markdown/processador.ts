/**
 * Markdown -> HTML fora do pipeline de páginas do Astro, com os mesmos plugins
 * do manual. Usado para trechos (índice de exercícios) e para o EPUB (XHTML).
 */
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkSmartypants from 'remark-smartypants';
import { unified, type Pluggable } from 'unified';
import remarkBlocos from './remark-blocos';
import remarkSobrescrito from './remark-sobrescrito';
import { rehypeTabelas, rehypeTitulos } from './rehype-manual';

function criar(extrasRehype: Pluggable[] = []) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkSmartypants)
    .use(remarkBlocos as any)
    .use(remarkSobrescrito as any)
    .use(remarkRehype)
    .use(rehypeTitulos as any)
    .use(rehypeTabelas as any)
    .use(extrasRehype)
    .use(rehypeStringify, { closeSelfClosing: true, closeEmptyElements: true });
}

/** Cria uma função de renderização; `extrasRehype` entra depois dos plugins do manual. */
export function criarRenderizador(extrasRehype: Pluggable[] = []) {
  const processador = criar(extrasRehype);
  return async (md: string) => String(await processador.process(md));
}

export const renderizar = criarRenderizador();
