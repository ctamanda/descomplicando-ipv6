---
title: "Levantamento Bibliográfico e Fontes Utilizadas"
subtitle: "Descomplicando o IPv6: Um Guia Interativo de Redes"
author: "Amanda Ribeiro da Costa"
date: "Estágio Supervisionado I · Orientador: Prof. Alysson Martins Bruno"
lang: pt-BR
---

## 1. Objetivo do levantamento

Este documento registra a pesquisa bibliográfica realizada para embasar o Manual de IPv6 e o Quiz da plataforma *Descomplicando o IPv6*. Ele apresenta os critérios usados na escolha das fontes, as obras selecionadas como base principal, as fontes complementares e a forma como cada uma será utilizada na redação do manual.

O levantamento partiu de uma pergunta orientadora: **que material permite ensinar IPv6 do zero, em português, de forma progressiva e com prática, sem exigir um laboratório de redes?**

## 2. Critérios de seleção

As fontes foram avaliadas segundo cinco critérios:

1. **Idioma.** Preferência por obras em português, já que o público-alvo é o estudante brasileiro iniciante e a barreira do inglês técnico é um dos motivos de o IPv6 parecer "difícil".
2. **Autoridade.** Autores ou instituições reconhecidos na área: NIC.br (responsável pela disseminação do IPv6 no Brasil), autores certificados e as RFCs da IETF, que são a definição oficial do protocolo.
3. **Progressão didática.** A obra deveria permitir extrair uma sequência que vá dos conceitos de rede até a configuração, ou pelo menos cobrir bem um trecho dessa sequência.
4. **Aderência ao escopo.** O projeto cobre o uso do IPv6 (conceitos, endereçamento, prefixos, autoconfiguração, verificação e coexistência com IPv4). Ficam fora segurança em profundidade, roteamento dinâmico e laboratório com máquinas virtuais.
5. **Licença e possibilidade de adaptação.** Como o manual será distribuído em PDF, foi verificado o que cada fonte permite: apenas consulta ou também adaptação de trechos e figuras.

## 3. Fontes principais

Duas obras foram escolhidas como base do manual. Elas se complementam: uma é teórica e sequencial, a outra é prática e experimental.

### 3.1 BRITO, Samuel Henrique Bucke. *IPv6: O Novo Protocolo da Internet*. São Paulo: Novatec, 2013. ISBN 978-85-7522-638-4.

**O que é.** Livro didático em português, escrito por um instrutor certificado pelo IPv6 Forum e pela Cisco, com prefácio do fundador do IPv6 Forum. Organizado em oito capítulos: evolução da Internet, cabeçalho IPv6, estrutura do endereço, ICMPv6 e configuração de endereços, roteamento, segurança, serviços complementares e mecanismos de transição.

**Por que foi escolhido.** É a obra em português que mais se aproxima da sequência que o manual precisa: começa pelo esgotamento do IPv4 (e pelos remendos CIDR, DHCP e NAT), apresenta o endereço em detalhe, explica a notação e os tipos, traz exercícios resolvidos de cálculo de sub-rede e chega ao NDP, ao SLAAC e ao DHCPv6. O capítulo 8, sobre transição, sustenta a parte final do manual sobre a convivência entre IPv4 e IPv6.

**Limitações identificadas.** O livro assume que o leitor já sabe o que é uma rede, um pacote e um roteador; por isso a Parte 1 do manual (Introdução às redes) precisa ser escrita do zero. É de 2013, então dados de adoção e algumas referências normativas (RFC 2460, substituída pela RFC 8200 em 2017) serão atualizados na redação. Os capítulos de segurança e de roteamento dinâmico estão fora do escopo do projeto.

**Como será usada.** Referência teórica principal das Partes 2 a 6. Obra com todos os direitos reservados: será usada como base de estudo e citada, sem reprodução de trechos ou figuras.

### 3.2 EQUIPE IPV6.BR. *Laboratório de IPv6: aprenda na prática usando um emulador de redes*. São Paulo: NIC.br / Novatec, 2015. ISBN 978-85-7522-434-2. Disponível em: http://lab.ipv6.br.

**O que é.** Livro eletrônico produzido pelo CEPTRO.br, área do NIC.br responsável pelo projeto IPv6.br. Reúne os roteiros de experimentos usados nos cursos presenciais gratuitos do NIC.br, organizados em funcionalidades básicas (NDP, SLAAC, DHCPv6, Path MTU Discovery), serviços, segurança, técnicas de transição e roteamento, mais três apêndices (instalação, emulador CORE e comandos básicos).

