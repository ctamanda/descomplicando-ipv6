/**
 * Resultados do quiz, guardados só neste navegador (localStorage).
 * Cada tentativa guarda a nota e quais questões foram erradas, para montar
 * os dados de aprendizagem: evolução, melhor nota e seções mais erradas.
 */
const CHAVE = 'ipv6:quiz';
const MAX_TENTATIVAS = 20;

export type Tentativa = {
  data: string; // ISO
  acertos: number;
  total: number;
  erradas: string[]; // ids das questões
  secoesErradas: string[]; // "3.5", repetido se errou mais de uma da mesma seção
  desafio?: boolean; // feita no modo desafio (com tempo)
  modo?: 'quiz' | 'desafio';
  dificuldade?: 'facil' | 'medio' | 'dificil';
  tempoTotalMs?: number;
  semResposta?: number;
  tempoMedioMs?: number;
};

type Progresso = Record<string, { tentativas: Tentativa[] }>;

function ler(): Progresso {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) ?? '{}');
  } catch {
    return {};
  }
}

export function tentativasDoNivel(nivel: string): Tentativa[] {
  return ler()[nivel]?.tentativas ?? [];
}

export function salvarTentativa(nivel: string, t: Tentativa) {
  const p = ler();
  const lista = [...(p[nivel]?.tentativas ?? []), t].slice(-MAX_TENTATIVAS);
  p[nivel] = { tentativas: lista };
  try {
    localStorage.setItem(CHAVE, JSON.stringify(p));
  } catch {
    /* sem armazenamento: o resultado vale só nesta visita */
  }
}

export function limparProgresso() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {}
}

export function melhor(tentativas: Tentativa[]) {
  return tentativas.reduce<Tentativa | null>(
    (m, t) => (!m || t.acertos / t.total > m.acertos / m.total ? t : m),
    null,
  );
}

/** Seções mais erradas em todas as tentativas do nível, da mais para a menos errada. */
export function secoesMaisErradas(tentativas: Tentativa[]) {
  const conta = new Map<string, number>();
  for (const t of tentativas) for (const s of t.secoesErradas) conta.set(s, (conta.get(s) ?? 0) + 1);
  return [...conta.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], undefined, { numeric: true }));
}

/** Faixa de desempenho pela porcentagem de acertos. */
export function faixa(pct: number) {
  if (pct >= 90)
    return { rotulo: 'Excelente', tom: 'otimo', mensagem: 'Você domina o conteúdo. Experimente o Desafio no nível Difícil.' };
  if (pct >= 70)
    return {
      rotulo: 'Bom domínio',
      tom: 'otimo',
      mensagem: 'Você está bem. Revise os tópicos abaixo para fechar as lacunas.',
    };
  if (pct >= 50)
    return {
      rotulo: 'Em construção',
      tom: 'medio',
      mensagem: 'A base está aí, mas vale reler as seções indicadas antes de tentar de novo.',
    };
  return {
    rotulo: 'Precisa revisar',
    tom: 'revisar',
    mensagem: 'Volte ao manual pelas seções abaixo e refaça o quiz depois.',
  };
}
