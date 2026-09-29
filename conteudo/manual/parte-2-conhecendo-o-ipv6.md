## Antes de começar

Na Parte 1 você viu o que é uma rede, como os pacotes viajam, o que é um endereço IP e por que os endereços IPv4 acabaram. Agora você vai conhecer a resposta a esse problema. Esta parte é conceitual: ela apresenta o IPv6, conta de onde ele veio e mostra o que muda em relação ao IPv4. A leitura de endereços fica para a Parte 3.

---

## 2.1 O que é IPv6?

IPv6 é a sexta versão do protocolo IP, o protocolo que endereça e encaminha pacotes na Internet. Ele faz exatamente o mesmo trabalho que o IPv4: coloca um endereço de origem e um de destino em cada pacote e permite que os roteadores encaminhem esse pacote até chegar lá. A diferença mais visível é o tamanho do endereço.

> **Conceito-chave**
>
> O **IPv6** (Internet Protocol version 6) é a versão atual do protocolo IP. Seus endereços têm **128 bits**, quatro vezes o tamanho dos 32 bits do IPv4.

### Não é "IPv4 maior"

Seria natural imaginar que o IPv6 é só o IPv4 com endereços mais compridos. Não é. Quando a comunidade técnica decidiu criar uma nova versão, aproveitou para redesenhar o protocolo com base em vinte anos de experiência com o IPv4. O cabeçalho do pacote ficou mais simples, a configuração passou a ser automática, o NAT deixou de ser necessário e algumas funções que no IPv4 eram remendos viraram parte do protocolo. Você vai ver cada uma dessas mudanças na seção 2.3.

### Quantos endereços cabem em 128 bits

Com 32 bits o IPv4 tem cerca de 4,3 bilhões de endereços. Com 128 bits, o IPv6 tem 2^128 endereços, que é aproximadamente 340 undecilhões. Escrito por extenso: 340.282.366.920.938.463.463.374.607.431.768.211.456.

Números desse tamanho não significam nada sozinhos, então vale uma comparação. Se você dividisse todos os endereços IPv6 igualmente entre cada milímetro quadrado da superfície da Terra, incluindo os oceanos, cada milímetro quadrado receberia mais de 600 quatrilhões de endereços. Ou, de outro jeito: dá para dar a cada pessoa do planeta mais endereços do que o IPv4 inteiro tem, bilhões de vezes.

> **Você sabia?**
>
> O tamanho do espaço de endereços não foi escolhido para "dar a cada dispositivo um endereço". Foi escolhido para que ninguém precise economizar. No IPv6, uma única rede doméstica recebe um bloco de 18 quintilhões de endereços (um /64, que você vai entender na Parte 4), e isso é considerado normal. A ideia é que endereço nunca mais seja um recurso escasso.

### Por que 128 e não 64

Durante o projeto do IPv6, 64 bits foram considerados e teriam sido mais do que suficientes para numerar dispositivos. A escolha por 128 teve outro motivo: permitir que o endereço fosse dividido em duas metades, uma para identificar a rede e outra para o dispositivo dentro dela. Com 64 bits para a rede, é possível organizar a Internet inteira de forma hierárquica sem apertar nada; com 64 bits para o dispositivo, ele pode gerar o próprio endereço sem consultar ninguém. Essa divisão é a base da autoconfiguração, que você vai conhecer na Parte 5.

> **Vamos praticar**
>
> 1. Quantos bits tem um endereço IPv6? Quantas vezes o tamanho do IPv4?
> 2. Verdadeiro ou falso: o IPv6 é o IPv4 com endereços mais longos e nada mais.
> 3. Por que o espaço de endereços do IPv6 é tão maior do que o necessário para numerar todos os dispositivos do mundo?
>
> **Gabarito**
>
> 1. 128 bits, quatro vezes os 32 bits do IPv4.
> 2. Falso. O protocolo foi redesenhado: cabeçalho, configuração automática, ausência de NAT e outras mudanças.
> 3. Para que endereço nunca mais seja escasso e para permitir dividir o endereço em duas metades de 64 bits, uma para a rede e outra para o dispositivo.

