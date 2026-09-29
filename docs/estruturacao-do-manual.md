---
title: "Estruturação do Manual de IPv6"
subtitle: "Descomplicando o IPv6: Um Guia Interativo de Redes"
author: "Amanda Ribeiro da Costa"
date: "Estágio Supervisionado I · Orientador: Prof. Alysson Martins Bruno"
lang: pt-BR
---

## Sobre este documento

Este documento define a estrutura completa do Manual de IPv6: as partes, os capítulos, o que cada seção deve ensinar, os recursos didáticos previstos e as fontes bibliográficas que embasam cada trecho. Ele é o esqueleto a partir do qual o conteúdo será escrito.

**Como o manual será produzido.** Cada seção é um arquivo Markdown. Esse formato é a fonte única do conteúdo: a partir dele são geradas tanto as páginas do site quanto o PDF completo para download. Assim, o manual nunca existe em duas versões que precisariam ser sincronizadas.

**Convenções de cada seção.** Toda seção segue o mesmo padrão:

1. Introdução curta ligando ao que veio antes.
2. Explicação do conceito, com exemplo prático.
3. Blocos de apoio conforme a necessidade: *Conceito-chave*, *Você sabia*, *Exemplo*, *Atenção*.
4. *Vamos praticar*: de 2 a 4 exercícios curtos com gabarito.
5. *O que você precisa lembrar*: resumo em 3 a 5 frases.

Termos técnicos são explicados na primeira ocorrência e entram no glossário.

**Relação com o plano de atividades.** O plano de estágio prevê o conteúdo em quatro entregas. Elas correspondem às seis partes do manual assim:

| Entrega do plano | Partes do manual |
|---|---|
| Primeira parte do conteúdo | Parte 1 e Parte 2 |
| Segunda parte do conteúdo | Parte 3 |
| Terceira parte do conteúdo | Parte 4 |
| Quarta parte do conteúdo | Parte 5 e Parte 6 |

## Fontes utilizadas

- **[BRITO]** BRITO, Samuel Henrique Bucke. *IPv6: O Novo Protocolo da Internet*. Novatec, 2013. Referência teórica principal. Todos os direitos reservados: usada apenas como base de estudo, sem reprodução de trechos ou figuras.
- **[LAB]** EQUIPE IPV6.BR. *Laboratório de IPv6: aprenda na prática usando um emulador de redes*. NIC.br / Novatec, 2015. Licença CC BY-NC-SA 4.0. Referência prática: comandos, comportamento do NDP, SLAAC e DHCPv6. Pode ser adaptada com atribuição.
- **[RFC]** RFCs consultadas para conferência técnica: RFC 8200 (IPv6), RFC 4291 (endereçamento), RFC 4861 (Neighbor Discovery), RFC 4862 (SLAAC), RFC 8415 (DHCPv6), RFC 4193 (ULA).

Abaixo, cada seção indica entre colchetes a fonte que a embasa.

---

## Parte 1 · Introdução às redes

**Objetivo da parte:** dar ao leitor sem nenhum conhecimento prévio o vocabulário mínimo para entender o que é um endereço IP, por que ele existe e por que o IPv4 chegou ao limite. Nenhum dos livros cobre esta parte; ela é escrita do zero e é o que torna o manual acessível ao iniciante.

### 1.1 O que é uma rede?

- Rede como conjunto de dispositivos que trocam informação. Analogia com o sistema de correios.
- Dispositivos comuns: computador, celular, roteador de casa, servidor.
- Rede local (a casa, a escola) e a Internet (rede de redes).
- Recursos: *Você sabia* (a Internet não tem dono), *Conceito-chave* (rede, dispositivo, Internet).
- Fonte: autoral.

### 1.2 Como os dispositivos se comunicam?

- Ideia de mensagem dividida em pacotes.
- Cada pacote precisa de remetente e destinatário.
- Papel do roteador: encaminhar pacotes de uma rede para outra.
- Noção mínima de camadas: o IP cuida de endereçar e encaminhar; não precisa explicar o modelo OSI inteiro.
- Recursos: *Exemplo* (enviar uma foto pelo WhatsApp), *Atenção* (roteador de casa e modem não são a mesma coisa).
- Fonte: autoral; [LAB] Introdução para a visão de camadas.

### 1.3 O que é um endereço IP?

