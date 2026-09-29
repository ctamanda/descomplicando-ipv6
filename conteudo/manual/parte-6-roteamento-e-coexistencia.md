## Antes de começar

Esta é a parte de fechamento. Ela responde a duas perguntas que ficaram abertas: como um pacote sai da sua rede e chega a um servidor do outro lado do mundo, e como o IPv6 convive com o IPv4 numa Internet em que os dois existem ao mesmo tempo. É conceitual: você não vai configurar protocolos de roteamento aqui, mas vai entender o que eles fazem e reconhecer os mecanismos de transição que já estão rodando na sua casa. A última seção aponta o caminho para continuar.

---

## 6.1 O que é roteamento?

Na seção 1.2 você viu que, para sair da rede local, um dispositivo entrega o pacote ao roteador, e que cada roteador pelo caminho decide para onde encaminhar. Esta decisão, repetida em cada salto, é o **roteamento**.

> **Conceito-chave**
>
> **Roteamento** é o processo de decidir, em cada roteador, por qual interface e para qual próximo roteador um pacote deve seguir para chegar ao destino. A decisão é tomada consultando a **tabela de rotas**, que associa prefixos de destino a próximos saltos.

### Placas na estrada

Pense numa viagem de carro de Palmas a Brasília sem GPS. Você não precisa saber o caminho inteiro. Em cada cruzamento há uma placa: "Brasília, siga à direita". Você segue, chega ao próximo cruzamento, lê a próxima placa. Cada placa só sabe a direção geral; a soma delas leva você ao destino.

Roteadores funcionam assim. Cada um tem uma tabela com entradas do tipo "para destinos que começam com `2001:db8:cafe::/48`, mande para o roteador X pela interface Y". Ele olha o endereço de destino do pacote, procura a entrada mais específica que combine, e encaminha. Não sabe nem precisa saber o que acontece depois.

### A escolha da rota mais específica

Quando várias entradas da tabela combinam com o destino, o roteador escolhe a de **prefixo mais longo** (mais bits fixos), porque é a mais precisa. É a mesma lógica da seção 4.4: `2001:db8:cafe:1::/64` é mais específico que `2001:db8:cafe::/48`, que é mais específico que `2001:db8::/32`, que é mais específico que `::/0`.

A entrada `::/0` combina com qualquer destino: é a **rota padrão**. Ela é usada quando nenhuma outra serve, e aponta para o gateway. No seu notebook, a tabela é minúscula: a rede local (`/64`, alcançável diretamente) e a rota padrão (tudo o mais, via gateway). Num roteador de provedor, a tabela tem centenas de milhares de prefixos.

> **Exemplo**
>
> Tabela de rotas de um notebook (`ip -6 route`):
> `2804:14d:5e00:3f02::/64 dev wlan0 proto ra` (minha rede: falo direto)
> `fe80::/64 dev wlan0` (link-local: falo direto)
> `default via fe80::a2b3:c4ff:fed5:e6f7 dev wlan0 proto ra` (todo o resto: via gateway)
> Para um destino `2804:14d:5e00:3f02::7`, a primeira entrada combina e é a mais específica: entrega direta. Para `2800:3f0:4001:80a::200e`, só a rota padrão combina: vai para o gateway.

> **Atenção**
>
> "Rota" e "gateway" não são a mesma coisa. O gateway é o roteador para onde a rota padrão aponta. Um roteador de verdade tem muitas rotas apontando para muitos vizinhos; a rota padrão é só uma delas, usada para o que não tem rota mais específica.

> **Vamos praticar**
>
> 1. O que é uma tabela de rotas?
> 2. Um roteador tem entradas para `2001:db8::/32`, `2001:db8:1::/48` e `::/0`. Qual ele usa para o destino `2001:db8:1:5::9`?
> 3. O que é a rota `::/0`?
> 4. Por que um roteador não precisa conhecer o caminho inteiro até o destino?
>
> **Gabarito**
>
> 1. A lista de prefixos de destino conhecidos e, para cada um, por onde encaminhar (interface e próximo salto).
> 2. `2001:db8:1::/48`, a mais específica que combina.
> 3. A rota padrão: combina com qualquer destino e é usada quando nenhuma outra serve.
> 4. Porque cada roteador só decide o próximo salto; o roteador seguinte toma a próxima decisão.