> **O que você precisa lembrar**
>
> IPv6 é a versão atual do protocolo IP, com endereços de 128 bits. Não é só um IPv4 maior: é um protocolo redesenhado. O espaço de endereços é tão grande que economizar deixa de fazer sentido, e os 128 bits foram escolhidos para permitir a divisão em duas metades de 64.

---

## 2.2 Por que o IPv6 surgiu?

A seção 1.6 contou o problema: os endereços IPv4 estavam acabando desde os anos 1990 e os remendos só adiavam o fim. Esta seção conta a resposta: quem decidiu criar um novo protocolo, quando, e por que ele demorou tanto para ser adotado.

### Uma linha do tempo

- **1981.** O IPv4 é definido na RFC 791.
- **1992 a 1994.** A IETF, organização que define os padrões da Internet, percebe que os endereços vão acabar e abre um processo para escolher a "próxima geração do IP", chamada IPng.
- **1995.** A primeira especificação do IPv6 é publicada, na RFC 1883.
- **1998.** A especificação é revisada na RFC 2460, que por quase vinte anos foi o documento de referência.
- **2011.** O estoque central de endereços IPv4 (IANA) acaba. Em 8 de junho acontece o "World IPv6 Day", um teste global de um dia com IPv6 ligado nos grandes sites.
- **2012.** Em 6 de junho, o "World IPv6 Launch": Google, Facebook, Yahoo e grandes provedores ligam o IPv6 em definitivo.
- **2017.** A RFC 8200 consolida o IPv6 como padrão da Internet, no mesmo nível formal do IPv4.
- **2020.** O LACNIC, registro da América Latina, esgota seu estoque de IPv4.
- **2026.** Pela primeira vez, mais da metade dos acessos ao Google no mundo chega por IPv6.

> **Você sabia?**
>
> Não existe IPv5. O número 5 já tinha sido usado por um protocolo experimental para transmissão de áudio e vídeo em tempo real, o ST-II, que nunca virou padrão. Por isso a nova versão do IP pulou direto para o 6.

### Por que demorou tanto

O IPv6 foi definido em 1995 e, trinta anos depois, ainda convive com o IPv4. Isso costuma surpreender quem começa a estudar. Há três razões principais.

**O IPv4 nunca "quebrou".** Com NAT, DHCP e CIDR, a Internet continuou funcionando. Ninguém acordou sem conexão. Sem crise visível, a troca ficou sempre para depois.

**Os dois protocolos não conversam.** Um dispositivo só IPv6 não consegue falar com um servidor só IPv4, e vice-versa. Ninguém quer migrar primeiro se o resto do mundo ainda está no protocolo antigo. Isso obrigou todo mundo a rodar os dois ao mesmo tempo, o que custa dinheiro e exige gente treinada.

**Curva de aprendizado.** Profissionais formados com IPv4 precisam reaprender endereçamento, configuração e diagnóstico. Materiais em português eram escassos. Este manual existe, em parte, por causa disso.

> **Atenção**
>
> "Demorou" não significa "não aconteceu". Hoje o IPv6 é o protocolo dominante em redes de celular, em grandes serviços como Google, YouTube, Netflix e Meta, e na maior parte dos provedores brasileiros de grande porte. Se você usa Internet no celular no Brasil, é provável que esteja usando IPv6 agora, sem saber.

### Situação atual

Os números mudam todo mês, mas a tendência é clara. Segundo a medição do Google, em abril de 2026 mais de 50% dos acessos ao serviço no mundo chegaram por IPv6. No Brasil o índice fica na faixa de 45% a 47%, acima da média mundial em alguns períodos. A adoção é puxada pelas grandes operadoras de celular e banda larga; os provedores regionais menores ainda estão atrasados, e é neles que boa parte do trabalho de implantação dos próximos anos vai acontecer.

Você pode conferir os dados atualizados em google.com/ipv6 e em ipv6.br, o portal do NIC.br sobre o assunto.

