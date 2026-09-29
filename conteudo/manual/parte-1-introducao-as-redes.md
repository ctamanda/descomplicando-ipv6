---
title: "Parte 1 · Introdução às redes"
subtitle: "Descomplicando o IPv6: Um Guia Interativo de Redes"
author: "Amanda Ribeiro da Costa"
date: "Manual de IPv6 · versão de trabalho"
lang: pt-BR
---

## Antes de começar

Esta parte não fala de IPv6. Ela existe porque, para entender o IPv6, você precisa de meia dúzia de ideias sobre redes que quase todo material técnico já assume que você sabe. Aqui elas são explicadas do zero. Se você já trabalha com redes, pode passar direto para a Parte 2; se está começando, leia com calma. Tudo o que vem depois se apoia nestas seis seções.

---

## 1.1 O que é uma rede?

Pense no seu celular. Ele manda uma mensagem, abre um vídeo, atualiza um aplicativo. Nada disso está dentro do aparelho: a mensagem vai para outro celular, o vídeo vem de um servidor em outra cidade, a atualização vem da empresa que fez o aplicativo. Para que isso aconteça, o celular precisa estar ligado a outros dispositivos de alguma forma. Esse "estar ligado a outros dispositivos" é uma rede.

> **Conceito-chave**
>
> Uma **rede de computadores** é um conjunto de dispositivos conectados entre si que conseguem trocar informação. Cada dispositivo ligado à rede é chamado de **host** ou **nó**.

Os dispositivos de uma rede podem ser computadores, celulares, tablets, impressoras, câmeras, televisões, relógios. Hoje quase tudo que tem uma tomada pode entrar em uma rede. Existem também dispositivos cuja única função é fazer a rede funcionar. O mais importante deles é o **roteador**: é ele que recebe a informação de um dispositivo e a encaminha na direção certa. O roteador de Wi-Fi da sua casa é um exemplo.

### Rede pequena, rede grande

A rede da sua casa é pequena: alguns celulares, um notebook, uma TV, todos ligados ao mesmo roteador. Esse tipo de rede se chama **rede local**, ou LAN (do inglês *Local Area Network*). A rede de uma escola, de uma empresa ou de um prédio também é uma rede local, só que maior.

Agora imagine ligar a rede da sua casa à rede do seu provedor de Internet, que por sua vez está ligada a redes de outros provedores, que estão ligadas a redes de empresas, universidades e governos no mundo inteiro. O resultado é a **Internet**: não uma rede única, mas uma **rede de redes**.

> **Você sabia?**
>
> A Internet não tem dono nem sede. Ela funciona porque milhares de redes independentes concordaram em conversar usando as mesmas regras. Essas regras são os **protocolos**, e o mais importante deles, o protocolo IP, é o assunto deste manual.

### Uma analogia que vai nos acompanhar

Ao longo do manual, vamos comparar a rede com o sistema de correios. Uma carta sai da sua casa, passa pela agência do bairro, por um centro de distribuição, por outra agência e chega ao destinatário. Ninguém no caminho precisa conhecer você nem o destinatário; basta ler o endereço no envelope. Redes funcionam de um jeito parecido, e o "endereço no envelope" é o que vamos estudar nas próximas seções.

> **Vamos praticar**
>
> 1. Liste cinco dispositivos que estão conectados à rede da sua casa neste momento.
> 2. Qual dispositivo da sua casa faz o papel de roteador? Como você sabe?
> 3. Na analogia dos correios, o que seria a Internet: a agência do bairro ou o sistema inteiro de agências e centros de distribuição?
>
> **Gabarito**
>
> 1. Resposta livre. Exemplos comuns: celular, notebook, smart TV, videogame, impressora, assistente de voz.
> 2. Normalmente o aparelho que gera o Wi-Fi. É ele que está ligado ao cabo do provedor e é por ele que todos os outros dispositivos se conectam.
> 3. O sistema inteiro. Uma agência sozinha seria uma rede local.

> **O que você precisa lembrar**
>
> Uma rede é um conjunto de dispositivos que trocam informação. A rede da sua casa é uma rede local. A Internet é uma rede de redes. O roteador é o dispositivo que encaminha a informação de uma rede para outra. Tudo isso só funciona porque todos seguem os mesmos protocolos.