**Por que foi escolhido.** Foi a partir dele que se tomou uma decisão central do projeto: **não construir um laboratório ou máquina virtual**, porque o NIC.br já oferece exatamente isso, de forma gratuita e consolidada. O manual se posiciona, portanto, como o material de leitura que o próprio Laboratório recomenda ter lido antes dos experimentos, e indica o Laboratório como próximo passo. Além disso, as experiências do capítulo 1 mostram, passo a passo e com saídas de comandos reais, como o NDP, o SLAAC e o DHCPv6 se comportam, o que permite explicar esses mecanismos de forma concreta na Parte 5 do manual. O apêndice C (comandos básicos) é a base da seção de verificação de configuração e comandos.

**Licença.** Creative Commons Atribuição, Uso não Comercial, Compartilhamento pela mesma licença (CC BY-NC-SA 4.0). Isso permite adaptar trechos, saídas de comando e figuras no manual, desde que o crédito seja dado ao NIC.br e o manual seja publicado sob a mesma licença. Essa possibilidade foi registrada como decisão pendente de confirmação com o orientador.

**Como será usada.** Referência prática da Parte 5 (IPv6 na prática) e da Parte 6 (coexistência); fonte da lista inicial do glossário (lista de abreviaturas); indicação de "próximos passos" ao final do manual.

## 4. Fontes complementares

### 4.1 Documentos normativos (RFCs da IETF)

As RFCs são a definição oficial do protocolo. Elas não serão citadas no texto do manual como leitura obrigatória, porque o público é iniciante, mas serão usadas para conferir cada afirmação técnica e estarão nas referências.

| RFC | Título | Uso no manual |
|---|---|---|
| RFC 8200 (2017) | Internet Protocol, Version 6 (IPv6) Specification | Definição atual do protocolo; substitui a RFC 2460 citada em Brito |
| RFC 4291 (2006) | IP Version 6 Addressing Architecture | Tipos de endereço, prefixos, formato do identificador de interface |
| RFC 5952 (2010) | A Recommendation for IPv6 Address Text Representation | Regras de abreviação (minúsculas, uso único do "::") |
| RFC 4193 (2005) | Unique Local IPv6 Unicast Addresses | Endereços unique local (fc00::/7) |
| RFC 4861 (2007) | Neighbor Discovery for IP version 6 | Router Solicitation/Advertisement, Neighbor Solicitation/Advertisement |
| RFC 4862 (2007) | IPv6 Stateless Address Autoconfiguration | SLAAC e detecção de endereço duplicado |
| RFC 8415 (2018) | Dynamic Host Configuration Protocol for IPv6 (DHCPv6) | DHCPv6 stateful, stateless e delegação de prefixo |
| RFC 8106 (2017) | IPv6 Router Advertisement Options for DNS Configuration | Entrega de DNS via RA (RDNSS) |
| RFC 6146 / RFC 6147 (2011) | Stateful NAT64 / DNS64 | Tradução IPv6 para IPv4 na Parte 6 |

### 4.2 Materiais do NIC.br e do IPv6.br

