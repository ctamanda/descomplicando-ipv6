/** Sumário (lateral fixa ou painel), menu do site e botão de tema. Roda a cada navegação. */

const TELA_COM_LATERAL = window.matchMedia('(min-width: 64rem)');

function lateralRecolhida() {
  return document.documentElement.dataset.lateral === 'recolhida';
}

function definirLateral(recolhida: boolean) {
  const raiz = document.documentElement;
  if (recolhida) raiz.dataset.lateral = 'recolhida';
  else delete raiz.dataset.lateral;
  try {
    localStorage.setItem('ipv6:lateral', recolhida ? 'recolhida' : 'aberta');
  } catch {}
  pintarBotoesSumario();
}

/** Nesta tela, o botão de sumário controla a lateral fixa (e não o painel)? */
function usaLateral() {
  return TELA_COM_LATERAL.matches && !!document.querySelector('.lateral');
}

function pintarBotoesSumario() {
  const lateral = usaLateral();
  document.querySelectorAll<HTMLElement>('[data-abrir-gaveta]').forEach((b) => {
    if (lateral) {
      b.setAttribute('aria-label', lateralRecolhida() ? 'Mostrar o sumário' : 'Recolher o sumário');
      b.setAttribute('aria-expanded', String(!lateralRecolhida()));
    } else {
      b.setAttribute('aria-label', 'Abrir o sumário');
      b.setAttribute('aria-expanded', 'false');
    }
  });
}

export function iniciarGaveta() {
  const gaveta = document.querySelector<HTMLDialogElement>('[data-gaveta]');

  document.querySelectorAll<HTMLElement>('[data-abrir-gaveta]').forEach((botao) => {
    botao.addEventListener('click', (e) => {
      e.preventDefault(); // sem JS, o botão do cabeçalho é um link para a capa do manual
      if (usaLateral()) return definirLateral(!lateralRecolhida());
      if (!gaveta) return;
      gaveta.showModal();
      botao.setAttribute('aria-expanded', 'true');
      gaveta.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ block: 'center' });
    });
  });

  // O botão « fica na lateral, que é mantida entre páginas: liga uma vez só.
  const recolher = document.querySelector<HTMLElement>('[data-recolher-lateral]');
  if (recolher && !recolher.dataset.pronto) {
    recolher.dataset.pronto = 'true';
    recolher.addEventListener('click', () => definirLateral(true));
  }

  if (gaveta) {
    gaveta.addEventListener('close', pintarBotoesSumario);
    gaveta.querySelector('[data-fechar-gaveta]')?.addEventListener('click', () => gaveta.close());
    gaveta.addEventListener('click', (e) => {
      if (e.target === gaveta) gaveta.close(); // toque no fundo escurecido
    });
    // Ao escolher uma seção, fecha o painel antes de trocar de página.
    gaveta.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => gaveta.close()));
  }

  pintarBotoesSumario();
  TELA_COM_LATERAL.onchange = pintarBotoesSumario;
  iniciarMenu();
}

/** Menu do site (☰ do cabeçalho). */
function iniciarMenu() {
  const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
  const botao = document.querySelector<HTMLElement>('[data-abrir-menu]');
  if (!menu || !botao) return;
  botao.addEventListener('click', (e) => {
    e.preventDefault(); // sem JS, o ☰ é um link para o sumário
    menu.showModal();
    botao.setAttribute('aria-expanded', 'true');
  });
  menu.addEventListener('close', () => botao.setAttribute('aria-expanded', 'false'));
  menu.querySelector('[data-fechar-menu]')?.addEventListener('click', () => menu.close());
  menu.addEventListener('click', (e) => {
    if (e.target === menu) menu.close(); // toque no fundo escurecido
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.close()));
}

export function iniciarTema() {
  const botao = document.querySelector<HTMLButtonElement>('[data-tema]');
  if (!botao) return;
  const raiz = document.documentElement;
  const escuroPeloSistema = window.matchMedia('(prefers-color-scheme: dark)');
  const escuroAgora = () => (raiz.dataset.theme ? raiz.dataset.theme === 'escuro' : escuroPeloSistema.matches);
  const pintar = () => {
    const escuro = escuroAgora();
    botao.setAttribute('aria-pressed', String(escuro));
    botao.setAttribute('aria-label', escuro ? 'Usar modo claro' : 'Usar modo escuro');
  };
  botao.addEventListener('click', () => {
    raiz.dataset.theme = escuroAgora() ? 'claro' : 'escuro';
    try {
      localStorage.setItem('ipv6:tema', raiz.dataset.theme);
    } catch {}
    pintar();
  });
  escuroPeloSistema.onchange = pintar;
  pintar();
}
