/**
 * Gera o EPUB do manual no build, a partir dos mesmos Markdown do site.
 *
 * Estrutura (EPUB 3, com toc.ncx para leitores antigos):
 *   mimetype                      (primeiro arquivo, sem compressão)
 *   META-INF/container.xml
 *   OEBPS/content.opf, nav.xhtml, toc.ncx, estilo.css, capa.png
 *   OEBPS/capa.xhtml, sobre.xhtml, parte-N.xhtml, secao-N-M.xhtml, referencias.xhtml
 *
 * No livro digital não há botão "Ver gabarito": gabaritos e resoluções
 * aparecem abertos, com um rótulo.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { strToU8, zipSync, type Zippable } from 'fflate';
import { visit } from 'unist-util-visit';
import { getPartes, getSecoes } from '../conteudo/manual';
import { criarRenderizador } from '../markdown/processador';
import { ESTILO_EPUB } from './estilo';

const TITULO = 'Descomplicando o IPv6';
const SUBTITULO = 'Um Guia Interativo de Redes';
const AUTORA = 'Amanda Ribeiro da Costa';
const IDENTIFICADOR = 'urn:uuid:5f1e7c2a-6b1d-4c8e-9a3f-2d7b8e4c1a90';
const PASTA = path.resolve('conteudo');

type El = { type: string; tagName?: string; value?: string; properties?: Record<string, unknown>; children?: El[] };

/** Gabarito e resolução abertos, com rótulo, e sem atributos só úteis no site. */
function rehypeParaEpub() {
  return (raiz: El) => {
    visit(raiz as any, 'element', (no: El) => {
      if (no.tagName === 'details') {
        no.tagName = 'div';
        const resumo = no.children?.find((c) => c.tagName === 'summary');
        if (resumo) {
          const texto = resumo.children?.map((c) => c.value ?? '').join('') ?? '';
          resumo.tagName = 'p';
          resumo.properties = { className: ['resposta__rotulo'] };
          resumo.children = [{ type: 'text', value: texto.replace(/^Ver /, '').replace(/^./, (l) => l.toUpperCase()) }];
        }
      }
      if (no.properties?.tabIndex !== undefined) delete no.properties.tabIndex;
      if (no.tagName === 'div' && (no.properties?.className as string[] | undefined)?.includes('tabela')) {
        delete no.properties!.role;
        delete no.properties!.ariaLabel;
      }
      return undefined;
    });
    return raiz;
  };
}

const markdownParaXhtml = criarRenderizador([rehypeParaEpub as any]);

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function pagina(titulo: string, corpo: string, tipo = '') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="pt-BR" lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>${esc(titulo)}</title>
<link rel="stylesheet" type="text/css" href="estilo.css" />
</head>
<body${tipo ? ` epub:type="${tipo}"` : ''}>
${corpo}
</body>
</html>
`;
}

type Capitulo = { id: string; arquivo: string; titulo: string; xhtml: string; filhos?: Capitulo[] };

async function montarCapitulos() {
  const [partes, secoes] = await Promise.all([getPartes(), getSecoes()]);
  const lerPagina = (nome: string) => readFile(path.join(PASTA, 'paginas', nome), 'utf-8');

  const sobre: Capitulo = {
    id: 'sobre',
    arquivo: 'sobre.xhtml',
    titulo: 'Sobre a autora, Prefácio e Apresentação',
    xhtml: pagina('Apresentação', `<section epub:type="frontmatter">\n${await markdownParaXhtml(await lerPagina('sobre.md'))}\n</section>`),
  };

  const capitulosPartes: Capitulo[] = [];
  for (const parte of partes) {
    const { numero, titulo } = parte.data;
    const daParte = secoes.filter((s) => s.data.parte === numero);

    const filhos: Capitulo[] = [];
    for (const s of daParte) {
      const arquivo = `secao-${s.data.numero.replace('.', '-')}.xhtml`;
      const nome = `${s.data.numero} ${s.data.titulo}`;
      filhos.push({
        id: `secao-${s.data.numero.replace('.', '-')}`,
        arquivo,
        titulo: nome,
        xhtml: pagina(
          nome,
          `<section epub:type="chapter">
<p class="chapeu">Parte ${numero} · ${esc(titulo)}</p>
<h1>${esc(nome)}</h1>
${await markdownParaXhtml(s.body ?? '')}
</section>`,
        ),
      });
    }

    const lista = daParte
      .map((s) => `<li><a href="secao-${s.data.numero.replace('.', '-')}.xhtml">${esc(`${s.data.numero} ${s.data.titulo}`)}</a></li>`)
      .join('\n');
    capitulosPartes.push({
      id: `parte-${numero}`,
      arquivo: `parte-${numero}.xhtml`,
      titulo: `Parte ${numero} · ${titulo}`,
      xhtml: pagina(
        `Parte ${numero}: ${titulo}`,
        `<section epub:type="part" class="abertura">