---

## 1.2 Como os dispositivos se comunicam?

Você acabou de mandar uma foto pelo WhatsApp. O que aconteceu entre o momento em que você tocou em "enviar" e o momento em que o seu amigo viu a foto?

### A informação viaja em pedaços

A foto não viaja inteira. Ela é cortada em pedaços pequenos chamados **pacotes**. Cada pacote carrega um pedacinho da foto e algumas informações de controle, entre elas quem enviou e para quem vai. Do outro lado, os pacotes são juntados de novo na ordem certa e a foto aparece.

Por que cortar em pedaços? Por três motivos. Primeiro, porque os pacotes de várias pessoas podem compartilhar o mesmo cabo ao mesmo tempo, sem que ninguém precise esperar a foto de alguém terminar de passar. Segundo, porque se um pacote se perder, só ele precisa ser enviado de novo, e não a foto inteira. Terceiro, porque pacotes pequenos podem seguir caminhos diferentes e chegar por rotas distintas.

> **Conceito-chave**
>
> Um **pacote** é a unidade de informação que circula na rede. Ele tem um **cabeçalho**, com dados de controle (por exemplo, remetente e destinatário), e um **corpo**, com o conteúdo em si.

### O envelope precisa de endereço

Volte à analogia dos correios. Uma carta só chega se o envelope tiver o endereço do destinatário. E, se algo der errado, o correio precisa do endereço do remetente para devolvê-la. Com pacotes é igual: cada um carrega no cabeçalho o **endereço de origem** e o **endereço de destino**. Esses endereços são os endereços IP, que você vai conhecer na próxima seção.

### Quem lê o envelope

Dentro da sua casa, o celular e a TV estão na mesma rede local e conseguem trocar pacotes diretamente. Mas o servidor do WhatsApp não está na sua casa. Ele está em outra rede, provavelmente em outro país. Como o pacote chega lá?

É aqui que entra o roteador. Quando um dispositivo quer mandar um pacote para fora da rede local, ele entrega o pacote ao roteador. O roteador olha o endereço de destino e decide para qual outro roteador encaminhar. Esse roteador faz o mesmo, e o próximo também, até o pacote chegar à rede onde está o destino. Cada roteador pelo caminho só precisa saber uma coisa: "para esse destino, mando por aqui". Ninguém precisa conhecer o caminho inteiro.

> **Exemplo**
>
> Você toca em "enviar" na foto.
>
> 1. O aplicativo entrega a foto ao sistema do celular, que a corta em pacotes.
> 2. Cada pacote recebe o endereço do seu celular como origem e o endereço do servidor do WhatsApp como destino.
> 3. Os pacotes vão pelo Wi-Fi até o roteador da sua casa.
> 4. O roteador encaminha para o provedor; o provedor encaminha para outros roteadores, até o servidor.
> 5. O servidor junta os pacotes, guarda a foto e faz o caminho inverso até o celular do seu amigo.
> Tudo isso costuma levar menos de um segundo.

### Camadas: cada um cuida de uma coisa

Enviar uma foto envolve tarefas bem diferentes: transformar a foto em bits, garantir que nenhum pacote se perca, decidir o caminho, transmitir sinais pelo Wi-Fi ou pelo cabo. Para não misturar tudo, as redes são organizadas em **camadas**, e cada camada cuida de uma tarefa. Você não precisa decorar as camadas agora. Precisa saber só isto: o protocolo **IP** é a camada responsável por **endereçar** os pacotes e por **encaminhá-los** de rede em rede até o destino. Todo o resto (Wi-Fi, cabos, aplicativos) fica em outras camadas. Por isso dá para trocar o IPv4 pelo IPv6 sem trocar o WhatsApp nem o Wi-Fi.

> **Atenção**
>
> Em muitas casas o provedor instala um aparelho só, mas ele faz dois papéis: o de **modem**, que converte o sinal do provedor (fibra, cabo), e o de **roteador**, que distribui a rede internamente. São funções diferentes, e em algumas instalações são aparelhos separados. Quando este manual fala em "roteador", está falando da função de encaminhar pacotes.