> **Vamos praticar**
>
> 1. Em que ano saiu a primeira especificação do IPv6? E a atual?
> 2. Cite dois motivos para a adoção lenta do IPv6.
> 3. O que aconteceu em 6 de junho de 2012?
> 4. Por que não existe IPv5?
>
> **Gabarito**
>
> 1. 1995 (RFC 1883); a atual é a RFC 8200, de 2017.
> 2. O IPv4 continuou funcionando com remendos; os dois protocolos não conversam entre si, o que obriga a rodar ambos; falta de profissionais treinados.
> 3. O World IPv6 Launch: grandes sites e provedores ligaram o IPv6 em definitivo.
> 4. O número 5 já tinha sido usado por um protocolo experimental (ST-II).

> **O que você precisa lembrar**
>
> O IPv6 foi criado pela IETF nos anos 1990 para resolver o esgotamento do IPv4; a especificação atual é a RFC 8200, de 2017. A adoção foi lenta porque o IPv4 nunca parou de funcionar e porque os dois protocolos não se comunicam diretamente. Hoje mais da metade do tráfego dos grandes serviços já é IPv6, e o Brasil está próximo da metade dos usuários.

---

## 2.3 Diferenças entre IPv4 e IPv6

Agora que você sabe o que o IPv6 é e por que existe, vamos colocar os dois protocolos lado a lado. Esta seção resume as diferenças; cada uma será aprofundada nas partes seguintes.

### A tabela

| Característica | IPv4 | IPv6 |
|---|---|---|
| Tamanho do endereço | 32 bits | 128 bits |
| Como se escreve | 4 números decimais separados por ponto: 192.168.0.1 | 8 grupos hexadecimais separados por dois-pontos: 2001:db8::1 |
| Quantidade de endereços | cerca de 4,3 bilhões | cerca de 340 undecilhões |
| Endereço privado + NAT | regra em quase toda rede | desnecessário: todo dispositivo pode ter endereço público |
| Configuração automática | precisa de um servidor DHCP | o próprio dispositivo se configura (SLAAC), DHCPv6 é opcional |
| Broadcast | existe | não existe; usa multicast |
| Cabeçalho do pacote | 20 bytes, tamanho variável, com checksum | 40 bytes, tamanho fixo, sem checksum |
| Fragmentação | roteadores podem fragmentar no caminho | só a origem fragmenta |
| Endereços por interface | normalmente um | vários (link-local, global, temporário) |

### O que cada diferença significa

**Endereço.** A mudança mais óbvia. O endereço fica quatro vezes maior e passa a ser escrito em hexadecimal, o que assusta no início mas tem lógica, como você verá na Parte 3.

**NAT.** No IPv4, o NAT existe porque não há endereços públicos para todos. No IPv6 há endereços para todos, então o NAT deixa de ter motivo. Cada dispositivo pode ter um endereço público próprio, e a comunicação volta a ser direta, de ponta a ponta.

**Configuração.** No IPv4, um dispositivo novo precisa que alguém (um servidor DHCP ou uma pessoa) lhe dê um endereço. No IPv6, ele ouve o roteador anunciar o prefixo da rede e monta o próprio endereço. Isso se chama autoconfiguração, e o DHCPv6 passa a ser uma opção, não uma exigência.

**Broadcast.** No IPv4, várias operações consistem em "gritar para todo mundo na rede" (broadcast), o que obriga todos os dispositivos a processar a mensagem mesmo quando ela não é para eles. O IPv6 substitui isso por multicast: a mensagem vai só para o grupo interessado. A seção 2.5 explica.

**Cabeçalho.** O cabeçalho é a parte de controle do pacote (lembre da seção 1.2). No IPv4 ele tem tamanho variável e campos que quase nunca são usados. No IPv6 ele tem sempre 40 bytes, com menos campos, e o roteador processa mais rápido. O checksum (uma verificação de erro) foi removido do IP porque as camadas de cima e de baixo já fazem essa verificação.

**Fragmentação.** Quando um pacote é grande demais para um trecho do caminho, no IPv4 o roteador pode cortá-lo em pedaços. No IPv6 isso é proibido: só quem enviou pode fragmentar, e para isso ele descobre antes qual é o tamanho máximo do caminho. Menos trabalho para os roteadores.

