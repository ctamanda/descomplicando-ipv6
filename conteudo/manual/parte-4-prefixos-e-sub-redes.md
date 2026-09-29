## Antes de começar

Na Parte 3 você aprendeu a ler um endereço. Nesta, vai aprender a ler uma **rede**: o que é um prefixo, o que a barra significa, como separar o que é rede do que é dispositivo e como dividir um bloco grande em blocos menores. A parte termina com dez exercícios resolvidos que juntam tudo o que foi visto até aqui.

---

## 4.1 O que é um prefixo?

Na seção 1.5 você viu que um endereço IPv4 tem uma parte que identifica a rede e outra que identifica o dispositivo, e que a máscara de rede diz onde uma termina e a outra começa. No IPv6 a ideia é a mesma, mas o nome muda: em vez de máscara, fala-se em **prefixo**.

> **Conceito-chave**
>
> O **prefixo** é a parte inicial de um endereço IPv6 que identifica a rede. O **tamanho do prefixo** é quantos bits, contados da esquerda, pertencem a essa parte. Escreve-se com uma barra: `/64` significa "os 64 primeiros bits são a rede".

### Uma comparação lado a lado

| | IPv4 | IPv6 |
|---|---|---|
| Endereço de um dispositivo | `192.168.0.15` | `2001:db8:1:2::15` |
| Como se indica a rede | máscara `255.255.255.0` ou `/24` | prefixo `/64` |
| Endereço da rede | `192.168.0.0/24` | `2001:db8:1:2::/64` |
| Parte da rede | `192.168.0` | `2001:db8:1:2` |
| Parte do dispositivo | `15` | `::15` |

No IPv6 não existe a máscara escrita em decimal com pontos. Só existe a notação com barra. Isso é uma simplificação: um número diz tudo.

### Prefixo é também o nome da rede

Quando se fala "a rede `2001:db8:1:2::/64`", está se dizendo duas coisas ao mesmo tempo: que a rede começa com `2001:db8:1:2` e que os 64 primeiros bits estão fixos. Todos os endereços de `2001:db8:1:2::` até `2001:db8:1:2:ffff:ffff:ffff:ffff` pertencem a ela. Um prefixo é, portanto, um **intervalo** de endereços, e a barra diz o tamanho desse intervalo.

> **Exemplo**
>
> A rede `2001:db8:1:2::/64` contém todos os endereços cujos quatro primeiros grupos são `2001:0db8:0001:0002`. Isso inclui `2001:db8:1:2::1`, `2001:db8:1:2::15`, `2001:db8:1:2:a1b2:c3d4:e5f6:7890` e outros 18 quintilhões.
> O endereço `2001:db8:1:3::1` **não** está nela: o quarto grupo é `0003`, diferente de `0002`.

> **Vamos praticar**
>
> 1. No IPv6, o que substitui a máscara de rede do IPv4?
> 2. O que significa a barra em `2001:db8::/32`?
> 3. O endereço `2001:db8:1:2:ffff::1` pertence à rede `2001:db8:1:2::/64`?
>
> **Gabarito**
>
> 1. A notação de prefixo com barra (`/N`).
> 2. Que os 32 primeiros bits (os dois primeiros grupos, `2001:0db8`) identificam a rede.
> 3. Sim. Os quatro primeiros grupos são `2001:0db8:0001:0002`; o resto é identificador de interface.

> **O que você precisa lembrar**
>
> Prefixo é a parte do endereço que identifica a rede; o tamanho do prefixo (/N) diz quantos bits da esquerda ela ocupa. Não há máscara em decimal no IPv6. Um prefixo nomeia um intervalo de endereços: todos os que começam com aqueles N bits.

---

## 4.2 Notação de prefixos

Você já sabe o que a barra significa. Esta seção mostra os tamanhos de prefixo que aparecem na prática e ensina a enxergar onde cada um corta o endereço.

### Os tamanhos comuns

