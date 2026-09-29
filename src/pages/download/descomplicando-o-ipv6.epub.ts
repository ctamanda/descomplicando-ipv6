import type { APIRoute } from 'astro';
import { gerarEpub } from '../../lib/epub/gerar-epub';

// O EPUB é gerado a partir dos Markdown do manual a cada build.
export const GET: APIRoute = async () =>
  new Response(await gerarEpub(), { headers: { 'Content-Type': 'application/epub+zip' } });
