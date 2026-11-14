import { faixa, melhor, salvarTentativa, tentativasDoNivel, limparProgresso, type Tentativa } from './quiz-progresso';

type Questao = {
  id: string; parte: number; parteTitulo: string; nivel: string; secao: string; secaoTitulo: string; href: string;
  enunciado: string; alternativas: string[]; correta: number; explicacao: string;
};
type Dados = { questoes: Questao[]; urlQuiz: string; urlManual: string };
type Dificuldade = 'facil' | 'medio' | 'dificil';
type Rodada = { questao: Questao; ordem: number[]; escolhida: number | null; tempoMs: number };
const CONFIG: Record<Dificuldade, { nome: string; total: number; segundos: number; niveis: string[] }> = {
  facil: { nome: 'Fácil', total: 10, segundos: 45, niveis: ['basico'] },
  medio: { nome: 'Médio', total: 15, segundos: 30, niveis: ['basico', 'intermediario'] },
  dificil: { nome: 'Difícil', total: 20, segundos: 20, niveis: ['basico', 'intermediario', 'avancado'] },
};
const LETRAS = 'ABCDEF';
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const embaralhar = <T,>(lista: T[]) => {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const chave = (modo: 'quiz' | 'desafio', dificuldade?: Dificuldade) => modo === 'quiz' ? 'quiz' : `desafio-${dificuldade}`;
const inicializados = new WeakSet<HTMLElement>();

function sortear(questoes: Questao[], total: number, niveis?: string[], metadeAvancado = false) {
  const banco = niveis ? questoes.filter((q) => niveis.includes(q.nivel)) : questoes;
  const porParte = new Map<number, Questao[]>();
  for (const q of banco) porParte.set(q.parte, [...(porParte.get(q.parte) ?? []), q]);
  if (metadeAvancado) {
    const avancadas = embaralhar(banco.filter((q) => q.nivel === 'avancado')).slice(0, Math.ceil(total / 2));
    const restantes = embaralhar(banco.filter((q) => !avancadas.includes(q))).slice(0, total - avancadas.length);
    return embaralhar([...avancadas, ...restantes]).slice(0, Math.min(total, banco.length));
  }
  const escolhidas = [...porParte.values()].map((grupo) => embaralhar(grupo)[0]);
  return embaralhar([...escolhidas, ...embaralhar(banco.filter((q) => !escolhidas.includes(q)))])
    .slice(0, Math.min(total, banco.length));
}

export function iniciarQuiz() {
  document.querySelectorAll<HTMLElement>('[data-quiz]').forEach((raiz) => iniciarQuizRaiz(raiz));
}

function iniciarQuizRaiz(raiz: HTMLElement) {
  const fonte = document.getElementById('dados-quiz');
  if (!fonte || inicializados.has(raiz)) return;
  inicializados.add(raiz);
  raiz.dataset.pronto = 'true';
  const dados: Dados = JSON.parse(fonte.textContent!);
  const telaInicio = raiz.querySelector<HTMLElement>('[data-tela="inicio"]')!;
  const telaRegras = raiz.querySelector<HTMLElement>('[data-tela="regras"]')!;
  const telaQuestao = raiz.querySelector<HTMLElement>('[data-tela="questao"]')!;
  const telaResultado = raiz.querySelector<HTMLElement>('[data-tela="resultado"]')!;
  const contador = raiz.querySelector<HTMLElement>('[data-contador]')!;
  const barra = raiz.querySelector<HTMLElement>('[data-barra]')!;
  const parte = raiz.querySelector<HTMLElement>('[data-parte]')!;
  const passos = raiz.querySelector<HTMLElement>('[data-passos]')!;
  const legendaPassos = raiz.querySelector<HTMLElement>('[data-legenda-passos]')!;
  const enunciado = raiz.querySelector<HTMLElement>('[data-enunciado]')!;
  const lista = raiz.querySelector<HTMLElement>('[data-alternativas]')!;
  const retorno = raiz.querySelector<HTMLElement>('[data-feedback]')!;
  const avancar = raiz.querySelector<HTMLButtonElement>('[data-avancar]')!;
  const cronometro = raiz.querySelector<HTMLElement>('[data-cronometro]')!;
  const anel = raiz.querySelector<SVGCircleElement>('[data-anel]')!;
  const segundos = raiz.querySelector<HTMLElement>('[data-segundos]')!;
  const encerrar = document.querySelector<HTMLButtonElement>('[data-encerrar]')!;
  const modoCabecalho = document.querySelector<HTMLElement>('[data-modo-cabecalho]')!;
  const circunferencia = 2 * Math.PI * 46;
  anel.style.strokeDasharray = `${circunferencia}`;

  let modo: 'quiz' | 'desafio' = 'quiz';
  let dificuldade: Dificuldade | undefined;
  let rodada: Rodada[] = [];
  let atual = 0;
  let relogio = 0;
  let inicio = 0;
  let totalTempo = 0;
  let encerrado = false;
  const mostrarTela = (tela: HTMLElement) => {
    [telaInicio, telaRegras, telaQuestao, telaResultado].forEach((t) => (t.hidden = t !== tela));
    const emRodada = tela === telaQuestao;
    modoCabecalho.hidden = tela === telaInicio;
    encerrar.hidden = tela === telaInicio;
    modoCabecalho.textContent = modo === 'desafio' ? `Desafio · ${CONFIG[dificuldade!].nome}` : 'Modo Quiz';
    if (!emRodada) pararRelogio();
  };

  function pintarMelhores() {
    let tem = false;
    raiz.querySelectorAll<HTMLElement>('[data-melhor]').forEach((el) => {
      const id = el.dataset.melhor!;
      const m = melhor(tentativasDoNivel(id === 'quiz' ? 'quiz' : id));
      el.textContent = m ? `Seu melhor: ${m.acertos} de ${m.total} (${Math.round(m.acertos / m.total * 100)}%)` : '';
      tem ||= !!m;
    });
    const dificuldadeAtual = (raiz.querySelector<HTMLInputElement>('input[name="dificuldade"]:checked')?.value ?? 'medio') as Dificuldade;
    const m = melhor(tentativasDoNivel(`desafio-${dificuldadeAtual}`));
    raiz.querySelector<HTMLElement>('[data-melhor-desafio]')!.textContent = m
      ? `Seu melhor no ${CONFIG[dificuldadeAtual].nome}: ${m.acertos} de ${m.total}`
      : '';
    raiz.querySelector<HTMLButtonElement>('[data-limpar]')!.hidden = !tem;
  }
  pintarMelhores();

  raiz.querySelector<HTMLButtonElement>('[data-iniciar="quiz"]')!.addEventListener('click', () => iniciar('quiz'));
  raiz.querySelector<HTMLButtonElement>('[data-iniciar="desafio"]')!.addEventListener('click', () => {
    modo = 'desafio';
    dificuldade = (raiz.querySelector<HTMLInputElement>('input[name="dificuldade"]:checked')?.value ?? 'medio') as Dificuldade;
    const c = CONFIG[dificuldade];
    raiz.querySelector('[data-regras-titulo]')!.textContent = `Desafio ${c.nome}`;
    raiz.querySelector('[data-regras]')!.innerHTML = `<li>${c.total} questões, sorteadas de ${c.niveis.map((n) => n === 'basico' ? 'Básico' : n === 'intermediario' ? 'Intermediário' : 'Avançado').join(' e ')}.</li><li>${c.segundos} segundos por questão, sem explicação durante a rodada.</li><li>Questões sem resposta pelo tempo contam como erro.</li>`;
    mostrarTela(telaRegras);
  });
  raiz.querySelector('[data-comecar-desafio]')!.addEventListener('click', () => iniciar('desafio'));
  raiz.querySelector('[data-voltar-inicio]')!.addEventListener('click', () => mostrarTela(telaInicio));
  raiz.querySelectorAll<HTMLInputElement>('input[name="dificuldade"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      raiz.querySelectorAll('label').forEach((label) => label.classList.toggle('selecionada', label.querySelector('input')?.checked ?? false));
      pintarMelhores();
    });
  });
  raiz.querySelector<HTMLButtonElement>('[data-limpar]')!.addEventListener('click', () => {
    if (confirm('Limpar os melhores resultados deste navegador?')) { limparProgresso(); pintarMelhores(); }
  });

  function iniciar(novoModo: 'quiz' | 'desafio') {
    modo = novoModo;
    if (modo === 'quiz') dificuldade = undefined;
    if (modo === 'desafio' && !dificuldade) dificuldade = 'facil';
    const c = dificuldade ? CONFIG[dificuldade] : { total: 15, segundos: 0 };
    rodada = sortear(dados.questoes, c.total, modo === 'desafio' ? CONFIG[dificuldade!].niveis : undefined, dificuldade === 'dificil')
      .map((q) => ({ questao: q, ordem: embaralhar(q.alternativas.map((_, i) => i)), escolhida: null, tempoMs: 0 }));
    atual = 0; totalTempo = 0; encerrado = false;
    cronometro.hidden = modo !== 'desafio';
    mostrarTela(telaQuestao); mostrarQuestao();
  }
  function pararRelogio() { clearInterval(relogio); relogio = 0; }
  function pintarRelogio() {
    const limite = CONFIG[dificuldade!].segundos * 1000;
    const restante = Math.max(0, limite - (performance.now() - inicio));
    const s = Math.ceil(restante / 1000);
    segundos.textContent = String(s);
    anel.style.strokeDashoffset = String(circunferencia * (1 - restante / limite));
    cronometro.setAttribute('aria-label', `Tempo restante: ${s} segundos de ${CONFIG[dificuldade!].segundos}`);
    cronometro.dataset.faixa = restante <= 5000 ? 'vermelho' : restante <= limite / 2 ? 'amarelo' : 'azul';
    if (restante <= 0) responder(-1);
  }
  function mostrarQuestao() {
    const item = rodada[atual];
    contador.textContent = `Questão ${atual + 1} de ${rodada.length}`;
    parte.textContent = `Parte ${item.questao.parte} · ${item.questao.parteTitulo}`;
    barra.style.setProperty('--p', String(atual / rodada.length));
    passos.hidden = modo !== 'desafio';
    legendaPassos.hidden = modo !== 'desafio';
    passos.innerHTML = rodada.map((r, i) => {
      const estado = i === atual ? 'atual' : r.escolhida === null ? 'futura' : r.escolhida === -1 ? 'tempo' : r.escolhida === r.questao.correta ? 'certa' : 'errada';
      return `<span class="quiz__passo quiz__passo--${estado}" aria-label="${i + 1}: ${estado}"></span>`;
    }).join('');
    enunciado.textContent = item.questao.enunciado;
    lista.innerHTML = item.ordem.map((original, pos) => `<li><button type="button" class="alternativa" data-original="${original}"><span class="alternativa__letra">${LETRAS[pos]}</span><span class="alternativa__texto">${esc(item.questao.alternativas[original])}</span><span class="alternativa__estado"></span></button></li>`).join('');
    retorno.innerHTML = ''; retorno.className = 'quiz__retorno'; avancar.hidden = true;
    enunciado.focus({ preventScroll: true });
    if (modo === 'desafio') { inicio = performance.now(); pintarRelogio(); relogio = window.setInterval(pintarRelogio, 100); }
  }
  function responder(original: number) {
    const item = rodada[atual];
    if (item.escolhida !== null) return;
    item.escolhida = original; pararRelogio();
    item.tempoMs = modo === 'desafio' ? Math.min(CONFIG[dificuldade!].segundos * 1000, performance.now() - inicio) : 0;
    totalTempo += item.tempoMs;
    const certo = original === item.questao.correta;
    const posCorreta = item.ordem.indexOf(item.questao.correta);
    lista.querySelectorAll<HTMLButtonElement>('.alternativa').forEach((b) => {
      const n = Number(b.dataset.original); b.disabled = true;
      if (n === item.questao.correta) b.classList.add('alternativa--correta');
      else if (n === original) b.classList.add('alternativa--errada');
      if (original === -1 && n !== item.questao.correta) b.classList.add('alternativa--esgotada');
    });
    if (modo === 'desafio') {
      retorno.className = `quiz__retorno quiz__retorno--${certo ? 'certo' : 'errado'}`;
      retorno.innerHTML = `<p class="quiz__veredito">${certo ? 'Certa!' : original === -1 ? `Tempo esgotado. A correta é a ${LETRAS[posCorreta]}.` : 'Errada.'}</p>`;
      window.setTimeout(() => atual < rodada.length - 1 ? (atual++, mostrarQuestao()) : mostrarResultado(), original === -1 ? 1500 : 500);
      return;
    }
    retorno.className = `quiz__retorno quiz__retorno--${certo ? 'certo' : 'errado'}`;
    retorno.innerHTML = `<p class="quiz__veredito">${certo ? 'Certa!' : `Errada. A correta é a ${LETRAS[posCorreta]}.`}</p><p>${esc(item.questao.explicacao)}</p><p><a href="${item.questao.href}">Revisar no manual: ${esc(item.questao.secao)} ${esc(item.questao.secaoTitulo)}</a></p>`;
    avancar.textContent = atual < rodada.length - 1 ? 'Próxima questão' : 'Ver resultados'; avancar.hidden = false; avancar.focus();
  }
  lista.addEventListener('click', (e) => { const b = (e.target as Element).closest<HTMLButtonElement>('.alternativa'); if (b && !b.disabled) responder(Number(b.dataset.original)); });
  avancar.addEventListener('click', () => atual < rodada.length - 1 ? (atual++, mostrarQuestao()) : mostrarResultado());
  encerrar.addEventListener('click', () => {
    if (confirm('Encerrar o quiz? O progresso desta rodada será perdido.')) {
      encerrado = true;
      rodada = [];
      mostrarTela(telaInicio);
      pintarMelhores();
    }
  });

  function mostrarResultado() {
    pararRelogio();
    const total = rodada.length;
    const acertos = rodada.filter((r) => r.escolhida === r.questao.correta).length;
    const semResposta = rodada.filter((r) => r.escolhida === -1 || r.escolhida === null).length;
    const pct = Math.round(acertos / total * 100);
    const f = faixa(pct);
    const erros = rodada.filter((r) => r.escolhida !== r.questao.correta);
    const partes = new Map<number, Map<string, { q: Questao; items: Rodada[] }>>();
    for (const r of erros) {
      const secoes = partes.get(r.questao.parte) ?? new Map<string, { q: Questao; items: Rodada[] }>();
      const grupo = secoes.get(r.questao.secao);
      if (grupo) grupo.items.push(r);
      else secoes.set(r.questao.secao, { q: r.questao, items: [r] });
      partes.set(r.questao.parte, secoes);
    }
    const faixaCor = pct >= 90 ? 'var(--verde)' : pct >= 70 ? 'var(--azul)' : pct >= 50 ? 'var(--amarelo)' : 'var(--erro)';
    const detalhes = [...partes.entries()].sort(([a], [b]) => a - b).map(([numero, secoes]) => {
      const primeiro = [...secoes.values()][0].q;
      const conteudo = [...secoes.values()].sort((a, b) => a.q.secao.localeCompare(b.q.secao, undefined, { numeric: true })).map((g) =>
        `<details class="res__grupo"><summary><span>${esc(g.q.secao)} ${esc(g.q.secaoTitulo)}</span><strong>${g.items.length} ${g.items.length === 1 ? 'erro' : 'erros'}</strong></summary><p><a href="${g.q.href}">Revisar</a></p>${g.items.map((r) => `<div class="res__errada"><p class="res__enunciado">${esc(r.questao.enunciado)}</p><p><b>Marcada:</b> ${r.escolhida === -1 || r.escolhida === null ? 'nenhuma' : esc(r.questao.alternativas[r.escolhida])}</p><p><b>Correta:</b> ${esc(r.questao.alternativas[r.questao.correta])}</p><p>${esc(r.questao.explicacao)}</p></div>`).join('')}</details>`,
      ).join('');
      return `<section class="res__parte"><h3>Parte ${numero} · ${esc(primeiro.parteTitulo)}</h3>${conteudo}</section>`;
    }).join('');
    const tentativa: Tentativa = { data: new Date().toISOString(), acertos, total, erradas: erros.map((r) => r.questao.id), secoesErradas: erros.map((r) => r.questao.secao), modo, ...(modo === 'desafio' ? { desafio: true, dificuldade, tempoTotalMs: Math.round(totalTempo), semResposta, tempoMedioMs: Math.round(totalTempo / total) } : {}) };
    const k = chave(modo, dificuldade); salvarTentativa(k, tentativa);
    telaResultado.innerHTML = `<div class="res__cabeca"><p class="chapeu">Resultado · ${modo === 'desafio' ? `Desafio ${CONFIG[dificuldade!].nome}` : 'Quiz'}</p><div class="anel-resultado" style="--pct:${pct / 100};--cor:${faixaCor}"><svg viewBox="0 0 120 120"><circle class="anel-resultado__trilho" cx="60" cy="60" r="52"/><circle class="anel-resultado__progresso" cx="60" cy="60" r="52"/></svg><strong>${pct}%</strong></div><p class="res__nota"><strong>${acertos}</strong> de ${total}</p><p class="res__faixa res__faixa--${f.tom}">${f.rotulo}</p><p class="res__mensagem">${f.mensagem}</p></div>${modo === 'desafio' ? `<section class="res__bloco"><p><b>Dificuldade:</b> ${CONFIG[dificuldade!].nome} · <b>Tempo total:</b> ${Math.round(totalTempo / 1000)} s · <b>Sem resposta por tempo:</b> ${semResposta}</p></section>` : ''}<section class="res__bloco"><h2>O que você precisa melhorar</h2>${detalhes || '<p>Parabéns, você não errou nenhuma questão. Experimente o Desafio no nível Difícil.</p>'}</section><div class="res__acoes"><button type="button" class="botao-principal" data-refazer>Refazer</button><button type="button" class="botao-secundario" data-trocar>Trocar de modo</button><a class="link-discreto" href="${dados.urlManual}">Voltar ao manual</a></div>`;
    mostrarTela(telaResultado); telaResultado.focus({ preventScroll: true });
    telaResultado.querySelector('[data-refazer]')!.addEventListener('click', () => iniciar(modo));
    telaResultado.querySelector('[data-trocar]')!.addEventListener('click', () => { pintarMelhores(); mostrarTela(telaInicio); });
    pintarMelhores();
  }
}
