/**
 * Índice de exercícios: todos os blocos "Vamos praticar" e os exercícios da
 * seção 4.7 ("### Exercício N" seguido de "**Resolução.**").
 */
import { renderizar } from '../markdown/processador';
import { getSumario, type Parte, type Secao } from './manual';

export type Exercicio = {
  id: string;
  /** "Vamos praticar" ou "Exercício 3" */
  titulo: string;
  html: string;
};

export type GrupoDeExercicios = { secao: Secao; exercicios: Exercicio[] };

/** Blockquotes que começam com "> **Vamos praticar**" (linhas seguidas que começam com ">"). */
function blocosDePratica(md: string): string[] {
  const linhas = md.replace(/\r\n/g, '\n').split('\n');
  const blocos: string[] = [];
  for (let i = 0; i < linhas.length; i++) {
    if (!/^>\s*\*\*Vamos praticar\*\*/.test(linhas[i])) continue;
    let fim = i;
    while (fim + 1 < linhas.length && linhas[fim + 1].startsWith('>')) fim++;
    blocos.push(linhas.slice(i, fim + 1).join('\n'));
    i = fim;
  }
  return blocos;
}

/** "### Exercício N" até o próximo título ### ou até um bloco didático. */
function exerciciosNumerados(md: string): { titulo: string; corpo: string }[] {
  const partes = md.replace(/\r\n/g, '\n').split(/^### /m).slice(1);
  return partes
    .filter((p) => /^Exercício \d+/.test(p))
    .map((p) => {
      const [titulo, ...resto] = p.split('\n');
      const corpo = resto.join('\n').split(/^> \*\*/m)[0].trim();
      return { titulo: titulo.trim(), corpo };
    });
}

export async function getExercicios(): Promise<{ parte: Parte; grupos: GrupoDeExercicios[] }[]> {
  const sumario = await getSumario();
  return Promise.all(
    sumario.map(async ({ parte, secoes }) => {
      const grupos: GrupoDeExercicios[] = [];
      for (const secao of secoes) {
        const md = secao.body ?? '';
        const exercicios: Exercicio[] = [];

        for (const [n, { titulo, corpo }] of exerciciosNumerados(md).entries()) {
          exercicios.push({ id: `${secao.id}-ex-${n + 1}`, titulo, html: await renderizar(corpo) });
        }
        for (const [n, bloco] of blocosDePratica(md).entries()) {
          exercicios.push({ id: `${secao.id}-pratica-${n + 1}`, titulo: 'Vamos praticar', html: await renderizar(bloco) });
        }
        if (exercicios.length) grupos.push({ secao, exercicios });
      }
      return { parte, grupos };
    }),
  );
}
