## Antes de começar

Até aqui você aprendeu a ler endereços e redes. Esta parte mostra o IPv6 funcionando: como um dispositivo descobre os vizinhos, como ele ganha um endereço sozinho, quando entra o DHCPv6, como chega ao DNS e ao gateway, e como você confere tudo isso no Windows e no Linux. É a parte que mais se aproveita do Laboratório de IPv6 do NIC.br; ao final dela você vai estar pronto para os experimentos do capítulo 1 daquele livro.

---

## 5.1 ICMPv6 e Neighbor Discovery: como os dispositivos se descobrem

No IPv4, o ICMP era um protocolo secundário: servia para o `ping` e para avisar de erros, e muita gente o bloqueava sem consequência. No IPv6 isso muda completamente. O **ICMPv6** é o protocolo que faz o IPv6 funcionar: sem ele, nenhum dispositivo descobre o roteador, ninguém ganha endereço, ninguém acha o vizinho.

> **Conceito-chave**
>
> O **ICMPv6** (Internet Control Message Protocol for IPv6) é o protocolo de mensagens de controle do IPv6. Além de erros e `ping`, ele carrega o **Neighbor Discovery Protocol (NDP)**, o conjunto de mensagens pelas quais os dispositivos descobrem roteadores, prefixos, vizinhos e endereços duplicados.

### O que o NDP substitui

No IPv4, quando um dispositivo precisa mandar um pacote para outro na mesma rede, ele precisa descobrir o endereço físico (MAC) do destino. Isso é feito pelo **ARP**, que manda um broadcast "quem tem o IP tal?" e espera a resposta. No IPv6 não existe ARP. O NDP faz esse trabalho e vários outros, usando multicast em vez de broadcast, como você viu na seção 2.5.

| Função | IPv4 | IPv6 (NDP) |
|---|---|---|
| Descobrir o MAC de um vizinho | ARP (broadcast) | Neighbor Solicitation / Advertisement (multicast) |
| Descobrir o roteador | configuração manual ou DHCP | Router Solicitation / Advertisement |
| Descobrir o prefixo da rede | configuração manual ou DHCP | Router Advertisement |
| Detectar endereço duplicado | ARP gratuito (opcional) | Duplicate Address Detection (obrigatório) |
| Saber se o vizinho ainda está lá | não existe | Neighbor Unreachability Detection |

### As quatro mensagens

O NDP usa cinco tipos de mensagem ICMPv6; quatro delas você precisa conhecer.

**Router Solicitation (RS).** "Existe algum roteador aqui?" Enviada pelo dispositivo quando entra na rede, para o grupo multicast `ff02::2` (todos os roteadores). Só os roteadores recebem.

**Router Advertisement (RA).** "Sou um roteador; este é o prefixo da rede; use-me como gateway." Enviada pelo roteador em resposta a um RS e também periodicamente (a cada poucos minutos), para `ff02::1` (todos os nós). É a mensagem mais importante do IPv6: ela carrega o prefixo, o tempo de validade, se o dispositivo deve usar DHCPv6, o tamanho máximo de pacote e, opcionalmente, os servidores DNS.

**Neighbor Solicitation (NS).** "Quem tem o endereço tal? Me diga seu MAC." Enviada quando um dispositivo precisa do endereço físico de um vizinho. Vai para o grupo multicast **solicited-node** do endereço procurado, que você viu na seção 2.5, de modo que só quem tem aquele endereço a processa. Também é usada para conferir se um endereço já está em uso.

**Neighbor Advertisement (NA).** "O endereço é meu; meu MAC é este." Resposta ao NS.

> **Exemplo**
>
> O notebook `2001:db8:1:2::a` quer mandar um pacote para a impressora `2001:db8:1:2::b`, na mesma rede. Ele não sabe o MAC da impressora.
>
> 1. O notebook calcula o grupo solicited-node de `2001:db8:1:2::b`: `ff02::1:ff00:b` (os 24 últimos bits do endereço, anexados ao prefixo `ff02::1:ff00:0/104`).
> 2. Manda um **Neighbor Solicitation** para esse grupo, perguntando por `2001:db8:1:2::b`.
> 3. A impressora, que está inscrita nesse grupo por ter esse endereço, responde com um **Neighbor Advertisement** contendo o seu MAC.
> 4. O notebook guarda o par endereço/MAC numa tabela (o **cache de vizinhos**) e envia o pacote.
> Os outros dispositivos da rede nem viram a pergunta.

### Detecção de endereço duplicado

Antes de usar qualquer endereço (link-local ou global), o dispositivo confere se alguém já o tem. Ele manda um Neighbor Solicitation perguntando pelo próprio endereço que pretende usar, com origem `::` (não especificado, porque ainda não tem endereço). Se alguém responder, o endereço está em uso e ele não o adota. Se ninguém responder em cerca de um segundo, o endereço é dele. Isso se chama **DAD** (Duplicate Address Detection) e é obrigatório.

> **Atenção**
>
> **Nunca bloqueie ICMPv6 em um firewall IPv6.** No IPv4 era comum bloquear ICMP "por segurança". No IPv6, bloquear ICMPv6 impede RS, RA, NS e NA, e a rede simplesmente para de funcionar: ninguém ganha endereço, ninguém encontra o gateway. Se for filtrar, filtre tipos específicos (a RFC 4890 lista o que pode e o que não pode ser bloqueado), mas as mensagens do NDP sempre precisam passar.

