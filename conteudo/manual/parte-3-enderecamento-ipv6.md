## Antes de começar

Esta é a parte em que o IPv6 deixa de ser conceito e vira algo que você lê, escreve e reconhece. Ao final dela você vai saber ler qualquer endereço IPv6, abreviar e expandir sem errar, e dizer, olhando para o começo do endereço, se ele é global, local, multicast ou especial. Vá devagar nas seções 3.5 e 3.6: são as que mais geram erro em prova e em configuração.

---

## 3.1 Estrutura de um endereço IPv6

Um endereço IPv6 é assim:

`2001:0db8:0000:0000:0000:0000:0000:0001`

À primeira vista parece uma sequência aleatória de letras e números. Não é. Ele tem uma estrutura fixa e, depois que você a enxerga, todo endereço fica legível.

> **Conceito-chave**
>
> Um endereço IPv6 é escrito como **oito grupos** de **quatro dígitos hexadecimais**, separados por **dois-pontos**. Cada grupo representa 16 bits; oito grupos formam os 128 bits.

Vamos separar o exemplo em seus oito grupos:

| Grupo | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Valor | 2001 | 0db8 | 0000 | 0000 | 0000 | 0000 | 0000 | 0001 |

Cada grupo é um número de quatro dígitos escrito em hexadecimal, um sistema de numeração que usa dezesseis símbolos: os dígitos de 0 a 9 e as letras de a a f. A seção 3.3 explica esse sistema; por enquanto basta saber que "0db8" é um número, e não uma sigla.

### Comparando com o IPv4

| | IPv4 | IPv6 |
|---|---|---|
| Separador | ponto | dois-pontos |
| Quantidade de partes | 4 | 8 |
| Bits por parte | 8 | 16 |
| Sistema de numeração | decimal (0 a 255) | hexadecimal (0000 a ffff) |
| Exemplo | 192.168.0.1 | 2001:0db8:0000:0000:0000:0000:0000:0001 |

A lógica é a mesma: um número grande demais para ler de uma vez, quebrado em partes menores. O IPv4 quebra 32 bits em quatro pedaços de 8; o IPv6 quebra 128 bits em oito pedaços de 16.

> **Atenção**
>
> No IPv4, cada parte vai de 0 a 255 porque são 8 bits em decimal. No IPv6, cada grupo vai de 0000 a ffff porque são 16 bits em hexadecimal. "ffff" é o maior valor possível de um grupo e corresponde a 65.535 em decimal. Um grupo como "fffg" ou "10000" não existe.

> **Vamos praticar**
>
> 1. Quantos grupos tem um endereço IPv6 e quantos dígitos cada grupo?
> 2. Separe em grupos o endereço `fe80:0000:0000:0000:1c2a:8bff:fe3e:0042`.
> 3. Qual destes grupos é inválido: `0db8`, `abcd`, `12g4`, `ffff`?
>
> **Gabarito**
>
> 1. Oito grupos de quatro dígitos hexadecimais.
> 2. fe80 · 0000 · 0000 · 0000 · 1c2a · 8bff · fe3e · 0042.
> 3. `12g4`, porque "g" não é um dígito hexadecimal.

> **O que você precisa lembrar**
>
> Um endereço IPv6 tem oito grupos de quatro dígitos hexadecimais separados por dois-pontos. Cada grupo tem 16 bits; oito grupos, 128 bits. Cada grupo vai de 0000 a ffff.

---

## 3.2 Os 128 bits do endereço

Você já sabe que o endereço tem 128 bits divididos em oito grupos de 16. Esta seção mostra como esses 128 bits se organizam por dentro, porque é essa organização que explica quase tudo o que vem depois.

### Duas metades

Na regra geral, um endereço IPv6 é dividido ao meio:

| Bits 1 a 64 | Bits 65 a 128 |
|---|---|
| **Prefixo de rede** | **Identificador de interface** |
| Diz **em qual rede** o dispositivo está | Diz **qual dispositivo** é, dentro da rede |
| Grupos 1 a 4 | Grupos 5 a 8 |
| Vem do provedor ou do administrador | Vem do próprio dispositivo (ou é escolhido manualmente) |

Voltando ao endereço da seção anterior:

`2001:0db8:0000:0000` **:** `0000:0000:0000:0001`

Os quatro primeiros grupos (`2001:0db8:0000:0000`) identificam a rede. Os quatro últimos (`0000:0000:0000:0001`) identificam o dispositivo: neste caso, o dispositivo número 1 daquela rede.

> **Conceito-chave**
>
> Na configuração mais comum, os **64 primeiros bits** de um endereço IPv6 são o **prefixo de rede** e os **64 últimos** são o **identificador de interface**. Essa divisão se escreve **/64** e é o padrão de toda rede local IPv6.

### Por que isso importa