> **O que você precisa lembrar**
>
> Roteamento é decidir o próximo salto em cada roteador, consultando a tabela de rotas e escolhendo o prefixo mais longo que combine. `::/0` é a rota padrão, que aponta para o gateway. Nenhum roteador conhece o caminho inteiro.

---

## 6.2 Comunicação entre redes

Vamos acompanhar um pacote da sua casa até um servidor e de volta, para ver todas as peças das partes anteriores trabalhando juntas.

### O caminho de ida

> **Exemplo**
>
> Seu notebook (`2804:14d:5e00:3f02:a8f1:3c9d:7e02:b641`) abre um vídeo em um servidor (`2800:3f0:4001:80a::200e`).
>
> 1. **No notebook.** O destino não está na rede local (`2804:14d:5e00:3f02::/64`). A tabela de rotas manda para o gateway, `fe80::a2b3:c4ff:fed5:e6f7`. O notebook consulta o cache de vizinhos (ou faz Neighbor Solicitation) para achar o MAC do roteador e entrega o pacote pelo Wi-Fi.
> 2. **No roteador de casa.** Ele lê o destino, não é nenhuma das suas redes internas, então segue a rota padrão: a interface que dá para o provedor. Diminui o Hop Limit em 1 e encaminha. Repare que ele **não altera** os endereços de origem e destino: não há NAT.
> 3. **No provedor.** Roteadores do provedor consultam tabelas maiores. O prefixo `2800:3f0::/32` pertence a outra organização; a tabela diz por qual conexão externa (para outro provedor, ou para um ponto de troca de tráfego) ele é alcançável. Mais alguns saltos, cada um diminuindo o Hop Limit.
> 4. **No provedor do servidor.** O pacote entra na rede da organização dona de `2800:3f0::/32`, é roteado até o enlace onde está o servidor, e o último roteador faz Neighbor Solicitation para achar o MAC dele.
> 5. **No servidor.** O pacote chega com os mesmos endereços de origem e destino com que saiu. O servidor sabe exatamente quem pediu.

### O caminho de volta

O servidor responde para `2804:14d:5e00:3f02:a8f1:3c9d:7e02:b641`. O caminho é análogo, no sentido contrário, e não precisa ser o mesmo: cada roteador decide por conta própria. Ao chegar ao roteador de casa, ele vê que `2804:14d:5e00:3f02::/64` é uma das suas redes, faz Neighbor Solicitation pelo notebook (ou usa o cache) e entrega.

Compare com o IPv4: lá, o roteador de casa teria trocado o endereço privado do notebook pelo seu endereço público na ida (NAT), guardado a correspondência numa tabela, e feito a troca inversa na volta. No IPv6, nada disso: os endereços viajam intactos.

### Onde o Hop Limit entra

Cada roteador diminui o Hop Limit em 1. Se chegar a zero, o pacote é descartado e o roteador manda uma mensagem ICMPv6 "tempo excedido" para a origem. É esse mecanismo que o `traceroute -6` explora: ele manda pacotes com Hop Limit 1, 2, 3... e cada roteador que descarta um deles se revela na mensagem de erro. O resultado é a lista dos roteadores do caminho.

> **Exemplo**
>
> `traceroute -6 google.com` (simplificado):
> `1 fe80::a2b3:c4ff:fed5:e6f7 1 ms` (roteador de casa)
> `2 2804:14d:5e00::1 8 ms` (primeiro roteador do provedor)
> `3 2804:14d::4:1 12 ms` (núcleo do provedor)
> `4 2001:12f8::... 15 ms` (ponto de troca de tráfego, o IX.br)
> `5 2800:3f0:4001:80a::200e 18 ms` (o servidor)
> Cinco saltos. O pacote passou por cinco decisões de roteamento.

> **Você sabia?**
>
> Boa parte do tráfego IPv6 brasileiro passa pelos **pontos de troca de tráfego** do IX.br, operados pelo NIC.br. Neles, provedores, empresas de conteúdo e universidades se conectam diretamente, sem passar por redes internacionais. É uma das razões de a latência para os grandes serviços ser baixa no Brasil, e uma das razões de o IPv6 ter avançado tanto aqui: o IX.br exige IPv6 dos participantes.