> **Você sabia?**
>
> O NDP também faz a **Neighbor Unreachability Detection**: se um dispositivo para de receber confirmação de que um vizinho está vivo, ele manda um NS para conferir. Isso permite que a rede perceba rapidamente quando um roteador cai e mude para outro, sem que o usuário precise fazer nada. O IPv4 não tem nada equivalente.

> **Vamos praticar**
>
> 1. Qual mensagem do NDP substitui o ARP do IPv4?
> 2. Para qual grupo multicast um dispositivo envia o Router Solicitation, e quem recebe?
> 3. O que o Router Advertisement carrega?
> 4. Por que a Detecção de Endereço Duplicado usa `::` como origem?
> 5. Por que bloquear ICMPv6 quebra a rede?
>
> **Gabarito**
>
> 1. O par Neighbor Solicitation / Neighbor Advertisement.
> 2. Para `ff02::2`; só os roteadores do enlace recebem.
> 3. O prefixo da rede, tempos de validade, se deve usar DHCPv6, o tamanho máximo de pacote e, opcionalmente, servidores DNS.
> 4. Porque o dispositivo ainda não tem endereço nenhum confirmado; o que ele pretende usar é justamente o que está sendo testado.
> 5. Porque o NDP, que descobre roteadores, prefixos e vizinhos, é transportado pelo ICMPv6.

> **O que você precisa lembrar**
>
> O ICMPv6 é indispensável: ele carrega o Neighbor Discovery (NDP), que substitui o ARP e faz muito mais. RS pergunta por roteadores; RA anuncia prefixo e gateway; NS pergunta por um vizinho ou testa um endereço; NA responde. A DAD confere se um endereço está livre antes de usá-lo. Nunca bloqueie ICMPv6.

---

## 5.2 Autoconfiguração (SLAAC)

Esta é a seção que junta tudo. O link-local (3.8), o prefixo /64 (4.3), o identificador de interface (4.5) e as mensagens do NDP (5.1) existem para que esta cena aconteça: um dispositivo é ligado e, em segundos, sem servidor e sem ninguém digitar nada, está configurado.

> **Conceito-chave**
>
> **SLAAC** (Stateless Address Autoconfiguration) é o processo pelo qual um dispositivo IPv6 monta o próprio endereço global a partir do prefixo anunciado pelo roteador. "Stateless" porque nenhum servidor guarda registro de quem tem qual endereço.

### O passo a passo

> **Exemplo**
>
> Você abre o notebook e ele conecta ao Wi-Fi. Nos bastidores:
>
> 1. **Link-local.** A interface gera um identificador e monta `fe80::` + identificador. Antes de usar, faz a DAD: manda um Neighbor Solicitation perguntando por esse endereço, com origem `::`. Ninguém responde. O link-local está confirmado.
> 2. **Router Solicitation.** O notebook manda um RS para `ff02::2`: "existe roteador aqui?"
> 3. **Router Advertisement.** O roteador responde com um RA (para `ff02::1` ou diretamente para o notebook) dizendo: "prefixo `2804:14d:5e00:3f02::/64`, válido por tantos segundos; sou o gateway; use SLAAC; aqui vão os servidores DNS."
> 4. **Endereço global.** O notebook junta o prefixo anunciado com um identificador de interface (estável, RFC 7217) e forma `2804:14d:5e00:3f02:5c3e:91ff:fe22:1b7`. Faz a DAD de novo para esse endereço. Livre.
> 5. **Endereço temporário.** Ele gera também um identificador aleatório e forma um segundo endereço global, `2804:14d:5e00:3f02:a8f1:3c9d:7e02:b641`, que vai usar para as conexões que iniciar. DAD de novo.
> 6. **Gateway e rota.** Ele registra o endereço link-local do roteador (de onde veio o RA) como gateway padrão.
> Tudo isso leva menos de dois segundos. Nenhum servidor participou.

### O que o RA decide

O Router Advertisement traz algumas "bandeiras" (flags) que dizem ao dispositivo o que fazer:

| Bandeira | Nome | O que diz ao dispositivo |
|---|---|---|
| A | Autonomous | "Monte seu endereço com este prefixo (SLAAC)." |
| M | Managed | "Use DHCPv6 para obter endereço." |
| O | Other | "Use DHCPv6 só para outras informações (DNS, por exemplo)." |
| L | On-link | "Este prefixo está diretamente conectado; fale direto com os vizinhos dele." |

A combinação mais comum em redes domésticas e de celular é A ligado, M desligado, O desligado: SLAAC puro, com DNS entregue no próprio RA. Em redes corporativas é comum M ligado (DHCPv6 para ter controle central) ou A com O (SLAAC para o endereço, DHCPv6 para o DNS). A seção 5.3 detalha.

### Tempos de validade

O prefixo anunciado tem dois prazos: um **tempo preferencial**, durante o qual o endereço é usado normalmente, e um **tempo de validade**, depois do qual ele é descartado. Como o roteador repete o RA periodicamente, os prazos são renovados e o endereço nunca expira enquanto o roteador estiver lá. Se o provedor trocar o prefixo (o que acontece em muitas conexões residenciais), o roteador anuncia o novo com prazos normais e o antigo com prazo zero, e os dispositivos migram sozinhos.

> **Atenção**
>
> Uma consequência prática: em muitas casas o **prefixo IPv6 muda** de tempos em tempos (quando o roteador reinicia ou quando o provedor renova a delegação). Se você configurou algum serviço com o endereço global fixo, ele vai parar de funcionar quando o prefixo mudar. Para serviços internos, use ULA (seção 3.7) ou o link-local; para serviços expostos, um DNS dinâmico.

