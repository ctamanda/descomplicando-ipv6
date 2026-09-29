## Sobre a autora

Amanda Ribeiro da Costa é estudante de Sistemas de Informação na Universidade Estadual do Tocantins (Unitins), em Palmas. Este manual é o produto do seu Estágio Supervisionado I, orientado pelo professor Alysson Martins Bruno.

A ideia nasceu de uma observação repetida em sala de aula, em conversas com colegas e no próprio percurso dela: basta alguém ouvir "IPv6" para já achar que é assunto de especialista. Endereço comprido, cheio de letras, dois-pontos duplos no meio. A reação quase sempre é a mesma, um passo para trás. Só que, quando ela foi estudar de verdade, percebeu que o medo vinha da falta de explicação, e não da dificuldade do conteúdo. Cada pedaço do IPv6 faz sentido quando alguém explica o pedaço anterior primeiro.

Foi isso que ela quis fazer aqui: pegar o assunto que assusta e mostrar, uma peça de cada vez, que ele não é o bicho de sete cabeças que parece. Se depois deste manual você olhar para um endereço IPv6 e conseguir lê-lo com calma, o objetivo foi cumprido.

## Prefácio

Quando comecei a estudar IPv6, tudo parecia um muro. Os endereços eram longos e cheios de letras, os textos assumiam que eu já sabia o que era um prefixo, um Router Advertisement, um /64, e os poucos materiais em português pulavam direto para a configuração. Eu não queria configurar nada ainda. Eu queria entender.

Foi assim que surgiu a ideia deste manual. Ele foi escrito para a pessoa que eu era no início: alguém curioso, sem base em redes, que precisava que cada conceito fosse explicado antes de ser usado. Aqui nada é dado como óbvio. Cada parte começa com o que é necessário para entender a próxima, e o leitor avança no seu ritmo.

O IPv6 não é o futuro da Internet. É o presente. Mais da metade do tráfego dos maiores serviços do mundo já chega por ele, e no Brasil quase metade dos usuários já o utiliza sem saber. Aprender IPv6 hoje é aprender como a Internet funciona de fato.

Espero que este material ajude você a derrubar o muro que eu tive que derrubar.

*Amanda Ribeiro da Costa. Palmas, Tocantins, 2026.*

## Apresentação

Este manual faz parte da plataforma **Descomplicando o IPv6**, um ambiente web educacional que reúne o texto que você tem em mãos, exercícios por seção e um quiz de avaliação por níveis. Ele pode ser lido no site, seção por seção, ou baixado na íntegra em PDF para estudo offline.

### Para quem é

Para quem nunca estudou redes de computadores; para estudantes de Tecnologia da Informação, Sistemas de Informação e cursos afins; para profissionais iniciantes que precisam entender os fundamentos do IPv6; e para quem já conhece o assunto e quer revisar.

### Como o manual está organizado

O conteúdo segue uma sequência progressiva em seis partes:

- **Parte 1, Introdução às redes:** o vocabulário mínimo (rede, pacote, roteador, endereço IP, máscara) e a história do esgotamento do IPv4.
- **Parte 2, Conhecendo o IPv6:** o que é, por que surgiu, o que muda em relação ao IPv4.
- **Parte 3, Endereçamento IPv6:** como ler, abreviar, expandir e classificar um endereço.
- **Parte 4, Prefixos e sub-redes:** como interpretar um prefixo e dividir uma rede.
- **Parte 5, IPv6 na prática:** como um dispositivo ganha endereço (NDP, SLAAC, DHCPv6) e como verificar a própria configuração.
- **Parte 6, Roteamento e coexistência:** como os pacotes saem da rede local e como IPv6 e IPv4 convivem hoje.

Ao final há um glossário com todos os termos técnicos e a lista de referências.

### Recursos didáticos

Ao longo do texto você vai encontrar seis tipos de bloco:

- **Conceito-chave:** a definição que você precisa dominar para seguir adiante.
- **Você sabia?:** curiosidades e informações complementares.
- **Exemplo:** uma situação prática explicada passo a passo.
- **Atenção:** erros comuns e conceitos que costumam confundir.
- **Vamos praticar:** exercícios curtos com gabarito ao final da seção.
- **O que você precisa lembrar:** o resumo da seção em poucas frases.

### Como estudar

A plataforma sugere um ciclo em quatro etapas: **aprender** (ler a seção), **compreender** (usar os exemplos e blocos de apoio), **praticar** (resolver os exercícios) e **avaliar** (fazer o quiz do nível correspondente). Sempre que errar uma questão do quiz, o sistema indica a seção do manual para revisar.

### Fontes e licença

O conteúdo foi elaborado a partir do livro *IPv6: O Novo Protocolo da Internet*, de Samuel Henrique Bucke Brito (Novatec, 2013), do *Laboratório de IPv6* do NIC.br (2015, licença CC BY-NC-SA 4.0) e das RFCs da IETF que definem o protocolo; as referências completas estão ao final. Este manual não cobre segurança em IPv6 nem oferece laboratório com máquinas virtuais: para praticar em ambiente real, recomendamos o Laboratório de IPv6 do NIC.br, gratuito em lab.ipv6.br.
