import type { APIRoute } from 'astro';
import { lerPdf } from '../../lib/downloads';

// Copia o PDF de conteudo/arquivos/ para o site. Para atualizar, basta trocar o arquivo lá.
export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await lerPdf()), { headers: { 'Content-Type': 'application/pdf' } });
