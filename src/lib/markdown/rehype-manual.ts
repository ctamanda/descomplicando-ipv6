import { SKIP, visit } from 'unist-util-visit';
import { slugify } from '../slug';

type El = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: El[];
};

function textoDe(no: El): string {
  if (no.type === 'text') return no.value ?? '';
  return (no.children ?? []).map(textoDe).join('');
}

/** Dá a cada ### (e ##) um id sem acentos, para link direto: #grupos-de-zeros. */
export function rehypeTitulos() {
  return (raiz: El) => {
    const usados = new Map<string, number>();
    visit(raiz as any, 'element', (no: El) => {
      if (!/^h[23]$/.test(no.tagName!)) return;
      const base = slugify(textoDe(no)) || 'titulo';
      const n = usados.get(base) ?? 0;
      usados.set(base, n + 1);
      no.properties = { ...no.properties, id: n ? `${base}-${n}` : base };
    });
  };
}

/** Envolve cada tabela num contêiner com rolagem horizontal, acessível por teclado. */
export function rehypeTabelas() {
  return (raiz: El) => {
    visit(raiz as any, 'element', (no: El, indice?: number, pai?: El) => {
      if (no.tagName !== 'table' || !pai || indice === undefined) return;
      pai.children![indice] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['tabela'], tabIndex: 0, role: 'region', ariaLabel: 'Tabela' },
        children: [no],
      };
      return SKIP;
    });
  };
}
