/**
 * Pinta o progresso de leitura em todos os sumários da página (lateral, painel
 * do celular, listas das aberturas) e destaca a página atual. Roda a cada
 * navegação, porque a lateral é mantida entre páginas (transition:persist).
 */
import { lerLidas } from './lidas';

export function atualizarSumario() {
  atualizarAbas();
  const lidas = lerLidas();
  const caminho = location.pathname;

  // Marcadores de seção lida, em qualquer lista do site
  document.querySelectorAll<HTMLAnchorElement>('a[data-secao-id]').forEach((a) => {
    const lida = lidas.has(a.dataset.secaoId!);
    a.classList.toggle('lida', lida);
    const estado = a.querySelector('[data-estado]');
    if (estado) estado.textContent = lida ? ' (lida)' : '';
  });

  document.querySelectorAll<HTMLElement>('[data-sumario]').forEach((nav) => {
    let total = 0;
    let feitas = 0;

    nav.querySelectorAll<HTMLElement>('[data-parte]').forEach((parte) => {
      const links = [...parte.querySelectorAll<HTMLAnchorElement>('a[data-secao-id]')];
      const n = links.filter((a) => lidas.has(a.dataset.secaoId!)).length;
      total += links.length;
      feitas += n;
      const conta = parte.querySelector('[data-conta]');
      if (conta) conta.innerHTML = `<span class="visualmente-oculto">Lidas: </span>${n}/${links.length}`;
      parte.querySelector<HTMLElement>('.barra')?.style.setProperty('--p', String(n / links.length));
      parte.classList.toggle('completa', n === links.length);
    });

    const numero = nav.querySelector('[data-lidas-total]');
    if (numero) numero.textContent = String(feitas);
    nav.querySelector<HTMLElement>('.sumario__progresso .barra')?.style.setProperty('--p', String(total ? feitas / total : 0));

    // Página atual: destaca e abre a parte dela (sem fechar as que a pessoa abriu)
    let atual: HTMLAnchorElement | null = null;
    nav.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
      const eh = new URL(a.href).pathname === caminho;
      if (eh) {
        a.setAttribute('aria-current', 'page');
        atual = a;
      } else {
        a.removeAttribute('aria-current');
      }
    });
    if (atual) {
      (atual as HTMLAnchorElement).closest('details')?.setAttribute('open', '');
    }
  });
}

/** Rola a lateral até a página atual, se ela estiver fora de vista. */
export function mostrarAtualNaLateral() {
  const lateral = document.querySelector<HTMLElement>('[data-lateral-rolagem]');
  const atual = lateral?.querySelector<HTMLElement>('[aria-current="page"]');
  if (!lateral || !atual) return;
  const r = atual.getBoundingClientRect();
  const l = lateral.getBoundingClientRect();
  if (r.top < l.top + 40 || r.bottom > l.bottom - 40) {
    lateral.scrollTop += r.top - l.top - l.height / 3;
  }
}

/** Visto nas abas das partes já concluídas. */
export function atualizarAbas() {
  const lidas = lerLidas();
  document.querySelectorAll<HTMLElement>('[data-aba-secoes]').forEach((aba) => {
    const ids = aba.dataset.abaSecoes!.split(',');
    aba.classList.toggle('aba--feita', ids.every((id) => lidas.has(id)));
  });
}
