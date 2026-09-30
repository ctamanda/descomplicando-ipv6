/**
 * Paginação do leitor. O CSS (livro.css) diagrama o texto em colunas; aqui só
 * calculamos quantas páginas existem e movemos a rolagem horizontal. A animação
 * de virar a folha fica em folhear.ts.
 */
import { prefetch } from 'astro:prefetch';
import { navigate } from 'astro:transitions/client';
import { criarFolheador } from './folhear';

const MODO_LIVRO = window.matchMedia('screen and (min-height: 30rem)');
const SEM_ANIMACAO = window.matchMedia('(prefers-reduced-motion: reduce)');
export const ULTIMA_PAGINA = '#ultima-pagina';

export function iniciarLivro() {
  const livro = document.querySelector<HTMLElement>('[data-livro]');
  const texto = livro?.querySelector<HTMLElement>('[data-texto]');
  const controles = document.querySelector<HTMLElement>('[data-controles]');
  if (!livro || !texto || !controles || livro.dataset.iniciado) return;
  livro.dataset.iniciado = 'true';

  const regua = controles.querySelector<HTMLInputElement>('[data-regua]')!;
  const status = controles.querySelector<HTMLElement>('[data-status]')!;
  const btnAnt = controles.querySelector<HTMLButtonElement>('[data-virar="anterior"]')!;
  const btnProx = controles.querySelector<HTMLButtonElement>('[data-virar="proxima"]')!;
  const numEsq = livro.querySelector<HTMLElement>('[data-num-esq]')!;
  const numDir = livro.querySelector<HTMLElement>('[data-num-dir]')!;
  const { numero, anterior, anteriorTitulo, proxima, proximaTitulo } = livro.dataset;

  let colunas = 1; // páginas visíveis por vez
  let passo = 1; // largura de uma "virada", em px
  let totalPaginas = 1; // páginas (colunas) da seção
  let totalViradas = 1;
  let atual = 0; // índice da virada atual
  let preenchimento: HTMLElement | null = null;

  const ativo = () => MODO_LIVRO.matches;
  const folheador = criarFolheador(livro, texto);

  function medir() {
    const estilo = getComputedStyle(texto!);
    colunas = Number(estilo.columnCount) || 1;

    // Largura e vão em pixels inteiros: com frações, a rolagem arredondada
    // cortaria 1px da borda direita de tabelas e caixas.
    texto!.style.width = '';
    texto!.style.columnGap = '';
    texto!.style.columnWidth = '';
    const vao = Math.round(parseFloat(estilo.columnGap) || 0);
    const largura = Math.floor(texto!.getBoundingClientRect().width);
    texto!.style.width = `${largura}px`;
    texto!.style.columnGap = `${vao}px`;
    const larguraColuna = (largura - vao * (colunas - 1)) / colunas;
    // Largura da coluna explícita, em px (como fazem os leitores de EPUB): o Safari
    // do iPhone não pagina uma coluna só com largura automática. 1px a menos para o
    // arredondamento nunca derrubar o livro aberto para uma coluna.
    texto!.style.columnWidth = `${Math.max(1, Math.floor(larguraColuna) - 1)}px`;
    livro!.dataset.colunas = String(colunas);

    // No livro aberto, um total ímpar de colunas deixaria a última virada torta.
    preenchimento?.remove();
    preenchimento = null;
    const contar = () => Math.max(1, Math.round((texto!.scrollWidth + vao) / (larguraColuna + vao)));
    totalPaginas = contar();
    if (colunas === 2 && totalPaginas % 2 === 1) {
      preenchimento = document.createElement('div');
      preenchimento.className = 'livro__preenchimento';
      preenchimento.setAttribute('aria-hidden', 'true');
      texto!.append(preenchimento);
    }

    passo = colunas * (larguraColuna + vao);
    totalViradas = Math.max(1, Math.ceil(totalPaginas / colunas));
    regua.max = String(totalViradas);
    folheador.preparar();
  }

  function atualizarInterface() {
    const primeira = atual * colunas + 1;
    const ultima = Math.min(primeira + colunas - 1, totalPaginas);
    const paginas = ultima > primeira ? `págs. ${primeira} e ${ultima}` : `pág. ${primeira}`;
    status.innerHTML = `<strong>${numero}</strong> · ${paginas} de ${totalPaginas}`;
    regua.value = String(atual + 1);
    regua.setAttribute('aria-valuetext', `${paginas} de ${totalPaginas}`);
    numEsq.textContent = String(primeira);
    numDir.textContent = colunas === 2 ? (ultima > primeira ? String(ultima) : '') : String(primeira);

    const noInicio = atual === 0;
    livro!.classList.toggle('livro--abertura', noInicio);
    const noFim = atual >= totalViradas - 1;
    btnAnt.setAttribute('aria-label', noInicio ? `Voltar: ${anteriorTitulo}` : 'Página anterior');
    btnProx.setAttribute('aria-label', noFim ? `Seguir: ${proximaTitulo}` : 'Próxima página');
    btnAnt.dataset.borda = String(noInicio);
    btnProx.dataset.borda = String(noFim);
  }

  /** Vai para uma virada; com `folhear`, anima a folha girando na lombada. */
  function irPara(indice: number, folhear = true) {
    const de = atual;
    atual = Math.min(Math.max(indice, 0), totalViradas - 1);
    const destino = atual * passo;
    const mostrar = () => texto!.scrollTo({ left: destino, behavior: 'auto' });

    if (folhear && atual !== de && ativo() && !SEM_ANIMACAO.matches) {
      folheador.virar(de, atual, { colunas, larguraPagina: passo / colunas, totalPaginas }, mostrar);
    } else {
      folheador.terminar();
      mostrar();
    }
    atualizarInterface();
  }

  /** Virada que contém um elemento (âncora, foco). */
  function viradaDe(el: Element) {
    const deslocamento = el.getBoundingClientRect().left - texto!.getBoundingClientRect().left + texto!.scrollLeft;
    return Math.floor((deslocamento + 1) / passo);
  }

  // Ordem das páginas do livro (capa primeiro), para saber para que lado virar
  const ordem: string[] = JSON.parse(document.getElementById('ordem-livro')?.textContent ?? '[]');
  const indiceAtual = Number(livro.dataset.indice ?? 0);
  const indiceDe = (href: string) => ordem.indexOf(new URL(href, location.href).pathname);

  let navegando = false;
  /** Troca de página do site virando a folha (ou várias, se o destino estiver longe). */
  async function navegarFolheando(href: string, sentidoPadrao: 1 | -1 = 1) {
    if (navegando) return;
    navegando = true;
    const i = indiceDe(href);
    const distancia = i < 0 ? 0 : i - indiceAtual;
    const sentido: 1 | -1 = distancia === 0 ? sentidoPadrao : distancia > 0 ? 1 : -1;
    if (ativo() && !SEM_ANIMACAO.matches) {
      const folhas = Math.min(4, Math.max(1, Math.ceil(Math.abs(distancia) / 6)));
      await folheador.virarParaBranco(sentido, atual, { colunas, larguraPagina: passo / colunas, totalPaginas }, folhas);
    }
    navigate(href);
  }

  const avancar = () => (atual < totalViradas - 1 ? irPara(atual + 1) : proxima && navegarFolheando(proxima, 1));
  const voltar = () => (atual > 0 ? irPara(atual - 1) : anterior && navegarFolheando(anterior + ULTIMA_PAGINA, -1));

  // Links para outras páginas do livro (abas, sumário, Anterior/Próxima, termos do glossário) viram a folha
  livro.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target || a.hasAttribute('download')) return;
    const destino = new URL(a.href, location.href);
    if (destino.origin !== location.origin || indiceDe(a.href) < 0) return;
    if (destino.pathname === location.pathname) {
      // Âncora na mesma página (ex.: letras do glossário): o próprio livro vira até lá,
      // sem o navegador tentar fazer uma transição de página ao mesmo tempo.
      if (!destino.hash) return;
      e.preventDefault();
      history.pushState(history.state, '', destino.hash);
      irParaHash(true);
      return;
    }
    e.preventDefault();
    navegarFolheando(a.href);
  });

  // Cantos da página
  livro.querySelector('[data-canto="proxima"]')?.addEventListener('click', () => avancar());
  livro.querySelector('[data-canto="anterior"]')?.addEventListener('click', () => voltar());

  // Algo abriu ou fechou (ex.: parte dos exercícios): recalcula e fica na página de quem mudou
  texto.addEventListener('livro:reposicionar', (e) => {
    if (!ativo()) return;
    medir();
    irPara(viradaDe(e.target as Element), false);
  });

  // Conteúdo que muda sozinho (quiz, busca do glossário): recalcula as páginas e volta à primeira
  texto.addEventListener('livro:atualizar', () => {
    if (!ativo()) return;
    medir();
    irPara(0, false);
  });

  function irParaHash(suave: boolean) {
    const hash = decodeURIComponent(location.hash);
    if (hash === ULTIMA_PAGINA) return irPara(totalViradas - 1, false);
    const alvo = hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
    if (alvo && texto!.contains(alvo)) irPara(viradaDe(alvo), suave);
  }

  function recalcular() {
    if (!ativo()) return;
    const proporcao = totalViradas > 1 ? atual / (totalViradas - 1) : 0;
    medir();
    irPara(Math.round(proporcao * (totalViradas - 1)), false);
  }

  // Eventos. Os que ficam no document/window são desligados ao trocar de página.
  const ciclo = new AbortController();
  const { signal } = ciclo;
  const observador = new ResizeObserver(() => recalcular());
  document.addEventListener('astro:before-swap', () => (ciclo.abort(), observador.disconnect()), { once: true });

  btnAnt.addEventListener('click', voltar);
  btnProx.addEventListener('click', avancar);
  regua.addEventListener('input', () => irPara(Number(regua.value) - 1, false));

  document.addEventListener('keydown', (e) => {
    if (!ativo() || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const alvo = e.target as HTMLElement;
    if (alvo.closest('input, textarea, select, .tabela, dialog[open]')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') (e.preventDefault(), avancar());
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') (e.preventDefault(), voltar());
    else if (e.key === 'Home') (e.preventDefault(), irPara(0));
    else if (e.key === 'End') (e.preventDefault(), irPara(totalViradas - 1));
  }, { signal });

  // Foco por Tab em um link de outra página: mostra a página dele.
  texto.addEventListener('focusin', (e) => {
    if (ativo()) irPara(viradaDe(e.target as Element), false);
  });

  // Busca do navegador (Ctrl+F) e outros saltos: alinha na página mais próxima.
  let temporizador = 0;
  texto.addEventListener('scroll', () => {
    clearTimeout(temporizador);
    temporizador = window.setTimeout(() => {
      const indice = Math.round(texto.scrollLeft / passo);
      if (indice !== atual || Math.abs(texto.scrollLeft - indice * passo) > 2) irPara(indice, false);
    }, 150);
  });

  // Gesto de deslizar no celular
  let toqueX = 0;
  let toqueY = 0;
  let toqueValido = false;
  livro.addEventListener(
    'touchstart',
    (e) => {
      toqueValido = !(e.target as Element).closest('.tabela');
      toqueX = e.touches[0].clientX;
      toqueY = e.touches[0].clientY;
    },
    { passive: true },
  );
  livro.addEventListener('touchend', (e) => {
    if (!toqueValido || !ativo()) return;
    const dx = e.changedTouches[0].clientX - toqueX;
    const dy = e.changedTouches[0].clientY - toqueY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? avancar : voltar)();
  });

  // Gabarito aberto ou fechado muda a quantidade de páginas; fica na página do botão.
  texto.addEventListener(
    'toggle',
    (e) => {
      if (!ativo()) return;
      medir();
      irPara(viradaDe((e.target as HTMLDetailsElement).querySelector('summary') ?? (e.target as Element)), false);
    },
    true,
  );
  observador.observe(livro);
  MODO_LIVRO.addEventListener('change', () => {
    if (ativo()) return recalcular();
    texto.style.width = texto.style.columnGap = texto.style.columnWidth = '';
    texto.scrollTo({ left: 0 });
  }, { signal });
  window.addEventListener('hashchange', () => ativo() && irParaHash(true), { signal });

  if (ativo()) {
    medir();
    irPara(0, false);
    irParaHash(false);
  }
  // Deixa a página anterior e a seguinte já baixadas: a virada não espera a rede
  [anterior, proxima].forEach((href) => href && prefetch(href.split('#')[0]));

  if (new URLSearchParams(location.search).has('diagnostico')) mostrarDiagnostico(texto, status);

  document.fonts?.ready.then(() => {
    if (signal.aborted) return;
    recalcular();
    irParaHash(false);
  });
}

/** Painel temporário (?diagnostico) para descobrir o que o celular calcula. */
function mostrarDiagnostico(texto: HTMLElement, status: HTMLElement) {
  const painel = document.createElement('pre');
  painel.style.cssText =
    'position:fixed;left:4px;right:4px;top:4px;z-index:99;margin:0;padding:6px;font:11px/1.35 monospace;white-space:pre-wrap;background:#000c;color:#fff;border-radius:6px;pointer-events:none';
  document.body.append(painel);
  const atualizar = () => {
    const s = getComputedStyle(texto);
    painel.textContent = [
      navigator.userAgent,
      `tela ${innerWidth}x${innerHeight} · livro ${MODO_LIVRO.matches} · doc ${document.documentElement.scrollHeight}`,
      `colunas ${s.columnCount} · larg. col ${s.columnWidth} · vão ${s.columnGap} · overflow ${s.overflow}`,
      `texto ${texto.clientWidth}x${texto.clientHeight} · scrollWidth ${texto.scrollWidth} · scrollHeight ${texto.scrollHeight}`,
      status.textContent,
    ].join('\n');
  };
  atualizar();
  setInterval(atualizar, 1000);
}
