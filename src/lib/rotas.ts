/** Todas as URLs do site passam por aqui, para funcionar também em /nome-do-repo/ no GitHub Pages. */
const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');

export const url = (caminho = '') => BASE + caminho.replace(/^\//, '');

export const rotas = {
  inicio: url(),
  manual: url('manual/'),
  parte: (n: number) => url(`manual/parte-${n}/`),
  secao: (s: { parte: number; slug: string }) => url(`manual/parte-${s.parte}/${s.slug}/`),
  exercicios: url('exercicios/'),
  quiz: url('quiz/'),
  glossario: url('glossario/'),
  download: url('download/'),
  referencias: url('referencias/'),
  sobre: url('sobre/'),
};

export const MENU = [
  { chave: 'manual', rotulo: 'Sumário', href: rotas.manual },
  { chave: 'exercicios', rotulo: 'Exercícios', href: rotas.exercicios },
  { chave: 'quiz', rotulo: 'Quiz', href: rotas.quiz },
  { chave: 'glossario', rotulo: 'Glossário', href: rotas.glossario },
] as const;