> **Você sabia?**
>
> O SLAAC é o motivo de o IPv6 ser tão bem aceito em redes de celular. Uma operadora com dezenas de milhões de aparelhos não precisa de servidores DHCP gigantes: cada celular se configura sozinho a partir do prefixo que a rede anuncia. É também por isso que o Android nunca implementou cliente DHCPv6 para endereço.

> **Vamos praticar**
>
> 1. Coloque em ordem: Router Advertisement, DAD do link-local, formação do endereço global, Router Solicitation.
> 2. O que significa "stateless" no SLAAC?
> 3. Se o RA vier com a bandeira A ligada e M desligada, o que o dispositivo faz?
> 4. Por que o dispositivo faz a DAD duas ou três vezes durante a autoconfiguração?
> 5. Um serviço configurado com endereço global fixo parou de responder depois que o roteador reiniciou. Qual é a causa provável?
>
> **Gabarito**
>
> 1. DAD do link-local, Router Solicitation, Router Advertisement, formação do endereço global.
> 2. Que nenhum servidor guarda registro de quem tem qual endereço; o dispositivo monta o próprio.
> 3. Monta o endereço com SLAAC e não usa DHCPv6 para endereço.
> 4. Uma para cada endereço que forma: link-local, global estável e global temporário.
> 5. O prefixo entregue pelo provedor mudou, e o endereço antigo deixou de ser válido.

> **O que você precisa lembrar**
>
> SLAAC: link-local com DAD, RS, RA com o prefixo, endereço global montado pelo próprio dispositivo com DAD, gateway igual ao link-local do roteador. As bandeiras A, M e O do RA dizem se o dispositivo usa SLAAC, DHCPv6 ou os dois. Prefixos podem mudar; não fixe serviços em endereços globais residenciais.

---

## 5.3 DHCPv6

Se o SLAAC resolve tudo sozinho, para que serve o DHCPv6? Esta seção responde: há situações em que o administrador quer controle sobre quem recebe qual endereço, ou precisa entregar informações que o SLAAC não entrega, ou precisa passar um bloco inteiro de endereços para outro roteador.

> **Conceito-chave**
>
> O **DHCPv6** é a versão do DHCP para IPv6. Diferente do IPv4, onde o DHCP é o único jeito automático de configurar, no IPv6 ele é **opcional** e convive com o SLAAC. É o roteador, pelas bandeiras do RA, que diz ao dispositivo se e como usar DHCPv6.

### Três modos

**Stateful (com estado).** O servidor DHCPv6 entrega o endereço ao dispositivo e guarda registro: quem pediu, qual endereço recebeu, por quanto tempo. É o modo mais parecido com o DHCP do IPv4. Ativado pela bandeira **M** do RA. Usado em redes corporativas que precisam saber qual máquina tem qual endereço, ou que querem endereços "arrumados" em vez dos identificadores aleatórios do SLAAC.

**Stateless (sem estado).** O dispositivo monta o endereço com SLAAC, mas pergunta ao servidor DHCPv6 outras informações: servidores DNS, domínio de busca, servidor de hora. O servidor não guarda nada. Ativado pela bandeira **O** do RA. Foi muito usado antes de o RA poder carregar DNS diretamente (RFC 8106); hoje é menos necessário.

**Prefix Delegation (delegação de prefixo).** O uso mais importante em redes domésticas. O roteador do provedor não entrega um endereço ao roteador da sua casa: entrega um **bloco inteiro**, tipicamente um /56, que o seu roteador então divide em /64 e anuncia nas suas redes internas. É assim que a sua casa recebe os 256 prefixos da seção 4.6.

> **Exemplo**
>
> Como o IPv6 chega à sua casa:
>
> 1. O roteador de casa liga e, na interface que dá para o provedor, faz SLAAC ou DHCPv6 para obter um endereço próprio.
> 2. Ele pede ao provedor, via **DHCPv6 Prefix Delegation**, um bloco. O provedor responde: "seu bloco é `2804:14d:5e00:3f00::/56`, válido por 24 horas".
> 3. O roteador pega o primeiro /64 desse bloco (`2804:14d:5e00:3f00::/64`) e começa a anunciá-lo por RA no Wi-Fi.
> 4. O seu notebook recebe o RA e faz SLAAC com esse prefixo.
> 5. Se o roteador tiver rede de visitantes, ele usa outro /64 do mesmo bloco (`...:3f01::/64`) nela.
> Ou seja: DHCPv6 entre o provedor e o roteador; SLAAC entre o roteador e os seus dispositivos.

### SLAAC ou DHCPv6?

| | SLAAC | DHCPv6 stateful |
|---|---|---|
| Quem escolhe o endereço | o dispositivo | o servidor |
| Servidor necessário | não | sim |
| Registro de quem tem qual endereço | não | sim |
| Entrega DNS | sim, via RA (RFC 8106) | sim |
| Funciona no Android | sim | não (o Android não tem cliente) |
| Uso típico | casas, celulares, redes simples | empresas que precisam de auditoria ou controle |

Na prática, muitas redes corporativas rodam os dois: SLAAC para dispositivos que não suportam DHCPv6 e DHCPv6 para os que suportam, com o RA carregando A e M ligadas.

> **Atenção**
>
> Mesmo com DHCPv6 stateful, o dispositivo **continua precisando do RA** para saber quem é o gateway. O DHCPv6, diferente do DHCP do IPv4, **não entrega gateway**. O gateway vem sempre do Router Advertisement. Uma rede com servidor DHCPv6 e sem roteador anunciando RA não funciona.

