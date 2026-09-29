/** Arquivos para baixar: o PDF (em conteudo/arquivos) e o EPUB (gerado no build). */
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gerarEpub } from './epub/gerar-epub';
import { url } from './rotas';

export const ARQUIVO_PDF = path.resolve('conteudo/arquivos/Descomplicando-o-IPv6.pdf');

export const lerPdf = () => readFile(ARQUIVO_PDF);

/** 1401819 -> "1,3 MB"; 180000 -> "176 KB" */
export function tamanho(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export async function getDownloads() {
  const [pdf, epub] = await Promise.all([stat(ARQUIVO_PDF), gerarEpub()]);
  return {
    pdf: { href: url('download/descomplicando-o-ipv6.pdf'), nome: 'descomplicando-o-ipv6.pdf', tamanho: tamanho(pdf.size) },
    epub: { href: url('download/descomplicando-o-ipv6.epub'), nome: 'descomplicando-o-ipv6.epub', tamanho: tamanho(epub.byteLength) },
  };
}
