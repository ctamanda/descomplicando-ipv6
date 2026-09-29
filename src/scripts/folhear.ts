/**
 * Animação de virar a folha.
 *
 * O texto de verdade (interativo) nunca sai do lugar. Por cima dele fica uma
 * camada invisível com "folhas" já montadas: faces de papel que contêm uma
 * cópia do texto, preparadas quando o navegador está ocioso. Na hora da
 * virada, só reposicionamos as cópias (transform) e giramos a folha em 3D;
 * nada é criado nem diagramado no clique, e a animação sai fluida.
 *
 * Com duas colunas:
 *   avançar:  [velha esq. (fixa)] [folha: frente = velha dir., verso = nova esq.]
 *   voltar:   [folha: frente = velha esq., verso = nova dir.] [velha dir. (fixa)]
 * Por baixo das faces, o texto real já está na nova página.
 */

const DURACAO = 680;
const CURVA = 'cubic-bezier(0.45, 0.05, 0.25, 1)';
const MAX_FOLHAS = 4;

export type Geometria = {
  colunas: number; // 1 ou 2 páginas visíveis
  larguraPagina: number; // coluna + vão, em px
  totalPaginas: number;
};

type Face = { el: HTMLElement; copia: HTMLElement | null; num: HTMLElement | null; sombra: HTMLElement; conteudo: boolean };
type Folha = { el: HTMLElement; frente: Face; verso: Face };

