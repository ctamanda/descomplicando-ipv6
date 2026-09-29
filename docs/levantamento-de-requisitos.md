# Levantamento de Requisitos

**Projeto:** Descomplicando o IPv6: Um Guia Interativo de Redes
**Aluna:** Amanda Ribeiro da Costa
**Disciplina:** Estágio Supervisionado I
**Professor da disciplina:** Jeferson Morais da Costa
**Professor orientador:** Alysson Martins Bruno

---

## 1. Identificação do projeto

**Título:** Descomplicando o IPv6: Um Guia Interativo de Redes

**Produto:** plataforma web educacional composta por um Manual de IPv6 organizado em capítulos e seções, exercícios ao final de cada seção, um Quiz de avaliação por níveis, glossário, referências e a versão completa do manual para download em PDF.

## 2. Apresentação do projeto

O projeto consiste no desenvolvimento de uma plataforma web educacional destinada ao ensino dos fundamentos do protocolo IPv6, com o objetivo de desmistificar o protocolo para quem nunca teve contato com redes de computadores.

A proposta é apresentar o conteúdo de forma didática, progressiva e acessível: o leitor começa em conceitos básicos de redes, entende por que o IPv6 surgiu, aprende a ler e interpretar endereços e prefixos e chega à configuração e ao uso do protocolo na prática. Cada micro conceito é explicado antes de ser usado, sem pressupor conhecimento prévio.

A plataforma segue o modelo de portais educacionais de leitura (artigos por assunto, navegação lateral, exercício ao fim de cada tópico), enquanto o manual segue a organização de um livro didático, com capítulos, seções, exemplos, ilustrações, exercícios e recursos de apoio.

O usuário pode ler o manual pelo site, resolver os exercícios de cada seção, testar o conhecimento no Quiz e baixar o manual completo em PDF para estudo offline.

## 3. Objetivo do produto

Desenvolver uma plataforma educacional web que facilite o aprendizado de IPv6 por meio de conteúdo teórico, exemplos práticos, recursos visuais, exercícios e avaliação interativa, em uma abordagem progressiva que vai dos conceitos básicos de redes até o endereçamento, a configuração e o uso do IPv6.

## 4. Público-alvo

A plataforma atende três perfis principais:

1. **Iniciante absoluto:** pessoa sem conhecimento prévio em redes de computadores.
2. **Estudante:** aluno iniciante de TI, de Sistemas de Informação, de redes de computadores ou de cursos relacionados.
3. **Profissional iniciante ou em revisão:** quem já atua na área e quer compreender ou revisar os fundamentos do IPv6.

A linguagem e a estrutura do material são projetadas para o primeiro perfil. Nenhum conhecimento prévio em redes é obrigatório para acompanhar o conteúdo.

## 5. Escopo

### 5.1 Dentro do escopo

- Fundamentos de redes necessários para entender o IPv6.
- Origem, motivação e características do IPv6.
- Endereçamento, representação, prefixos e sub-redes.
- Configuração, autoconfiguração, DHCPv6, DNS e verificação.
- Roteamento básico e coexistência com IPv4.
- Exercícios por seção e Quiz por nível de dificuldade.
- Manual em PDF para download.

### 5.2 Fora do escopo

- **Segurança em IPv6** (IPsec, ataques, filtragem, firewall). O foco é entender e usar o protocolo.
- **Ambiente de laboratório ou máquina virtual.** O NIC.br já oferece o "Laboratório de IPv6" com essa proposta. A plataforma se posiciona como material de leitura, fixação e avaliação, e indica o laboratório do NIC.br como próximo passo para quem quiser praticar em ambiente real.
- Cadastro de usuários, login e área administrativa.
- Conteúdo em outros idiomas.

### 5.3 Decisões de projeto

- **Sem cadastro.** Todo o conteúdo e o Quiz são acessíveis sem conta. O progresso do Quiz, se armazenado, fica apenas no navegador do usuário.
- **Fonte única de conteúdo.** O texto do manual é escrito em um formato que gera tanto as páginas do site quanto o PDF, evitando manter duas versões.
- **Conteúdo autoral.** O manual é escrito a partir da bibliografia base, com citação das fontes. Não há transcrição de trechos dos livros.
- **Referência de formato:** portais educacionais de leitura (ex.: Brasil Escola), com artigo por seção e navegação clara entre partes.

## 6. Bibliografia base