- Endereço como identificação única de um dispositivo em uma rede.
- Diferença entre endereço IP e endereço físico (MAC), em uma frase.
- IP público e IP privado, com exemplo do roteador de casa.
- Recursos: *Conceito-chave* (endereço IP), *Vamos praticar* (identificar o IP do próprio celular).
- Fonte: autoral; [BRITO] cap. 1.

### 1.4 O que é IPv4?

- 32 bits, quatro números de 0 a 255 separados por ponto.
- Quantos endereços existem (cerca de 4,3 bilhões) e por que isso pareceu muito em 1981.
- Recursos: *Exemplo* (ler 192.168.0.1), *Você sabia* (o IPv4 foi definido em 1981).
- Fonte: [BRITO] cap. 1.

### 1.5 Como o IPv4 é utilizado?

- Máscara de rede e a ideia de "parte da rede" e "parte do dispositivo", explicada com o exemplo 192.168.0.0/24.
- Gateway padrão e DNS, só como nomes que o leitor verá na configuração.
- Recursos: *Exemplo* (a configuração de rede de um computador), *Atenção* (a máscara não é um segundo endereço).
- Fonte: [BRITO] cap. 1.1.1 (CIDR).

### 1.6 Limitações do IPv4

- Esgotamento dos endereços: IANA em 2011, LACNIC depois.
- Remendos que adiaram o problema: CIDR, DHCP e principalmente NAT, e o que o NAT quebra.
- Por que remendo não resolve: crescimento da Internet, celulares, Internet das Coisas.
- Recursos: *Você sabia* (a ONU declarou a Internet direito fundamental em 2011), *O que você precisa lembrar*.
- Fonte: [BRITO] cap. 1.1 (1.1.1 CIDR, 1.1.2 DHCP, 1.1.3 NAT).

---

## Parte 2 · Conhecendo o IPv6

**Objetivo da parte:** apresentar o IPv6 como resposta às limitações do IPv4, sem entrar ainda na leitura de endereços.

### 2.1 O que é IPv6?

- Nova versão do protocolo IP, com endereços de 128 bits.
- Não é "IPv4 maior": é um protocolo redesenhado.
- Quantos endereços cabem em 128 bits, com comparação concreta (endereços por grão de areia da Terra).
- Recursos: *Conceito-chave*, *Você sabia*.
- Fonte: [BRITO] cap. 1.2.

### 2.2 Por que o IPv6 surgiu?

- Linha do tempo: IPng nos anos 1990, RFC 2460 em 1998, RFC 8200 em 2017.
- Adoção lenta e por quê (parque instalado, custo, curva de aprendizado).
- Situação atual no Brasil e no mundo (dados do NIC.br e do Google IPv6 Statistics, consultados na redação).
- Fonte: [BRITO] cap. 1.2; [LAB] Prefácio.

### 2.3 Diferenças entre IPv4 e IPv6

- Tabela comparativa: tamanho do endereço, notação, quantidade, NAT, configuração automática, broadcast, fragmentação.
- Cabeçalho simplificado: o que saiu, o que ficou (só o suficiente para entender "mais simples de processar").
- Recursos: tabela comparativa, *Atenção* (IPv6 não substitui o IPv4 de um dia para o outro; os dois convivem).
- Fonte: [BRITO] cap. 2 (visão geral, sem os cabeçalhos de extensão).

### 2.4 Principais características do IPv6

- Espaço de endereçamento enorme.
- Autoconfiguração: o dispositivo se configura sozinho.
- Fim do NAT: comunicação fim a fim.
- Cabeçalho mais simples e extensível.
- Recursos: *Conceito-chave* (autoconfiguração, fim a fim).
- Fonte: [BRITO] cap. 1.2 e cap. 2.

### 2.5 O fim do broadcast: unicast, multicast e anycast

- O IPv4 usa broadcast (falar com todos); o IPv6 não tem broadcast.
- Unicast (um para um), multicast (um para um grupo), anycast (um para o mais próximo).
- Por que isso importa: é assim que o IPv6 descobre vizinhos e roteadores (preparação para a Parte 5).
- Recursos: diagrama dos três tipos, *Vamos praticar*, *O que você precisa lembrar*.
- Fonte: [BRITO] cap. 3.2.2 e 3.2.3.

---

## Parte 3 · Endereçamento IPv6

**Objetivo da parte:** o leitor termina sabendo ler, abreviar, expandir e classificar qualquer endereço IPv6.

### 3.1 Estrutura de um endereço IPv6