- **Portal IPv6.br** (https://ipv6.br): material teórico, notícias e o curso e-learning gratuito de IPv6. Usado para conferir a situação da adoção no Brasil e como indicação de estudo continuado.
- **Curso "IPv6 básico" do NIC.br** (ambiente Sala de Aula, https://moodle.saladeaula.nic.br): apresentações sobre esgotamento do IPv4 e situação atual, usadas como referência para a Parte 1 e a Parte 2.
- **Fórum Brasileiro de IPv6 / Semana de Infraestrutura da Internet no Brasil:** dados de adoção divulgados pelo NIC.br.

### 4.3 Dados de adoção do IPv6

Os números de adoção mudam continuamente e serão consultados no momento da redação e datados no texto. Fontes:

- **Google IPv6 Statistics** (https://www.google.com/intl/pt-BR/ipv6/statistics.html): percentual de usuários que acessam o Google via IPv6, no mundo e por país. Em abril de 2026 a medição global ultrapassou 50% pela primeira vez; o Brasil aparece na faixa de 45% a 47%.
- **APNIC Labs** (https://stats.labs.apnic.net/ipv6): medição independente por país e por provedor, usada pelo próprio IPv6.br.
- **LACNIC:** esgotamento do estoque regional de IPv4 (2020) e lista de espera, para a Parte 1.

### 4.4 Ferramentas de verificação

- **test-ipv6.com:** teste de conectividade IPv6 pelo navegador, indicado na seção de verificação da configuração.
- **Documentação de comandos** dos sistemas operacionais (Microsoft Learn para `ipconfig`, `ping -6`, `netsh`; manuais do `iproute2` para `ip -6 addr`, `ip -6 route`, `ip -6 neigh`), para a tabela de comandos da Parte 5.

### 4.5 Obras gerais de redes, consultadas para a Parte 1

Para os conceitos que os dois livros principais não explicam (o que é uma rede, pacotes, camadas, endereço IP, máscara), foram consultadas obras introdutórias consagradas, usadas apenas como apoio à redação autoral:

- TANENBAUM, Andrew S.; WETHERALL, David J. *Redes de Computadores*. 5. ed. São Paulo: Pearson, 2011.
- KUROSE, James F.; ROSS, Keith W. *Redes de Computadores e a Internet: uma abordagem top-down*. 6. ed. São Paulo: Pearson, 2013.

## 5. Fontes consideradas e não adotadas

- **Materiais de certificação (Cisco CCNA, Comptia Network+).** Bons tecnicamente, mas orientados a equipamentos de fabricante e a exames, com linguagem que pressupõe conhecimento prévio. Não atendem ao critério 3.
- **Vídeos e artigos avulsos em blogs.** Úteis para ver como o assunto é explicado informalmente, mas sem autoria verificável e com erros conceituais frequentes (por exemplo, tratar o "::" como se pudesse aparecer mais de uma vez). Não atendem ao critério 2.
- **Textos em inglês sobre IPv6 (livros da O'Reilly e da Cisco Press).** Excelentes como referência, mas contrariam o critério 1 para o público-alvo. Poderão ser citados pontualmente.

## 6. Mapa de uso das fontes por parte do manual

| Parte do manual | Fonte principal | Fontes complementares |
|---|---|---|
| 1. Introdução às redes | Redação autoral | Tanenbaum; Kurose; Brito cap. 1; NIC.br (esgotamento) |
| 2. Conhecendo o IPv6 | Brito cap. 1.2 e 2 | RFC 8200; dados de adoção (Google, APNIC) |
| 3. Endereçamento IPv6 | Brito cap. 3.1 e 3.2 | RFC 4291; RFC 5952; RFC 4193 |
| 4. Prefixos e sub-redes | Brito cap. 3.3 | RFC 4291 |
| 5. IPv6 na prática | Brito cap. 4; Laboratório cap. 1 e apêndice C | RFC 4861; RFC 4862; RFC 8415; RFC 8106; test-ipv6.com |
| 6. Roteamento e coexistência | Brito cap. 5 e 8 | Laboratório cap. 4 (conceitos); RFC 6146/6147 |
| Glossário | Laboratório (lista de abreviaturas) | RFC 4291; RFC 4861 |

## 7. Considerações

A combinação escolhida cobre os dois lados do problema: o livro de Brito dá a sequência teórica em português, e o Laboratório do NIC.br dá a prática e a autoridade institucional, além de resolver a questão do ambiente de experimentação sem que o projeto precise construir um. As RFCs garantem a correção técnica, e as obras gerais de redes sustentam a parte introdutória que nenhuma das fontes específicas de IPv6 cobre.

A bibliografia poderá ser ampliada durante a redação do manual, especialmente para ilustrações, dados de adoção atualizados e exemplos de configuração em sistemas específicos.

## Referências (ABNT)

BRITO, Samuel Henrique Bucke. **IPv6: o novo protocolo da Internet**. São Paulo: Novatec, 2013.

DEERING, S.; HINDEN, R. **Internet Protocol, Version 6 (IPv6) Specification**. RFC 8200. IETF, 2017.

EQUIPE IPV6.BR. **Laboratório de IPv6: aprenda na prática usando um emulador de redes**. São Paulo: Novatec; NIC.br, 2015. Disponível em: http://lab.ipv6.br. Acesso em: set. 2026.

GOOGLE. **Estatísticas de adoção do IPv6**. Disponível em: https://www.google.com/intl/pt-BR/ipv6/statistics.html. Acesso em: set. 2026.

HINDEN, R.; DEERING, S. **IP Version 6 Addressing Architecture**. RFC 4291. IETF, 2006.

HINDEN, R.; HABERMAN, B. **Unique Local IPv6 Unicast Addresses**. RFC 4193. IETF, 2005.

JEONG, J. et al. **IPv6 Router Advertisement Options for DNS Configuration**. RFC 8106. IETF, 2017.

KAWAMURA, S.; KAWASHIMA, M. **A Recommendation for IPv6 Address Text Representation**. RFC 5952. IETF, 2010.

KUROSE, James F.; ROSS, Keith W. **Redes de computadores e a Internet**: uma abordagem top-down. 6. ed. São Paulo: Pearson, 2013.

MRUGALSKI, T. et al. **Dynamic Host Configuration Protocol for IPv6 (DHCPv6)**. RFC 8415. IETF, 2018.

NARTEN, T. et al. **Neighbor Discovery for IP version 6 (IPv6)**. RFC 4861. IETF, 2007.

NIC.BR. **IPv6.br**. Disponível em: https://ipv6.br. Acesso em: set. 2026.

TANENBAUM, Andrew S.; WETHERALL, David J. **Redes de computadores**. 5. ed. São Paulo: Pearson, 2011.

THOMSON, S.; NARTEN, T.; JINMEI, T. **IPv6 Stateless Address Autoconfiguration**. RFC 4862. IETF, 2007.