> **Você sabia?**
>
> O DHCPv6 não usa o endereço MAC para identificar o cliente, como o DHCP do IPv4. Ele usa um identificador chamado **DUID**, gerado pelo sistema operacional na primeira vez e guardado em disco. Trocar a placa de rede não muda o DUID; reinstalar o sistema, sim. Isso confunde quem tenta "reservar" um endereço para uma máquina pelo MAC.

> **Vamos praticar**
>
> 1. Qual bandeira do RA ativa o DHCPv6 stateful? E o stateless?
> 2. O que é delegação de prefixo e onde ela é usada?
> 3. Verdadeiro ou falso: com DHCPv6 stateful, o dispositivo não precisa mais do Router Advertisement.
> 4. Por que uma empresa escolheria DHCPv6 stateful em vez de SLAAC?
> 5. Um celular Android numa rede que só oferece DHCPv6 stateful (bandeira A desligada). Ele ganha endereço global?
>
> **Gabarito**
>
> 1. M para stateful; O para stateless.
> 2. É quando o provedor entrega ao roteador do cliente um bloco inteiro (um /56, por exemplo) via DHCPv6, para ele dividir em /64 nas redes internas. Usada entre provedor e roteador de casa.
> 3. Falso. O gateway vem sempre do RA; o DHCPv6 não o entrega.
> 4. Para registrar qual máquina tem qual endereço (auditoria) e para controlar os endereços atribuídos.
> 5. Não. O Android não implementa cliente DHCPv6 para endereço; sem SLAAC, ele fica só com o link-local.

> **O que você precisa lembrar**
>
> DHCPv6 é opcional. Stateful (bandeira M) entrega o endereço e registra; stateless (bandeira O) entrega só informações extras; delegação de prefixo entrega um bloco inteiro ao roteador de casa. O gateway nunca vem do DHCPv6, sempre do RA. O Android não usa DHCPv6 para endereço.

---

## 5.4 Gateway

Você já encontrou o gateway várias vezes neste manual. Esta seção curta consolida o que ele é no IPv6 e desfaz a confusão mais comum.

> **Conceito-chave**
>
> O **gateway padrão** (ou rota padrão) é o roteador para onde um dispositivo envia todo pacote cujo destino não está na sua própria rede. No IPv6, ele é descoberto automaticamente pelo **Router Advertisement** e seu endereço é normalmente o **link-local** do roteador.

### Como o dispositivo descobre

Não há configuração manual nem servidor. O roteador anuncia sua presença pelo RA, e o dispositivo registra o endereço de origem do RA (o link-local do roteador) como gateway. Se houver mais de um roteador anunciando, o dispositivo mantém uma lista e escolhe conforme a preferência indicada nos RAs; se um deles parar de anunciar, o dispositivo o descarta.

### Por que o gateway é link-local

Na seção 3.8 você viu o motivo: o RA sai do link-local do roteador, e o roteador está no mesmo enlace, então o link-local é suficiente para alcançá-lo. Usar o endereço global do roteador como gateway seria possível, mas desnecessário, e deixaria de funcionar se o prefixo global mudasse. O link-local nunca muda.

> **Exemplo**
>
> Saída de `ip -6 route` num Linux:
> `default via fe80::a2b3:c4ff:fed5:e6f7 dev wlan0 proto ra metric 600`
> Lendo: a rota padrão (`default`) vai pelo endereço `fe80::a2b3:c4ff:fed5:e6f7` (link-local do roteador), pela interface `wlan0`, e foi aprendida por RA (`proto ra`).
> No Windows, `ipconfig` mostra a mesma coisa como "Gateway Padrão: fe80::a2b3:c4ff:fed5:e6f7%12".

> **Atenção**
>
> Se você configurar um gateway IPv6 manualmente com um endereço link-local, precisa indicar a interface (`fe80::1%eth0` ou `via fe80::1 dev eth0`). Sem isso, o sistema não sabe por qual enlace aquele link-local é alcançável. Com gateway descoberto por RA, isso é automático.

> **Vamos praticar**
>
> 1. Como um dispositivo IPv6 descobre o gateway?
> 2. Por que o gateway costuma ser link-local?
> 3. Na linha `default via fe80::1 dev eth0 proto ra`, o que significa `proto ra`?
> 4. O que acontece com o gateway se o roteador parar de enviar RAs?
>
> **Gabarito**
>
> 1. Pelo Router Advertisement: o endereço de origem do RA vira o gateway.
> 2. Porque o RA sai do link-local do roteador, ele está no mesmo enlace e o link-local nunca muda.
> 3. Que a rota foi aprendida por Router Advertisement, não configurada manualmente.
> 4. Depois que o prazo anunciado expira, o dispositivo descarta o gateway.

> **O que você precisa lembrar**
>
> O gateway IPv6 é descoberto pelo RA e é o link-local do roteador. Não vem do DHCPv6 nem precisa de configuração manual. Ver `fe80::` como gateway é o comportamento normal.

---

## 5.5 DNS

Ninguém digita `2a00:1450:4001:82a::200e` para abrir o Google. O DNS traduz nomes em endereços, e no IPv6 ele tem duas novidades: um tipo de registro próprio e novos jeitos de o dispositivo descobrir qual servidor consultar.

### O registro AAAA

No DNS, um nome pode ter vários tipos de registro. O que guarda um endereço IPv4 é o registro **A**. O que guarda um endereço IPv6 é o registro **AAAA** ("quad-A"): quatro As porque o endereço tem quatro vezes o tamanho.