export function criarFolheador(livro: HTMLElement, texto: HTMLElement) {
  const camada = document.createElement('div');
  camada.className = 'livro__viradas ocioso';
  camada.setAttribute('aria-hidden', 'true');
  camada.inert = true;

  function novaFace(conteudo: boolean): Face {
    const el = document.createElement('div');
    el.className = 'virada__face';
    const sombra = document.createElement('div');
    sombra.className = 'virada__sombra';
    let num: HTMLElement | null = null;
    if (conteudo) {
      num = document.createElement('span');
      num.className = 'livro__num';
      el.append(num);
    }
    el.append(sombra);
    return { el, copia: null, num, sombra, conteudo };
  }

  const fixaConteudo = novaFace(true); // página velha que fica parada
  const fixaBranca = novaFace(false); // papel em branco por baixo (troca de página do site)
  const folhas: Folha[] = Array.from({ length: MAX_FOLHAS }, (_, i) => {
    const el = document.createElement('div');
    el.className = 'virada__folha';
    const frente = novaFace(i === 0);
    const verso = novaFace(i === 0);
    frente.el.classList.add('virada__frente');
    verso.el.classList.add('virada__verso');
    el.append(frente.el, verso.el);
    return { el, frente, verso };
  });
  fixaConteudo.el.classList.add('virada__fixa');
  fixaBranca.el.classList.add('virada__fixa');
  // A folha 0 (a de conteúdo) fica por cima das demais
  camada.append(fixaConteudo.el, fixaBranca.el, ...[...folhas].reverse().map((f) => f.el));
  livro.append(camada);

  const facesComConteudo = [fixaConteudo, folhas[0].frente, folhas[0].verso];
  let copiasProntas = false;
  let agendamento = 0;
  let emAndamento: Animation[] = [];
  let aoTerminar: (() => void) | null = null;
  let visivel = false;

  // ---------- Cópias do texto (montadas fora do clique) ----------

  function montarCopias() {
    cancelIdle(agendamento);
    const rl = livro.getBoundingClientRect();
    const rt = texto.getBoundingClientRect();
    for (const face of facesComConteudo) {
      face.copia?.remove();
      const copia = texto.cloneNode(true) as HTMLElement;
      copia.removeAttribute('data-texto');
      copia.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
      copia.className = 'livro__texto livro__copia';
      Object.assign(copia.style, {
        left: `${rt.left - rl.left}px`,
        top: `${rt.top - rl.top}px`,
        width: `${rt.width}px`,
        height: `${rt.height}px`,
      });
      face.el.prepend(copia);
      face.copia = copia;
    }
    copiasProntas = true;
  }

  /** Chamado quando o texto muda de tamanho ou de conteúdo: refaz as cópias com calma. */
  function preparar() {
    copiasProntas = false;
    cancelIdle(agendamento);
    agendamento = requestIdle(() => {
      if (!visivel) montarCopias();
    });
  }

  // ---------- Posicionamento das faces ----------

  function lado(face: Face, esq: boolean) {
    face.el.classList.toggle('virada__face--esq', esq);
    face.el.classList.toggle('virada__face--dir', !esq);
  }

  /** Faz a face mostrar a página `coluna` como página da esquerda (0) ou da direita (1). */
  function mostrarPagina(face: Face, coluna: number, ladoPagina: 0 | 1, g: Geometria) {
    lado(face, ladoPagina === 0 && g.colunas === 2);
    if (!face.copia || !face.num) return;
    const existe = coluna >= 0 && coluna < g.totalPaginas;
    face.copia.style.visibility = existe ? '' : 'hidden';
    face.num.textContent = existe ? String(coluna + 1) : '';
    face.num.className = `livro__num livro__num--${g.colunas === 2 && ladoPagina === 0 ? 'esq' : 'dir'}`;
    if (!existe) return;
    const x0 = g.colunas === 2 && ladoPagina === 1 ? livro.clientWidth / 2 : 0;
    const deslocamento = (coluna - (g.colunas === 2 ? ladoPagina : 0)) * g.larguraPagina + x0;
    face.copia.style.transform = `translateX(${-deslocamento}px)`;
  }

  function papel(face: Face, esq: boolean) {
    lado(face, esq);
    if (face.copia) face.copia.style.visibility = 'hidden';
    if (face.num) face.num.textContent = '';
  }

  function posicionarFolha(f: Folha, tipo: 'esq' | 'dir' | 'unica') {
    f.el.className = `virada__folha virada__folha--${tipo}`;
  }

  function esconderTudo() {
    for (const el of [fixaConteudo.el, fixaBranca.el, ...folhas.map((f) => f.el)]) el.classList.add('oculta');
  }

  function exibir(...els: HTMLElement[]) {
    els.forEach((el) => el.classList.remove('oculta'));
  }

  // ---------- Animação ----------

  function girar(f: Folha, de: number, para: number, atraso = 0, duracao = DURACAO) {
    const opcoes: KeyframeAnimationOptions = { duration: duracao, delay: atraso, easing: CURVA, fill: 'both' };
    emAndamento.push(f.el.animate([{ transform: `rotateY(${de}deg)` }, { transform: `rotateY(${para}deg)` }], opcoes));
    // A frente escurece ao levantar; o verso clareia ao assentar.
    emAndamento.push(
      f.frente.sombra.animate([{ opacity: 0 }, { opacity: 0.2 }], { duration: duracao / 2, delay: atraso, easing: 'ease-in', fill: 'both' }),
      f.verso.sombra.animate([{ opacity: 0.2 }, { opacity: 0.2, offset: 0.5 }, { opacity: 0 }], opcoes),
    );
  }

  function comecar() {
    terminar();
    if (!copiasProntas) montarCopias();
    esconderTudo();
    camada.classList.remove('ocioso');
    visivel = true;
  }

  function parar() {
    emAndamento.forEach((a) => a.cancel());
    emAndamento = [];
    esconderTudo();
    camada.classList.add('ocioso');
    visivel = false;
  }

  /** Encerra na hora uma virada em andamento (ex.: cliques seguidos). */
  function terminar() {
    if (!visivel) return;
    const fim = aoTerminar;
    aoTerminar = null;
    parar();
    fim?.();
  }

  function aoAcabar(depois?: () => void) {
    const lote = emAndamento;
    Promise.all(lote.map((a) => a.finished))
      .then(() => {
        if (emAndamento !== lote) return; // outra virada já começou
        const fim = aoTerminar;
        aoTerminar = null;
        parar();
        fim?.();
        depois?.();
      })
      .catch(() => {});
  }

  /**
   * Vira de `de` para `para` (índices de virada). `mostrar` põe o texto real na
   * nova página; é chamado no momento certo para não aparecer antes da hora.
   */
  function virar(de: number, para: number, g: Geometria, mostrar: () => void) {
    comecar();
    const avancar = para > de;
    const f = folhas[0];

    if (g.colunas === 2) {
      if (avancar) {
        mostrarPagina(fixaConteudo, 2 * de, 0, g);
        posicionarFolha(f, 'dir');
        mostrarPagina(f.frente, 2 * de + 1, 1, g);
        mostrarPagina(f.verso, 2 * para, 0, g);
        exibir(fixaConteudo.el, f.el);
        girar(f, 0, -180);
      } else {
        mostrarPagina(fixaConteudo, 2 * de + 1, 1, g);
        posicionarFolha(f, 'esq');
        mostrarPagina(f.frente, 2 * de, 0, g);
        mostrarPagina(f.verso, 2 * para + 1, 1, g);
        exibir(fixaConteudo.el, f.el);
        girar(f, 0, 180);
      }
      mostrar();
    } else if (avancar) {
      // Uma página: a folha atual levanta pela borda esquerda e revela a próxima.
      posicionarFolha(f, 'unica');
      mostrarPagina(f.frente, de, 0, g);
      papel(f.verso, true);
      exibir(f.el);
      girar(f, 0, -180);
      mostrar();
    } else {
      // Voltando: a página anterior desce por cima da atual.
      posicionarFolha(f, 'unica');
      mostrarPagina(f.frente, para, 0, g);
      papel(f.verso, true);
      exibir(f.el);
      girar(f, -180, 0);
      aoTerminar = mostrar;
    }
    aoAcabar();
  }

  /**
   * Virada para trocar de página do site: a folha atual gira e, por baixo e no
   * verso, aparece papel em branco. O conteúdo novo entra na navegação.
   * Com `quantas` maior que 1, folheia várias de uma vez (aba distante).
   * O papel em branco fica na tela até a página nova chegar.
   */
  function virarParaBranco(sentido: 1 | -1, atual: number, g: Geometria, quantas = 1): Promise<void> {
    comecar();
    const n = Math.min(MAX_FOLHAS, Math.max(1, quantas));
    const duracao = n > 1 ? 520 : DURACAO;
    const passo = 105;
    const usadas = folhas.slice(0, n);

    if (g.colunas === 2) {
      const tipo = sentido > 0 ? 'dir' : 'esq';
      mostrarPagina(fixaConteudo, sentido > 0 ? 2 * atual : 2 * atual + 1, sentido > 0 ? 0 : 1, g);
      papel(fixaBranca, sentido < 0);
      fixaBranca.el.classList.toggle('virada__face--dir', sentido > 0);
      usadas.forEach((f, i) => {
        posicionarFolha(f, tipo);
        if (i === 0) {
          mostrarPagina(f.frente, sentido > 0 ? 2 * atual + 1 : 2 * atual, sentido > 0 ? 1 : 0, g);
          papel(f.verso, sentido > 0);
        } else {
          papel(f.frente, sentido < 0);
          papel(f.verso, sentido > 0);
        }
        girar(f, 0, sentido > 0 ? -180 : 180, i * passo, duracao);
      });
      exibir(fixaConteudo.el, fixaBranca.el, ...usadas.map((f) => f.el));
    } else {
      papel(fixaBranca, true);
      usadas.forEach((f, i) => {
        posicionarFolha(f, 'unica');
        if (i === 0 && sentido > 0) mostrarPagina(f.frente, atual, 0, g);
        else papel(f.frente, true);
        papel(f.verso, true);
        girar(f, sentido > 0 ? 0 : -180, sentido > 0 ? -180 : 0, i * passo, duracao);
      });
      exibir(...(sentido > 0 ? [fixaBranca.el] : []), ...usadas.map((f) => f.el));
    }

    // Não esconde no fim: o papel em branco espera a página nova
    const lote = emAndamento;
    return Promise.all(lote.map((a) => a.finished))
      .then(() => {})
      .catch(() => {});
  }

  return { virar, virarParaBranco, terminar, preparar };
}

// requestIdleCallback com alternativa para navegadores sem suporte (Safari)
const requestIdle = (fn: () => void): number =>
  'requestIdleCallback' in window ? window.requestIdleCallback(fn, { timeout: 1500 }) : window.setTimeout(fn, 200);
const cancelIdle = (id: number) =>
  'cancelIdleCallback' in window ? window.cancelIdleCallback(id) : window.clearTimeout(id);