> **Vamos praticar**
>
> 1. Por que a foto é dividida em pacotes em vez de ser enviada inteira? Cite dois motivos.
> 2. Quais são as duas informações de endereço que todo pacote carrega?
> 3. Um roteador no meio do caminho precisa conhecer o caminho inteiro até o destino? Justifique.
>
> **Gabarito**
>
> 1. Para compartilhar a rede entre vários usuários ao mesmo tempo; para reenviar só o que se perdeu; para permitir caminhos diferentes.
> 2. O endereço de origem e o endereço de destino.
> 3. Não. Ele só precisa saber para qual vizinho encaminhar cada destino. O próximo roteador toma a próxima decisão.

> **O que você precisa lembrar**
>
> A informação viaja em pacotes. Cada pacote carrega o endereço de origem e o de destino. Dentro da rede local, os dispositivos conversam diretamente; para sair dela, entregam o pacote ao roteador, que encaminha de roteador em roteador até o destino. O protocolo IP é a camada que cuida do endereçamento e do encaminhamento.

---

## 1.3 O que é um endereço IP?

Na seção anterior você viu que todo pacote precisa de um endereço de origem e um de destino. Esse endereço é o **endereço IP**.

> **Conceito-chave**
>
> Um **endereço IP** é um número que identifica um dispositivo dentro de uma rede. Ele é atribuído à **interface de rede** do dispositivo (a placa de Wi-Fi ou a porta de cabo), e é por ele que os pacotes encontram o caminho.

Um dispositivo pode ter mais de uma interface e, por isso, mais de um endereço IP. Um notebook ligado ao Wi-Fi e ao cabo ao mesmo tempo tem dois. Um roteador, que por definição liga redes diferentes, tem pelo menos um endereço em cada rede.

### Endereço IP e endereço físico

Existe outro número gravado em cada placa de rede pelo fabricante, chamado **endereço MAC** (ou endereço físico). Ele serve para os dispositivos se reconhecerem dentro da mesma rede local, como se fosse o nome escrito na campainha do apartamento. O endereço IP é o endereço postal completo, que vale para o mundo inteiro. Os dois trabalham juntos, mas têm funções diferentes: o MAC identifica a placa; o IP identifica onde ela está na rede. Vamos voltar a essa dupla na Parte 5, porque o IPv6 tem um jeito próprio de relacionar um ao outro.

### Endereço público e endereço privado

Abra a configuração de rede do seu celular. Você vai ver algo como `192.168.0.15`. Agora pesquise "qual é o meu IP" no navegador. O número que aparece é diferente, algo como `179.184.22.91`. Por quê?

O primeiro é o **endereço privado**: vale só dentro da sua rede local. Todas as casas do Brasil podem ter um dispositivo com `192.168.0.15` sem conflito, porque esses endereços nunca saem da rede local. O segundo é o **endereço público**: é o endereço que o seu roteador tem na Internet, único no mundo, fornecido pelo provedor. Quando o seu celular manda um pacote para fora, o roteador troca o endereço privado pelo público, e faz a troca inversa na volta. Esse truque se chama **NAT**, e vamos falar dele na seção 1.6, porque ele é uma das razões de o IPv6 existir.

> **Você sabia?**
>
> Endereços privados foram uma solução de emergência. Eles foram definidos em 1996 porque os endereços públicos já estavam começando a faltar. A ideia era ganhar tempo. Ganhou muito mais do que se imaginava.

> **Vamos praticar**
>
> 1. Abra a configuração de rede do seu celular ou computador e anote o endereço IP que aparece. Ele começa com 10., 172. ou 192.168.? Se sim, é privado.
> 2. Pesquise "qual é o meu IP" no navegador e anote o resultado. Ele é igual ao do item 1?
> 3. Um roteador tem quantos endereços IP, no mínimo? Por quê?
>
> **Gabarito**
>
> 1. Resposta livre; na grande maioria das casas o endereço será privado, começando com 192.168.
> 2. Não. O do navegador é o endereço público do roteador, o do item 1 é o privado do dispositivo.
> 3. Pelo menos dois: um em cada rede que ele conecta (por exemplo, um na rede da casa e um na rede do provedor).