| Prefixo | Bits fixos | Grupos fixos | Quem costuma receber |
|---|---|---|---|
| /32 | 32 | 2 | Um provedor de Internet |
| /48 | 48 | 3 | Uma empresa ou instituição |
| /56 | 56 | 3 grupos e meio | Um cliente residencial |
| /64 | 64 | 4 | Uma rede local (uma casa, uma sala) |
| /128 | 128 | 8 | Um único endereço |

### Enxergar o corte

Como cada grupo tem 16 bits, os prefixos múltiplos de 16 cortam exatamente na fronteira de um grupo: /16 corta depois do 1º, /32 depois do 2º, /48 depois do 3º, /64 depois do 4º. Esses são fáceis de ler.

> **Exemplo**
>
> `2001:db8:abcd:1234:5678:9abc:def0:1` com diferentes prefixos:
> `/32`: rede é `2001:db8`, o resto é livre.
> `/48`: rede é `2001:db8:abcd`.
> `/64`: rede é `2001:db8:abcd:1234`.

Prefixos que não são múltiplos de 16 cortam **dentro** de um grupo. O mais comum é o /56, que corta 8 bits dentro do quarto grupo. Como cada dígito hexadecimal são 4 bits, 8 bits são dois dígitos: o /56 fixa os três primeiros grupos e os **dois primeiros dígitos** do quarto.

> **Exemplo**
>
> `2001:db8:abcd:1234::1` com prefixo `/56`.
> Os três primeiros grupos estão fixos: `2001:db8:abcd`.
> Do quarto grupo, `1234`, os dois primeiros dígitos estão fixos: `12`. Os dois últimos, `34`, são livres.
> A rede é `2001:db8:abcd:1200::/56`, e ela contém tudo de `2001:db8:abcd:1200::` até `2001:db8:abcd:12ff:ffff:ffff:ffff:ffff`.

> **Conceito-chave**
>
> Cada dígito hexadecimal são 4 bits. Para saber onde um prefixo corta, divida o tamanho por 4: o resultado é quantos dígitos hexadecimais (ignorando os dois-pontos) estão fixos. /56 ÷ 4 = 14 dígitos: três grupos completos (12 dígitos) mais dois dígitos do quarto.

> **Atenção**
>
> Ao escrever o endereço de uma rede, a parte do dispositivo deve estar **zerada**. `2001:db8:abcd:1234::/64` está certo; `2001:db8:abcd:1234::1/64` é o endereço de um dispositivo com a indicação do prefixo, não o endereço da rede. As duas coisas aparecem nas ferramentas, e é importante saber qual é qual.

> **Vamos praticar**
>
> 1. Um /48 fixa quantos grupos? E um /64?
> 2. Quantos dígitos hexadecimais um /56 fixa? E um /60?
> 3. Qual é a rede de `2001:db8:1234:5678::9` com prefixo /48?
> 4. Qual é a rede de `2001:db8:1234:5678::9` com prefixo /56?
> 5. Qual é a rede de `2001:db8:1234:5678::9` com prefixo /60?
>
> **Gabarito**
>
> 1. /48 fixa 3 grupos; /64 fixa 4.
> 2. /56 fixa 14 dígitos; /60 fixa 15.
> 3. `2001:db8:1234::/48`.
> 4. `2001:db8:1234:5600::/56` (fixa `56` do quarto grupo; `78` fica livre).
> 5. `2001:db8:1234:5670::/60` (fixa `567` do quarto grupo; só o último dígito, `8`, fica livre).

> **O que você precisa lembrar**
>
> Prefixos múltiplos de 16 cortam entre grupos: /32 são 2 grupos, /48 são 3, /64 são 4. Outros cortam dentro de um grupo; divida por 4 para saber quantos dígitos hexa estão fixos (/56 = 14 dígitos). O endereço de uma rede tem a parte do dispositivo zerada.

---

## 4.3 Como interpretar um /64

O /64 merece uma seção própria porque é o tamanho que você vai ver o tempo todo e porque é a fonte de uma dúvida clássica: "por que tantos endereços para uma rede pequena?".

### O que um /64 contém

