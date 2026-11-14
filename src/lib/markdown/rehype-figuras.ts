import path from 'node:path';

type Node = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
};

interface Opcoes {
  baseImagem?: string;
  preferirPng?: boolean;
}

function texto(no: Node): string {
  return no.children?.map((filho) => filho.value ?? texto(filho)).join('') ?? no.value ?? '';
}

function imagemDoPar(no: Node) {
  const imagem = no.children?.find((filho) => filho.tagName === 'img');
  if (!imagem || !imagem.properties) return null;
  if (typeof imagem.properties.src !== 'string') {
    const marcador = Object.entries(imagem.properties).find(([chave]) => chave.startsWith('__ASTRO_IMAGE_'));
    if (!marcador || typeof marcador[1] !== 'string') return null;
    try {
      const dados = JSON.parse(marcador[1]) as { src?: string; alt?: string };
      if (!dados.src) return null;
      imagem.properties.src = dados.src;
      if (dados.alt) imagem.properties.alt = dados.alt;
      delete imagem.properties[marcador[0]];
    } catch {
      return null;
    }
  }
  return imagem;
}

function legendaNoPar(no: Node) {
  return no.children?.find((filho) => filho.tagName === 'em' || filho.tagName === 'i');
}

function legenda(textoLegenda: string): Node[] {
  const match = textoLegenda.match(/^(Figura\s+\d+\.\d+)(\s*[–-]\s*)(.*)$/i);
  if (!match) return [{ type: 'text', value: textoLegenda }];
  return [
    { type: 'element', tagName: 'strong', properties: {}, children: [{ type: 'text', value: match[1] }] },
    { type: 'text', value: `${match[2]}${match[3]}` },
  ];
}

function normalizarImagem(src: string, opcoes: Opcoes) {
  const caminho = src.replace(/^\.?\//, '').replace(/^imagens\//, '');
  const nome = path.posix.basename(caminho);
  const extensao = path.posix.extname(nome).toLowerCase();
  const nomePng = `${path.posix.basename(nome, extensao)}.png`;
  const caminhoFinal = opcoes.preferirPng && extensao === '.svg' ? `imagens/png/${nomePng}` : `imagens/${nome}`;
  return `${opcoes.baseImagem ?? ''}${caminhoFinal}`;
}

export default function rehypeFiguras(opcoes: Opcoes = {}) {
  return (raiz: Node) => {
    const filhos = raiz.children ?? [];
    for (let i = 0; i < filhos.length; i += 1) {
      const parImagem = filhos[i];
      const imagem = parImagem.tagName === 'p' ? imagemDoPar(parImagem) : null;
      if (!imagem) continue;

      const legendaNo = legendaNoPar(parImagem);
      const legendaSeparada = filhos[i + 1]?.tagName === 'p' ? filhos[i + 1] : null;
      const noLegenda = legendaNo ?? legendaSeparada;
      if (!noLegenda) continue;

      const legendaTexto = texto(noLegenda).trim();
      if (!/^Figura\s+\d+\.\d+/i.test(legendaTexto)) continue;

      const src = String(imagem.properties!.src);
      const srcFinal = normalizarImagem(src, opcoes);
      imagem.properties = {
        ...imagem.properties,
        src: srcFinal,
        width: 1000,
        height: 520,
        loading: 'lazy',
        decoding: 'async',
      };

      const figura: Node = {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['figura'] },
        children: [
          {
            type: 'element',
            tagName: 'a',
            properties: {
              className: ['figura__link'],
              href: srcFinal,
              'data-lightbox': 'figura',
              'aria-label': 'Ampliar figura',
            },
            children: [imagem],
          },
          {
            type: 'element',
            tagName: 'figcaption',
            properties: { className: ['figura__legenda'] },
            children: legenda(legendaTexto),
          },
        ],
      };
      filhos.splice(i, legendaNo ? 1 : 2, figura);
    }

    return raiz;
  };
}
