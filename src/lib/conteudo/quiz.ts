/**
 * Banco de questões (conteudo/quiz.json), validado no build: se uma questão
 * tiver erro de formato ou citar uma seção que não existe, o build para e diz qual.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'astro/zod';
import { getSecoes } from './manual';
import { rotas } from '../rotas';

export const NIVEIS = [
  {
    id: 'basico',
    nome: 'Básico',
    partes: [1, 2],
    descricao: 'Redes, endereços IP, o esgotamento do IPv4 e o que o IPv6 muda.',
  },
  {
    id: 'intermediario',
    nome: 'Intermediário',
    partes: [3, 4],
    descricao: 'Ler, abreviar e expandir endereços, reconhecer os tipos de endereço, prefixos e sub-redes.',
  },
  {
    id: 'avancado',
    nome: 'Avançado',
    partes: [4, 5, 6],
    descricao: 'Sub-redes na prática, descoberta de vizinhos, autoconfiguração, DNS, roteamento e convivência com o IPv4.',
  },
] as const;

export type NivelId = (typeof NIVEIS)[number]['id'];

/** Quantas questões são sorteadas por rodada. */
export const QUESTOES_POR_RODADA = 10;

const esquema = z.array(
  z
    .object({
      id: z.string().min(1),
      nivel: z.enum(['basico', 'intermediario', 'avancado']),
      secao: z.string().regex(/^\d+\.\d+$/),
      enunciado: z.string().min(1),
      alternativas: z.array(z.string().min(1)).min(2).max(6),
      correta: z.number().int().min(0),
      explicacao: z.string().min(1),
    })
    .refine((q) => q.correta < q.alternativas.length, { message: '"correta" aponta para uma alternativa que não existe' }),
);

export type QuestaoDoSite = {
  id: string;
  parte: number;
  secao: string;
  secaoTitulo: string;
  href: string;
  enunciado: string;
  alternativas: string[];
  correta: number;
  explicacao: string;
};

export async function getQuestoes(nivel?: NivelId): Promise<QuestaoDoSite[]> {
  const bruto = JSON.parse(await readFile(path.resolve('conteudo/quiz.json'), 'utf-8'));
  const resultado = esquema.safeParse(bruto);
  if (!resultado.success) {
    const erro = resultado.error.issues[0];
    const q = bruto[erro.path[0] as number];
    throw new Error(`conteudo/quiz.json: questão ${q?.id ?? erro.path[0]}: ${erro.message} (${erro.path.join('.')})`);
  }

  const ids = new Set<string>();
  const secoes = await getSecoes();
  return resultado.data
    .filter((q) => !nivel || q.nivel === nivel)
    .map((q) => {
      if (ids.has(q.id)) throw new Error(`conteudo/quiz.json: id repetido "${q.id}".`);
      ids.add(q.id);
      const s = secoes.find((x) => x.data.numero === q.secao);
      if (!s) throw new Error(`conteudo/quiz.json: questão ${q.id} cita a seção ${q.secao}, que não existe no manual.`);
      return {
        id: q.id,
        parte: s.data.parte,
        secao: q.secao,
        secaoTitulo: s.data.titulo,
        href: rotas.secao(s.data),
        enunciado: q.enunciado,
        alternativas: q.alternativas,
        correta: q.correta,
        explicacao: q.explicacao,
      };
    });
}