Um /64 fixa os quatro primeiros grupos e deixa os quatro últimos livres. Quatro grupos livres são 64 bits, e 2^64 dá **18.446.744.073.709.551.616** endereços. Dezoito quintilhões. Para uma casa com dez dispositivos.

### Por que tanto

A resposta está no que a Parte 5 vai mostrar em detalhe: no IPv6, o dispositivo **gera o próprio identificador de interface**. Para que dois dispositivos na mesma rede não gerem o mesmo identificador por acaso, o espaço precisa ser grande o bastante para que a chance de colisão seja desprezível. Com 64 bits, essa chance é tão pequena que o protocolo pode simplesmente confiar (e, por segurança, fazer uma verificação rápida). Com 8 ou 16 bits, como no IPv4, isso não funcionaria, e seria preciso um servidor central distribuindo endereços.

Então o /64 não é "uma rede com muitos endereços". É "uma rede em que os dispositivos se configuram sozinhos". O tamanho é o preço da autonomia.

> **Conceito-chave**
>
> O **/64** é o tamanho padrão de qualquer rede IPv6 que tenha dispositivos. Os 64 bits livres existem para que os dispositivos gerem identificadores próprios sem risco de colisão, o que torna a autoconfiguração possível.

### A regra: não faça redes menores que /64

Tecnicamente é possível criar uma rede /96 ou /120 e configurar tudo à mão. Mas isso quebra a autoconfiguração (SLAAC exige 64 bits de identificador), atrapalha alguns mecanismos de segurança que assumem /64 e não economiza nada de útil, porque endereço não é escasso. A recomendação das RFCs e a prática do NIC.br é clara: **rede com dispositivos é /64, sempre**.

> **Atenção**
>
> Quem vem do IPv4 sente vontade de "dar um /126 para o link entre dois roteadores, porque só precisa de dois endereços". Isso existe como prática em alguns provedores, mas é exceção de infraestrutura, não regra para redes locais. Para uma casa, uma sala, um departamento: /64. Se você não sabe qual prefixo usar, use /64.

> **Exemplo**
>
> Um provedor entrega a uma residência o bloco `2804:14d:5c81:9a00::/56`. O roteador da casa pega o primeiro /64 desse bloco, `2804:14d:5c81:9a00::/64`, e o anuncia no Wi-Fi. Cada celular, notebook e TV monta um endereço dentro dele: `2804:14d:5c81:9a00:` seguido de 64 bits que o próprio dispositivo escolheu. Sobram outros 255 blocos /64 para a casa usar em outras redes, se quiser.

> **Vamos praticar**
>
> 1. Quantos grupos estão livres em um /64? Quantos endereços isso dá, aproximadamente?
> 2. Por que a rede local precisa de 64 bits livres?
> 3. Uma sala de aula tem 30 computadores. Que tamanho de prefixo ela deve receber?
>
> **Gabarito**
>
> 1. Quatro grupos, 2^64, cerca de 18 quintilhões.
> 2. Para que os dispositivos gerem o próprio identificador de interface sem colidir, o que permite a autoconfiguração.
> 3. /64. Rede com dispositivos é sempre /64, independentemente da quantidade.

> **O que você precisa lembrar**
>
> O /64 é o padrão para toda rede com dispositivos. Seus 18 quintilhões de endereços não são para uso: são o espaço que permite ao dispositivo gerar um identificador único sozinho. Não faça redes menores que /64.

---

## 4.4 Identificação da rede

Esta seção é prática: dado um endereço e um tamanho de prefixo, encontrar o endereço da rede. É a operação mais comum ao interpretar saídas de comandos e planejar redes.

### O método

1. Se o endereço estiver abreviado, **expanda** (seção 3.6). É mais seguro trabalhar com os oito grupos.
2. Divida o tamanho do prefixo por 4 para saber quantos **dígitos hexadecimais** estão fixos.
3. Conte esses dígitos da esquerda para a direita (pulando os dois-pontos) e **zere tudo que vier depois**.
4. Abrevie o resultado e acrescente a barra.