Lembre da seção 1.5: no IPv4 a máscara dizia onde terminava a rede e começava o dispositivo, e a máscara podia ser quase qualquer coisa (/24, /25, /30...). No IPv6, a divisão em /64 é tão padronizada que muitos mecanismos do protocolo dependem dela. A autoconfiguração (Parte 5) só funciona porque o dispositivo sabe que os 64 bits finais são dele para preencher.

Isso não significa que todo prefixo é /64. Um provedor recebe blocos maiores (/32, por exemplo) e entrega ao cliente blocos como /48 ou /56, que o cliente divide em várias redes /64. A Parte 4 mostra essas contas. O que fica fixo é o tamanho da rede local: /64.

> **Você sabia?**
>
> Os 64 bits do identificador de interface permitem 18.446.744.073.709.551.616 dispositivos numa única rede local. É por isso que "economizar" fazendo redes menores que /64 não faz sentido: você nunca vai usar nem uma fração disso, e ainda quebra a autoconfiguração.

> **Vamos praticar**
>
> 1. Em um endereço /64, quais grupos formam o prefixo de rede e quais formam o identificador de interface?
> 2. No endereço `2804:14d:1234:5678:abcd:ef01:2345:6789`, qual é o prefixo de rede e qual é o identificador de interface?
> 3. Dois dispositivos com endereços `2001:db8:1:2:0:0:0:10` e `2001:db8:1:2:0:0:0:20` estão na mesma rede /64? Por quê?
>
> **Gabarito**
>
> 1. Grupos 1 a 4 são o prefixo; grupos 5 a 8 são o identificador.
> 2. Prefixo `2804:14d:1234:5678`; identificador `abcd:ef01:2345:6789`.
> 3. Sim. Os quatro primeiros grupos são iguais (`2001:db8:1:2`), então a rede é a mesma; só o identificador muda.

> **O que você precisa lembrar**
>
> Um endereço IPv6 de rede local é dividido em duas metades de 64 bits: prefixo de rede (grupos 1 a 4) e identificador de interface (grupos 5 a 8). Essa divisão /64 é o padrão e a base da autoconfiguração.

---

## 3.3 Sistema hexadecimal

Chegou a hora de entender as letras. Esta seção é curta e prática: ao final você vai saber por que o IPv6 usa hexadecimal e como converter um grupo de 16 bits para hexadecimal e vice-versa.

### Três sistemas, uma mesma quantidade

Nós contamos em **decimal** porque temos dez dedos: usamos dez símbolos (0 a 9) e, quando acabam, acrescentamos uma casa. Computadores contam em **binário**: dois símbolos (0 e 1). O **hexadecimal** usa dezesseis símbolos: os dígitos de 0 a 9 e depois as letras a, b, c, d, e, f para representar 10, 11, 12, 13, 14 e 15.

| Decimal | Binário | Hexadecimal |
|---|---|---|
| 0 | 0000 | 0 |
| 1 | 0001 | 1 |
| 2 | 0010 | 2 |
| 3 | 0011 | 3 |
| 4 | 0100 | 4 |
| 5 | 0101 | 5 |
| 6 | 0110 | 6 |
| 7 | 0111 | 7 |
| 8 | 1000 | 8 |
| 9 | 1001 | 9 |
| 10 | 1010 | a |
| 11 | 1011 | b |
| 12 | 1100 | c |
| 13 | 1101 | d |
| 14 | 1110 | e |
| 15 | 1111 | f |

### Por que hexadecimal

Olhe a tabela: cada dígito hexadecimal corresponde exatamente a **quatro bits**. Isso é o que o torna conveniente. Um grupo de 16 bits vira quatro dígitos hexadecimais, um para cada quatro bits, e a conversão é direta, sem contas complicadas. Se o IPv6 fosse escrito em decimal, como o IPv4, cada grupo de 16 bits precisaria de até cinco dígitos (de 0 a 65535) e a relação com os bits ficaria escondida.

> **Conceito-chave**
>
> Cada dígito **hexadecimal** representa **4 bits**. Um grupo de um endereço IPv6 tem 4 dígitos, logo 16 bits.

### Convertendo binário para hexadecimal

Pegue um grupo de 16 bits, separe em quatro pedaços de 4 bits e traduza cada pedaço pela tabela.

> **Exemplo**
>
> Converter `0000110110111000` para hexadecimal.
>
> 1. Separe em blocos de 4 bits: `0000` `1101` `1011` `1000`
> 2. Traduza cada bloco pela tabela: 0000 = 0, 1101 = d, 1011 = b, 1000 = 8
> 3. Junte: `0db8`
> Esse é o segundo grupo do endereço que usamos desde a seção 3.1.

### Convertendo hexadecimal para binário

O caminho inverso: cada dígito vira 4 bits.

> **Exemplo**
>
> Converter `fe80` para binário.
> f = 1111, e = 1110, 8 = 1000, 0 = 0000
> Resultado: `1111 1110 1000 0000`
> Esse é o primeiro grupo de todo endereço link-local, que você vai ver na seção 3.8. Repare que ele começa com dez bits 1111111010: é isso que define o prefixo fe80::/10.

