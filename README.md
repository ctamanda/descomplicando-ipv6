# Descomplicando o IPv6: Um Guia Interativo de Redes

Plataforma educacional estática que apresenta o manual *Descomplicando o IPv6* como um livro que se folheia no navegador: capa, sumário, seis partes, exercícios, quiz em três níveis e glossário. Projeto do Estágio Supervisionado I (Sistemas de Informação, Unitins).

Site publicado: <https://ctamanda.github.io/descomplicando-ipv6/>

- Sem servidor, sem cadastro e sem login. O progresso de leitura e os resultados do quiz ficam só no navegador de quem lê (`localStorage`).
- Todo o conteúdo fica em arquivos Markdown e JSON na pasta `conteudo/`. Para mudar o texto, não é preciso mexer no código.
- Feito com [Astro](https://astro.build). O resultado é HTML, CSS e um pouco de JavaScript. Sem JavaScript, o conteúdo continua legível.

## Como rodar no computador

É preciso ter o [Node.js](https://nodejs.org) 22.12 ou mais novo.

```sh
npm install        # uma vez, para baixar as dependências
npm run dev        # servidor de desenvolvimento em http://localhost:4321/descomplicando-ipv6/
```

Para ver a versão final, igual à que vai para o ar:

```sh
npm run build      # gera o site em dist/
npm run preview    # serve o dist/ em http://localhost:4321/descomplicando-ipv6/
```

Se algum conteúdo estiver fora do padrão (uma seção sem número, uma questão do quiz citando uma seção que não existe), o `npm run build` para e diz qual arquivo corrigir.

## Onde fica cada coisa

```text
conteudo/                  tudo o que é texto do site
├── manual/                as seis partes do manual (uma por arquivo)
├── paginas/               Sobre e Referências
├── dados/partes.json      título e descrição de cada parte (sumário)
├── dados/glossario.json   termos do glossário
├── quiz.json              banco de questões do quiz
└── arquivos/              PDF para download e imagem da capa
src/
├── pages/                 rotas do site (uma página por arquivo)
├── components/            componentes (livro, cabeçalho, sumário...)
├── lib/conteudo/          leitura do conteudo/ e ordem das páginas do livro
├── lib/markdown/          regras que transformam o Markdown do manual
├── lib/epub/              geração do EPUB
├── scripts/               interações no navegador (folhear, quiz, progresso)
└── styles/                estilos
public/                    ícones e arquivos servidos como estão
docs/                      documentos do estágio
```

## Como adicionar ou editar uma seção do manual

Cada parte é um arquivo em `conteudo/manual/`, com o nome começando pelo número da parte (`parte-3-...md`). Dentro dele:

- `## Antes de começar` abre a parte (texto de apresentação, opcional).
- Cada seção começa com um título de nível 2 no formato `## N.M Título`, por exemplo `## 3.9 Endereços multicast`. O número define a ordem e o endereço da página. Títulos fora desse padrão são ignorados, e o build avisa.
- Subtítulos dentro da seção usam `###`.

Os blocos didáticos são citações que começam com o nome do bloco em negrito:

```markdown
> **Conceito-chave**
>
> Uma **rede de computadores** é um conjunto de dispositivos conectados...
```

Os nomes aceitos são: `Conceito-chave`, `Você sabia?`, `Exemplo`, `Atenção`, `Vamos praticar` e `O que você precisa lembrar`.

Num bloco `Vamos praticar`, tudo o que vem depois de uma linha `> **Gabarito**` fica escondido atrás do botão "Ver gabarito". Esses blocos aparecem também, automaticamente, no Apêndice A (Exercícios).

Uma parte nova (a 7, por exemplo) precisa de duas coisas: o arquivo `conteudo/manual/parte-7-....md` e um item com `"numero": 7` em `conteudo/dados/partes.json`.

Os termos do glossário que aparecem no texto viram links para a definição sozinhos.

## Como adicionar uma questão ao quiz

As questões ficam em `conteudo/quiz.json`. Cada nível (básico, intermediário, avançado) sorteia 10 questões por rodada, então é bom manter pelo menos 10 por nível; hoje são 20.

```json
{
  "id": "q-basico-021",
  "nivel": "basico",
  "secao": "3.5",
  "enunciado": "Qual é a forma abreviada de 2001:0db8:0000:0000:0000:0000:0000:0001?",
  "alternativas": ["2001:db8::1", "2001:db8:0:1", "2001::db8::1", "2001:db8"],
  "correta": 0,
  "explicacao": "Primeiro se tiram os zeros à esquerda de cada grupo; depois a maior sequência de grupos zerados vira ::."
}
```

- `id`: único no arquivo.
- `nivel`: `basico`, `intermediario` ou `avancado`.
- `secao`: seção do manual que a questão cobra. No resultado, o site indica essa seção para revisão, e ela precisa existir no manual.
- `alternativas`: de 2 a 6 opções. A ordem é embaralhada a cada rodada.
- `correta`: a posição da alternativa certa na lista, contando a partir de 0.
- `explicacao`: aparece depois que a pessoa responde.

## Como adicionar um termo ao glossário

Em `conteudo/dados/glossario.json`:

```json
{
  "termo": "Anycast",
  "sinonimos": ["endereço anycast"],
  "definicao": "Endereço compartilhado por vários dispositivos...",
  "secao": "2.5"
}
```

- `secao`: seção do manual onde o termo é explicado. Vira o link "Seção 2.5" no glossário e precisa existir no manual.
- `sinonimos`: opcional. Outras formas de escrever o termo, que também viram link no texto.

## Como atualizar o PDF e o EPUB

- **PDF:** substitua o arquivo `conteudo/arquivos/Descomplicando-o-IPv6.pdf` por um com o mesmo nome. O tamanho mostrado na página Download se atualiza sozinho.
- **EPUB:** é gerado a cada build a partir dos arquivos de `conteudo/manual/`. Não precisa fazer nada.

## Como publicar

O site é publicado no GitHub Pages pelo workflow `.github/workflows/deploy.yml`, a cada push na branch `main`.

Configuração, uma vez só:

1. No repositório do GitHub, abra **Settings > Pages**.
2. Em **Source**, escolha **GitHub Actions**.

Depois disso, cada `git push` na `main` gera o site e publica em alguns minutos. O andamento aparece na aba **Actions**.

O endereço `https://ctamanda.github.io/descomplicando-ipv6/` está configurado em `astro.config.mjs`. Para publicar em outro lugar (outro repositório, Netlify, Cloudflare Pages), defina as variáveis de ambiente no build:

```sh
SITE_URL=https://meu-dominio.com BASE_PATH=/ npm run build
```

## Créditos

Conteúdo baseado no livro *IPv6: O Novo Protocolo da Internet* e no Laboratório de IPv6 do NIC.br (CC BY-NC-SA 4.0). Autora do manual e da plataforma: Amanda Ribeiro da Costa.

A licença deste material ainda será definida.