- Oito grupos de quatro dígitos hexadecimais separados por dois-pontos.
- Exemplo anotado: 2001:0db8:0000:0000:0000:0000:0000:0001.
- Recursos: figura com o endereço dividido em grupos, *Conceito-chave*.
- Fonte: [BRITO] cap. 3.1; [RFC 4291].

### 3.2 Os 128 bits do endereço

- Cada grupo tem 16 bits; oito grupos, 128 bits.
- Metade rede, metade interface, na regra geral (/64), sem cálculo ainda.
- Recursos: figura 128 bits = 64 + 64.
- Fonte: [BRITO] cap. 3.1.

### 3.3 Sistema hexadecimal

- Por que hexadecimal: 4 bits por dígito, 16 símbolos (0 a 9, a a f).
- Tabela binário/decimal/hexadecimal de 0 a 15.
- Converter um grupo de 16 bits para hexadecimal e vice-versa.
- Recursos: tabela, *Exemplo* passo a passo, *Vamos praticar* (conversões).
- Fonte: autoral.

### 3.4 Como ler um endereço IPv6

- Ler grupo a grupo; letras podem ser maiúsculas ou minúsculas (recomenda-se minúsculas).
- Onde o endereço aparece na prática (configuração do computador, navegador com colchetes na URL).
- Recursos: *Atenção* (endereço IPv6 em URL usa colchetes: http://[2001:db8::1]/).
- Fonte: [BRITO] cap. 3.1; [RFC 5952].

### 3.5 Representação e abreviação de endereços

- Regra 1: omitir zeros à esquerda em cada grupo.
- Regra 2: substituir a maior sequência de grupos zerados por "::", uma única vez.
- Exemplos de abreviação correta e incorreta.
- Recursos: *Exemplo* passo a passo, *Atenção* (o "::" só pode aparecer uma vez), *Vamos praticar*.
- Fonte: [BRITO] cap. 3.1; [RFC 5952].

### 3.6 Expansão de endereços abreviados

- Processo inverso: contar os grupos presentes, calcular quantos o "::" representa.
- Recursos: *Exemplo* passo a passo, *Vamos praticar* (expandir cinco endereços).
- Fonte: [BRITO] cap. 3.1.

### 3.7 Tipos de endereços IPv6

- Unicast global (2000::/3): o endereço "público".
- Unique local (fc00::/7): o "privado" do IPv6.
- Link-local (fe80::/10): apresentado aqui e aprofundado em 3.8.
- Multicast (ff00::/8) e os grupos importantes (ff02::1, ff02::2).
- Especiais: ::1 (loopback), :: (não especificado), 2001:db8::/32 (documentação).
- Recursos: tabela de prefixos, *Vamos praticar* (classificar endereços).
- Fonte: [BRITO] cap. 3.2 (3.2.1 a 3.2.4); [RFC 4291]; [RFC 4193].

### 3.8 Endereço link-local: por que toda interface tem um

- Toda interface IPv6 cria um fe80:: sozinha, antes de qualquer configuração.
- Vale só dentro do enlace (não é roteado). É por ele que o dispositivo conversa com o roteador.
- Por que aparece com "%" ou nome de interface no fim (identificador de zona).
- Recursos: *Atenção* (é normal ver um endereço fe80 mesmo sem IPv6 na Internet), *O que você precisa lembrar*.
- Fonte: [BRITO] cap. 3.2.1.1; [LAB] Apêndice C (ping6 -I).

---

## Parte 4 · Prefixos e sub-redes

**Objetivo da parte:** o leitor termina sabendo interpretar um prefixo, separar rede e interface, e dividir um bloco em sub-redes.

### 4.1 O que é um prefixo?

- Prefixo como a parte do endereço que identifica a rede, análogo à máscara do IPv4.
- Recursos: *Conceito-chave*, comparação lado a lado com 192.168.0.0/24.
- Fonte: [BRITO] cap. 3.3.

### 4.2 Notação de prefixos

- Barra e número de bits: 2001:db8::/32, 2001:db8:1::/48, 2001:db8:1:2::/64.
- Recursos: figura com os bits destacados.
- Fonte: [BRITO] cap. 3.3.

### 4.3 Como interpretar um /64

- O /64 é o tamanho padrão de uma rede local em IPv6.
- Os 64 bits restantes identificam a interface; por que é tão grande (autoconfiguração).
- Recursos: *Atenção* (não "economizar" fazendo redes menores que /64).
- Fonte: [BRITO] cap. 3.3 e 4.2.1; [RFC 4291].

### 4.4 Identificação da rede

- Extrair o prefixo de rede de um endereço dado o tamanho do prefixo.
- Recursos: *Exemplo* passo a passo, *Vamos praticar*.
- Fonte: [BRITO] cap. 3.3.1.

### 4.5 Identificação dos dispositivos

- Identificador de interface: os 64 bits finais.
- De onde ele vem: manual, aleatório (privacidade), derivado do MAC (EUI-64, só como curiosidade).
- Recursos: *Você sabia* (extensões de privacidade), *Vamos praticar*.
- Fonte: [BRITO] cap. 3.2.1 e 4.2.

### 4.6 Sub-redes IPv6

- Como um provedor entrega um /56 ou /48 e como dividir em /64.
- Quantas sub-redes cabem: 2 elevado à diferença de bits.
- Plano de endereçamento simples para uma casa ou pequena empresa.
- Recursos: tabela de divisão, *Exemplo* completo.
- Fonte: [BRITO] cap. 3.3 e 3.3.1.

### 4.7 Exercícios de interpretação e cálculo

- Seção inteira de prática: dez exercícios progressivos com resolução comentada (abreviar, expandir, classificar, extrair prefixo, dividir em sub-redes).
- Fonte: inspirado nos cinco exercícios de [BRITO] cap. 3.3.1 e 3.3.2, com enunciados próprios.

---

## Parte 5 · IPv6 na prática

**Objetivo da parte:** o leitor entende como um dispositivo ganha endereço IPv6 e consegue verificar a própria configuração em Windows e Linux.

### 5.1 ICMPv6 e Neighbor Discovery: como os dispositivos se descobrem

- ICMPv6 faz muito mais que ping: é a base do funcionamento do IPv6.
- Neighbor Discovery (NDP) substitui o ARP: descobrir o MAC do vizinho, descobrir roteadores, detectar endereço duplicado.
- As quatro mensagens: Router Solicitation, Router Advertisement, Neighbor Solicitation, Neighbor Advertisement.
- Recursos: diagrama de sequência, *Conceito-chave*.
- Fonte: [BRITO] cap. 4.1 (4.1.1 a 4.1.3); [LAB] Experiências 1.1 a 1.4; [RFC 4861].

### 5.2 Autoconfiguração (SLAAC)

- O dispositivo ouve o Router Advertisement, pega o prefixo e monta o próprio endereço.
- Passo a passo: link-local, Router Solicitation, Router Advertisement, endereço global, detecção de duplicado.
- Recursos: *Exemplo* narrado (o que acontece quando você liga o notebook), *Atenção* (SLAAC não entrega DNS por padrão; ver RDNSS e DHCPv6).
- Fonte: [BRITO] cap. 4.2.1; [LAB] Experiências 1.5 e 1.6; [RFC 4862].

### 5.3 DHCPv6

- Quando o SLAAC não basta: controle central, entrega de DNS, registro de quem tem qual endereço.
- Stateful e stateless, em uma frase cada.
- Delegação de prefixo: como o provedor entrega um bloco ao roteador de casa.
- Recursos: tabela SLAAC vs DHCPv6, *Você sabia* (o Android não usa DHCPv6).
- Fonte: [BRITO] cap. 4.2.3; [LAB] Experiências 1.7 a 1.9; [RFC 8415].

### 5.4 Gateway

- O roteador da rede local; em IPv6 é descoberto pelo Router Advertisement, e o endereço do gateway costuma ser link-local.
- Recursos: *Atenção* (não se assuste com gateway fe80::).
- Fonte: [BRITO] cap. 4.1.1.

### 5.5 DNS

- Registro AAAA e resolução de nomes em IPv6.
- Como o dispositivo descobre o servidor DNS: RDNSS no RA ou DHCPv6.
- Recursos: *Exemplo* (consultar um AAAA com nslookup/dig).
- Fonte: [BRITO] cap. 7.1; [LAB] Experiência 2.1.

### 5.6 Configuração de IPv6 em Windows e Linux

- Onde ver e ativar o IPv6 em cada sistema.
- Configuração manual de endereço, prefixo e gateway (quando e por que fazer).
- Recursos: passos com capturas de tela próprias.
- Fonte: [BRITO] cap. 4.2.2; [LAB] Apêndice C.

### 5.7 Verificação da configuração

- Como conferir se você tem IPv6 funcionando: endereço, gateway, DNS, conectividade.
- Testes online (test-ipv6.com, ipv6.br).
- Recursos: checklist, *Vamos praticar* (verificar a própria máquina).
- Fonte: [LAB] Apêndice C.

### 5.8 Comandos relacionados ao IPv6

- Tabela de referência: Windows (ipconfig, ping -6, tracert -6, netsh) e Linux (ip -6 addr, ip -6 route, ping6/ping -6, traceroute6, ip -6 neigh).
- O que cada saída mostra.
- Recursos: tabela comando/uso/sistema, *O que você precisa lembrar*.
- Fonte: [LAB] Apêndice C (adaptado, com atribuição).

---

## Parte 6 · Roteamento e coexistência

**Objetivo da parte:** o leitor entende como pacotes saem da rede local e como IPv6 e IPv4 convivem na Internet de hoje. É a parte conceitual de fechamento; não ensina a configurar protocolos de roteamento.

### 6.1 O que é roteamento?

- Decidir por onde o pacote vai quando o destino está em outra rede.
- Recursos: analogia com placas de trânsito, *Conceito-chave*.
- Fonte: [BRITO] cap. 5 (introdução).

### 6.2 Comunicação entre redes

- Caminho de um pacote da sua casa até um servidor: rede local, provedor, Internet.
- Recursos: diagrama do caminho.
- Fonte: [BRITO] cap. 5.3.

### 6.3 Rotas

- Tabela de rotas, rota padrão, rota estática.
- Ler a saída de ip -6 route e route print.
- Recursos: *Exemplo* (tabela de rotas de um notebook).
- Fonte: [BRITO] cap. 5.1.

### 6.4 Conceitos relacionados ao roteamento IPv6

- Roteamento dinâmico existe (OSPFv3, BGP), mas fica como visão geral de um parágrafo cada.
- Por que o IPv6 facilita a agregação de rotas.
- Fonte: [BRITO] cap. 5.2 e 5.3; [LAB] cap. 5 (só citado).

### 6.5 Convivendo com o IPv4: pilha dupla, túneis e NAT64

- Pilha dupla: o dispositivo fala os dois; é o normal hoje.
- Túneis: IPv6 dentro de IPv4, quando o caminho não tem IPv6 (visão geral).
- Tradução: NAT64 e DNS64, para redes só IPv6 acessarem serviços só IPv4.
- Recursos: tabela dos três mecanismos, *Atenção* (a maioria das redes domésticas já está em pilha dupla).
- Fonte: [BRITO] cap. 8 (8.1, 8.2 visão geral, 8.3.2); [LAB] Experiências 4.3, 4.6 e 4.7 (só conceito).

### 6.6 Próximos passos: o Laboratório de IPv6 do NIC.br

- Onde praticar de verdade: o livro e o emulador do NIC.br (lab.ipv6.br), cursos gratuitos do ipv6.br.
- Quais experiências do Laboratório correspondem a cada parte deste manual.
- Fonte: [LAB].

---

## Complementos

### Glossário

Termos coletados durante a redação de cada seção. Ponto de partida: a lista de abreviaturas do [LAB] (NDP, RA, RS, NS, NA, DAD, SLAAC, DHCPv6, MTU, PMTUD, ULA, NAT64, DNS64, DS-Lite, 6rd), mais os termos da Parte 1 (rede, pacote, roteador, gateway, máscara, prefixo).

### Referências

Bibliografia completa em formato ABNT, incluindo os dois livros, as RFCs e os sites consultados (ipv6.br, lab.ipv6.br, test-ipv6.com, Google IPv6 Statistics).

### Exercícios (índice)

Página que reúne todos os blocos *Vamos praticar* do manual, organizados por parte, para quem quer praticar direto.

## Resumo quantitativo

| Parte | Seções | Exercícios previstos |
|---|---|---|
| 1. Introdução às redes | 6 | 4 |
| 2. Conhecendo o IPv6 | 5 | 4 |
| 3. Endereçamento IPv6 | 8 | 10 |
| 4. Prefixos e sub-redes | 7 | 16 (10 na seção 4.7) |
| 5. IPv6 na prática | 8 | 6 |
| 6. Roteamento e coexistência | 6 | 3 |
| **Total** | **40** | **43** |

A estrutura poderá ser ajustada durante a redação, conforme a definição final dos conteúdos.