### E o decimal?

Você raramente vai precisar converter grupos IPv6 para decimal. Mas se precisar, cada posição hexadecimal vale uma potência de 16: da direita para a esquerda, 1, 16, 256 e 4096.

> **Exemplo**
>
> `0db8` em decimal:
> 0 × 4096 + 13 × 256 + 11 × 16 + 8 × 1 = 0 + 3328 + 176 + 8 = **3512**

> **Atenção**
>
> Letras maiúsculas e minúsculas representam o mesmo valor: `0DB8` e `0db8` são idênticos. A recomendação oficial (RFC 5952) é escrever sempre em **minúsculas**. Este manual segue essa regra.

> **Vamos praticar**
>
> 1. Converta para hexadecimal: `1010`, `0011`, `1111`.
> 2. Converta o grupo de 16 bits `0010000000000001` para hexadecimal.
> 3. Converta o grupo `abcd` para binário.
> 4. Quantos bits representa o grupo `ffff`? Qual é o seu valor em decimal?
>
> **Gabarito**
>
> 1. a, 3, f.
> 2. `0010` `0000` `0000` `0001` = `2001`. Sim, o primeiro grupo do nosso endereço de exemplo.
> 3. a = 1010, b = 1011, c = 1100, d = 1101: `1010 1011 1100 1101`.
> 4. 16 bits. Em decimal: 15 × 4096 + 15 × 256 + 15 × 16 + 15 = 65.535.

> **O que você precisa lembrar**
>
> Hexadecimal usa 16 símbolos (0 a 9 e a a f). Cada dígito vale 4 bits, então um grupo de quatro dígitos são 16 bits. Para converter, separe o binário em blocos de 4 e use a tabela. Escreva sempre em minúsculas.

---

## 3.4 Como ler um endereço IPv6

Você já conhece a estrutura, as duas metades e o hexadecimal. Esta seção junta tudo e mostra como um endereço IPv6 aparece na prática, em telas de configuração, em navegadores e em comandos, para que nenhuma forma de escrevê-lo pegue você de surpresa.

### Lendo em voz alta

Um endereço se lê grupo a grupo. `2001:db8::1` se lê "dois mil e um, dê bê oito, dois-pontos dois-pontos, um". Ninguém lê os bits nem converte nada; os grupos são pronunciados como se escrevem. Com a prática, endereços como `fe80::1` ou `2001:db8::` passam a ser reconhecidos de relance, como você reconhece `192.168.0.1` hoje.

### Onde o endereço aparece

**Na configuração de rede.** No Windows, o comando `ipconfig` mostra linhas como "Endereço IPv6" e "Endereço IPv6 de link local". No Linux e no macOS, `ip -6 addr` ou `ifconfig` mostram linhas começando com `inet6`. Você vai quase sempre ver o endereço já abreviado, com `::`, e frequentemente seguido de uma barra e um número (`/64`): esse número é o tamanho do prefixo, assunto da Parte 4.

**No navegador.** Aqui mora uma pegadinha. Um endereço IPv6 usa dois-pontos, e o navegador também usa dois-pontos para separar a porta (como em `localhost:8080`). Para não confundir os dois, o endereço IPv6 em uma URL vai **entre colchetes**:

`http://[2001:db8::1]/`

`http://[2001:db8::1]:8080/`

No segundo exemplo, `8080` é a porta e tudo dentro dos colchetes é o endereço. Sem os colchetes, o navegador não sabe onde termina o endereço e começa a porta.

**Com identificador de zona.** Alguns endereços aparecem com um símbolo de porcentagem e um nome ou número no fim:

`fe80::1c2a:8bff:fe3e:42%eth0` (Linux)

`fe80::1c2a:8bff:fe3e:42%12` (Windows)

A parte depois do `%` não é parte do endereço. É o nome da interface de rede por onde ele vale. Isso só acontece com endereços link-local, e a seção 3.8 explica o motivo.

> **Atenção**
>
> Se você copiar um endereço com `%eth0` no fim e colar em um lugar que espera um endereço "limpo", vai dar erro. O identificador de zona é uma informação local do seu computador; não faz sentido fora dele.

### Maiúsculas, minúsculas e zeros

Três regras simples, todas da RFC 5952, que define a forma recomendada de escrever endereços:

1. Letras em **minúsculas**.
2. **Zeros à esquerda** de cada grupo são omitidos: `0db8` vira `db8`, `0001` vira `1`, `0000` vira `0`.
3. A maior sequência de grupos zerados é substituída por `::`, uma única vez.

As regras 2 e 3 são a abreviação, assunto da próxima seção. Elas existem porque ninguém quer digitar `2001:0db8:0000:0000:0000:0000:0000:0001` quando pode digitar `2001:db8::1`.

