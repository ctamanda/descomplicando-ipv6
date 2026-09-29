/**
 * A ordem das páginas do livro, como num livro impresso:
 *
 *   capa (início) → sumário → apresentação → partes 1 a 6 (abertura + seções)
 *   → apêndice A: exercícios → apêndice B: quiz → apêndice C: glossário
 *   → apêndice D: download → referências (última página)
 *
 * Daqui saem Anterior/Próxima de todas as páginas, a espessura das folhas
 * empilhadas, as abas da borda e a direção da virada ao navegar.
 */
import { rotas } from '../rotas';
import { getSumario } from './manual';

export type PaginaDoLivro = {
  chave: string; // "sumario", "parte-3", "3.5", "exercicios"...
  href: string;
  titulo: string; // "3.5 Representação e abreviação de endereços"
  rotulo: string; // curto, para a barra de páginas: "3.5"
  aba: string; // a qual aba pertence
};

export type Aba = { chave: string; marca: string; titulo: string; href: string; tipo: 'sumario' | 'parte' | 'apendice' };

export const CAPA = { href: rotas.inicio, titulo: 'Capa do livro' };

export async function getOrdemDoLivro(): Promise<PaginaDoLivro[]> {
  const sumario = await getSumario();
  const paginas: PaginaDoLivro[] = [
    { chave: 'sumario', href: rotas.manual, titulo: 'Sumário', rotulo: 'Sumário', aba: 'sumario' },
    { chave: 'apresentacao', href: rotas.sobre, titulo: 'Apresentação', rotulo: 'Apresentação', aba: 'sumario' },
  ];
  for (const { parte, secoes } of sumario) {
    const n = parte.data.numero;
    paginas.push({ chave: `parte-${n}`, href: rotas.parte(n), titulo: `Parte ${n} · ${parte.data.titulo}`, rotulo: `Parte ${n}`, aba: `parte-${n}` });
    for (const s of secoes) {
      paginas.push({ chave: s.id, href: rotas.secao(s.data), titulo: `${s.data.numero} ${s.data.titulo}`, rotulo: s.data.numero, aba: `parte-${n}` });
    }
  }
  paginas.push(
    { chave: 'exercicios', href: rotas.exercicios, titulo: 'Apêndice A · Exercícios', rotulo: 'Exercícios', aba: 'exercicios' },
    { chave: 'quiz', href: rotas.quiz, titulo: 'Apêndice B · Quiz', rotulo: 'Quiz', aba: 'quiz' },
    { chave: 'glossario', href: rotas.glossario, titulo: 'Apêndice C · Glossário', rotulo: 'Glossário', aba: 'glossario' },
    { chave: 'download', href: rotas.download, titulo: 'Apêndice D · Download', rotulo: 'Download', aba: 'download' },
    { chave: 'referencias', href: rotas.referencias, titulo: 'Referências', rotulo: 'Referências', aba: 'referencias' },
  );
  return paginas;
}

export async function getAbas(): Promise<Aba[]> {
  const sumario = await getSumario();
  return [
    { chave: 'sumario', marca: 'S', titulo: 'Sumário', href: rotas.manual, tipo: 'sumario' },
    ...sumario.map(({ parte }) => ({
      chave: `parte-${parte.data.numero}`,
      marca: String(parte.data.numero),
      titulo: `Parte ${parte.data.numero} · ${parte.data.titulo}`,
      href: rotas.parte(parte.data.numero),
      tipo: 'parte' as const,
    })),
    { chave: 'exercicios', marca: 'A', titulo: 'Apêndice A · Exercícios', href: rotas.exercicios, tipo: 'apendice' },
    { chave: 'quiz', marca: 'B', titulo: 'Apêndice B · Quiz', href: rotas.quiz, tipo: 'apendice' },
    { chave: 'glossario', marca: 'C', titulo: 'Apêndice C · Glossário', href: rotas.glossario, tipo: 'apendice' },
    { chave: 'download', marca: 'D', titulo: 'Apêndice D · Download', href: rotas.download, tipo: 'apendice' },
  ];
}

export type Destino = { href: string; rotulo: string; titulo: string };

/** Página do livro, vizinhas e posição (0 a 1). `chave` pode apontar para uma página "filha" (ex.: um nível do quiz). */
export async function getPaginaDoLivro(chave: string) {
  const ordem = await getOrdemDoLivro();
  const i = ordem.findIndex((p) => p.chave === chave);
  if (i < 0) throw new Error(`Página "${chave}" não está na ordem do livro.`);
  const ant = ordem[i - 1];
  const prox = ordem[i + 1];
  return {
    pagina: ordem[i],
    indice: i,
    progresso: i / (ordem.length - 1),
    anterior: (ant
      ? { href: ant.href, rotulo: 'Página anterior', titulo: ant.titulo }
      : { href: CAPA.href, rotulo: 'Voltar à', titulo: 'Capa do livro' }) as Destino,
    proxima: (prox
      ? { href: prox.href, rotulo: 'Próxima página', titulo: prox.titulo }
      : { href: CAPA.href, rotulo: 'Fechar o livro', titulo: 'Voltar à capa' }) as Destino,
    /** hrefs na ordem, para o script saber a direção da virada */
    hrefs: ordem.map((p) => p.href),
  };
}
