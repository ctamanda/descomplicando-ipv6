export function iniciarFiguras() {
  const lightbox = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
  const imagem = lightbox?.querySelector<HTMLImageElement>('[data-lightbox-image]');
  const legenda = lightbox?.querySelector<HTMLElement>('[data-lightbox-caption]');
  if (!lightbox || !imagem || !legenda || lightbox.dataset.pronto) return;
  lightbox.dataset.pronto = 'true';

  document.addEventListener('click', (evento) => {
    const link = (evento.target as HTMLElement).closest<HTMLAnchorElement>('[data-lightbox]');
    if (!link || !document.body.contains(link)) return;
    evento.preventDefault();
    const figura = link.closest('figure');
    imagem.src = link.href;
    imagem.alt = link.querySelector('img')?.alt ?? '';
    legenda.textContent = figura?.querySelector('figcaption')?.textContent ?? '';
    lightbox.showModal();
  });
  lightbox.addEventListener('click', (evento) => {
    if (evento.target === lightbox) lightbox.close();
  });
}