> **Exemplo**
>
> Endereço `2001:db8:abcd:1234:5678:9abc:def0:1`, prefixo /64.
> Passo 1: expandido, `2001:0db8:abcd:1234:5678:9abc:def0:0001`.
> Passo 2: 64 ÷ 4 = 16 dígitos fixos.
> Passo 3: 16 dígitos são exatamente os quatro primeiros grupos: `2001:0db8:abcd:1234`. Zerando o resto: `2001:0db8:abcd:1234:0000:0000:0000:0000`.
> Passo 4: `2001:db8:abcd:1234::/64`.

> **Exemplo**
>
> Mesmo endereço, prefixo /56.
> Passo 2: 56 ÷ 4 = 14 dígitos fixos.
> Passo 3: 12 dígitos são os três primeiros grupos; sobram 2, que são os dois primeiros dígitos do quarto grupo: `12`. Fixo até aqui: `2001:0db8:abcd:12`. Zerando o resto: `2001:0db8:abcd:1200:0000:0000:0000:0000`.
> Passo 4: `2001:db8:abcd:1200::/56`.

> **Exemplo**
>
> Mesmo endereço, prefixo /48.
> 48 ÷ 4 = 12 dígitos, três grupos. Rede: `2001:db8:abcd::/48`.

### O truque para prefixos "quebrados"

Quando o tamanho do prefixo não é múltiplo de 4 (por exemplo, /58 ou /62), o corte cai **dentro de um dígito**, e é preciso ir ao binário. Isso é raro na prática: provedores e administradores quase sempre escolhem prefixos múltiplos de 4 justamente para evitar contas. Se você encontrar um, converta o dígito do corte para 4 bits, fixe os bits necessários e zere o resto.

> **Exemplo**
>
> `2001:db8:abcd:1234::1` com prefixo /62.
> 62 ÷ 4 = 15 dígitos e sobram 2 bits. Os 15 dígitos fixam `2001:0db8:abcd:123`. O 16º dígito é `4`, que em binário é `0100`. Fixando os 2 primeiros bits (`01`) e zerando os outros: `0100` = `4`. Rede: `2001:db8:abcd:1234::/62`.
> Se o dígito fosse `7` (`0111`), fixar `01` e zerar daria `0100` = `4`, e a rede seria `2001:db8:abcd:1234::/62` também. O /62 agrupa os dígitos 4, 5, 6 e 7 na mesma rede.

> **Atenção**
>
> O erro mais frequente aqui é contar grupos em vez de dígitos. "/56 é três grupos e meio" funciona como intuição, mas na hora de zerar, conte 14 dígitos. E lembre de expandir antes: em `2001:db8:1::5`, o segundo grupo é `0db8` (4 dígitos), não `db8` (3).

> **Vamos praticar**
>
> Encontre o endereço da rede:
>
> 1. `2001:db8:1:2:3:4:5:6`, prefixo /64
> 2. `2804:14d:5c81:9a2b:1c3f:7e2a:9b40:d1e5`, prefixo /64
> 3. `2804:14d:5c81:9a2b:1c3f:7e2a:9b40:d1e5`, prefixo /56
> 4. `2804:14d:5c81:9a2b:1c3f:7e2a:9b40:d1e5`, prefixo /48
> 5. `2001:db8:cafe:beef::1`, prefixo /60
> 6. `fe80::1`, prefixo /64
>
> **Gabarito**
>
> 1. `2001:db8:1:2::/64`.
> 2. `2804:14d:5c81:9a2b::/64`.
> 3. `2804:14d:5c81:9a00::/56` (quarto grupo `9a2b`: fixa `9a`, zera `2b`).
> 4. `2804:14d:5c81::/48`.
> 5. `2001:db8:cafe:bee0::/60` (fixa `bee`, zera `f`).
> 6. `fe80::/64`.

> **O que você precisa lembrar**
>
> Para achar a rede: expanda o endereço, divida o prefixo por 4 para saber quantos dígitos hexa estão fixos, zere o resto e abrevie. Prefixos múltiplos de 4 cortam entre dígitos; os outros exigem olhar o binário de um dígito, mas são raros.