> **O que você precisa lembrar**
>
> O endereço IP identifica uma interface de rede. O endereço MAC identifica a placa fisicamente; o IP diz onde ela está na rede. Endereços privados valem só dentro da rede local e se repetem em milhões de casas; o endereço público é único e é o que o mundo vê.

---

## 1.4 O que é IPv4?

Até agora falamos em "endereço IP" de forma genérica. Existem duas versões do protocolo IP em uso: a versão 4 e a versão 6. O IPv4 é a que você usa desde sempre e, provavelmente, ainda usa neste momento. Entender como ele funciona é o jeito mais fácil de entender por que o IPv6 é diferente.

### 32 bits, quatro números

Um endereço IPv4 é um número de **32 bits**. Bits são zeros e uns; 32 deles dão um número grande e difícil de ler, então convencionou-se escrevê-lo em quatro partes de 8 bits, cada uma convertida para decimal e separadas por pontos. Como 8 bits vão de 0 a 255, cada parte é um número entre 0 e 255.

> **Exemplo**
>
> O endereço `192.168.0.1` é, em bits:
> `11000000 . 10101000 . 00000000 . 00000001`
> Cada bloco de 8 bits vira um número: 192, 168, 0 e 1. Ninguém escreve endereços em binário no dia a dia, mas é bom saber que os quatro números são só uma forma mais confortável de ler 32 bits.

### Quantos endereços existem

Com 32 bits é possível formar 2^32 combinações, ou seja, **4.294.967.296** endereços, um pouco menos de 4,3 bilhões. Parte deles é reservada para usos especiais (os endereços privados, por exemplo), então o número de endereços públicos disponíveis é menor.

> **Você sabia?**
>
> O IPv4 foi definido em 1981, na RFC 791. Na época havia algumas centenas de computadores conectados, quase todos em universidades e centros de pesquisa dos Estados Unidos. Quatro bilhões de endereços pareciam um exagero. Hoje só o Brasil tem mais celulares do que habitantes.

> **Atenção**
>
> Cada número de um endereço IPv4 vai de 0 a 255. Endereços como `192.168.0.256` ou `300.10.10.1` não existem. Se você vir um número acima de 255, há erro de digitação.

> **Vamos praticar**
>
> 1. Quantos bits tem um endereço IPv4? Em quantas partes ele é escrito?
> 2. Quais destes endereços são inválidos: `10.0.0.1`, `172.16.300.5`, `8.8.8.8`, `192.168.1.0`, `256.1.1.1`?
> 3. Converta o número 200 para binário (8 bits).
>
> **Gabarito**
>
> 1. 32 bits, escritos em quatro partes de 8 bits.
> 2. `172.16.300.5` e `256.1.1.1`, porque têm partes acima de 255.
> 3. `11001000` (128 + 64 + 8 = 200).

> **O que você precisa lembrar**
>
> O IPv4 usa endereços de 32 bits, escritos como quatro números de 0 a 255 separados por ponto. Isso dá cerca de 4,3 bilhões de endereços, parte deles reservada. Foi definido em 1981, quando isso parecia mais do que suficiente.

---

## 1.5 Como o IPv4 é utilizado?

Você já sabe ler um endereço IPv4. Agora vamos ver o que aparece junto dele na configuração de qualquer dispositivo, porque esses mesmos elementos existem no IPv6, com outra roupa.

### Parte da rede, parte do dispositivo

Um endereço IP faz duas coisas ao mesmo tempo: diz **em qual rede** o dispositivo está e **qual dispositivo** ele é dentro dessa rede. É como um endereço postal com rua e número: a rua é a rede, o número é o dispositivo.

No IPv4, quem separa a parte da rede da parte do dispositivo é a **máscara de rede**. A máscara mais comum em redes domésticas é `255.255.255.0`. Ela diz: "os três primeiros números identificam a rede; o último identifica o dispositivo".

> **Exemplo**
>
> Rede da casa: endereços de `192.168.0.1` a `192.168.0.254`, máscara `255.255.255.0`.
>
> - Parte da rede: `192.168.0`
> - Parte do dispositivo: o último número (1, 2, 3... até 254)
> Todos os dispositivos da casa compartilham `192.168.0` e diferem no final. É assim que o celular sabe que a TV `192.168.0.20` está na mesma rede que ele, e que `8.8.8.8` não está.