> **Exemplo**
>
> Um notebook ligado ao Wi-Fi de casa, com pilha dupla (IPv4 e IPv6).
> No IPv4 ele tem um endereço só, `192.168.0.15`, privado, dado pelo roteador via DHCP, e sai para a Internet traduzido pelo NAT.
> No IPv6 ele tem pelo menos dois: um `fe80::...` (link-local, criado sozinho) e um `2804:...` (global, montado a partir do prefixo que o roteador anunciou), e sai para a Internet com o próprio endereço, sem tradução.

> **Atenção**
>
> Um erro comum é achar que o IPv6 "substitui" o IPv4 e que uma rede migra de um para o outro. Na prática as redes rodam os dois ao mesmo tempo (pilha dupla) e vão rodar assim por muitos anos. A Parte 6 explica como essa convivência funciona.

> **Vamos praticar**
>
> 1. Qual é o tamanho do cabeçalho IPv6? Ele é fixo ou variável?
> 2. Por que o NAT é desnecessário no IPv6?
> 3. Quem pode fragmentar um pacote no IPv6?
> 4. Um dispositivo IPv6 costuma ter quantos endereços? Cite dois.
>
> **Gabarito**
>
> 1. 40 bytes, fixo.
> 2. Porque há endereços públicos suficientes para todos os dispositivos.
> 3. Só a origem do pacote; os roteadores do caminho não fragmentam.
> 4. Vários. Pelo menos um link-local (fe80::) e um global.

> **O que você precisa lembrar**
>
> O IPv6 muda o tamanho e a notação do endereço, elimina a necessidade de NAT, configura o dispositivo automaticamente, troca broadcast por multicast, simplifica o cabeçalho para 40 bytes fixos e proíbe fragmentação no caminho. Um dispositivo IPv6 tem vários endereços ao mesmo tempo, e as redes rodam IPv4 e IPv6 juntos.

---

## 2.4 Principais características do IPv6

A seção anterior mostrou as diferenças ponto a ponto. Esta organiza as quatro características que definem o IPv6 e que você vai reencontrar ao longo de todo o manual.

### 1. Espaço de endereçamento abundante

Já vimos os números. O que importa entender é a consequência: **no IPv6 não se economiza endereço**. Cada rede recebe um bloco enorme, cada dispositivo pode ter vários endereços, e o planejamento de uma rede deixa de ser "quantos endereços eu preciso" e passa a ser "como eu organizo meus blocos". A Parte 4 mostra como fazer isso.

### 2. Autoconfiguração

Um dispositivo IPv6 ligado a uma rede se configura sozinho, em segundos, sem servidor e sem intervenção humana:

1. Ele cria um endereço link-local a partir de um prefixo fixo (fe80::) e de um identificador próprio.
2. Ele pergunta à rede se existe um roteador (Router Solicitation).
3. O roteador responde anunciando o prefixo da rede (Router Advertisement).
4. O dispositivo junta o prefixo com seu identificador e forma o endereço global.
5. Antes de usar, ele confere que ninguém mais está usando aquele endereço.

Isso se chama **SLAAC** (Stateless Address Autoconfiguration). "Stateless" significa que ninguém guarda registro de quem tem qual endereço: não há servidor, não há tabela. A Parte 5 percorre cada passo desse processo com detalhe.

> **Conceito-chave**
>
> **Autoconfiguração (SLAAC)** é o mecanismo pelo qual um dispositivo IPv6 monta o próprio endereço a partir do prefixo anunciado pelo roteador, sem precisar de um servidor DHCP.

### 3. Comunicação fim a fim

O princípio original da Internet era que qualquer dispositivo pudesse falar diretamente com qualquer outro. O NAT quebrou esse princípio (seção 1.6). O IPv6 o restaura: cada dispositivo tem um endereço público único, e um pacote sai da origem e chega ao destino com os mesmos endereços que tinha ao sair, sem ser reescrito no caminho.

Na prática isso simplifica jogos online, chamadas de vídeo, câmeras, dispositivos de casa inteligente e qualquer aplicação em que alguém de fora precisa iniciar a conexão. Também simplifica o diagnóstico: o endereço que aparece no servidor é o endereço real do dispositivo.

