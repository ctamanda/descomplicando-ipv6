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

function alternar(id: string) {
  const lidas = lerLidas();
  lidas.has(id) ? lidas.delete(id) : lidas.add(id);
  gravar(lidas);
  pintarBotoes();
  atualizarSumario();
}

/** Estado de todos os botões: o do fim da seção e os marcadores das listas. */
function pintarBotoes() {
  const lidas = lerLidas();
  document.querySelectorAll<HTMLButtonElement>('[data-marcar-lida]').forEach((botao) => {
    const lida = lidas.has(botao.dataset.marcarLida!);
    botao.setAttribute('aria-pressed', String(lida));
    botao.querySelector('[data-rotulo]')!.textContent = lida ? 'Seção lida' : 'Marcar como lida';
    botao.classList.add('pronto');
  });
  document.querySelectorAll<HTMLButtonElement>('[data-alternar-lida]').forEach((botao) => {
    const lida = lidas.has(botao.dataset.alternarLida!);
    botao.setAttribute('aria-pressed', String(lida));
  });
}

// Um ouvinte só, no documento: vale para a lateral (mantida entre páginas) e para
// o conteúdo de cada página nova, sem religar nada a cada navegação.
document.addEventListener('click', (e) => {
  const botao = (e.target as Element).closest<HTMLButtonElement>('[data-marcar-lida], [data-alternar-lida]');
  if (!botao) return;
  alternar(botao.dataset.marcarLida ?? botao.dataset.alternarLida!);
});

/** Pinta os botões "Marcar como lida" e os marcadores da página. */
export function iniciarLidas() {
  pintarBotoes();
}