> **Vamos praticar**
>
> 1. Quantas vezes o endereço de destino de um pacote é alterado no caminho, em IPv6?
> 2. O que o roteador de casa faz de diferente no IPv6 em relação ao IPv4, ao encaminhar um pacote para fora?
> 3. Como o `traceroute` descobre os roteadores do caminho?
> 4. A resposta do servidor precisa seguir o mesmo caminho que o pedido?
>
> **Gabarito**
>
> 1. Nenhuma. Origem e destino viajam intactos.
> 2. Não faz NAT: encaminha o pacote sem trocar o endereço de origem.
> 3. Enviando pacotes com Hop Limit crescente e lendo as mensagens ICMPv6 de "tempo excedido" que cada roteador devolve.
> 4. Não. Cada roteador decide por conta própria; os caminhos de ida e volta podem ser diferentes.

> **O que você precisa lembrar**
>
> Um pacote sai do dispositivo para o gateway, atravessa roteadores que decidem salto a salto, e chega com os endereços originais. Não há NAT. O Hop Limit diminui em cada roteador e é o que o traceroute usa para mapear o caminho.

---

## 6.3 Rotas

Você já sabe o que é uma tabela de rotas. Esta seção mostra de onde as rotas vêm, como ler a tabela nos sistemas que você usa, e quando faz sentido criar uma à mão.

### De onde vêm as rotas

Uma entrada da tabela pode ter três origens:

**Conectada.** Criada automaticamente quando a interface recebe um endereço. Se você tem `2001:db8:1:2::10/64` em eth0, o sistema cria sozinho a rota `2001:db8:1:2::/64 dev eth0`: "esse prefixo está diretamente conectado, fale direto". Também é assim com `fe80::/64`.

**Aprendida por RA.** A rota padrão do seu dispositivo vem do Router Advertisement, como você viu na seção 5.4. O RA pode ainda anunciar rotas para prefixos específicos (opção Route Information, RFC 4191), útil quando há mais de um roteador na rede e cada um leva a lugares diferentes.

**Estática.** Configurada manualmente por um administrador. Usada em roteadores pequenos, em enlaces simples, e para casos em que se quer forçar um caminho.

**Dinâmica.** Aprendida de outros roteadores por um protocolo de roteamento. É o que os roteadores de provedores e de grandes redes usam, e é o assunto da próxima seção.

### Lendo a tabela

No Linux, `ip -6 route show`:

`2804:14d:5e00:3f02::/64 dev wlan0 proto kernel metric 600 pref medium`
`fe80::/64 dev wlan0 proto kernel metric 600 pref medium`
`default via fe80::a2b3:c4ff:fed5:e6f7 dev wlan0 proto ra metric 600 pref medium`

Campo a campo: o **prefixo de destino** (ou `default`); `via` e o **próximo salto**, quando não é entrega direta; `dev` e a **interface**; `proto`, a **origem** da rota (`kernel` para conectada, `ra` para Router Advertisement, `static` para manual, `bgp` ou `ospf` para dinâmica); `metric`, a **prioridade** entre rotas iguais (menor ganha).

No Windows, `route print -6` mostra uma tabela com colunas "Prefixo de Rede", "Gateway" e "Métrica"; a rota padrão aparece como `::/0`.

### Quando criar uma rota estática

Em um dispositivo comum, nunca: o RA cuida de tudo. Em roteadores, nos casos em que há uma rede atrás de outro roteador e nenhum protocolo dinâmico está rodando.

> **Exemplo**
>
> Uma empresa tem dois roteadores: o principal (R1), que dá para a Internet, e um secundário (R2), que atende a rede da filial `2001:db8:cafe:2::/64`. R1 e R2 se falam pelo enlace `2001:db8:cafe:ff::/64`, onde R2 tem o endereço `2001:db8:cafe:ff::2`.
> R1 precisa saber que a filial fica atrás de R2. Em R1, rota estática:
> `ip -6 route add 2001:db8:cafe:2::/64 via 2001:db8:cafe:ff::2`
> R2 precisa saber que "todo o resto" fica atrás de R1. Em R2, rota padrão estática:
> `ip -6 route add default via 2001:db8:cafe:ff::1`
> Com duas linhas, as duas redes se comunicam. Com dez roteadores, esse método vira insustentável, e é aí que entram os protocolos dinâmicos.

> **Atenção**
>
> Uma rota estática com próximo salto **link-local** exige a interface: `via fe80::1 dev eth0`. Uma com próximo salto **global**, como no exemplo acima, não exige, porque o sistema descobre a interface pela rota conectada. Esquecer o `dev` num link-local é um erro clássico.