> **Atenção**
>
> Endereço público não significa dispositivo exposto. Ter um endereço público em IPv6 é como ter um número de telefone: qualquer um pode discar, mas o seu roteador ou firewall decide se atende. Roteadores domésticos com IPv6 bloqueiam conexões vindas de fora por padrão, exatamente como fazem no IPv4. O que muda é que, quando você **quer** permitir uma conexão, não precisa de truques como redirecionamento de porta.

### 4. Cabeçalho simples e extensível

O cabeçalho fixo de 40 bytes carrega só o essencial: versão, classe de tráfego, rótulo de fluxo, tamanho do conteúdo, tipo do próximo cabeçalho, limite de saltos, origem e destino. Tudo o que é opcional (roteamento especial, fragmentação, segurança) vai em **cabeçalhos de extensão**, encadeados depois do cabeçalho principal e presentes só quando são necessários. Um roteador comum lê o cabeçalho principal e ignora o resto. Isso torna o processamento previsível e permite adicionar funções novas ao protocolo sem mudar o cabeçalho base.

> **Você sabia?**
>
> O campo que no IPv4 se chama TTL (Time To Live, "tempo de vida") no IPv6 se chama **Hop Limit** (limite de saltos). A função é a mesma: cada roteador que o pacote atravessa diminui o valor em 1, e quando chega a zero o pacote é descartado. Isso impede que um pacote perdido circule para sempre. O nome mudou porque nunca foi realmente um tempo, e sim uma contagem de saltos.

### Uma quinta, escondida: ICMPv6

Há uma característica que raramente aparece em listas mas sustenta as outras: no IPv6, o protocolo **ICMPv6** é indispensável. No IPv4, o ICMP serve principalmente para o `ping` e para mensagens de erro, e muita rede o bloqueia sem consequência. No IPv6, o ICMPv6 é o que faz a autoconfiguração e a descoberta de vizinhos funcionarem. Bloquear ICMPv6 quebra a rede. Você vai ver isso de perto na Parte 5.

> **Vamos praticar**
>
> 1. O que significa "stateless" em SLAAC?
> 2. Explique em uma frase o que é comunicação fim a fim.
> 3. Para que servem os cabeçalhos de extensão?
> 4. Verdadeiro ou falso: ter endereço público em IPv6 deixa o dispositivo automaticamente exposto à Internet.
> 5. Qual é o nome, no IPv6, do campo equivalente ao TTL?
>
> **Gabarito**
>
> 1. Que não há servidor nem tabela guardando quem tem qual endereço; o dispositivo monta o próprio.
> 2. O pacote sai da origem e chega ao destino com os mesmos endereços, sem tradução no caminho.
> 3. Carregar funções opcionais (roteamento especial, fragmentação, segurança) fora do cabeçalho principal, só quando necessárias.
> 4. Falso. O roteador ou firewall continua decidindo quais conexões entram; só deixa de ser preciso NAT para permitir uma.
> 5. Hop Limit.

> **O que você precisa lembrar**
>
> As quatro características centrais do IPv6 são: espaço de endereços abundante, autoconfiguração (SLAAC), comunicação fim a fim sem NAT e cabeçalho fixo de 40 bytes com extensões opcionais. Por trás delas está o ICMPv6, que no IPv6 é indispensável.

---

## 2.5 O fim do broadcast: unicast, multicast e anycast

Esta é a última seção conceitual antes de entrarmos nos endereços em si. Ela responde a uma pergunta que a seção 2.3 deixou aberta: se o IPv6 não tem broadcast, como os dispositivos "falam com todo mundo" quando precisam?

### O que era o broadcast

No IPv4, quando um dispositivo precisa encontrar alguém na rede local sem saber onde está (por exemplo, descobrir o endereço físico de outro dispositivo ou procurar um servidor DHCP), ele manda um pacote para o **endereço de broadcast**. Esse pacote é entregue a **todos** os dispositivos da rede, e cada um precisa parar, abrir o pacote e decidir se é para ele. Numa rede com quinhentos dispositivos, quinhentos param para ler uma mensagem que interessa a um.

O IPv6 elimina o broadcast e o substitui por algo mais preciso.

### Os três tipos de comunicação