> **Exemplo**
>
> Consultando os dois registros de um nome, no Linux ou macOS:
> `dig google.com A` retorna algo como `142.250.79.14`
> `dig google.com AAAA` retorna algo como `2800:3f0:4001:80a::200e`
> No Windows: `nslookup -type=AAAA google.com`
> Um site que tem registro AAAA é acessível por IPv6. Um que só tem A, não.

Quando um dispositivo com pilha dupla vai abrir um site, ele consulta os dois registros e, se houver AAAA, **prefere o IPv6**. É por isso que, numa rede com IPv6 funcionando, a maior parte do tráfego para Google, YouTube, Netflix e redes sociais já vai por IPv6 sem que você perceba.

> **Você sabia?**
>
> Os navegadores usam uma técnica chamada **Happy Eyeballs** (RFC 8305): tentam IPv6 e IPv4 quase ao mesmo tempo e ficam com o que responder primeiro, com uma pequena vantagem para o IPv6. Assim, se o IPv6 de uma rede estiver mal configurado, o usuário quase não sente: o navegador cai para o IPv4 em milissegundos. Isso é ótimo para o usuário e péssimo para quem administra a rede, porque esconde o problema.

### Como o dispositivo descobre o servidor DNS

No IPv4, o servidor DNS vem sempre do DHCP. No IPv6 há três caminhos:

1. **No próprio Router Advertisement**, pela opção **RDNSS** (Recursive DNS Server, RFC 8106). O roteador anuncia o prefixo e os servidores DNS na mesma mensagem. É o mais simples e o que a maioria dos sistemas atuais suporta.
2. **Por DHCPv6**, stateless ou stateful. Necessário para sistemas antigos que não entendem RDNSS.
3. **Herdado do IPv4.** Numa rede com pilha dupla, o dispositivo pode usar o servidor DNS que recebeu pelo DHCP do IPv4 para consultar registros AAAA também. O DNS não se importa por qual protocolo a pergunta chega.

O terceiro caminho é o motivo de muitas redes "funcionarem" em IPv6 sem que ninguém tenha configurado DNS em IPv6: a consulta vai por IPv4, a resposta traz o AAAA, a conexão vai por IPv6.

> **Atenção**
>
> O servidor DNS **ter** um endereço IPv6 e o servidor DNS **responder** registros AAAA são coisas diferentes. Qualquer servidor DNS moderno responde AAAA, mesmo se você o consulta por IPv4. Já numa rede só IPv6 (sem IPv4 nenhum), o servidor DNS precisa ser alcançável por um endereço IPv6, entregue por RDNSS ou DHCPv6.

### Registro reverso

Assim como no IPv4, dá para perguntar "qual nome corresponde a este endereço". No IPv6 isso usa o domínio `ip6.arpa`, e o endereço é escrito ao contrário, dígito por dígito, separado por pontos. `2001:db8::1` vira `1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa`. Você não precisa montar isso à mão (`dig -x 2001:db8::1` faz), mas vale reconhecer o formato quando aparecer em logs.

> **Vamos praticar**
>
> 1. Qual tipo de registro DNS guarda um endereço IPv6?
> 2. Um site tem registro A e não tem AAAA. Ele é acessível por IPv6?
> 3. Cite os três caminhos pelos quais um dispositivo pode descobrir o servidor DNS em IPv6.
> 4. Por que uma rede pode "funcionar" em IPv6 sem ter DNS configurado em IPv6?
> 5. O que o Happy Eyeballs faz?
>
> **Gabarito**
>
> 1. AAAA.
> 2. Não; sem AAAA não há endereço IPv6 para conectar.
> 3. RDNSS no RA, DHCPv6 e o servidor DNS herdado do DHCP do IPv4.
> 4. Porque a consulta DNS pode ir por IPv4 e mesmo assim retornar o registro AAAA; a conexão então vai por IPv6.
> 5. Tenta IPv6 e IPv4 quase ao mesmo tempo e usa o que responder primeiro, com preferência ao IPv6.

> **O que você precisa lembrar**
>
> O registro AAAA guarda endereços IPv6. Dispositivos com pilha dupla preferem IPv6 quando há AAAA. O servidor DNS pode vir por RDNSS no RA, por DHCPv6 ou herdado do IPv4. O reverso usa `ip6.arpa`.

---

## 5.6 Configuração de IPv6 em Windows e Linux

Na maioria dos casos você não configura nada: o SLAAC faz tudo. Esta seção mostra onde o IPv6 está em cada sistema, como ver o que foi configurado automaticamente e como configurar à mão nos poucos casos em que isso é necessário (servidores e testes, principalmente).

### Windows

**Ver a configuração.** Abra o Prompt de Comando ou o PowerShell e digite `ipconfig`. Numa interface com IPv6 funcionando aparecem linhas como:

`Endereço IPv6 . . . . . . . . . . . : 2804:14d:5e00:3f02:5c3e:91ff:fe22:1b7`
`Endereço IPv6 Temporário. . . . . . : 2804:14d:5e00:3f02:a8f1:3c9d:7e02:b641`
`Endereço IPv6 de link local . . . . : fe80::5c3e:91ff:fe22:1b7%12`
`Gateway Padrão. . . . . . . . . . . : fe80::a2b3:c4ff:fed5:e6f7%12`

Se aparecer só o link-local, o IPv6 está ativo mas não há roteador anunciando prefixo (ou o provedor não oferece IPv6).

**Ativar ou desativar.** O IPv6 vem ativado por padrão desde o Windows Vista. Para conferir: Painel de Controle, Central de Rede e Compartilhamento, Alterar as configurações do adaptador, botão direito no adaptador, Propriedades, e a caixa "Protocolo IP Versão 6 (TCP/IPv6)" deve estar marcada. Desativar não é recomendado: vários serviços do Windows assumem que ele existe.

