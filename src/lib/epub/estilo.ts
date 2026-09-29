/**
 * CSS do EPUB. Sem fundos coloridos (os leitores têm modo noturno e sépia):
 * os blocos didáticos se distinguem pela borda e pelo rótulo.
 */
export const ESTILO_EPUB = `
body { margin: 0 5%; line-height: 1.55; }
h1, h2, h3 { font-family: Georgia, serif; line-height: 1.25; page-break-after: avoid; }
h1 { font-size: 1.6em; margin: 0.4em 0 1em; color: #123c6b; }
h2 { font-size: 1.3em; margin: 1.6em 0 0.5em; color: #123c6b; }
h3 { font-size: 1.12em; margin: 1.5em 0 0.4em; color: #123c6b; }
p { margin: 0 0 0.8em; }
sup { font-size: 0.7em; line-height: 0; }
code { font-family: monospace; font-size: 0.9em; }
blockquote { margin: 1em 0; padding-left: 1em; border-left: 3px solid #c5cfda; font-style: italic; }

.chapeu, .subtitulo, .bloco__rotulo, .resposta__rotulo {
  font-size: 0.72em; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; color: #566372;
}
.chapeu { margin-bottom: 0.3em; }
.subtitulo { margin-top: 2em; }

.abertura__numero { font-family: Georgia, serif; font-size: 4em; line-height: 1; color: #8fb4dd; margin: 0.5em 0 0.1em; }
.lista-secoes { padding-left: 1.2em; }
.lista-secoes li { margin: 0.3em 0; }

.bloco { margin: 1.3em 0; padding: 0.2em 0 0.2em 1em; border-left: 4px solid #c5cfda; page-break-inside: avoid; }
.bloco--conceito, .bloco--lembrar { border-left-color: #123c6b; }
.bloco--praticar { border-left-color: #2fb36a; }
.bloco--atencao { border-left-color: #f2b705; }
.bloco--conceito .bloco__rotulo, .bloco--lembrar .bloco__rotulo { color: #123c6b; }
.bloco--praticar .bloco__rotulo { color: #1a6e3f; }
.bloco--atencao .bloco__rotulo { color: #6f5200; }

.resposta { margin-top: 0.8em; padding-top: 0.5em; border-top: 1px dotted #c5cfda; }
.resposta__rotulo { color: #1a6e3f; }

.tabela { margin: 1em 0; overflow-x: auto; }
table { border-collapse: collapse; font-size: 0.85em; }
th, td { border: 1px solid #c5cfda; padding: 0.3em 0.5em; text-align: left; vertical-align: top; }
th { font-weight: bold; }

.capa { margin: 0; padding: 0; text-align: center; }
.capa img { max-width: 100%; max-height: 100%; }
nav ol { list-style: none; padding-left: 1em; }
nav li { margin: 0.25em 0; }
`;