---

## 4.5 Identificação dos dispositivos

Você já sabe separar a rede. Esta seção olha para a outra metade: o **identificador de interface**, os 64 bits que dizem qual dispositivo é, e de onde ele vem.

### Três origens possíveis

**Manual.** Alguém escolhe. É o caso de servidores e roteadores, que precisam de endereços fáceis de lembrar: `2001:db8:1:2::1` para o gateway, `2001:db8:1:2::53` para o DNS. Identificadores curtos e "bonitos" quase sempre foram configurados à mão.

**Aleatório.** O dispositivo sorteia 64 bits. É o padrão nos sistemas modernos (Windows, Android, iOS, Linux recente). Há duas variantes: um identificador **estável**, que o dispositivo mantém enquanto estiver naquela rede (definido na RFC 7217), e identificadores **temporários**, trocados a cada dia ou a cada conexão, usados para navegar na web sem que o endereço permita rastrear o dispositivo (RFC 8981, antes RFC 4941, as "extensões de privacidade"). Por isso um notebook ou celular costuma mostrar um endereço global estável e outro "temporário" na mesma rede.

**Derivado do endereço MAC (EUI-64).** Foi o método original. O endereço MAC da placa tem 48 bits; para chegar a 64, insere-se `fffe` no meio e inverte-se um bit específico. Um MAC `00:1a:2b:3c:4d:5e` vira o identificador `021a:2bff:fe3c:4d5e`. É fácil de reconhecer: tem `ff:fe` no meio. O problema é que o MAC identifica a placa física para sempre, em qualquer rede, o que é ruim para privacidade. Por isso os sistemas modernos abandonaram esse método para dispositivos de usuário, mas você ainda o encontra em roteadores e equipamentos de rede.

> **Conceito-chave**
>
> O **identificador de interface** (IID) são os 64 bits finais do endereço. Ele pode ser escolhido manualmente, gerado aleatoriamente pelo dispositivo (o padrão hoje) ou derivado do endereço MAC (EUI-64, reconhecível pelo `ff:fe` no meio).

> **Exemplo**
>
> Três endereços na mesma rede `2001:db8:1:2::/64`, e o que o identificador revela:
> `2001:db8:1:2::1`: identificador `::1`, curto demais para ser sorteado. Configurado à mão; provavelmente o roteador.
> `2001:db8:1:2:021a:2bff:fe3c:4d5e`: tem `ff:fe` no meio. EUI-64, derivado de um MAC. Provavelmente um equipamento de rede ou um sistema antigo.
> `2001:db8:1:2:d8a1:3c0b:77f2:0e19`: sem padrão reconhecível. Aleatório; um celular ou notebook moderno.

> **Você sabia?**
>
> O bit que se inverte no EUI-64 é o sétimo bit do primeiro byte, chamado bit "universal/local". No MAC `00:1a:...`, o primeiro byte `00` vira `02`. Por isso identificadores EUI-64 costumam começar com `02`, `06`, `0a` ou `0e` quando o MAC original começava com `00`, `04`, `08` ou `0c`.

### Por que isso importa

Reconhecer a origem do identificador ajuda no diagnóstico: um endereço com `ff:fe` no meio vem de um MAC (dá para descobrir o fabricante da placa); um endereço "temporário" vai mudar amanhã (não use para configurar um servidor); um endereço curto foi configurado por alguém (deve estar documentado em algum lugar).

> **Atenção**
>
> Nunca configure um serviço (impressora, câmera, servidor) para ser acessado por um endereço **temporário**. Ele vai mudar e o serviço vai "sumir". Use o endereço estável do dispositivo ou, melhor, configure um identificador manual.