**Configurar manualmente.** Na mesma janela de Propriedades, clique em "Protocolo IP Versão 6", Propriedades, e escolha "Usar o seguinte endereço IPv6". Preencha endereço, tamanho do prefixo (64) e gateway. Por linha de comando, em PowerShell como administrador:

`New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 2001:db8:1:2::10 -PrefixLength 64`

> **Atenção**
>
> Quando configurar manualmente no Windows, não é preciso informar o gateway se a rede tem roteador anunciando RA: o gateway continua sendo aprendido automaticamente. Informe-o só se não houver RA (o que é raro e geralmente indica problema).

### Linux

**Ver a configuração.** O comando moderno é `ip` (do pacote iproute2; o antigo `ifconfig` é obsoleto e mostra IPv6 de forma incompleta):

`ip -6 addr show`

A saída, por interface, tem linhas `inet6`:

`inet6 2804:14d:5e00:3f02:5c3e:91ff:fe22:1b7/64 scope global dynamic mngtmpaddr`
`inet6 2804:14d:5e00:3f02:a8f1:3c9d:7e02:b641/64 scope global temporary dynamic`
`inet6 fe80::5c3e:91ff:fe22:1b7/64 scope link`

Lendo: `scope global` é endereço global; `scope link` é link-local; `dynamic` indica que veio do SLAAC; `temporary` é o endereço de privacidade. O `/64` é o prefixo.

Para ver o gateway: `ip -6 route show`, procurando a linha `default via ...`.

**Ativar ou desativar.** O IPv6 vem ativado. Se estiver desativado, o parâmetro `net.ipv6.conf.all.disable_ipv6` estará em 1; `sysctl net.ipv6.conf.all.disable_ipv6=0` reativa (a configuração permanente fica em `/etc/sysctl.conf` ou na ferramenta de rede da distribuição).

**Configurar manualmente.** Temporariamente, como root:

`ip -6 addr add 2001:db8:1:2::10/64 dev eth0`
`ip -6 route add default via fe80::1 dev eth0`

Para tornar permanente, use a ferramenta da distribuição: NetworkManager (`nmcli`), netplan (Ubuntu) ou os arquivos em `/etc/network/interfaces` (Debian). A sintaxe varia; o que não varia são os três dados: endereço com prefixo, interface e gateway.

> **Exemplo**
>
> Configuração permanente com NetworkManager, comum em desktops Linux:
> `nmcli con mod "Conexão cabeada 1" ipv6.method manual ipv6.addresses 2001:db8:1:2::10/64 ipv6.gateway fe80::1`
> `nmcli con up "Conexão cabeada 1"`
> Para voltar ao automático: `ipv6.method auto`.

### Celulares

Android e iOS não têm configuração manual de IPv6 acessível ao usuário: usam SLAAC sempre. Para ver o endereço no Android, Configurações, Sobre o telefone, Status (ou Wi-Fi, detalhes da rede); no iOS, Ajustes, Wi-Fi, o "i" ao lado da rede. Se o IPv6 não estiver funcionando num celular, o problema está na rede, não no aparelho.

> **Vamos praticar**
>
> 1. Qual comando mostra os endereços IPv6 no Windows? E no Linux?
> 2. Na saída do Linux, o que significa `scope link`? E `temporary`?
> 3. Um computador mostra só o endereço `fe80::...` e nenhum global. O IPv6 está desativado?
> 4. Ao configurar um endereço manual no Windows numa rede com RA, é preciso preencher o gateway?
> 5. Qual comando Linux adiciona temporariamente o endereço `2001:db8:1:2::10/64` à interface eth0?
>
> **Gabarito**
>
> 1. `ipconfig` no Windows; `ip -6 addr show` no Linux.
> 2. `scope link` é link-local; `temporary` é o endereço temporário de privacidade.
> 3. Não. O IPv6 está ativo (o link-local existe); só não há roteador anunciando prefixo ou o provedor não oferece IPv6.
> 4. Não; ele continua vindo do RA.
> 5. `ip -6 addr add 2001:db8:1:2::10/64 dev eth0`

> **O que você precisa lembrar**
>
> Windows: `ipconfig` mostra endereço, temporário, link-local e gateway; configuração manual nas propriedades do adaptador ou com `New-NetIPAddress`. Linux: `ip -6 addr` e `ip -6 route`; manual com `ip -6 addr add` e `ip -6 route add`, permanente pela ferramenta da distribuição. Celulares só usam SLAAC. Na dúvida, não desative o IPv6.

---

## 5.7 Verificação da configuração

Você já sabe onde ver os endereços. Esta seção organiza um roteiro para responder à pergunta "meu IPv6 está funcionando?", do mais básico ao mais completo, e para achar onde está o problema quando não está.

### O roteiro

| Passo | O que conferir | Como | O que esperar |
|---|---|---|---|
| 1 | O IPv6 está ativo? | `ipconfig` / `ip -6 addr` | Um endereço `fe80::` na interface |
| 2 | Tenho endereço global? | idem | Um endereço `2xxx:` ou `3xxx:` com `/64` |
| 3 | Tenho gateway? | `ipconfig` / `ip -6 route` | Uma linha de gateway ou `default via fe80::...` |
| 4 | Alcanço o gateway? | `ping fe80::...%interface` | Respostas |
| 5 | Alcanço a Internet por endereço? | `ping 2001:4860:4860::8888` | Respostas |
| 6 | O DNS resolve AAAA? | `nslookup -type=AAAA google.com` / `dig google.com AAAA` | Um endereço IPv6 |
| 7 | Alcanço a Internet por nome? | `ping google.com` (ou `ping -6`) | Respostas de um endereço IPv6 |
| 8 | O navegador usa IPv6? | abrir test-ipv6.com | Nota 10/10 |

