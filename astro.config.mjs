// @ts-check
import { defineConfig } from 'astro/config';
import remarkBlocos from './src/lib/markdown/remark-blocos.ts';
import remarkSobrescrito from './src/lib/markdown/remark-sobrescrito.ts';
import remarkGlossario from './src/lib/markdown/remark-glossario.ts';
import { rehypeTabelas, rehypeTitulos } from './src/lib/markdown/rehype-manual.ts';

// Publicado em https://ctamanda.github.io/descomplicando-ipv6/.
// Para outro endereço (Cloudflare Pages, Vercel), defina SITE_URL e BASE_PATH=/.
const base = process.env.BASE_PATH || '/descomplicando-ipv6';

export default defineConfig({
  site: process.env.SITE_URL || 'https://ctamanda.github.io',
  base,
  trailingSlash: 'always',
  // Pré-carrega páginas (ao passar o mouse nos links, e as vizinhas do livro via script)
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  markdown: {
    remarkPlugins: [remarkBlocos, remarkSobrescrito, [remarkGlossario, { base }]],
    rehypePlugins: [rehypeTitulos, rehypeTabelas],
  },
});