> **Você sabia?**
>
> Os endereços que começam com `2001:db8` são reservados pela RFC 3849 para **documentação**. Eles nunca são atribuídos a ninguém, exatamente para que livros, manuais e exemplos possam usá-los sem apontar para uma rede real. É o equivalente IPv6 do "exemplo.com". Este manual os usa em todos os exemplos.

> **Vamos praticar**
>
> 1. Como se escreve o endereço `2001:db8::1` em uma URL, na porta 443?
> 2. No endereço `fe80::a1b2:c3d4%wlan0`, o que é `wlan0`?
> 3. Por que os endereços de exemplo deste manual começam com `2001:db8`?
> 4. Verdadeiro ou falso: `2001:DB8::1` e `2001:db8::1` são endereços diferentes.
>
> **Gabarito**
>
> 1. `https://[2001:db8::1]:443/`
> 2. O identificador de zona: o nome da interface de rede pela qual esse endereço link-local vale.
> 3. Porque `2001:db8::/32` é reservado para documentação e nunca é atribuído a uma rede real.
> 4. Falso. Maiúsculas e minúsculas são equivalentes; recomenda-se minúsculas.

> **O que você precisa lembrar**
>
> Um endereço se lê grupo a grupo. Em URLs ele vai entre colchetes para não confundir com a porta. Endereços link-local podem aparecer com `%interface` no fim, que não é parte do endereço. Escreva em minúsculas, omita zeros à esquerda e use `2001:db8::/32` para exemplos.

---

## 3.5 Representação e abreviação de endereços

Esta é a seção mais importante da Parte 3. Abreviar endereços parece detalhe, mas é onde a maioria dos erros acontece, e é impossível trabalhar com IPv6 sem dominar as duas regras.

### Regra 1: omitir zeros à esquerda

Dentro de cada grupo, os zeros que aparecem **antes** do primeiro dígito diferente de zero podem ser removidos. Zeros no meio ou no fim do grupo ficam.

| Grupo completo | Abreviado | Observação |
|---|---|---|
| 0db8 | db8 | um zero à esquerda removido |
| 0001 | 1 | três zeros removidos |
| 0000 | 0 | fica pelo menos um dígito |
| 00a0 | a0 | o zero do fim fica |
| 1000 | 1000 | nenhum zero à esquerda |

> **Exemplo**
>
> `2001:0db8:0000:0000:0000:0000:0000:0001`
> Aplicando a regra 1 em cada grupo:
> `2001:db8:0:0:0:0:0:1`
> Já ficou bem menor. Mas ainda dá para melhorar.

### Regra 2: comprimir zeros com "::"

Uma **sequência de um ou mais grupos inteiramente zerados** pode ser substituída por dois-pontos duplos, `::`. Isso só pode ser feito **uma vez** no endereço.

> **Exemplo**
>
> `2001:db8:0:0:0:0:0:1`
> Os grupos 3 a 7 são todos zero. Substituímos a sequência por `::`:
> `2001:db8::1`
> De 39 caracteres para 11. Esse é o endereço em sua forma final.

Por que só uma vez? Porque, na expansão, quem lê precisa saber quantos grupos o `::` está escondendo. Como o endereço tem sempre oito grupos, basta contar os grupos que sobraram e a diferença é o que o `::` representa. Se houvesse dois `::`, não daria para saber quantos grupos cada um esconde.

> **Atenção**
>
> `2001:db8::1::5` é **inválido**. Existem dois `::`, e é impossível saber se o endereço é `2001:db8:0:1:0:0:0:5`, `2001:db8:0:0:1:0:0:5` ou outra combinação. Quando o endereço tem duas sequências de zeros, só uma pode virar `::`; a outra fica escrita como `0`.

### Regras de desempate (RFC 5952)

Quando o endereço tem mais de uma sequência de zeros, a RFC 5952 define qual delas vira `::`:

1. Comprima a sequência **mais longa**.
2. Se houver empate, comprima a **primeira** (a mais à esquerda).
3. Nunca use `::` para comprimir um **único** grupo zerado; escreva `0`.

> **Exemplo**
>
> `2001:db8:0:0:1:0:0:1`
> Há duas sequências de dois zeros (grupos 3 e 4; grupos 6 e 7). Empate: comprime a primeira.
> Forma correta: `2001:db8::1:0:0:1`
> Forma aceita mas não recomendada: `2001:db8:0:0:1::1`
>
> `2001:db8:0:1:2:3:4:5`
> Só um grupo zerado (grupo 3). A regra 3 diz para não comprimir.
> Forma correta: `2001:db8:0:1:2:3:4:5`
> Forma aceita mas não recomendada: `2001:db8::1:2:3:4:5`

Os sistemas aceitam as formas "não recomendadas" sem erro. A regra existe para que um mesmo endereço seja sempre escrito do mesmo jeito, o que facilita comparar, buscar em logs e evitar duplicatas em configurações.

### Casos especiais