Cada passo depende do anterior. Onde a sequência quebra, está o problema.

### Interpretando as falhas

**Falha no passo 1.** O IPv6 está desativado no sistema. Reative (seção 5.6).

**Falha no passo 2 (tem link-local, não tem global).** Nenhum roteador está anunciando prefixo no enlace. Causas comuns: o provedor não oferece IPv6; o roteador de casa tem IPv6 desligado; o roteador não recebeu delegação de prefixo do provedor. Confira a página de status do roteador: se ele mesmo não tem endereço IPv6 na interface do provedor, o problema é do provedor ou da configuração de acesso.

**Falha no passo 3 ou 4.** Há prefixo mas não gateway, ou o gateway não responde. Normalmente é o mesmo roteador que falha ao anunciar RA; ou um firewall bloqueando ICMPv6 (seção 5.1).

**Falha no passo 5 (gateway responde, Internet não).** O roteador tem IPv6 interno mas não externo, ou o provedor não está roteando o prefixo. Do lado do usuário há pouco a fazer além de reiniciar o roteador e, se persistir, chamar o provedor.

**Falha no passo 6 ou 7 (Internet por endereço funciona, por nome não).** Problema de DNS: o servidor configurado não está respondendo ou não é alcançável. Teste com outro servidor DNS (`nslookup -type=AAAA google.com 2001:4860:4860::8888`).

**Falha no passo 8 com tudo anterior funcionando.** O navegador ou o sistema está preferindo IPv4 por alguma política local, ou o teste está detectando um problema de tamanho de pacote (MTU). test-ipv6.com explica cada item que falha.

> **Exemplo**
>
> Um `ping -6` para o Google no Windows, funcionando:
> `Disparando google.com [2800:3f0:4001:80a::200e] com 32 bytes de dados:`
> `Resposta de 2800:3f0:4001:80a::200e: tempo=18ms`
> Repare que a resposta vem de um endereço IPv6: o nome foi resolvido para AAAA e o tráfego foi por IPv6. Se a resposta viesse de um endereço `142.250...`, o sistema teria escolhido IPv4, e valeria investigar por quê.

> **Atenção**
>
> Ao dar `ping` num endereço link-local, lembre do identificador de zona: `ping fe80::1%12` no Windows, `ping fe80::1%eth0` ou `ping -I eth0 fe80::1` no Linux. Sem ele, o comando falha com "endereço inválido" ou "rede inacessível", e isso não significa que o gateway está fora.

> **Você sabia?**
>
> O endereço `2001:4860:4860::8888` é o DNS público do Google em IPv6; o `2606:4700:4700::1111` é o da Cloudflare. Ambos são úteis para o passo 5 porque respondem a `ping` de qualquer lugar do mundo e têm endereços fáceis de lembrar.

> **Vamos praticar**
>
> 1. Um computador tem link-local, global e gateway, faz `ping` no gateway com sucesso, mas `ping 2001:4860:4860::8888` falha. Onde provavelmente está o problema?
> 2. `ping 2001:4860:4860::8888` funciona, mas `ping google.com` responde de um endereço IPv4. O que isso indica?
> 3. Um computador só tem `fe80::`. Cite duas causas possíveis.
> 4. Faça o roteiro completo na sua própria máquina e anote em qual passo ele para (se parar).
>
> **Gabarito**
>
> 1. Entre o roteador e a Internet: o roteador não tem saída IPv6 ou o provedor não roteia o prefixo.
> 2. Que o DNS não retornou AAAA (ou o sistema preferiu IPv4). Conferir com `nslookup -type=AAAA`.
> 3. Provedor sem IPv6; roteador com IPv6 desligado ou sem delegação de prefixo.
> 4. Resposta livre.

> **O que você precisa lembrar**
>
> Confira em ordem: link-local, global, gateway, ping no gateway, ping em endereço externo, DNS AAAA, ping por nome, test-ipv6.com. Onde a sequência quebra está o problema. Lembre do `%interface` em link-local e não bloqueie ICMPv6.

---

## 5.8 Comandos relacionados ao IPv6

Esta seção é uma referência: os comandos que você vai usar para ver, testar e diagnosticar IPv6 no Windows e no Linux, lado a lado, com o que cada um mostra. Volte a ela sempre que precisar. A lista foi adaptada do apêndice C do Laboratório de IPv6 do NIC.br, com acréscimos para o Windows.

### Ver endereços e interfaces

| O que fazer | Windows | Linux |
|---|---|---|
| Ver endereços de todas as interfaces | `ipconfig` | `ip -6 addr show` |
| Ver com mais detalhes (MAC, DNS, DHCP) | `ipconfig /all` | `ip -6 addr show dev eth0` |
| Ver só uma interface | `netsh interface ipv6 show addresses` | `ip -6 addr show dev eth0` |
| Ver os grupos multicast de que a interface participa | `netsh interface ipv6 show joins` | `ip -6 maddr show` |

### Rotas e gateway

| O que fazer | Windows | Linux |
|---|---|---|
| Ver a tabela de rotas IPv6 | `route print -6` ou `netsh interface ipv6 show route` | `ip -6 route show` |
| Ver só a rota padrão | `netsh interface ipv6 show route` (procurar `::/0`) | `ip -6 route show default` |
| Adicionar rota padrão manual | `netsh interface ipv6 add route ::/0 "Ethernet" fe80::1` | `ip -6 route add default via fe80::1 dev eth0` |