Existe uma forma mais curta de escrever a máscara: contar quantos bits são da rede e colocar depois de uma barra. `255.255.255.0` tem 24 bits "ligados", então a rede se escreve `192.168.0.0/24`. Guarde essa notação com barra: no IPv6 ela é a única usada.

> **Conceito-chave**
>
> A **máscara de rede** (ou **prefixo**, na notação com barra) indica quantos bits do endereço identificam a rede. O restante identifica o dispositivo dentro dela.

### Gateway e DNS

Na configuração de rede aparecem mais dois itens.

O **gateway padrão** é o endereço do roteador da sua rede local. Quando um dispositivo quer mandar um pacote para um endereço que não está na sua rede, ele manda para o gateway, e o roteador se vira a partir dali. Em casa, o gateway costuma ser `192.168.0.1`.

O **servidor DNS** é quem traduz nomes em endereços. Você digita `google.com`; o dispositivo pergunta ao servidor DNS "qual é o IP de google.com?", recebe um número e só então manda o pacote. Sem DNS, você teria que decorar números.

> **Atenção**
>
> A máscara `255.255.255.0` parece um endereço, mas não é. Ela não identifica nenhum dispositivo; é só uma "régua" que diz onde termina a rede e começa o dispositivo. Confundir os dois é um erro comum.

> **Vamos praticar**
>
> 1. Na rede `192.168.1.0/24`, o endereço `192.168.1.77` e o endereço `192.168.2.77` estão na mesma rede? Por quê?
> 2. Para que serve o gateway padrão?
> 3. O que acontece se o servidor DNS estiver configurado errado? Você consegue acessar `8.8.8.8` diretamente? E `google.com`?
>
> **Gabarito**
>
> 1. Não. Com /24, os três primeiros números identificam a rede: `192.168.1` e `192.168.2` são redes diferentes.
> 2. Receber os pacotes destinados a fora da rede local e encaminhá-los.
> 3. Acessar `8.8.8.8` funciona, porque é um número e não precisa de tradução. Acessar `google.com` falha, porque o nome não consegue ser traduzido em endereço.

> **O que você precisa lembrar**
>
> Todo endereço IP tem uma parte que identifica a rede e outra que identifica o dispositivo. No IPv4, a máscara (ou o prefixo com barra) separa as duas. O gateway é o roteador para onde vão os pacotes de fora da rede. O DNS traduz nomes em endereços. Esses três conceitos existem também no IPv6.

---

## 1.6 Limitações do IPv4

Você já sabe que o IPv4 tem cerca de 4,3 bilhões de endereços. Esta seção conta o que aconteceu quando eles acabaram, os remendos que foram inventados para adiar o problema, e por que remendo não resolve. É a história que explica por que o IPv6 existe.

### Os endereços acabaram

Endereços IP são distribuídos em blocos por uma cadeia de organizações: a IANA, no topo, entrega grandes blocos a cinco registros regionais (o da América Latina é o **LACNIC**), que entregam blocos menores a provedores e empresas.

Em **3 de fevereiro de 2011**, a IANA entregou seus últimos blocos. O estoque central de endereços IPv4 do mundo tinha acabado. Os registros regionais foram esgotando os seus nos anos seguintes; o LACNIC chegou ao fim do estoque em **agosto de 2020**. Hoje, um provedor novo que precise de endereços IPv4 entra em lista de espera ou compra endereços de quem tem sobrando, por dezenas de dólares cada um.

> **Você sabia?**
>
> Em 2011, o mesmo ano em que o estoque da IANA acabou, um relatório da ONU afirmou que o acesso à Internet deveria ser tratado como um direito de todos. Os dois fatos, juntos, mostram o tamanho do problema: um recurso que todos precisam ter tinha acabado de se esgotar.

### Os remendos

O esgotamento não foi surpresa. Desde os anos 1990 já se sabia que os endereços iam acabar, e três técnicas foram criadas para adiar esse dia.