> **Vamos praticar**
>
> 1. Quais são as três origens possíveis do identificador de interface?
> 2. Como reconhecer um identificador EUI-64?
> 3. Qual é o identificador EUI-64 gerado a partir do MAC `00:50:56:ab:cd:ef`?
> 4. Por que os sistemas modernos preferem identificadores aleatórios?
> 5. O endereço `2001:db8:1:2:5cf1:9a3b:0c7d:e412` é mais provavelmente manual, aleatório ou EUI-64?
>
> **Gabarito**
>
> 1. Manual, aleatório (estável ou temporário) e derivado do MAC (EUI-64).
> 2. Pelo `ff:fe` no meio dos 64 bits (grupos 6 e 7 terminando e começando com `ff` e `fe`).
> 3. Insere `fffe` no meio: `0050:56ff:feab:cdef`; inverte o sétimo bit do primeiro byte (`00` vira `02`): `0250:56ff:feab:cdef`.
> 4. Por privacidade: o MAC identifica a placa em qualquer rede, permitindo rastrear o dispositivo; o aleatório não.
> 5. Aleatório: não é curto nem tem `ff:fe`.

> **O que você precisa lembrar**
>
> Os 64 bits finais identificam a interface. Podem ser manuais (curtos, para servidores e roteadores), aleatórios (o padrão hoje, com versões estável e temporária) ou EUI-64 (derivados do MAC, com ff:fe no meio). Nunca use um endereço temporário para configurar um serviço.

---

## 4.6 Sub-redes IPv6

A última peça: como um bloco grande é dividido em redes menores. Se você entendeu prefixos, sub-redes são só uma consequência.

### A hierarquia

Os blocos IPv6 são distribuídos em cascata, e cada nível recebe um prefixo menor (ou seja, com mais bits fixos) do nível acima:

1. O **LACNIC** recebe blocos enormes da IANA (por exemplo `2800::/12`).
2. Um **provedor** recebe um /32 do LACNIC (por exemplo `2804:14d::/32`).
3. Um **cliente** recebe do provedor um /56 (residencial) ou /48 (empresa).
4. Cada **rede local** do cliente recebe um /64.

Em cada passo, o bloco maior é dividido em blocos menores de tamanho igual. Isso se chama **dividir em sub-redes**, ou *subnetting*.

### Quantas sub-redes cabem

A conta é simples: a diferença entre os dois tamanhos de prefixo é a quantidade de bits que você tem para numerar sub-redes, e 2 elevado a esse número é quantas cabem.

| Bloco recebido | Dividido em | Bits para sub-redes | Quantidade de sub-redes |
|---|---|---|---|
| /48 | /64 | 64 − 48 = 16 | 2^16 = 65.536 |
| /56 | /64 | 64 − 56 = 8 | 2^8 = 256 |
| /60 | /64 | 64 − 60 = 4 | 2^4 = 16 |
| /32 | /48 | 48 − 32 = 16 | 65.536 |
| /32 | /56 | 56 − 32 = 24 | 16.777.216 |

> **Conceito-chave**
>
> Para dividir um bloco /A em sub-redes /B, você tem **B − A bits** para numerá-las, o que dá **2^(B−A)** sub-redes. Cada uma é obtida variando esses bits e mantendo os A bits iniciais iguais.

### Um plano de endereçamento residencial

Uma casa recebe `2001:db8:1:ab00::/56` (usamos o bloco de documentação para o exemplo; na vida real seria algo como `2804:14d:5c81:9a00::/56`). São 8 bits para sub-redes, que são exatamente os dois últimos dígitos do quarto grupo, de `00` a `ff`. Isso dá 256 redes /64:

| Sub-rede | Prefixo | Uso |
|---|---|---|
| 00 | `2001:db8:1:ab00::/64` | Wi-Fi principal |
| 01 | `2001:db8:1:ab01::/64` | Rede de visitantes |
| 02 | `2001:db8:1:ab02::/64` | Câmeras e casa inteligente |
| 03 | `2001:db8:1:ab03::/64` | Home office |
| ... | ... | ... |
| ff | `2001:db8:1:abff::/64` | (disponível) |

Cada uma dessas redes tem seus 18 quintilhões de endereços e sua própria autoconfiguração. Isolar as câmeras do Wi-Fi principal, por exemplo, deixa de ser um luxo de empresa.

