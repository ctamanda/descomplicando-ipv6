import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const PASTA = path.resolve('conteudo/manual/imagens');
const TIPOS: Record<string, string> = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export async function getStaticPaths() {
  const arquivos = await readdir(PASTA);
  const png = await readdir(path.join(PASTA, 'png'));
  const nomes = [
    ...arquivos.filter((nome) => TIPOS[path.extname(nome).toLowerCase()]).map((nome) => ({ url: nome, arquivo: nome })),
    ...png.filter((nome) => TIPOS[path.extname(nome).toLowerCase()]).map((nome) => ({ url: `png/${nome}`, arquivo: `png/${nome}` })),
  ];
  return nomes.map(({ url, arquivo }) => ({ params: { nome: url }, props: { nome: arquivo } }));
}

export async function GET({ props }: { props: { nome: string } }) {
  const nome = props.nome.replace(/\\/g, '/');
  const extensao = path.extname(nome).toLowerCase();
  if (!TIPOS[extensao]) return new Response('Imagem não encontrada', { status: 404 });

  let arquivo = path.join(PASTA, nome);
  try {
    return new Response(await readFile(arquivo), { headers: { 'Content-Type': TIPOS[extensao], 'Cache-Control': 'public, max-age=31536000, immutable' } });
  } catch {
    arquivo = path.join(PASTA, path.basename(nome));
    try {
      return new Response(await readFile(arquivo), { headers: { 'Content-Type': TIPOS[extensao], 'Cache-Control': 'public, max-age=31536000, immutable' } });
    } catch {
      return new Response('Imagem não encontrada', { status: 404 });
    }
  }
}