- **Todos os grupos zero:** `0000:0000:0000:0000:0000:0000:0000:0000` vira `::`. É o endereço "não especificado", que você verá na seção 3.7.
- **Só o último grupo diferente de zero:** `::1` é o endereço de loopback, equivalente ao `127.0.0.1` do IPv4.
- **Só os primeiros grupos diferentes de zero:** `2001:db8::` é um endereço que termina em zeros; costuma representar o prefixo de uma rede.

> **Vamos praticar**
>
> Abreviar cada endereço na forma recomendada pela RFC 5952.
>
> 1. `2001:0db8:0000:0000:0000:ff00:0042:8329`
> 2. `fe80:0000:0000:0000:0000:0000:0000:0001`
> 3. `2001:0db8:0000:0001:0000:0000:0000:0001`
> 4. `2001:0db8:00ab:0000:0000:0000:0000:0000`
> 5. `0000:0000:0000:0000:0000:0000:0000:0001`
> 6. `2001:0db8:0001:0000:0002:0000:0003:0004`
>
> **Gabarito**
>
> 1. `2001:db8::ff00:42:8329`
> 2. `fe80::1`
> 3. `2001:db8:0:1::1` (a sequência mais longa é a de três zeros nos grupos 5 a 7; o zero do grupo 3 fica escrito)
> 4. `2001:db8:ab::`
> 5. `::1`
> 6. `2001:db8:1:0:2:0:3:4` (dois grupos zerados isolados; nenhum pode virar `::` porque a regra 3 proíbe comprimir grupo único)

> **O que você precisa lembrar**
>
> Regra 1: remova zeros à esquerda de cada grupo. Regra 2: substitua a maior sequência de grupos zerados por `::`, só uma vez; em empate, a primeira; nunca comprima um grupo sozinho. Escreva em minúsculas. `2001:0db8:0000:0000:0000:0000:0000:0001` é `2001:db8::1`.

---

## 3.6 Expansão de endereços abreviados

A abreviação você já domina. Agora o caminho inverso: dado um endereço com `::`, reconstruir os oito grupos completos. Você vai precisar disso sempre que for comparar endereços, calcular prefixos ou entender a saída de um comando.

### O método

1. Conte quantos grupos estão escritos (os separados por `:` simples, de cada lado do `::`).
2. Subtraia esse número de 8. O resultado é quantos grupos de `0000` o `::` representa.
3. Substitua o `::` por essa quantidade de grupos `0000`.
4. Complete cada grupo com zeros à esquerda até ter quatro dígitos.

> **Exemplo**
>
> Expandir `2001:db8::ff00:42:8329`.
>
> 1. Grupos escritos: `2001`, `db8` à esquerda do `::`; `ff00`, `42`, `8329` à direita. Total: 5.
> 2. 8 menos 5 = 3. O `::` representa três grupos zerados.
> 3. `2001:db8:0000:0000:0000:ff00:42:8329`
> 4. Completar com zeros: `2001:0db8:0000:0000:0000:ff00:0042:8329`

> **Exemplo**
>
> Expandir `::1`.
>
> 1. Grupos escritos: nenhum à esquerda; `1` à direita. Total: 1.
> 2. 8 menos 1 = 7.
> 3. `0000:0000:0000:0000:0000:0000:0000:1`
> 4. `0000:0000:0000:0000:0000:0000:0000:0001`

> **Exemplo**
>
> Expandir `fe80::`.
>
> 1. Grupos escritos: `fe80`. Total: 1.
> 2. 8 menos 1 = 7.
> 3. e 4. `fe80:0000:0000:0000:0000:0000:0000:0000`

### Um erro comum

Quando o endereço não tem `::`, ele já tem oito grupos: só falta completar os zeros à esquerda. Não invente grupos.

> **Atenção**
>
> `2001:db8:1:0:2:0:3:4` não tem `::`. Conte: são oito grupos. A expansão é só completar os zeros: `2001:0db8:0001:0000:0002:0000:0003:0004`. Um erro frequente é "achar" que os zeros isolados precisam de expansão extra e acabar com nove ou dez grupos, o que é inválido.

### Para que serve expandir

Na maior parte do tempo você vai trabalhar com endereços abreviados. Expandir é útil em três situações:

- **Comparar dois endereços** que podem ter sido abreviados de formas diferentes: expandidos, ou são idênticos ou não são.
- **Calcular o prefixo de rede** em blocos que não terminam em grupo inteiro (um /56, por exemplo), como você verá na Parte 4.
- **Conferir se um endereço é válido:** se ao expandir você não chega a exatamente oito grupos de quatro dígitos, o endereço está errado.