> **Exemplo**
>
> Uma empresa recebe `2001:db8:1234::/48`. São 16 bits para sub-redes: todo o quarto grupo, de `0000` a `ffff`. Um plano simples usa o primeiro dígito do quarto grupo para o prédio e os três seguintes para o andar ou setor:
> `2001:db8:1234:1000::/64` a `2001:db8:1234:1fff::/64`: prédio 1 (4.096 redes).
> `2001:db8:1234:2000::/64` a `2001:db8:1234:2fff::/64`: prédio 2.
> Dentro do prédio 1, `2001:db8:1234:1001::/64` pode ser o primeiro andar, `2001:db8:1234:1002::/64` o segundo, e assim por diante.
> Isso é o que se chama "plano de endereçamento": usar os dígitos para carregar significado, já que sobram bits.

### O que não se faz

No IPv4, dividir uma rede significava calcular quantos hosts cabiam em cada pedaço e ajustar a máscara ao tamanho de cada departamento. No IPv6, isso é desnecessário e contraproducente. **Toda sub-rede final é /64**, independentemente de ter 2 ou 2.000 dispositivos. O planejamento se resume a decidir quantos /64 você quer e como numerá-los de forma que faça sentido.

> **Atenção**
>
> Não confunda "quantas sub-redes cabem" com "quantos dispositivos cabem". Em IPv6, a segunda pergunta não existe: cada /64 comporta mais dispositivos do que jamais vão existir. Só a primeira importa.

> **Vamos praticar**
>
> 1. Um provedor recebe um /32 e entrega /56 a cada cliente residencial. Quantos clientes ele consegue atender com esse bloco?
> 2. Uma escola recebe `2001:db8:1:5c00::/56`. Quantas redes /64 ela pode criar?
> 3. Liste as quatro primeiras sub-redes /64 do bloco `2001:db8:1:5c00::/56`.
> 4. Uma casa recebe um /60. Quantas redes /64 ela tem?
> 5. Liste todas as sub-redes /64 de `2001:db8:1:20::/60`.
>
> **Gabarito**
>
> 1. 56 − 32 = 24 bits, 2^24 = 16.777.216 clientes.
> 2. 64 − 56 = 8 bits, 256 redes.
> 3. `2001:db8:1:5c00::/64`, `2001:db8:1:5c01::/64`, `2001:db8:1:5c02::/64`, `2001:db8:1:5c03::/64` (o que varia são os dois últimos dígitos do quarto grupo).
> 4. 64 − 60 = 4 bits, 16 redes.
> 5. `2001:db8:1:20::/64`, `2001:db8:1:21::/64`, `2001:db8:1:22::/64`, ..., `2001:db8:1:2f::/64` (o último dígito do quarto grupo varia de 0 a f).

> **O que você precisa lembrar**
>
> Blocos IPv6 são distribuídos em cascata: /32 para provedores, /48 ou /56 para clientes, /64 para cada rede local. Dividir um /A em /B dá 2^(B−A) sub-redes. Toda sub-rede final é /64; o planejamento é só decidir como numerar os bits que sobram.

---

## 4.7 Exercícios de interpretação e cálculo

Dez exercícios que combinam tudo das Partes 3 e 4: expandir, abreviar, classificar, achar a rede, contar sub-redes. Tente resolver cada um antes de ler a resolução.

### Exercício 1

Expanda `2001:db8:5c::a` e diga quantos grupos o `::` esconde.

**Resolução.** Grupos escritos: `2001`, `db8`, `5c`, `a`. Quatro; o `::` esconde 8 − 4 = 4. Expandido: `2001:0db8:005c:0000:0000:0000:0000:000a`.

### Exercício 2

Abrevie `fe80:0000:0000:0000:0000:0000:0000:00c1` ao máximo.

**Resolução.** Zeros à esquerda: `fe80:0:0:0:0:0:0:c1`. Seis zeros consecutivos viram `::`. Resultado: `fe80::c1`.

### Exercício 3

Abrevie `2001:0db8:0000:0000:00ab:0000:0000:0001` ao máximo.