**CIDR.** Originalmente os endereços eram distribuídos em blocos de tamanhos fixos, muito grandes, e a maior parte ficava sem uso. O CIDR permitiu distribuir blocos de qualquer tamanho, exatamente como a notação com barra que você viu na seção 1.5. Ajudou a desperdiçar menos.

**DHCP.** Em vez de cada dispositivo ter um endereço fixo para sempre, o DHCP empresta endereços por um tempo e os recolhe quando o dispositivo sai da rede. Um provedor com 10 mil endereços consegue atender mais de 10 mil clientes, porque nem todos estão conectados ao mesmo tempo.

**NAT.** O mais importante dos três, e o que você viu na seção 1.3. O NAT permite que toda a rede da sua casa use um único endereço público. Dentro de casa, cada dispositivo tem um endereço privado; o roteador traduz tudo para o endereço público na saída. Um endereço público passou a servir para dezenas de dispositivos.

### O preço do remendo

O NAT salvou a Internet do colapso, mas cobrou um preço. O princípio original da Internet era que qualquer dispositivo pudesse falar diretamente com qualquer outro, ponta a ponta. Com NAT, um dispositivo dentro de casa não tem endereço público: ninguém de fora consegue iniciar uma conexão com ele. Isso complica jogos online, chamadas de vídeo, câmeras de segurança, e obriga aplicativos a inventar truques para atravessar o NAT.

E o problema só cresceu. Provedores sem endereços suficientes passaram a fazer NAT também na rede deles (o chamado CGNAT), colocando centenas de clientes atrás de um único endereço público. Aí o roteador da sua casa já nem tem endereço público próprio; ele tem um endereço privado do provedor, que é traduzido de novo. Duas camadas de tradução, mais lentidão, mais coisas que quebram.

> **Atenção**
>
> NAT não é IPv6, e IPv6 não é "NAT melhorado". São respostas opostas ao mesmo problema. O NAT esconde muitos dispositivos atrás de um endereço; o IPv6 dá um endereço público a cada dispositivo e elimina a necessidade de esconder.

### Por que remendo não resolve

Em 1981 a Internet tinha centenas de computadores. Hoje tem bilhões de celulares, e cada vez mais coisas que não são computadores: lâmpadas, carros, sensores, relógios, medidores de energia. Cada um precisa de um endereço. Nenhuma quantidade de NAT dá conta de um mundo em que o número de dispositivos cresce sem parar, e nenhum remendo devolve a comunicação direta que o NAT tirou.

A solução definitiva não é espremer melhor os 4,3 bilhões de endereços. É ter um protocolo com endereços suficientes para nunca mais precisar de remendo. É isso que o IPv6 é, e é nele que a Parte 2 começa.

> **Vamos praticar**
>
> 1. O que aconteceu em fevereiro de 2011 e em agosto de 2020?
> 2. Explique em uma frase o que cada remendo faz: CIDR, DHCP e NAT.
> 3. Cite um problema que o NAT causa para quem usa a Internet.
> 4. Verdadeiro ou falso: o IPv6 é uma versão mais eficiente de NAT.
>
> **Gabarito**
>
> 1. A IANA esgotou seu estoque central de endereços IPv4; o LACNIC esgotou o estoque da América Latina.
> 2. CIDR: permite blocos de qualquer tamanho, reduzindo desperdício. DHCP: empresta endereços temporariamente em vez de fixá-los. NAT: faz muitos dispositivos compartilharem um único endereço público.
> 3. Dispositivos atrás do NAT não podem receber conexões iniciadas de fora, o que complica jogos, chamadas, câmeras e outros serviços; com CGNAT há ainda mais lentidão e falhas.
> 4. Falso. O IPv6 elimina a necessidade de NAT ao dar endereço público a cada dispositivo.

> **O que você precisa lembrar**
>
> Os endereços IPv4 acabaram: na IANA em 2011, no LACNIC em 2020. CIDR, DHCP e NAT adiaram o esgotamento, mas o NAT quebrou a comunicação direta entre dispositivos e o CGNAT piorou isso. Com bilhões de dispositivos novos surgindo, remendos não bastam. A resposta é um protocolo com endereços suficientes: o IPv6.