> **Vamos praticar**
>
> Expandir para a forma completa de oito grupos.
>
> 1. `2001:db8::1`
> 2. `fe80::1c2a:8bff:fe3e:42`
> 3. `2001:db8:ab::`
> 4. `::`
> 5. `2001:db8:0:1::1`
> 6. Os endereços `2001:db8::1:0:0:1` e `2001:db8:0:0:1::1` são o mesmo endereço?
>
> **Gabarito**
>
> 1. `2001:0db8:0000:0000:0000:0000:0000:0001`
> 2. `fe80:0000:0000:0000:1c2a:8bff:fe3e:0042`
> 3. `2001:0db8:00ab:0000:0000:0000:0000:0000`
> 4. `0000:0000:0000:0000:0000:0000:0000:0000`
> 5. `2001:0db8:0000:0001:0000:0000:0000:0001`
> 6. Sim. Expandidos, ambos dão `2001:0db8:0000:0000:0001:0000:0000:0001`. A primeira forma é a recomendada.

> **O que você precisa lembrar**
>
> Para expandir: conte os grupos escritos, subtraia de 8, substitua o `::` por essa quantidade de `0000` e complete cada grupo com zeros à esquerda. Um endereço sem `::` já tem oito grupos. Expandir serve para comparar, calcular prefixos e validar.

---

## 3.7 Tipos de endereços IPv6

Nem todo endereço IPv6 serve para a mesma coisa. Assim como no IPv4 existem endereços públicos, privados, de loopback e reservados, o IPv6 tem tipos definidos pelos **primeiros bits** do endereço. A boa notícia: olhando o primeiro grupo, você identifica o tipo na hora.

### A tabela dos tipos

| Começa com | Prefixo | Tipo | Equivalente no IPv4 |
|---|---|---|---|
| `2` ou `3` | 2000::/3 | **Global unicast**: o endereço "público", roteável na Internet | endereço público |
| `fd` (e `fc`) | fc00::/7 | **Unique local (ULA)**: o "privado", vale só dentro de uma organização | 10.x, 172.16.x, 192.168.x |
| `fe8`, `fe9`, `fea`, `feb` | fe80::/10 | **Link-local**: vale só no enlace local, criado automaticamente | 169.254.x (APIPA) |
| `ff` | ff00::/8 | **Multicast**: grupo de interfaces | 224.x a 239.x |
| `::1` | ::1/128 | **Loopback**: o próprio dispositivo | 127.0.0.1 |
| `::` | ::/128 | **Não especificado**: "ainda não tenho endereço" | 0.0.0.0 |
| `2001:db8` | 2001:db8::/32 | **Documentação**: só para exemplos | 192.0.2.x, 198.51.100.x, 203.0.113.x |

### Cada tipo em detalhe

**Global unicast (2000::/3).** É o endereço que identifica um dispositivo na Internet inteira. Todo endereço que começa com `2` ou `3` é global. Na prática hoje quase todos começam com `2`: `2001:`, `2804:` (comum no Brasil), `2a00:` (Europa), `2600:` (Estados Unidos). É o provedor que entrega esses endereços, em blocos, e o dispositivo monta o seu a partir do prefixo anunciado pelo roteador. Todo dispositivo com Internet IPv6 tem pelo menos um endereço global.

**Unique local (fc00::/7).** É o equivalente ao endereço privado do IPv4: vale dentro de uma organização, não é roteado na Internet e pode ser usado sem pedir a ninguém. Na prática usa-se sempre a metade `fd00::/8`, com 40 bits gerados aleatoriamente depois do `fd` para que duas organizações não escolham o mesmo bloco por acaso (a RFC 4193 define como gerar). Diferente do IPv4, não é comum precisar de ULA numa rede doméstica, porque todo dispositivo já tem endereço global; ULA aparece em redes internas que precisam funcionar mesmo sem Internet.

**Link-local (fe80::/10).** Todo dispositivo IPv6 tem um, em toda interface, criado sozinho e sem depender de roteador. Vale só dentro do enlace (a rede local física) e nunca é roteado. É por ele que o dispositivo conversa com o roteador durante a autoconfiguração. A seção 3.8 é inteira sobre ele.

**Multicast (ff00::/8).** Identifica um grupo, como você viu na seção 2.5. O segundo dígito depois do `ff` diz o alcance: `ff02::` é o enlace local, `ff05::` é o site, `ff0e::` é global. Os endereços que mais aparecem são `ff02::1` (todos os nós do enlace) e `ff02::2` (todos os roteadores do enlace). Multicast nunca aparece como origem de um pacote.

**Loopback (::1).** Aponta para o próprio dispositivo. Quando um programa conecta em `::1`, o pacote nem sai da placa de rede. Serve para testar se a pilha IPv6 do sistema está funcionando: `ping ::1`.

**Não especificado (::).** Todos os bits em zero. Usado como origem quando o dispositivo ainda não tem endereço, por exemplo no primeiro passo da autoconfiguração, quando ele confere se o endereço que pretende usar já está em uso. Nunca é destino.

**Documentação (2001:db8::/32).** Reservado para livros e exemplos. Nunca é atribuído. Já vimos na seção 3.4.