- BRITO, Samuel Henrique Bucke. **IPv6: O Novo Protocolo da Internet**. São Paulo: Novatec, 2013. ISBN 978-85-7522-638-4. Obra com todos os direitos reservados: usada como referência teórica (estrutura do endereço, NDP, SLAAC, DHCPv6, roteamento, transição), sem reprodução de trechos.
- EQUIPE IPV6.BR (MOREIRAS, A. M. et al.). **Laboratório de IPv6: aprenda na prática usando um emulador de redes**. São Paulo: NIC.br / Novatec, 2015. ISBN 978-85-7522-434-2. Disponível em http://lab.ipv6.br. Licença CC BY-NC-SA 4.0: permite adaptar o conteúdo com atribuição, para fins não comerciais, desde que a obra derivada mantenha a mesma licença.
- RFCs de referência do IPv6, consultadas para conferência técnica (endereçamento, ND, SLAAC, DHCPv6).

**Uso das fontes.** O livro de Brito orienta a ordem e a profundidade dos conceitos; o Laboratório de IPv6 orienta a parte prática (comandos, verificação, comportamento do NDP, SLAAC e DHCPv6) e é indicado como próximo passo para quem quiser praticar em emulador. Caso o manual adapte trechos ou figuras do Laboratório de IPv6, o manual será publicado sob a mesma licença CC BY-NC-SA 4.0, com crédito ao NIC.br.

A bibliografia poderá ser complementada durante o levantamento bibliográfico.

## 7. Requisitos funcionais do sistema

### 7.1 Manual e navegação

| ID | Requisito | Descrição |
|---|---|---|
| RF01 | Disponibilizar o manual na web | O usuário acessa o conteúdo do manual diretamente pelo navegador. |
| RF02 | Organizar em capítulos e seções | O conteúdo possui hierarquia (parte > capítulo > seção) que facilita localizar e compreender os assuntos. |
| RF03 | Endereço próprio por seção | Cada seção do manual possui uma URL própria, permitindo links diretos a partir do Quiz, do glossário e de outras seções. |
| RF04 | Sumário navegável | O manual apresenta um sumário com todas as partes e seções, acessível de qualquer página do manual. |
| RF05 | Navegação sequencial | Cada seção oferece acesso à seção anterior e à próxima, e indica em que parte do manual o leitor está. |
| RF06 | Exercícios por seção | Ao final das seções aplicáveis, o sistema apresenta exercícios curtos ("Vamos praticar") com gabarito que o usuário pode revelar. Não há pontuação. |

### 7.2 Glossário e referências

| ID | Requisito | Descrição |
|---|---|---|
| RF07 | Glossário | O sistema apresenta uma página com os termos técnicos usados no manual, em ordem alfabética, cada um com definição curta. |
| RF08 | Termos ligados ao glossário | Termos técnicos dentro do texto do manual levam à respectiva definição no glossário. |
| RF09 | Referências | O sistema apresenta uma página com a bibliografia utilizada na elaboração do manual. |

### 7.3 Download

| ID | Requisito | Descrição |
|---|---|---|
| RF10 | Download do manual em PDF | O sistema disponibiliza o manual completo em PDF para estudo offline. |
| RF11 | Estrutura preservada no PDF | O PDF mantém a mesma organização do site (partes, capítulos e seções) e o mesmo conteúdo, por ser gerado da mesma fonte. |

### 7.4 Quiz

| ID | Requisito | Descrição |
|---|---|---|
| RF12 | Quiz interativo | O usuário responde questões relacionadas ao conteúdo do manual. |
| RF13 | Questões de múltipla escolha | Cada questão apresenta quatro alternativas e uma única correta. |
| RF14 | Níveis de dificuldade | O Quiz é organizado em três níveis (básico, intermediário, avançado). O usuário escolhe o nível ou avança em sequência. |
| RF15 | Registro da resposta | O sistema identifica a alternativa selecionada. |
| RF16 | Feedback imediato | Após cada resposta, o sistema informa se está correta ou incorreta. |
| RF17 | Explicação da resposta | Junto ao feedback, o sistema apresenta uma explicação da questão. |
| RF18 | Resultado final | Ao concluir um nível, o sistema apresenta o total de acertos, o percentual e a lista dos assuntos em que o usuário errou. |
| RF19 | Caminho de revisão | Cada questão está associada a uma seção do manual; o feedback e o resultado final oferecem link direto para revisar o assunto (usa RF03). |
| RF20 | Refazer o Quiz | O usuário pode refazer qualquer nível quantas vezes quiser. |
| RF21 | Questões relacionadas ao manual | Toda questão é elaborada a partir de conteúdo presente na plataforma. |

