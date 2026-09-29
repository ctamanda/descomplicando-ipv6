import { SKIP, visit } from 'unist-util-visit';

/**
 * "2^128" -> 2<sup>128</sup> e "2^(B−A)" -> 2<sup>B−A</sup>.
 * Só atua em texto comum: código inline é outro tipo de nó e fica intocado.
 */
const EXPOENTE = /(?<=[0-9A-Za-z)])\^(\([^)\n]+\)|[0-9A-Za-z]+)/g;

type No = { type: string; value?: string; children?: No[]; data?: Record<string, unknown> };

export default function remarkSobrescrito() {
  return (raiz: No) => {
    visit(raiz as any, 'text', (no: No, indice?: number, pai?: No) => {
      if (!pai || indice === undefined || !no.value!.includes('^')) return;

      const novos: No[] = [];
      let ultimo = 0;
      for (const m of no.value!.matchAll(EXPOENTE)) {
        if (m.index! > ultimo) novos.push({ type: 'text', value: no.value!.slice(ultimo, m.index) });
        const expoente = m[1].replace(/^\((.*)\)$/, '$1');
        novos.push({ type: 'sobrescrito', data: { hName: 'sup' }, children: [{ type: 'text', value: expoente }] });
        ultimo = m.index! + m[0].length;
      }
      if (!novos.length) return;
      if (ultimo < no.value!.length) novos.push({ type: 'text', value: no.value!.slice(ultimo) });

      pai.children!.splice(indice, 1, ...novos);
      return [SKIP, indice + novos.length];
    });
  };
}