> **Vamos praticar**
>
> 1. Cite as quatro origens possíveis de uma rota.
> 2. Na linha `default via fe80::1 dev eth0 proto ra metric 1024`, o que cada campo significa?
> 3. Um dispositivo de usuário precisa de rotas estáticas? Por quê?
> 4. Escreva o comando Linux que cria uma rota para `2001:db8:9::/48` via `2001:db8:ff::9`.
>
> **Gabarito**
>
> 1. Conectada, aprendida por RA, estática e dinâmica.
> 2. Rota padrão; próximo salto `fe80::1`; interface `eth0`; aprendida por Router Advertisement; prioridade 1024.
> 3. Não. A rota conectada e a rota padrão via RA cobrem tudo.
> 4. `ip -6 route add 2001:db8:9::/48 via 2001:db8:ff::9`

> **O que você precisa lembrar**
>
> Rotas são conectadas (automáticas), aprendidas por RA, estáticas ou dinâmicas. Na tabela, leia destino, próximo salto, interface e origem. Um dispositivo comum não precisa de rota manual; roteadores pequenos usam estáticas; redes grandes usam protocolos dinâmicos.

---

## 6.4 Conceitos relacionados ao roteamento IPv6

Esta seção é uma visão panorâmica. Ela não ensina a configurar protocolos de roteamento (isso é assunto para outro curso), mas apresenta os nomes que você vai encontrar e explica o que cada um faz, para que nada soe estranho.

### Protocolos de roteamento dinâmico

Quando há muitos roteadores, ninguém mantém rotas estáticas: os roteadores conversam entre si e aprendem as rotas uns dos outros. Isso é feito por **protocolos de roteamento**. Todos os protocolos importantes do IPv4 ganharam versões para IPv6:

| Protocolo | Onde é usado | Versão IPv6 |
|---|---|---|
| **OSPF** | Dentro de uma organização (campus, provedor) | OSPFv3 (RFC 5340) |
| **IS-IS** | Dentro de grandes provedores | IS-IS com suporte a IPv6 (mesmo protocolo, extensões) |
| **RIP** | Redes pequenas, hoje raro | RIPng (RFC 2080) |
| **BGP** | Entre organizações, na Internet inteira | BGP com MP-BGP (RFC 4760), o mesmo protocolo carregando prefixos IPv6 |

Os protocolos internos (OSPF, IS-IS, RIP) descobrem o melhor caminho dentro de uma rede que uma só organização controla. O BGP é o protocolo da Internet: é por ele que cada provedor anuncia aos outros "os prefixos tais são meus, mande para cá". A tabela BGP global de IPv6 tem, hoje, mais de 200 mil prefixos.

> **Você sabia?**
>
> No IPv6, os protocolos de roteamento conversam entre si usando **endereços link-local**. Dois roteadores vizinhos trocam mensagens OSPFv3 ou BGP pelos seus `fe80::`, e as rotas aprendidas apontam para o link-local do vizinho como próximo salto. É mais uma razão de o link-local ser tão importante: sem ele, o roteamento dinâmico não funcionaria.

### Agregação de rotas

O IPv6 foi projetado para que os prefixos sejam **hierárquicos**: o registro regional entrega um bloco grande ao provedor, o provedor entrega blocos menores aos clientes, o cliente divide em redes. Isso permite que, na Internet, o provedor anuncie **um único prefixo** (`2804:14d::/32`) em vez de anunciar cada rede de cada cliente. O resto do mundo só precisa saber "`2804:14d::/32` é daquele provedor"; o detalhe fica dentro dele.

Isso se chama **agregação**, e é o que mantém as tabelas de roteamento globais em tamanho administrável. No IPv4, décadas de remendos e trocas de blocos fragmentaram o espaço, e a tabela global tem quase um milhão de prefixos. No IPv6, a hierarquia foi desenhada desde o início.

### Roteamento e o cabeçalho IPv6

Algumas características do cabeçalho (seção 2.4) existem para facilitar o roteamento:

- **Tamanho fixo de 40 bytes:** o roteador sabe exatamente onde está cada campo, sem calcular.
- **Sem checksum:** o roteador não precisa recalcular nada ao diminuir o Hop Limit.
- **Sem fragmentação em trânsito:** o roteador nunca precisa cortar um pacote; se ele for grande demais, devolve um erro ICMPv6 "pacote grande demais" com o tamanho máximo do caminho, e a origem se ajusta. Isso se chama **Path MTU Discovery** e é obrigatório no IPv6.
- **Rótulo de fluxo (flow label):** um campo que identifica pacotes de uma mesma conexão, permitindo que roteadores os tratem em conjunto sem olhar as camadas de cima.

