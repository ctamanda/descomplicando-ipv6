import { SKIP, visit } from 'unist-util-visit';

/**
 * Blocos didáticos do manual.
 *
 * > **Conceito-chave**        ->  <div class="bloco bloco--conceito" role="note">
 * >                                 <p class="bloco__rotulo">Conceito-chave</p> ...
 * > texto
 *
 * Dentro de "Vamos praticar", tudo depois de "**Gabarito**" vai para um <details>.
 * Na seção 4.7, cada parágrafo "**Resolução.** ..." (até o próximo título) também.
 */

export const TIPOS_DE_BLOCO: Record<string, string> = {
  'Conceito-chave': 'conceito',
  'Você sabia?': 'sabia',
  Exemplo: 'exemplo',
  Atenção: 'atencao',
  'Vamos praticar': 'praticar',
  'O que você precisa lembrar': 'lembrar',
};

type No = { type: string; value?: string; children?: No[]; data?: Record<string, unknown> };

function textoDe(no: No): string {
  if (typeof no.value === 'string') return no.value;
  return (no.children ?? []).map(textoDe).join('');
}

/** Se o parágrafo contém só um negrito (ex.: "**Gabarito**"), devolve o texto dele. */
function rotuloDoParagrafo(no: No | undefined): string | null {
  if (no?.type !== 'paragraph') return null;
  const filhos = (no.children ?? []).filter((c) => !(c.type === 'text' && !c.value?.trim()));
  if (filhos.length !== 1 || filhos[0].type !== 'strong') return null;
  return textoDe(filhos[0]).trim().replace(/[.:]$/, '');
}

function recolhivel(textoDoBotao: string, filhos: No[]): No {
  return {
    type: 'resposta',
    data: { hName: 'details', hProperties: { className: ['resposta'] } },
    children: [
      { type: 'paragraph', data: { hName: 'summary' }, children: [{ type: 'text', value: textoDoBotao }] },
      ...filhos,
    ],
  };
}

/** Seção 4.7: "**Resolução.** texto" solto no corpo, até o próximo título. */
function recolherResolucoes(raiz: No) {
  const filhos = raiz.children ?? [];
  for (let i = 0; i < filhos.length; i++) {
    const p = filhos[i];
    const primeiro = p.children?.[0];
    if (p.type !== 'paragraph' || primeiro?.type !== 'strong') continue;
    if (!/^Resolução\.?$/.test(textoDe(primeiro).trim())) continue;

    p.children!.shift();
    const seguinte = p.children![0];
    if (seguinte?.type === 'text') seguinte.value = seguinte.value!.replace(/^\s+/, '');

    let fim = i + 1;
    while (fim < filhos.length && !['heading', 'thematicBreak', 'blockquote'].includes(filhos[fim].type)) fim++;
    filhos.splice(i, fim - i, recolhivel('Ver resolução', filhos.slice(i, fim)));
  }
}

export default function remarkBlocos() {
  return (raiz: No) => {
    recolherResolucoes(raiz);

    visit(raiz as any, 'blockquote', (no: No, indice?: number, pai?: No) => {
      if (!pai || indice === undefined) return;
      const rotulo = rotuloDoParagrafo(no.children?.[0]);

      // Formato alternativo: "> **Resolução**" como blockquote próprio.
      if (rotulo === 'Resolução') {
        pai.children![indice] = recolhivel('Ver resolução', no.children!.slice(1));
        return SKIP;
      }

      const tipo = rotulo ? TIPOS_DE_BLOCO[rotulo] : undefined;
      if (!tipo) return; // citação simples

      const conteudo = no.children!.slice(1);
      const iGabarito = conteudo.findIndex((c) => rotuloDoParagrafo(c) === 'Gabarito');
      if (iGabarito >= 0) {
        conteudo.splice(iGabarito, conteudo.length - iGabarito, recolhivel('Ver gabarito', conteudo.slice(iGabarito + 1)));
      }

      pai.children![indice] = {
        type: 'bloco',
        data: {
          hName: 'div',
          hProperties: { className: ['bloco', `bloco--${tipo}`], role: 'note', ariaLabel: rotulo },
        },
        children: [
          {
            type: 'paragraph',
            data: { hName: 'p', hProperties: { className: ['bloco__rotulo'], ariaHidden: 'true' } },
            children: [{ type: 'text', value: rotulo! }],
          },
          ...conteudo,
        ],
      };
      return SKIP;
    });
  };
}