## 8. Requisitos do conteúdo

Estes requisitos se aplicam ao texto do manual e das questões, não ao sistema.

| ID | Requisito |
|---|---|
| RC01 | O conteúdo é progressivo: nenhum conceito é usado antes de ser explicado. |
| RC02 | A linguagem é didática e acessível a quem não conhece redes. |
| RC03 | Cada conceito é acompanhado de ao menos um exemplo prático. |
| RC04 | O conteúdo utiliza imagens, diagramas e tabelas sempre que facilitarem a compreensão. |
| RC05 | Todo termo técnico é explicado na primeira ocorrência e consta no glossário. |
| RC06 | Cada seção termina com um resumo ("O que você precisa lembrar"). |
| RC07 | As seções com conteúdo aplicável possuem exercícios de fixação. |
| RC08 | As questões do Quiz usam linguagem clara e adequada ao público-alvo. |
| RC09 | O conteúdo mantém consistência de terminologia e de recursos didáticos entre capítulos. |
| RC10 | O conteúdo é autoral e cita as fontes utilizadas. |

## 9. Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF01 | A plataforma é responsiva e utilizável em celular, tablet e desktop. |
| RNF02 | A plataforma funciona nas versões atuais dos principais navegadores (Chrome, Firefox, Edge, Safari). |
| RNF03 | As páginas carregam rapidamente mesmo em conexões lentas (site estático, imagens otimizadas). |
| RNF04 | Toda a navegação é possível pelo teclado. |
| RNF05 | Imagens possuem texto alternativo e o texto mantém contraste legível com o fundo. |
| RNF06 | A identidade visual é consistente entre manual, exercícios, Quiz, glossário e referências. |
| RNF07 | Adicionar ou alterar seções do manual não exige alteração no código da plataforma. |
| RNF08 | Adicionar ou alterar questões do Quiz não exige alteração no código da plataforma. |
| RNF09 | O PDF é gerado automaticamente a partir do conteúdo do site. |

## 10. Restrições

- Custo zero de hospedagem e ferramentas.
- Desenvolvimento individual dentro do prazo da disciplina.
- Sem backend com banco de dados; a plataforma pode ser publicada como site estático.

## 11. Estrutura didática do manual

O manual segue uma evolução do conhecimento: conceitos avançados só aparecem depois dos fundamentos necessários.

**Parte 1 - Introdução às redes**
- O que é uma rede?
- Como dispositivos se comunicam?
- O que é um endereço IP?
- O que é IPv4?
- Como o IPv4 é utilizado?
- Limitações do IPv4.

**Parte 2 - Conhecendo o IPv6**
- O que é IPv6?
- Por que o IPv6 surgiu?
- Diferenças entre IPv4 e IPv6.
- Principais características do IPv6.
- O fim do broadcast: unicast, multicast e anycast.

**Parte 3 - Endereçamento IPv6**
- Estrutura de um endereço IPv6.
- Os 128 bits do endereço.
- Sistema hexadecimal.
- Como ler um endereço IPv6.
- Representação e abreviação de endereços.
- Expansão de endereços abreviados.
- Tipos de endereços IPv6 (global, link-local, unique local, multicast, especiais).
- Endereço link-local: por que toda interface tem um.

**Parte 4 - Prefixos e sub-redes**
- O que é um prefixo?
- Notação de prefixos.
- Como interpretar um /64.
- Identificação da rede.
- Identificação dos dispositivos.
- Sub-redes IPv6.
- Exercícios de interpretação e cálculo.

**Parte 5 - IPv6 na prática**
- ICMPv6 e Neighbor Discovery: como os dispositivos se descobrem.
- Autoconfiguração (SLAAC).
- DHCPv6.
- Gateway.
- DNS.
- Configuração de IPv6 em Windows e Linux.
- Verificação da configuração.
- Comandos relacionados ao IPv6.

**Parte 6 - Roteamento e coexistência**
- O que é roteamento?
- Comunicação entre redes.
- Rotas.
- Conceitos relacionados ao roteamento IPv6.
- Convivendo com o IPv4: pilha dupla, túneis e NAT64.
- Próximos passos: o Laboratório de IPv6 do NIC.br.