**Resolução.** Zeros à esquerda: `2001:db8:0:0:ab:0:0:1`. Duas sequências de dois zeros, empate: o `::` vai na primeira. Resultado: `2001:db8::ab:0:0:1`.

### Exercício 4

Classifique: `fd00:1::1`, `2a02:26f0::1`, `ff02::1:ff00:1`, `fe80::1%eth0`, `::`.

**Resolução.** `fd00:1::1` é unique local (fd). `2a02:26f0::1` é global unicast (começa com 2). `ff02::1:ff00:1` é multicast (ff; é um endereço solicited-node, que a Parte 5 explica). `fe80::1%eth0` é link-local, com identificador de zona. `::` é o endereço não especificado.

### Exercício 5

Qual é a rede /64 de `2804:7f4:3b80:c1a2:f0e1:d2c3:b4a5:9687`?

**Resolução.** /64 são os quatro primeiros grupos. Rede: `2804:7f4:3b80:c1a2::/64`.

### Exercício 6

Qual é a rede /56 do mesmo endereço?

**Resolução.** 56 ÷ 4 = 14 dígitos: três grupos mais `c1` do quarto. Zerando `a2`: `2804:7f4:3b80:c100::/56`.

### Exercício 7

Os endereços `2001:db8:1:2::10` e `2001:db8:1:3::10` estão na mesma rede /64? E na mesma rede /48?

**Resolução.** /64: os quatro primeiros grupos são `2001:0db8:0001:0002` e `2001:0db8:0001:0003`. Diferentes, redes diferentes. /48: os três primeiros grupos são `2001:0db8:0001` nos dois. Mesma rede /48. Ou seja, são duas sub-redes /64 do mesmo bloco /48.

### Exercício 8

Um provedor recebeu `2804:7f4::/32` e quer entregar um /48 a cada empresa cliente. Quantas empresas ele atende? Qual é o prefixo da primeira e da última?

**Resolução.** 48 − 32 = 16 bits, 2^16 = 65.536 empresas. O terceiro grupo varia de `0000` a `ffff`. Primeira: `2804:7f4::/48` (ou `2804:7f4:0::/48`). Última: `2804:7f4:ffff::/48`.

### Exercício 9

Uma empresa recebeu `2001:db8:1:9c00::/56` e quer três redes: escritório, visitantes e servidores. Proponha os três prefixos /64 e o endereço do gateway de cada uma, usando o identificador `::1`.

**Resolução.** 8 bits de sub-rede, os dois últimos dígitos do quarto grupo. Escritório: `2001:db8:1:9c00::/64`, gateway `2001:db8:1:9c00::1`. Visitantes: `2001:db8:1:9c01::/64`, gateway `2001:db8:1:9c01::1`. Servidores: `2001:db8:1:9c02::/64`, gateway `2001:db8:1:9c02::1`. Sobram 253 sub-redes.

### Exercício 10

Um notebook mostra `2001:db8:1:9c01:d8a1:3c0b:77f2:e19/64` e gateway `fe80::1%wlan0`. Responda: (a) em qual das redes do exercício 9 ele está? (b) o identificador de interface é manual, aleatório ou EUI-64? (c) o gateway está correto?

**Resolução.** (a) Os quatro primeiros grupos são `2001:0db8:0001:9c01`: rede de visitantes. (b) `d8a1:3c0b:77f2:0e19` não é curto nem tem `ff:fe` no meio: aleatório, típico de um notebook moderno. (c) Sim. O gateway ser link-local (`fe80::1`) com identificador de zona (`%wlan0`) é o comportamento normal; o roteador se anuncia pelo seu link-local e o sistema registra por qual interface.

> **O que você precisa lembrar**
>
> Para qualquer endereço: expanda se precisar, olhe o começo para classificar, divida o prefixo por 4 para achar a rede, olhe o identificador para saber sua origem. Para qualquer bloco: a diferença entre os prefixos diz quantas sub-redes cabem. Com essas quatro operações você lê qualquer rede IPv6.