### Vizinhos (o "ARP" do IPv6)

| O que fazer | Windows | Linux |
|---|---|---|
| Ver o cache de vizinhos (endereço IPv6 e MAC) | `netsh interface ipv6 show neighbors` | `ip -6 neigh show` |
| Limpar o cache | `netsh interface ipv6 delete neighbors` | `ip -6 neigh flush all` |

Na saída do Linux, `REACHABLE` significa que o vizinho respondeu recentemente; `STALE` que a entrada está guardada mas não confirmada; `FAILED` que o vizinho não respondeu.

### Testes de conectividade

| O que fazer | Windows | Linux |
|---|---|---|
| Ping em endereço global | `ping 2001:db8::1` ou `ping -6 nome` | `ping 2001:db8::1` ou `ping -6 nome` (ou `ping6`) |
| Ping em link-local | `ping fe80::1%12` | `ping fe80::1%eth0` ou `ping -I eth0 fe80::1` |
| Ping em todos os nós do enlace | `ping ff02::1%12` | `ping ff02::1%eth0` |
| Traçar a rota até um destino | `tracert -6 nome` | `traceroute -6 nome` (ou `traceroute6`) |
| Ver o caminho e a perda por salto | `pathping -6 nome` | `mtr -6 nome` |

O `ping ff02::1%eth0` é um truque útil: como `ff02::1` é o grupo de todos os nós, cada dispositivo do enlace responde, e você descobre em segundos quem está na rede sem precisar de nenhuma ferramenta extra.

### DNS

| O que fazer | Windows | Linux |
|---|---|---|
| Consultar registro AAAA | `nslookup -type=AAAA google.com` | `dig google.com AAAA` (ou `host -t AAAA google.com`) |
| Consultar usando um servidor específico | `nslookup -type=AAAA google.com 2001:4860:4860::8888` | `dig @2001:4860:4860::8888 google.com AAAA` |
| Consulta reversa | `nslookup 2001:db8::1` | `dig -x 2001:db8::1` |

### Conexões e portas

| O que fazer | Windows | Linux |
|---|---|---|
| Ver conexões IPv6 ativas | `netstat -an -p tcpv6` | `ss -6 -tan` |
| Ver o que está escutando em IPv6 | `netstat -an -p tcpv6` (procurar LISTENING) | `ss -6 -tln` |

### Captura de pacotes

Para ver as mensagens do NDP acontecendo, o `tcpdump` (Linux) e o Wireshark (qualquer sistema) capturam o tráfego da interface:

`tcpdump -i eth0 -s 0 icmp6`

Isso mostra RS, RA, NS e NA em tempo real. No Wireshark, o filtro `icmpv6` faz o mesmo com interface gráfica. É o jeito mais concreto de ver a seção 5.1 funcionando, e é o que as experiências do Laboratório de IPv6 fazem.

> **Exemplo**
>
> Trecho de uma captura com `tcpdump -i wlan0 icmp6` no momento em que um notebook entra na rede:
> `IP6 :: > ff02::1:ff22:1b7: ICMP6, neighbor solicitation, who has fe80::5c3e:91ff:fe22:1b7` (DAD do link-local)
> `IP6 fe80::5c3e:91ff:fe22:1b7 > ff02::2: ICMP6, router solicitation` (RS)
> `IP6 fe80::a2b3:c4ff:fed5:e6f7 > ff02::1: ICMP6, router advertisement, prefix 2804:14d:5e00:3f02::/64` (RA)
> `IP6 :: > ff02::1:ff22:1b7: ICMP6, neighbor solicitation, who has 2804:14d:5e00:3f02:5c3e:91ff:fe22:1b7` (DAD do global)
> É a seção 5.2 inteira em quatro linhas.

> **Atenção**
>
> Em Linux, prefira sempre `ip` a `ifconfig`, `route` e `arp`. Os comandos antigos (pacote net-tools) estão obsoletos desde 2001 e mostram informação IPv6 incompleta ou errada. Os equivalentes modernos são `ip addr`, `ip route` e `ip neigh`.

> **Vamos praticar**
>
> 1. Qual comando Linux mostra o cache de vizinhos IPv6? E o equivalente no Windows?
> 2. Como descobrir rapidamente todos os dispositivos IPv6 do seu enlace?
> 3. Qual comando mostra as mensagens do NDP em tempo real?
> 4. No Linux, por que não usar `ifconfig` para ver IPv6?
> 5. Qual comando Windows consulta o registro AAAA de um nome usando o servidor `2606:4700:4700::1111`?
>
> **Gabarito**
>
> 1. `ip -6 neigh show`; `netsh interface ipv6 show neighbors`.
> 2. `ping ff02::1%interface`: todos os nós respondem.
> 3. `tcpdump -i interface icmp6` ou o Wireshark com filtro `icmpv6`.
> 4. Porque está obsoleto e mostra IPv6 de forma incompleta; use `ip -6 addr`.
> 5. `nslookup -type=AAAA nome 2606:4700:4700::1111`

> **O que você precisa lembrar**
>
> Endereços: `ipconfig` / `ip -6 addr`. Rotas: `route print -6` / `ip -6 route`. Vizinhos: `netsh interface ipv6 show neighbors` / `ip -6 neigh`. Testes: `ping`, `tracert -6` / `traceroute -6`. DNS: `nslookup -type=AAAA` / `dig AAAA`. NDP ao vivo: `tcpdump icmp6`. Em Linux, use `ip`, nunca `ifconfig`.