> **Atenção**
>
> O Path MTU Discovery depende de o erro ICMPv6 "pacote grande demais" (tipo 2) chegar à origem. Um firewall que bloqueia esse tipo de mensagem faz conexões IPv6 "travarem" em transferências grandes enquanto pings e páginas pequenas funcionam. É um dos problemas mais difíceis de diagnosticar em IPv6, e mais uma razão para nunca bloquear ICMPv6 indiscriminadamente.

> **Vamos praticar**
>
> 1. Qual é a diferença entre um protocolo de roteamento interno (como OSPFv3) e o BGP?
> 2. O que é agregação de rotas e por que ela importa?
> 3. Por que os roteadores IPv6 não fragmentam pacotes, e o que acontece quando um pacote é grande demais?
> 4. Que endereços os roteadores usam para conversar entre si em OSPFv3 e BGP?
>
> **Gabarito**
>
> 1. O interno descobre caminhos dentro de uma organização; o BGP troca prefixos entre organizações, na Internet inteira.
> 2. Anunciar um prefixo grande em vez de muitos pequenos, graças à hierarquia de alocação; mantém as tabelas globais pequenas.
> 3. Porque o protocolo proíbe fragmentação em trânsito; o roteador devolve um erro ICMPv6 com o tamanho máximo e a origem reenvia pacotes menores (Path MTU Discovery).
> 4. Endereços link-local.

> **O que você precisa lembrar**
>
> OSPFv3, IS-IS e RIPng roteiam dentro de organizações; BGP roteia entre elas. Os roteadores conversam por link-local. A hierarquia de prefixos permite agregação, que mantém as tabelas pequenas. O cabeçalho fixo, a ausência de checksum e a fragmentação só na origem (com Path MTU Discovery) tornam o roteamento mais simples.

---

## 6.5 Convivendo com o IPv4: pilha dupla, túneis e NAT64

O IPv6 não substituiu o IPv4 de um dia para o outro, e a seção 2.2 explicou por quê. O resultado é uma Internet em que os dois protocolos coexistem, e um conjunto de **mecanismos de transição** que permitem que isso funcione. Você já usa pelo menos um deles.

> **Conceito-chave**
>
> Um dispositivo só IPv6 **não consegue** falar diretamente com um só IPv4, e vice-versa: são protocolos diferentes. Os **mecanismos de transição** resolvem isso de três formas: rodando os dois ao mesmo tempo (**pilha dupla**), carregando um dentro do outro (**túneis**) ou traduzindo um no outro (**tradução**).

### Pilha dupla (dual stack)

O dispositivo tem endereço IPv4 e endereço IPv6, e usa um ou outro conforme o destino: se o nome tem AAAA, vai por IPv6; se só tem A, vai por IPv4. É o mecanismo mais simples e o mais comum. Seu notebook, seu celular e seu roteador de casa provavelmente estão em pilha dupla agora.

| Vantagens | Desvantagens |
|---|---|
| Simples: nada a traduzir ou encapsular | Precisa de endereços IPv4, que acabaram |
| Cada protocolo funciona nativamente | Duas configurações, dois firewalls, dois diagnósticos |
| Transição gradual, serviço a serviço | Não reduz o consumo de IPv4 |

A pilha dupla é a ponte, não o destino: ela só adia o problema do IPv4. Provedores que não têm IPv4 suficiente combinam pilha dupla nos clientes com CGNAT no IPv4 (seção 1.6), o que degrada o IPv4 mas mantém o IPv6 nativo e limpo.

### Túneis

Um túnel encapsula pacotes de um protocolo dentro de pacotes do outro, para atravessar um trecho da rede que só fala um deles. Os mais conhecidos carregam IPv6 dentro de IPv4, para dar IPv6 a quem só tem IPv4 do provedor.