A estrutura poderá ser ajustada durante o levantamento bibliográfico e a redação.

## 12. Recursos didáticos

Blocos de apoio usados nas seções conforme a necessidade, evitando excesso:

- **Você sabia:** informações complementares e curiosidades.
- **Conceito-chave:** o que o estudante precisa dominar para avançar.
- **Exemplo:** situação prática com explicação passo a passo.
- **Atenção:** erros comuns e conceitos que causam confusão.
- **Vamos praticar:** exercícios curtos com gabarito (atende RF06 e RC07).
- **O que você precisa lembrar:** resumo da seção (atende RC06).

## 13. Estrutura da plataforma

| Área | Função |
|---|---|
| Página inicial | Apresenta o projeto, o fluxo de aprendizagem e o ponto de partida ("Começar pela Parte 1"). |
| Manual | Leitura do conteúdo com sumário, navegação sequencial e exercícios por seção. |
| Exercícios | Índice dos exercícios de todas as seções, para quem quer praticar direto. |
| Quiz | Avaliação por nível com feedback, explicação, resultado e links de revisão. |
| Download | Manual completo em PDF. |
| Glossário | Termos técnicos em ordem alfabética. |
| Referências | Bibliografia do projeto. |

## 14. Fluxo de aprendizagem

1. **Aprender:** ler a seção do manual.
2. **Compreender:** usar exemplos, ilustrações e blocos de apoio para consolidar.
3. **Praticar:** resolver os exercícios da seção.
4. **Avaliar:** fazer o Quiz do nível correspondente.
5. **Revisar:** voltar às seções indicadas no resultado do Quiz.

## 15. Progressão do Quiz

| Nível | Tipo de questão | Partes do manual |
|---|---|---|
| Básico | Identificação e compreensão de conceitos | 1 e 2 |
| Intermediário | Interpretação e aplicação | 3 e 4 |
| Avançado | Análise, representação de endereços, prefixos, sub-redes e resolução de problemas | 4, 5 e 6 |

Sugestão inicial: 10 questões por nível, com banco maior para permitir variação. A divisão poderá ser refinada durante a elaboração do banco de questões.

## 16. Critérios de aceitação

| Critério | Requisitos relacionados |
|---|---|
| Manual acessível na web, organizado em partes, capítulos e seções | RF01, RF02 |
| Cada seção com URL própria, sumário e navegação anterior/próxima | RF03, RF04, RF05 |
| Exercícios com gabarito ao final das seções aplicáveis | RF06, RC07 |
| Glossário disponível e termos do texto ligados a ele | RF07, RF08 |
| Página de referências | RF09 |
| PDF completo disponível, com a mesma estrutura do site | RF10, RF11, RNF09 |
| Quiz com três níveis, feedback imediato, explicação e resultado final | RF12 a RF18 |
| Resultado do Quiz com links para revisar os assuntos errados | RF19 |
| Quiz pode ser refeito | RF20 |
| Conteúdo compreensível por quem não conhece redes | RC01, RC02, RC05 |
| Plataforma responsiva e navegável em celular | RNF01 |
| Novas seções e questões adicionadas sem alterar o código | RNF07, RNF08 |

## 17. Considerações finais

Este levantamento estabelece a visão inicial da plataforma. A principal característica do projeto é a preocupação didática: atender quem já conhece redes, mas sobretudo quem está tendo o primeiro contato com o assunto.

A plataforma combina a estrutura de um material didático tradicional com recursos da web: leitura online, exercícios por seção, avaliação por Quiz com caminho de revisão e download do manual completo para estudo offline.

Os requisitos poderão ser refinados após o levantamento bibliográfico, a definição detalhada dos conteúdos e a elaboração do banco de questões.

## Anexo - Decisões pendentes

Pontos que precisam ser confirmados com o orientador antes do desenvolvimento:

1. Manter a Parte 6 com coexistência IPv4/IPv6 ou deixar como conteúdo futuro.
2. Quantidade de questões por nível (sugestão: 10).
3. Se o progresso do Quiz será guardado no navegador ou não guardado.
4. Nome do arquivo e capa do PDF.
5. Licença de publicação do manual (CC BY-NC-SA 4.0, se houver adaptação do Laboratório de IPv6).