> **Você sabia?**
>
> O bloco 2000::/3 corresponde a apenas um oitavo de todo o espaço IPv6, e mesmo assim contém 2^125 endereços. Tudo o que está fora dele (ULA, link-local, multicast e blocos ainda não definidos) ocupa os outros sete oitavos. Os projetistas deixaram a maior parte do espaço em branco, de propósito, para usos que ainda não foram inventados.

### Endereços especiais que você pode encontrar

Há alguns formatos que aparecem em situações específicas e vale reconhecer:

- `::ffff:192.0.2.1`: um endereço IPv4 "embrulhado" em IPv6, chamado **IPv4-mapped**. Aparece em logs de servidores com pilha dupla quando um cliente IPv4 se conecta. Não é um endereço IPv6 de verdade; é o sistema representando um IPv4 no formato IPv6.
- `64:ff9b::192.0.2.1`: prefixo usado pelo **NAT64**, mecanismo de tradução que você vai ver na Parte 6.
- `2002::/16`: bloco do antigo túnel 6to4, hoje obsoleto. Se aparecer, é sinal de configuração antiga.

> **Atenção**
>
> Um dispositivo IPv6 normalmente tem **vários endereços ao mesmo tempo**: pelo menos um link-local e um global por interface, muitas vezes mais de um global (um estável e um temporário, para privacidade), e o loopback. Isso é normal e esperado. No IPv4 você estava acostumado a "um endereço por placa"; no IPv6 esqueça essa ideia.

> **Vamos praticar**
>
> Classifique cada endereço pelo tipo.
>
> 1. `2804:14d:1234::1`
> 2. `fe80::1`
> 3. `ff02::2`
> 4. `fd12:3456:789a::1`
> 5. `::1`
> 6. `2001:db8::42`
> 7. `::`
> 8. `3ffe:1900::1`
> 9. Um dispositivo mostra os endereços `fe80::a1`, `2804:14d:1::a1` e `2804:14d:1:0:5c3e:91ff:fe22:1b7`. Isso é normal? Explique.
>
> **Gabarito**
>
> 1. Global unicast (começa com 2).
> 2. Link-local.
> 3. Multicast (todos os roteadores do enlace).
> 4. Unique local (ULA).
> 5. Loopback.
> 6. Global unicast, mas do bloco de documentação: só para exemplos.
> 7. Não especificado.
> 8. Global unicast (começa com 3; o bloco 3ffe::/16 foi usado em testes antigos e hoje está desativado, mas pertence a 2000::/3).
> 9. Sim. Um link-local e dois globais na mesma rede (`2804:14d:1::/64`), provavelmente um configurado manualmente e outro montado automaticamente.

> **O que você precisa lembrar**
>
> O tipo de um endereço está nos primeiros bits: `2` ou `3` é global, `fd` é unique local, `fe80` é link-local, `ff` é multicast, `::1` é loopback, `::` é não especificado e `2001:db8` é documentação. Um dispositivo tem vários endereços ao mesmo tempo.

---

## 3.8 Endereço link-local: por que toda interface tem um

Esta seção é dedicada a um tipo de endereço que confunde quase todo iniciante. Você vai vê-lo em qualquer computador, mesmo em redes sem nenhum IPv6 na Internet, e vai vê-lo como gateway das suas redes. Depois desta seção, ele deixa de ser mistério.

### O que é

> **Conceito-chave**
>
> Um endereço **link-local** é um endereço que começa com `fe80::/10`, que **toda interface IPv6 cria sozinha** ao ser ativada e que vale **apenas dentro do enlace** (a rede local física, como um Wi-Fi ou um cabo). Ele nunca é roteado para fora.

"Enlace" (em inglês, *link*) é o conjunto de dispositivos que estão diretamente conectados entre si, sem roteador no meio: todos os dispositivos ligados ao mesmo Wi-Fi, ou ao mesmo switch. Um endereço link-local identifica o dispositivo dentro desse conjunto e só faz sentido lá.

### Por que ele existe

Pense no problema que a autoconfiguração precisa resolver. Um dispositivo acabou de ser ligado. Ele não tem endereço nenhum. Para conseguir um endereço global, ele precisa conversar com o roteador. Mas como conversar com alguém se você não tem endereço para colocar como origem?

A solução do IPv6 é elegante: o dispositivo cria, sozinho e sem perguntar a ninguém, um endereço que só precisa ser único dentro do enlace. Ele junta o prefixo fixo `fe80::/64` com um identificador de interface que ele mesmo gera (a partir do endereço MAC ou aleatoriamente). Pronto: agora ele tem um endereço válido para falar com os vizinhos, incluindo o roteador, e pode pedir o prefixo global.

Por isso o link-local existe **antes** de qualquer outro endereço e **independentemente** de haver roteador, provedor ou Internet. Ligue um cabo entre dois notebooks e eles já conseguem trocar pacotes IPv6 pelos endereços link-local, sem configurar nada.