<p class="abertura__numero">${numero}</p>
<p class="chapeu">Parte ${numero}</p>
<h1>${esc(titulo)}</h1>
<p class="subtitulo">Antes de começar</p>
${await markdownParaXhtml(parte.body ?? '')}
<p class="subtitulo">Nesta parte</p>
<ol class="lista-secoes">
${lista}
</ol>
</section>`,
      ),
      filhos,
    });
  }

  const referencias: Capitulo = {
    id: 'referencias',
    arquivo: 'referencias.xhtml',
    titulo: 'Referências',
    xhtml: pagina('Referências', `<section epub:type="bibliography">\n${await markdownParaXhtml(await lerPagina('referencias.md'))}\n</section>`, ''),
  };

  return { capitulos: [sobre, ...capitulosPartes, referencias] };
}

function nav(capitulos: Capitulo[]) {
  const item = (c: Capitulo): string =>
    `<li><a href="${c.arquivo}">${esc(c.titulo)}</a>${c.filhos?.length ? `\n<ol>\n${c.filhos.map(item).join('\n')}\n</ol>` : ''}</li>`;
  return pagina(
    'Sumário',
    `<nav epub:type="toc" id="toc">
<h1>Sumário</h1>
<ol>
${capitulos.map(item).join('\n')}
</ol>
</nav>
<nav epub:type="landmarks" hidden="hidden">
<ol>
<li><a epub:type="cover" href="capa.xhtml">Capa</a></li>
<li><a epub:type="toc" href="nav.xhtml">Sumário</a></li>
<li><a epub:type="bodymatter" href="parte-1.xhtml">Início da leitura</a></li>
</ol>
</nav>`,
  );
}

function ncx(capitulos: Capitulo[]) {
  let ordem = 0;
  const ponto = (c: Capitulo): string =>
    `<navPoint id="np-${c.id}" playOrder="${++ordem}"><navLabel><text>${esc(c.titulo)}</text></navLabel><content src="${c.arquivo}"/>${(c.filhos ?? []).map(ponto).join('')}</navPoint>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="pt-BR">
<head><meta name="dtb:uid" content="${IDENTIFICADOR}"/></head>
<docTitle><text>${esc(`${TITULO}: ${SUBTITULO}`)}</text></docTitle>
<navMap>
${capitulos.map(ponto).join('\n')}
</navMap>
</ncx>
`;
}

function opf(capitulos: Capitulo[]) {
  const todos = capitulos.flatMap((c) => [c, ...(c.filhos ?? [])]);
  const modificado = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  const manifesto = todos.map((c) => `<item id="${c.id}" href="${c.arquivo}" media-type="application/xhtml+xml"/>`).join('\n');
  const espinha = todos.map((c) => `<itemref idref="${c.id}"/>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id-livro" xml:lang="pt-BR">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="id-livro">${IDENTIFICADOR}</dc:identifier>
<dc:title>${esc(`${TITULO}: ${SUBTITULO}`)}</dc:title>
<dc:creator>${esc(AUTORA)}</dc:creator>
<dc:language>pt-BR</dc:language>
<dc:date>2026</dc:date>
<dc:subject>Redes de computadores</dc:subject>
<dc:subject>IPv6</dc:subject>
<dc:description>Manual introdutório de IPv6 em seis partes, produzido no Estágio Supervisionado I do curso de Sistemas de Informação da Universidade Estadual do Tocantins (Unitins).</dc:description>
<meta property="dcterms:modified">${modificado}</meta>
<meta name="cover" content="capa-imagem"/>
</metadata>
<manifest>
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
<item id="estilo" href="estilo.css" media-type="text/css"/>
<item id="capa-imagem" href="capa.png" media-type="image/png" properties="cover-image"/>
<item id="capa" href="capa.xhtml" media-type="application/xhtml+xml"/>
${manifesto}
</manifest>
<spine toc="ncx">
<itemref idref="capa" linear="yes"/>
<itemref idref="nav"/>
${espinha}
</spine>
</package>
`;
}

let emCache: Promise<Uint8Array> | null = null;

/** O arquivo .epub pronto (gerado uma vez por build). */
export function gerarEpub() {
  emCache ??= (async () => {
    const { capitulos } = await montarCapitulos();
    const capaPng = await readFile(path.join(PASTA, 'arquivos', 'capa.png'));
    const capaXhtml = pagina(
      'Capa',
      `<section epub:type="cover" class="capa"><img src="capa.png" alt="${esc(`Capa: ${TITULO}, ${SUBTITULO.toLowerCase()}. ${AUTORA}, Universidade Estadual do Tocantins, Estágio Supervisionado I, 2026.`)}"/></section>`,
    );

    const arquivos: Zippable = {
      // O mimetype precisa ser o primeiro arquivo e ir sem compressão.
      mimetype: [strToU8('application/epub+zip'), { level: 0 }],
      'META-INF/container.xml': strToU8(`<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>
`),
      'OEBPS/content.opf': strToU8(opf(capitulos)),
      'OEBPS/nav.xhtml': strToU8(nav(capitulos)),
      'OEBPS/toc.ncx': strToU8(ncx(capitulos)),
      'OEBPS/estilo.css': strToU8(ESTILO_EPUB),
      'OEBPS/capa.png': [new Uint8Array(capaPng), { level: 0 }],
      'OEBPS/capa.xhtml': strToU8(capaXhtml),
    };
    for (const c of capitulos.flatMap((c) => [c, ...(c.filhos ?? [])])) {
      arquivos[`OEBPS/${c.arquivo}`] = strToU8(c.xhtml);
    }
    return zipSync(arquivos, { level: 9 });
  })();
  return emCache;
}