> **Conceito-chave**
>
> No IPv6, um endereço de destino pode ser de três tipos:
>
> **Unicast**: identifica **uma** interface. O pacote é entregue a ela.
>
> **Multicast**: identifica um **grupo** de interfaces. O pacote é entregue a todas as que fizerem parte do grupo.
>
> **Anycast**: identifica um grupo, mas o pacote é entregue apenas à interface **mais próxima** do grupo.

**Unicast** é o caso comum: o seu notebook conversando com um servidor. Todos os endereços que você vai aprender a ler na Parte 3 (globais, link-local, unique local) são unicast.

**Multicast** substitui o broadcast. Em vez de "todo mundo", o pacote vai para "todos os que se inscreveram nesse grupo". Os dispositivos que não estão no grupo nem chegam a processar o pacote. Endereços multicast começam com `ff`. Dois grupos são usados o tempo todo:

- `ff02::1` significa "todos os dispositivos deste enlace". É o mais parecido com o antigo broadcast, mas só é usado quando realmente se quer falar com todos.
- `ff02::2` significa "todos os roteadores deste enlace". É para esse grupo que um dispositivo pergunta "existe um roteador aqui?" durante a autoconfiguração. Só os roteadores recebem; os outros dispositivos nem veem a mensagem.

**Anycast** é o menos intuitivo. Vários servidores em lugares diferentes compartilham o mesmo endereço, e cada pacote vai para o servidor mais próximo de quem enviou. É como se um serviço tivesse "filiais" com o mesmo endereço e a rede escolhesse automaticamente a mais perto. É usado, por exemplo, nos servidores raiz do DNS.

> **Exemplo**
>
> Você liga o notebook no Wi-Fi. Ele precisa descobrir se há um roteador na rede.
> No IPv4, ele faria broadcast: todos os dispositivos da rede receberiam a pergunta.
> No IPv6, ele manda a pergunta para `ff02::2`. Só os roteadores estão inscritos nesse grupo, então só eles recebem. A TV, os celulares e a impressora não são incomodados.

### Multicast e o endereço solicitado

Há um uso ainda mais engenhoso. Quando um dispositivo precisa descobrir o endereço físico de outro (o que no IPv4 era feito por broadcast com o ARP), o IPv6 calcula um grupo multicast especial a partir do endereço que está procurando, chamado **solicited-node multicast**. Só o dispositivo dono daquele endereço (e, por coincidência, pouquíssimos outros) está inscrito nesse grupo. Assim a "pergunta" chega quase exclusivamente a quem deve responder. A Parte 5 mostra isso funcionando.

> **Você sabia?**
>
> Um dispositivo IPv6 está sempre inscrito em vários grupos multicast ao mesmo tempo: `ff02::1` (todos os nós), o grupo solicited-node de cada um dos seus endereços, e outros conforme os serviços que usa. Você pode ver essa lista no Linux com `ip -6 maddr`.

> **Atenção**
>
> Endereços que começam com `ff` são sempre multicast e nunca aparecem como **origem** de um pacote; um pacote sempre parte de um endereço unicast. Se você vir `ff02::1` na origem de alguma coisa, algo está errado.

> **Vamos praticar**
>
> 1. Qual é o problema do broadcast que o IPv6 quis resolver?
> 2. Classifique: `ff02::1` é unicast, multicast ou anycast? E o endereço do seu notebook?
> 3. Para qual grupo um dispositivo pergunta se há roteador na rede?
> 4. Explique anycast em uma frase.
>
> **Gabarito**
>
> 1. Todos os dispositivos da rede precisam processar uma mensagem que interessa a poucos.
> 2. `ff02::1` é multicast (todos os nós). O endereço do notebook é unicast.
> 3. `ff02::2`, todos os roteadores do enlace.
> 4. Vários servidores compartilham um endereço e o pacote vai para o mais próximo de quem enviou.

> **O que você precisa lembrar**
>
> O IPv6 não tem broadcast. Ele usa unicast (um destino), multicast (um grupo, endereços que começam com ff) e anycast (o mais próximo de um grupo). Os grupos ff02::1 (todos os nós) e ff02::2 (todos os roteadores) são a base da autoconfiguração, e o grupo solicited-node permite descobrir vizinhos sem incomodar a rede inteira.
