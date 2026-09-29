/** Seções marcadas como lidas, guardadas só neste navegador. */
import { atualizarSumario } from './sumario';

const CHAVE = 'ipv6:lidas';

export function lerLidas(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(CHAVE) ?? '[]'));
  } catch {
    return new Set();
  }
}

function gravar(lidas: Set<string>) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify([...lidas]));
  } catch {
    /* navegador sem armazenamento: a marcação vale só nesta visita */
  }
}

/** Botões "Marcar como lida" da página. */
export function iniciarLidas() {
  document.querySelectorAll<HTMLButtonElement>('[data-marcar-lida]').forEach((botao) => {
    const id = botao.dataset.marcarLida!;
    const rotulo = botao.querySelector('[data-rotulo]')!;
    const pintar = () => {
      const lida = lerLidas().has(id);
      botao.setAttribute('aria-pressed', String(lida));
      rotulo.textContent = lida ? 'Seção lida' : 'Marcar como lida';
    };
    botao.addEventListener('click', () => {
      const lidas = lerLidas();
      lidas.has(id) ? lidas.delete(id) : lidas.add(id);
      gravar(lidas);
      pintar();
      atualizarSumario();
    });
    pintar();
    botao.classList.add('pronto');
  });
}