> **Exemplo**
>
> Você abre a configuração de rede de um computador numa rede que só tem IPv4 (o provedor nem oferece IPv6). Mesmo assim aparece uma linha como:
> `inet6 fe80::1c2a:8bff:fe3e:42/64 scope link`
> Isso não é erro nem "IPv6 configurado por engano". É o link-local, que existe sempre. O computador não tem endereço global, então não navega em IPv6, mas está pronto para se autoconfigurar no instante em que um roteador anunciar um prefixo.

### O gateway é link-local

Aqui vem a parte que mais surpreende quem vem do IPv4. Na seção 1.5 você viu que o gateway padrão é o roteador da rede, e no IPv4 ele tem um endereço como `192.168.0.1`. No IPv6, o gateway padrão costuma ser o endereço **link-local** do roteador, algo como `fe80::1` ou `fe80::a2b3:c4ff:fed5:e6f7`.

O motivo é simples: o dispositivo descobre o roteador pelo anúncio que ele faz (Router Advertisement), e esse anúncio sai do endereço link-local do roteador. Como o roteador está no mesmo enlace, o link-local basta para chegar até ele. Não há razão para usar o endereço global do roteador como gateway.

> **Atenção**
>
> Ver `fe80::...` como gateway padrão em `ipconfig` ou `ip -6 route` é **normal e correto**. Não é sinal de que "o IPv6 não pegou endereço de verdade". O endereço global do seu dispositivo aparece em outra linha; o gateway é link-local por design.

### O identificador de zona

Como o mesmo endereço link-local pode existir em enlaces diferentes (um `fe80::1` no Wi-Fi e outro `fe80::1` no cabo, por exemplo), quando o computador tem mais de uma interface ele precisa saber por qual delas mandar o pacote. É isso que o **identificador de zona** faz: `fe80::1%eth0` significa "o `fe80::1` que está no enlace da interface eth0". No Windows a zona é um número (`%12`); no Linux e no macOS é o nome da interface (`%eth0`, `%wlan0`, `%en0`).

Por isso, para dar `ping` em um endereço link-local, você indica a interface:

`ping fe80::1%eth0` (Linux/macOS, ou `ping -6 fe80::1%12` no Windows)

Endereços globais não precisam disso, porque são únicos no mundo e o sistema sabe para onde mandá-los pela tabela de rotas.

### O que o link-local faz no dia a dia

- Serve de origem e destino para toda a **descoberta de vizinhos** (Neighbor Discovery), que substitui o ARP do IPv4.
- É o endereço de onde o roteador **anuncia o prefixo** e o endereço que os dispositivos usam como **gateway**.
- Permite que dispositivos no mesmo enlace conversem **mesmo sem roteador**: dois computadores ligados por cabo, uma impressora e um notebook no mesmo Wi-Fi.
- Nunca sai do enlace. Se você tentar mandar um pacote para um link-local que não está na sua rede, ele simplesmente não vai.

> **Você sabia?**
>
> O identificador de interface do link-local costuma ser gerado a partir do endereço MAC da placa, num formato chamado EUI-64: pega-se os 48 bits do MAC, inserem-se `ff:fe` no meio e inverte-se um bit. É por isso que tantos endereços link-local (e globais) têm `ff:fe` no meio, como `fe80::1c2a:8bff:fe3e:42`. Sistemas modernos muitas vezes preferem gerar o identificador aleatoriamente, por privacidade, e aí o `ff:fe` não aparece. A seção 4.5 volta a esse assunto.

> **Vamos praticar**
>
> 1. Um computador está numa rede sem IPv6 no provedor. Ele tem algum endereço IPv6? Qual?
> 2. Por que o dispositivo consegue criar o link-local sem falar com ninguém?
> 3. O gateway padrão IPv6 de um notebook aparece como `fe80::1`. Isso está errado?
> 4. O que significa o `%wlan0` em `fe80::1%wlan0`? Em que situação ele é necessário?
> 5. É possível acessar um servidor pelo endereço link-local dele a partir de outra rede? Por quê?
>
> **Gabarito**
>
> 1. Sim, o link-local (fe80::...), que toda interface cria sozinha.
> 2. Porque o prefixo é fixo (fe80::/64) e o identificador é gerado localmente; ele só precisa ser único no enlace, o que é conferido depois com os vizinhos.
> 3. Não. O gateway IPv6 é normalmente o endereço link-local do roteador, porque é dele que sai o anúncio do prefixo.
> 4. É o identificador de zona: indica a interface (wlan0) pela qual o endereço vale. É necessário quando o computador tem mais de uma interface e o endereço é link-local.
> 5. Não. Endereços link-local nunca são roteados; valem só dentro do próprio enlace.

> **O que você precisa lembrar**
>
> Todo dispositivo IPv6 tem um endereço link-local (fe80::/10) em cada interface, criado sozinho, válido só no enlace e nunca roteado. Ele existe antes de qualquer outro endereço e é por ele que a autoconfiguração acontece. O gateway padrão IPv6 é normalmente link-local. O `%interface` no fim indica por onde ele vale.