- **6in4 / túneis manuais:** configurados à mão entre dois pontos. Usados por entusiastas e empresas antes de o provedor oferecer IPv6 nativo (serviços como o Hurricane Electric Tunnel Broker).
- **6to4 (2002::/16) e Teredo:** túneis automáticos, hoje **obsoletos**; se aparecerem, é sinal de configuração antiga que deve ser removida.
- **6rd:** túnel automático operado pelo próprio provedor, usado por algumas operadoras como etapa intermediária.
- **DS-Lite e MAP:** o contrário: carregam IPv4 dentro de IPv6, para provedores cuja rede interna já é só IPv6 e que precisam levar IPv4 aos clientes. É o cenário para onde os grandes provedores caminham.

> **Atenção**
>
> Túneis IPv6 sobre IPv4 acrescentam cabeçalhos e reduzem o tamanho útil do pacote, o que provoca problemas de MTU e latência. Se o seu provedor oferece IPv6 nativo, use-o; túneis são a solução para quando não há nativo, não uma alternativa a ele.

### Tradução: NAT64 e DNS64

O terceiro mecanismo permite que uma rede **só IPv6** acesse servidores **só IPv4**. Funciona em dupla:

**DNS64.** Quando o dispositivo pergunta pelo AAAA de um site que só tem A, o servidor DNS64 "inventa" um AAAA, colocando o endereço IPv4 dentro de um prefixo especial, normalmente `64:ff9b::/96`. O site `192.0.2.1` vira `64:ff9b::192.0.2.1` (ou `64:ff9b::c000:201` em hexadecimal).

**NAT64.** O dispositivo manda o pacote IPv6 para esse endereço. Um roteador NAT64 no caminho reconhece o prefixo, extrai o IPv4 de dentro dele, traduz o pacote para IPv4 e o envia. A resposta faz o caminho inverso.

> **Exemplo**
>
> Um celular numa rede de operadora só IPv6 abre um site antigo, só IPv4, em `203.0.113.5`.
>
> 1. O celular pede o AAAA de `sitantigo.exemplo`. O DNS64 da operadora vê que só existe A e responde `64:ff9b::203.0.113.5`.
> 2. O celular manda o pacote IPv6 para `64:ff9b::203.0.113.5`.
> 3. O NAT64 da operadora traduz para um pacote IPv4 com destino `203.0.113.5`, usando um endereço IPv4 público da operadora como origem.
> 4. O site responde em IPv4; o NAT64 traduz de volta para IPv6 e entrega ao celular.
> O celular nunca teve endereço IPv4 e nunca soube que o site era IPv4.

É assim que as grandes operadoras de celular já operam: rede só IPv6 por dentro, NAT64 na borda para o que ainda não migrou. Reduz o consumo de IPv4 a um punhado de endereços na borda.

> **Você sabia?**
>
> Alguns aplicativos antigos quebram em redes só IPv6 com NAT64 porque usam endereços IPv4 escritos diretamente no código, sem passar pelo DNS. Por isso a Apple exige, desde 2016, que todo aplicativo da App Store funcione em redes só IPv6 com NAT64, e oferece no macOS um modo de teste para isso. Foi uma das medidas que mais acelerou a adaptação de aplicativos ao IPv6.

### Qual mecanismo é qual

| Situação | Mecanismo |
|---|---|
| Tenho IPv4 e IPv6 do provedor | Pilha dupla (o normal em casa hoje) |
| Só tenho IPv4 do provedor e quero IPv6 | Túnel 6in4 ou 6rd (ou trocar de provedor) |
| Rede só IPv6 precisando acessar sites só IPv4 | NAT64 + DNS64 (o normal em operadoras de celular) |
| Provedor com rede interna só IPv6 levando IPv4 ao cliente | DS-Lite ou MAP |

> **Vamos praticar**
>
> 1. Cite os três tipos de mecanismo de transição e um exemplo de cada.
> 2. Por que a pilha dupla não resolve o esgotamento do IPv4?
> 3. O que o DNS64 faz quando um site só tem registro A?
> 4. Um aplicativo funciona em pilha dupla e falha numa rede só IPv6 com NAT64. Qual é a causa provável?
> 5. Verdadeiro ou falso: 6to4 e Teredo são boas opções para ter IPv6 em casa hoje.
>
> **Gabarito**
>
> 1. Pilha dupla (dual stack); túneis (6in4, 6rd, DS-Lite); tradução (NAT64/DNS64).
> 2. Porque cada dispositivo continua precisando de um endereço IPv4.
> 3. Sintetiza um AAAA colocando o IPv4 dentro do prefixo `64:ff9b::/96`.
> 4. O aplicativo usa endereços IPv4 fixos no código, sem consultar o DNS, e por isso não passa pelo DNS64.
> 5. Falso. Ambos estão obsoletos; use IPv6 nativo ou, na falta dele, um túnel 6in4.

