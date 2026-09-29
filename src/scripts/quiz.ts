/**
 * O quiz de um nível: sorteia as questões, mostra uma por vez com retorno
 * imediato e, no fim, os dados de aprendizagem (nota, desempenho por parte,
 * seções para revisar, evolução entre tentativas).
 */
import { lerLidas } from './lidas';
import { faixa, melhor, salvarTentativa, tentativasDoNivel, type Tentativa } from './quiz-progresso';

type Questao = {
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

type Dados = {
  nivel: string;
  nome: string;
  porRodada: number;
  questoes: Questao[];
  partes: Record<string, string>;
  urlNiveis: string;
  proximo: { nome: string; href: string } | null;
};

type Rodada = {
  questao: Questao;
  ordem: number[]; // ordem embaralhada das alternativas (índices originais)
  escolhida: number | null; // índice original escolhido; -1 = tempo esgotado
  tempoMs: number; // quanto tempo levou para responder
};

/** Segundos por questão no modo desafio. */
const LIMITE_SEGUNDOS = 60;

const LETRAS = 'ABCDEF';
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function embaralhar<T>(lista: T[]): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const dataCurta = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

export function iniciarQuiz() {
  const raiz = document.querySelector<HTMLElement>('[data-quiz]');
  const fonte = document.getElementById('dados-quiz');
  if (!raiz || !fonte || raiz.dataset.pronto) return;
  raiz.dataset.pronto = 'true';
  const dados: Dados = JSON.parse(fonte.textContent!);

  const telaQuestao = raiz.querySelector<HTMLElement>('[data-tela="questao"]')!;
  const telaResultado = raiz.querySelector<HTMLElement>('[data-tela="resultado"]')!;
  const contador = raiz.querySelector<HTMLElement>('[data-contador]')!;
  const barra = raiz.querySelector<HTMLElement>('[data-barra]')!;
  const enunciado = raiz.querySelector<HTMLElement>('[data-enunciado]')!;
  const lista = raiz.querySelector<HTMLElement>('[data-alternativas]')!;
  const retorno = raiz.querySelector<HTMLElement>('[data-feedback]')!;
  const avancar = raiz.querySelector<HTMLButtonElement>('[data-avancar]')!;

  // Modo desafio: ?desafio=1 no endereço liga o tempo por questão
  const desafio = new URLSearchParams(location.search).has('desafio');
  const caixaTempo = raiz.querySelector<HTMLElement>('[data-tempo]')!;
  const barraTempo = raiz.querySelector<HTMLElement>('[data-tempo-barra]')!;
  const textoTempo = raiz.querySelector<HTMLElement>('[data-tempo-texto]')!;
  const avisoTempo = raiz.querySelector<HTMLElement>('[data-tempo-aviso]')!;
  caixaTempo.hidden = !desafio;
  let inicioQuestao = 0;
  let pausadoEm = 0;
  let relogio = 0;

  function pararRelogio() {
    clearInterval(relogio);
    relogio = 0;
  }
  function restante() {
    const agora = pausadoEm || performance.now();
    return Math.max(0, LIMITE_SEGUNDOS * 1000 - (agora - inicioQuestao));
  }
  function pintarRelogio() {
    const ms = restante();
    const s = Math.ceil(ms / 1000);
    textoTempo.textContent = `${s} s`;
    barraTempo.style.setProperty('--p', String(ms / (LIMITE_SEGUNDOS * 1000)));
    caixaTempo.classList.toggle('acabando', s <= 15);
    if (s === 10) avisoTempo.textContent = 'Faltam 10 segundos.';
    if (ms <= 0) {
      pararRelogio();
      responder(-1);
    }
  }
  function iniciarRelogio() {
    if (!desafio) return;
    pararRelogio();
    inicioQuestao = performance.now();
    pausadoEm = 0;
    avisoTempo.textContent = '';
    pintarRelogio();
    relogio = window.setInterval(pintarRelogio, 250);
  }
  // Aba em segundo plano: o tempo para, para ninguém perder a questão sem ver
  document.addEventListener('visibilitychange', () => {
    if (!desafio || !relogio) return;
    if (document.hidden) pausadoEm = performance.now();
    else if (pausadoEm) {
      inicioQuestao += performance.now() - pausadoEm;
      pausadoEm = 0;
    }
  });

  // Listeners no document são desligados ao sair da página
  const ciclo = new AbortController();
  document.addEventListener('astro:before-swap', () => (ciclo.abort(), pararRelogio()), { once: true });

  // O livro recalcula as páginas quando o conteúdo do quiz muda
  const atualizarLivro = () => raiz.closest('[data-texto]')?.dispatchEvent(new Event('livro:atualizar'));

  let rodada: Rodada[] = [];
  let atual = 0;

  function novaRodada() {
    rodada = embaralhar(dados.questoes)
      .slice(0, dados.porRodada)
      .map((questao) => ({ questao, ordem: embaralhar(questao.alternativas.map((_, i) => i)), escolhida: null, tempoMs: 0 }));
    atual = 0;
    telaResultado.hidden = true;
    telaQuestao.hidden = false;
    mostrarQuestao();
  }

  function mostrarQuestao() {
    const { questao, ordem } = rodada[atual];
    contador.textContent = `Questão ${atual + 1} de ${rodada.length}`;
    barra.style.setProperty('--p', String(atual / rodada.length));
    enunciado.textContent = questao.enunciado;
    lista.innerHTML = ordem
      .map(
        (original, pos) => `<li><button type="button" class="alternativa" data-original="${original}">
          <span class="alternativa__letra" aria-hidden="true">${LETRAS[pos]}</span>
          <span class="alternativa__texto">${esc(questao.alternativas[original])}</span>
          <span class="alternativa__estado" aria-hidden="true"></span>
        </button></li>`,
      )
      .join('');
    retorno.innerHTML = '';
    retorno.className = 'quiz__retorno';
    avancar.hidden = true;
    atualizarLivro();
    enunciado.focus({ preventScroll: true });
    iniciarRelogio();
  }

  function responder(original: number) {
    const item = rodada[atual];
    if (item.escolhida !== null) return;
    item.escolhida = original;
    item.tempoMs = desafio ? Math.min(LIMITE_SEGUNDOS * 1000, (pausadoEm || performance.now()) - inicioQuestao) : 0;
    pararRelogio();
    const esgotado = original === -1;
    const certo = original === item.questao.correta;
    const posCorreta = item.ordem.indexOf(item.questao.correta);

    lista.querySelectorAll<HTMLButtonElement>('.alternativa').forEach((b) => {
      const o = Number(b.dataset.original);
      b.disabled = true;
      if (o === item.questao.correta) b.classList.add('alternativa--correta');
      else if (o === original) b.classList.add('alternativa--errada');
      else if (esgotado) b.classList.add('alternativa--esgotada');
      if (o === original) b.setAttribute('aria-describedby', 'quiz-retorno');
    });

    retorno.className = `quiz__retorno quiz__retorno--${certo ? 'certo' : 'errado'}`;
    retorno.innerHTML = `
      <p class="quiz__veredito">${certo ? 'Correta!' : esgotado ? `Tempo esgotado. A resposta certa é a ${LETRAS[posCorreta]}.` : `Incorreta. A resposta certa é a ${LETRAS[posCorreta]}.`}</p>
      <p>${esc(item.questao.explicacao)}</p>
      <p><a href="${item.questao.href}" target="_blank" rel="noopener">Revisar no manual: ${esc(item.questao.secao)} ${esc(item.questao.secaoTitulo)}<span class="visualmente-oculto"> (abre em nova aba)</span></a></p>`;
    avancar.textContent = atual < rodada.length - 1 ? 'Próxima questão' : 'Ver meu resultado';
    avancar.hidden = false;
    atualizarLivro();
    avancar.focus();
  }

  lista.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('.alternativa');
    if (b && !b.disabled) responder(Number(b.dataset.original));
  });
  avancar.addEventListener('click', () => {
    if (atual < rodada.length - 1) {
      atual++;
      mostrarQuestao();
    } else {
      mostrarResultado();
    }
  });

  // Teclado: A-D ou 1-4 escolhem; Enter segue (quando o botão já está visível)
  document.addEventListener('keydown', (e) => {
    if (telaQuestao.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    if ((e.target as Element).closest('input, textarea')) return;
    const tecla = e.key.toUpperCase();
    const pos = LETRAS.indexOf(tecla) >= 0 ? LETRAS.indexOf(tecla) : Number(tecla) - 1;
    const botoes = lista.querySelectorAll<HTMLButtonElement>('.alternativa');
    if (pos >= 0 && pos < botoes.length && !botoes[pos].disabled) {
      e.preventDefault();
      responder(Number(botoes[pos].dataset.original));
    }
  }, { signal: ciclo.signal });

  const segundos = (ms: number) => `${Math.round(ms / 1000)} s`;
  function blocoTempo() {
    const total = rodada.reduce((s, r) => s + r.tempoMs, 0);
    const esgotadas = rodada.filter((r) => r.escolhida === -1).length;
    const lentas = [...rodada].sort((a, b) => b.tempoMs - a.tempoMs).slice(0, 3);
    const min = Math.floor(total / 60000);
    const seg = Math.round((total % 60000) / 1000);
    return `<section class="res__bloco">
        <h2>Seu tempo no desafio</h2>
        <p>Você levou ${min ? `${min} min ` : ''}${seg} s no total, uma média de ${segundos(total / rodada.length)} por questão${
          esgotadas ? `. Em ${esgotadas} ${esgotadas === 1 ? 'questão' : 'questões'} o tempo acabou antes da resposta` : ''
        }.</p>
        <p>Onde você mais demorou (vale reler a seção):</p>
        <ol class="res__tempos">${lentas
          .map((r) => `<li>${segundos(r.tempoMs)}: ${esc(r.questao.enunciado)} <a href="${r.questao.href}">${esc(r.questao.secao)}</a></li>`)
          .join('')}</ol>
      </section>`;
  }

  function mostrarResultado() {
    pararRelogio();
    const total = rodada.length;
    const erradas = rodada.filter((r) => r.escolhida !== r.questao.correta);
    const acertos = total - erradas.length;
    const pct = Math.round((acertos / total) * 100);
    const f = faixa(pct);

    const anteriores = tentativasDoNivel(dados.nivel);
    const ultima = anteriores.at(-1);
    const recorde = melhor(anteriores);
    const tentativa: Tentativa = {
      data: new Date().toISOString(),
      acertos,
      total,
      erradas: erradas.map((r) => r.questao.id),
      secoesErradas: erradas.map((r) => r.questao.secao),
      ...(desafio ? { desafio: true, tempoMedioMs: Math.round(rodada.reduce((s, r) => s + r.tempoMs, 0) / total) } : {}),
    };
    salvarTentativa(dados.nivel, tentativa);
    const historico = [...anteriores, tentativa].slice(-8);

    // Comparação com antes
    let comparacao = 'Esta é a sua primeira tentativa neste nível. Refaça depois para acompanhar a evolução.';
    if (ultima) {
      const dif = acertos - ultima.acertos;
      const variacao = dif > 0 ? `${dif} ${dif === 1 ? 'acerto' : 'acertos'} a mais` : dif < 0 ? `${-dif} ${dif === -1 ? 'acerto' : 'acertos'} a menos` : 'o mesmo número de acertos';
      comparacao = `Na tentativa anterior você fez ${ultima.acertos} de ${ultima.total}: agora foram ${variacao}.`;
      if (recorde && acertos / total > recorde.acertos / recorde.total) comparacao += ' É a sua melhor nota neste nível até agora.';
      else if (recorde) comparacao += ` Sua melhor nota neste nível é ${recorde.acertos} de ${recorde.total}.`;
    }

    // Desempenho por parte
    const porParte = new Map<number, { acertos: number; total: number }>();
    for (const r of rodada) {
      const p = porParte.get(r.questao.parte) ?? { acertos: 0, total: 0 };
      p.total++;
      if (r.escolhida === r.questao.correta) p.acertos++;
      porParte.set(r.questao.parte, p);
    }
    const linhasPartes = [...porParte.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(
        ([n, p]) => `<li>
          <span class="res__rotulo">Parte ${n} · ${esc(dados.partes[n] ?? '')}</span>
          <span class="barra res__barra" aria-hidden="true"><span style="--p:${p.acertos / p.total}"></span></span>
          <span class="res__valor">${p.acertos} de ${p.total}</span>
        </li>`,
      )
      .join('');

    // Seções para revisar (agrupadas), com aviso de seção ainda não lida
    const lidas = lerLidas();
    const porSecao = new Map<string, { q: Questao; n: number }>();
    for (const r of erradas) {
      const s = porSecao.get(r.questao.secao);
      porSecao.set(r.questao.secao, { q: r.questao, n: (s?.n ?? 0) + 1 });
    }
    const secoesRevisar = [...porSecao.values()]
      .sort((a, b) => b.n - a.n || a.q.secao.localeCompare(b.q.secao, undefined, { numeric: true }))
      .map(
        ({ q, n }) => `<li>
          <a href="${q.href}">${esc(q.secao)} ${esc(q.secaoTitulo)}</a>
          <span class="res__detalhe">${n} ${n === 1 ? 'erro' : 'erros'}${lidas.has(q.secao) ? '' : ' · seção ainda não marcada como lida'}</span>
        </li>`,
      )
      .join('');

    const questoesErradas = erradas
      .map(
        (r) => `<li class="res__errada">
          <p class="res__enunciado">${esc(r.questao.enunciado)}</p>
          <p><span class="res__marca res__marca--errada">Sua resposta:</span> ${r.escolhida === -1 ? 'nenhuma, o tempo acabou' : esc(r.questao.alternativas[r.escolhida!])}</p>
          <p><span class="res__marca res__marca--certa">Resposta certa:</span> ${esc(r.questao.alternativas[r.questao.correta])}</p>
          <p class="res__explicacao">${esc(r.questao.explicacao)}</p>
          <p><a href="${r.questao.href}">Revisar no manual: ${esc(r.questao.secao)} ${esc(r.questao.secaoTitulo)}</a></p>
        </li>`,
      )
      .join('');

    // Evolução (últimas tentativas)
    const evolucao =
      historico.length > 1
        ? `<ol class="res__evolucao">${historico
            .map((t, i) => {
              const p = t.acertos / t.total;
              const agora = i === historico.length - 1;
              return `<li${agora ? ' class="res__agora"' : ''}>
                <span class="res__coluna"><span style="--p:${p}"></span></span>
                <span class="res__valor">${t.acertos}/${t.total}</span>
                <span class="res__data">${agora ? 'agora' : dataCurta(t.data)}${t.desafio ? ' ⏱' : ''}</span>
              </li>`;
            })
            .join('')}</ol>
            <p class="visualmente-oculto">Notas das últimas tentativas, da mais antiga para a mais recente: ${historico.map((t) => `${t.acertos} de ${t.total}`).join(', ')}.</p>`
        : '<p class="res__nota-rodape">Quando você refizer o quiz, suas tentativas aparecem aqui lado a lado.</p>';

    telaResultado.innerHTML = `
      <div class="res__cabeca">
        <p class="chapeu">Resultado · Nível ${esc(dados.nome)}</p>
        <p class="res__nota"><strong>${acertos}</strong> de ${total}</p>
        <p class="res__pct">${pct}% de acertos</p>
        <p class="res__faixa res__faixa--${f.tom}">${f.rotulo}</p>
        <p class="res__mensagem">${f.mensagem}</p>
      </div>

      <section class="res__bloco">
        <h2>Comparado com antes</h2>
        <p>${comparacao}</p>
      </section>

      ${desafio ? blocoTempo() : ''}

      <section class="res__bloco">
        <h2>Desempenho por parte</h2>
        <ul class="res__partes">${linhasPartes}</ul>
      </section>

      <section class="res__bloco">
        <h2>O que revisar</h2>
        ${
          erradas.length
            ? `<p>Comece pelas seções com mais erros:</p><ul class="res__secoes">${secoesRevisar}</ul>
               <h3>Questões que você errou</h3><ol class="res__lista-erradas">${questoesErradas}</ol>`
            : '<p>Você acertou todas as questões desta rodada. Nenhuma seção para revisar.</p>'
        }
      </section>

      <section class="res__bloco">
        <h2>Sua evolução neste nível</h2>
        ${evolucao}
      </section>

      <div class="res__acoes">
        <button type="button" class="botao-principal" data-refazer>Refazer</button>
        ${pct >= 70 && dados.proximo ? `<a class="botao-secundario" href="${dados.proximo.href}">Ir para o nível ${esc(dados.proximo.nome)}</a>` : ''}
        <a class="link-discreto" href="${dados.urlNiveis}">Outro nível</a>
      </div>`;

    telaQuestao.hidden = true;
    telaResultado.hidden = false;
    atualizarLivro();
    telaResultado.focus({ preventScroll: true });
    telaResultado.querySelector('[data-refazer]')!.addEventListener('click', novaRodada);
  }

  novaRodada();
}