> **O que você precisa lembrar**
>
> IPv4 e IPv6 não se falam diretamente. Pilha dupla roda os dois (o normal em casa); túneis carregam um dentro do outro (6in4, 6rd, DS-Lite); NAT64 com DNS64 traduz para redes só IPv6 (o normal em celulares). 6to4 e Teredo são obsoletos. Pilha dupla é ponte, não destino.

---

## 6.6 Próximos passos: o Laboratório de IPv6 do NIC.br

Você chegou ao fim do manual. Sabe o que é o IPv6, por que existe, lê e escreve endereços, interpreta prefixos, entende como um dispositivo se configura sozinho, confere a própria rede e reconhece os mecanismos que fazem IPv4 e IPv6 conviverem. O que falta é **praticar em uma rede de verdade**, e para isso este manual, de propósito, não tentou substituir o que já existe.

### O Laboratório de IPv6

O NIC.br, por meio do projeto IPv6.br, publica gratuitamente o livro **Laboratório de IPv6: aprenda na prática usando um emulador de redes** (Novatec, 2015), disponível em **lab.ipv6.br** sob licença Creative Commons. Ele vem com uma máquina virtual pronta, contendo o emulador de redes CORE, em que você monta topologias com vários roteadores e computadores e observa o IPv6 funcionando pacote a pacote, com Wireshark e tcpdump.

As experiências do Laboratório correspondem diretamente às partes deste manual:

| Este manual | Experiência do Laboratório | O que você vai ver |
|---|---|---|
| 5.1 NDP | 1.1 a 1.4 | Neighbor Solicitation e Advertisement, RS e RA capturados |
| 5.2 SLAAC | 1.5 e 1.6 | Um host ganhando endereço a partir do RA, com DAD |
| 5.3 DHCPv6 | 1.7 a 1.9 | DHCPv6 stateful, stateless e delegação de prefixo |
| 6.4 Path MTU | 1.10 e 1.11 | Pacotes grandes demais e a mensagem ICMPv6 de ajuste |
| 5.5 DNS | 2.1 | Servidor DNS com registros AAAA |
| 6.5 Transição | 4.3, 4.6, 4.7 | Pilha dupla, NAT64 e DNS64 em funcionamento |
| 6.4 Roteamento | 5.1 a 5.4 | OSPFv3 e BGP entre roteadores emulados |

O Laboratório assume que você já sabe o que é um prefixo, um RA, um link-local. Você sabe. Comece pela experiência 1.1 e siga a ordem.

### Outros caminhos

- **Curso e-learning IPv6 básico do NIC.br**, gratuito, em ipv6.br. Cobre parte do que está aqui em vídeo e tem certificado.
- **test-ipv6.com** para conferir a sua conexão, e **ipv6.br** para acompanhar a adoção no Brasil.
- **As RFCs.** Depois deste manual, a RFC 4291 (endereçamento) e a RFC 4861 (Neighbor Discovery) são legíveis. A RFC 8200 é a definição do protocolo. Todas em datatracker.ietf.org.
- **Segurança em IPv6**, que este manual deixou fora do escopo: o capítulo 3 do Laboratório e o capítulo 6 do livro de Samuel Brito são os pontos de partida.

### Uma última palavra

Na abertura, este manual prometeu que o IPv6 não é o bicho de sete cabeças que parece. Se você chegou até aqui e consegue olhar para `2804:14d:5e00:3f02:a8f1:3c9d:7e02:b641/64` e dizer que é um endereço global, numa rede /64 do bloco /56 `2804:14d:5e00:3f00::/56`, com identificador aleatório de privacidade, montado por SLAAC a partir de um RA que veio do link-local do roteador, então a promessa foi cumprida. Cada uma dessas palavras assustava no começo. Agora são só o que são.

> **O que você precisa lembrar**
>
> Para praticar, o Laboratório de IPv6 do NIC.br (lab.ipv6.br) tem experiências para cada parte deste manual; comece pela 1.1. O curso e-learning do IPv6.br, o test-ipv6.com e as RFCs 4291, 4861 e 8200 são os próximos passos. Segurança fica para depois, no capítulo 3 do Laboratório.
