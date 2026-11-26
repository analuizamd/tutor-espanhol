# Vídeos do Hola Tutor: roteiros e como gerar

Este arquivo traz tudo o que é preciso para gerar os **11 vídeos de conversa** do Hola Tutor, um jogo para aprender espanhol nos níveis **A1 e A2** (iniciante e básico). Dá para entregá-lo inteiro ao seu Claude (Claude Code) e pedir que ele gere os vídeos. Na seção 3 há um prompt pronto para colar.

**Como o app usa os vídeos:** o aluno assiste ao vídeo e o **app mostra a legenda embaixo do player**. Cada palavra da legenda pode ser tocada para ver a tradução. Depois do vídeo vêm perguntas sobre o que foi dito. Por isso a legenda e a fala precisam bater **exatamente** com o roteiro.

---

## 1. O que entregar

Para **cada** vídeo da lista (seção 5), entregue 2 arquivos obrigatórios e 1 opcional, todos com o **id do vídeo** como nome:

| Arquivo | O que é | Obrigatório? |
|---|---|---|
| `<id>.mp4` | O vídeo | Sim |
| `<id>.vtt` | A legenda no formato WebVTT, com os tempos de cada fala | Sim |
| `<id>.jpg` | Capa (1280×720), de preferência o cartão de título | Opcional |

Exemplo: `a1-01-saludos.mp4`, `a1-01-saludos.vtt`, `a1-01-saludos.jpg`.

Entregue tudo numa pasta `videos/` (ou num .zip). No projeto, os arquivos vão para `public/videos/`, e o app detecta o vídeo sozinho, sem mudar nenhum código.

### Especificações técnicas do vídeo

- **Formato:** MP4, vídeo H.264 (`yuv420p`), áudio AAC 128 kbps, com `-movflags +faststart` (para começar a tocar rápido na web)
- **Tamanho:** 1280×720 (16:9), 30 fps
- **Peso:** até ~10 MB por vídeo (cenas quase paradas comprimem muito; CRF 28 costuma bastar)
- **Duração:** entre 40 e 75 segundos (cada roteiro traz a duração-alvo)

### ⚠️ As 4 regras que não podem falhar

1. **NÃO queimar legenda no vídeo.** O app mostra a própria legenda (clicável) embaixo do player. Se o vídeo também tiver legenda, o aluno vê tudo duplicado. O único texto permitido na tela é o cartão de título, os nomes dos personagens e o cartão do «Recuerda» (ver seção 2).
2. **Uma legenda (cue) por fala, na mesma ordem do roteiro.** O vídeo 1 tem 10 falas, então o `.vtt` dele tem exatamente 10 legendas. O app liga cada legenda à fala correspondente **pela ordem**. Se a quantidade não bater, o app ignora os tempos do vídeo.
3. **O texto de cada legenda é a fala em espanhol exatamente como está no roteiro** (com acentos, ¿ ¡ e «»). Não traduza nem resuma.
4. **Fale exatamente o roteiro.** Não improvise nem acrescente frases: as perguntas do app se referem a falas específicas.

### Formato do `.vtt`

```
WEBVTT

1
00:00:02.500 --> 00:00:08.200
<v Profe Carmen>¡Hola! Soy Carmen, tu profesora. Hoy vamos a aprender a saludar y a presentarnos.

2
00:00:09.000 --> 00:00:10.600
<v Diego>¡Hola! Buenos días.
```

- O início (`-->` à esquerda) é quando a pessoa **começa a falar**; o fim, quando termina.
- O `<v Nome>` (tag de voz) é opcional; o app o ignora.
- O cartão de título no começo **não** tem legenda: a primeira legenda começa depois dele.

---

## 2. Estrutura de todo vídeo

Todos os vídeos seguem o mesmo formato, porque o aluno se acostuma:

1. **Cartão de título** (2,5 s, sem fala): fundo liso com o código e o título da aula, ex.: «A1.1 · ¡Hola! ¿Cómo te llamas?».
2. **Abertura da Profe Carmen** (1ª fala): ela olha para a câmera e diz o que vamos aprender.
3. **Diálogo** entre os personagens, no cenário descrito.
4. **«Recuerda»** (última fala, também da Profe Carmen): enquanto ela fala, mostre na tela um cartão com as frases-chave da aula (listadas em cada roteiro).
5. **Final** (1,5 s): o logo/nome «Hola Tutor» ou só um fade out.

**Ritmo:** é para iniciantes, então fale **devagar e claro** (a velocidade de voz sugerida está em cada roteiro) e deixe **~0,6 s de pausa entre as falas**.

**Estilo visual:** ilustração flat, cores quentes (terracota, areia, azul-marinho, verde-oliva e dourado), amigável e adulto, sem cara de infantil. Os personagens devem ter **sempre a mesma aparência** em todos os vídeos (ver Elenco).

---

## 3. Como gerar (forma fácil)

### Opção A (recomendada): 100% automática com Claude Code, de graça

Usa vozes neurais gratuitas com **sotaque de cada país** (Espanha, México, Argentina, Uruguai) e monta o vídeo com imagens fixas e animação leve. Não tem leitura labial, mas para A1/A2 funciona bem e fica pronto num dia.

**Ferramentas** (o Claude Code pode instalar):
- `ffmpeg` (`brew install ffmpeg` no Mac)
- `edge-tts` (`pip install edge-tts`): vozes neurais da Microsoft, gratuitas, que também dão a duração de cada fala
- Python com `Pillow` para montar os quadros

**Como o pipeline funciona:**
1. **Imagens:** gerar 1 retrato de cada personagem (corpo inteiro, fundo transparente) e 1 fundo para cada cenário. Pode ser com um gerador de imagens (ChatGPT, Gemini, Midjourney etc.) usando as descrições de aparência e de cenário deste arquivo, ou o próprio Claude pode desenhar em SVG no estilo flat e converter para PNG.
2. **Áudio:** para cada fala, gerar um MP3 com `edge-tts --voice <voz> --rate <velocidade> --text "<fala>"` e medir a duração com `ffprobe`. As vozes sugeridas estão no Elenco. Se alguma não existir na sua versão, rode `edge-tts --list-voices | grep es-` e escolha outra **do mesmo país** (es-ES = Espanha, es-MX = México, es-AR = Argentina, es-UY = Uruguai), mantendo a mesma voz para o personagem em todos os vídeos.
3. **Quadros:** para cada fala, montar uma imagem 1280×720: fundo + personagens da cena, com **quem fala em destaque** (maior, mais claro, com um leve contorno) e uma etiqueta com o nome. Nas falas da Profe Carmen, ela aparece num quadro próprio, olhando para a câmera. Na última fala, sobrepor o cartão «Recuerda».
4. **Montagem:** cada quadro fica na tela pela duração do áudio + 0,6 s (com um zoom lento opcional, via `zoompan`). Juntar: cartão de título + falas + final.
5. **Legenda:** somar as durações para obter o início e o fim de cada fala e escrever o `.vtt` (uma legenda por fala, na ordem).
6. **Conferir:** o número de legendas é igual ao de falas e o texto de cada legenda é igual à fala do roteiro.

**Prompt pronto para colar no Claude Code** (na mesma pasta onde está este arquivo):

> Leia o arquivo ROTEIROS.md. Quero gerar os 11 vídeos descritos nele seguindo a "Opção A". Use o JSON do Apêndice como fonte das falas. Crie um script Python que, para cada vídeo: (1) gera o áudio de cada fala com edge-tts usando a voz e a velocidade indicadas; (2) monta um quadro 1280×720 por fala com o fundo do cenário e os personagens, destacando quem fala; (3) junta tudo com ffmpeg num MP4 H.264/AAC com cartão de título de 2,5 s no início, 0,6 s de pausa entre falas e o cartão «Recuerda» na última fala; (4) escreve o arquivo .vtt com uma legenda por fala, na ordem, com o texto exato da fala; (5) gera uma capa .jpg com o cartão de título. Respeite as "4 regras que não podem falhar" da seção 1 (principalmente: sem legenda queimada no vídeo). Comece gerando só o vídeo `a1-01-saludos` para eu aprovar o visual antes de fazer os outros. As imagens dos personagens e dos cenários devem seguir as descrições do Elenco e de cada roteiro, no estilo visual da seção 2. Salve tudo em `videos/`.

### Opção B: avatares falantes (mais realista, pago)

Plataformas como HeyGen, Synthesia ou D-ID criam pessoas virtuais com leitura labial.
1. Crie um avatar para cada personagem do Elenco (aparência e sotaque).
2. Para cada vídeo, cole as falas na ordem, uma cena por fala.
3. Exporte o MP4 **sem legenda queimada** e a legenda em SRT.
4. Converta o SRT em VTT (o Claude faz isso) e **confira se há uma legenda por fala**: as plataformas às vezes quebram uma fala em duas, e nesse caso é preciso juntar.

### Opção C: gravar com pessoas de verdade

Ótimo para os sotaques. Gravem lendo o roteiro (celular na horizontal, 720p ou 1080p). Depois, peça ao Claude para gerar o `.vtt`: com o [Whisper](https://github.com/openai/whisper) ele transcreve, alinha os tempos e ajusta para uma legenda por fala com o texto exato do roteiro.

---

## 4. Elenco (os mesmos personagens em todos os vídeos)

| Chave no roteiro | Nome na tela | De onde é | Voz sugerida (edge-tts) | Aparência |
|---|---|---|---|---|
| `Carmen` | Profe Carmen | Madrid, España | `es-ES-ElviraNeural` | Professora, ~40 anos, cabelo castanho preso, óculos redondos, blazer mostarda, sorriso acolhedor. |
| `Lucía` | Lucía | Madrid, España | `es-ES-XimenaNeural` | 22 anos, cabelo preto curto (chanel), camiseta listrada vermelha e branca, brincos de argola. |
| `Diego` | Diego | Guadalajara, México | `es-MX-JorgeNeural` | 25 anos, cabelo cacheado, barba curta, camisa verde-oliva, mochila. |
| `Valentina` | Valentina | Montevideo, Uruguay | `es-UY-ValentinaNeural` | 23 anos, cabelo ruivo longo, jaqueta jeans, cachecol celeste. |
| `Mateo` | Mateo | Buenos Aires, Argentina | `es-AR-TomasNeural` | 24 anos, cabelo castanho bagunçado, moletom azul-marinho, sempre com uma garrafa térmica de mate. |
| `Camarero` | Camarero | Madrid, España | `es-ES-AlvaroNeural` | Garçom de ~50 anos, avental preto, bigode grisalho. |
| `Vendedora` | Vendedora | Buenos Aires, Argentina | `es-AR-ElenaNeural` | Vendedora de ~35 anos, crachá, cabelo loiro preso, roupa elegante. |
| `Señor Ruiz` | Señor Ruiz | Montevideo, Uruguay | `es-UY-MateoNeural` | Senhor de ~70 anos, boina, bengala, casaco marrom. |
| `Doctora López` | Doctora López | Ciudad de México, México | `es-MX-DaliaNeural` | Médica de ~45 anos, jaleco branco, estetoscópio, cabelo preto em coque. |

## 5. Lista dos vídeos

| # | Arquivo (id) | Nível | Título | Duração alvo |
|---|---|---|---|---|
| 1 | `a1-01-saludos` | A1 | ¡Hola! ¿Cómo te llamas? | ~50 s |
| 2 | `a1-02-origen` | A1 | ¿De dónde eres? | ~55 s |
| 3 | `a1-03-familia` | A1 | Mi familia | ~55 s |
| 4 | `a1-04-cafeteria` | A1 | En la cafetería | ~50 s |
| 5 | `a1-05-rutina` | A1 | ¿Qué hora es? | ~55 s |
| 6 | `a2-01-compras` | A2 | De compras | ~60 s |
| 7 | `a2-02-direcciones` | A2 | ¿Dónde está el museo? | ~55 s |
| 8 | `a2-03-fin-de-semana` | A2 | ¿Qué hiciste el fin de semana? | ~55 s |
| 9 | `a2-04-planes` | A2 | Planes para el sábado | ~55 s |
| 10 | `a2-05-medico` | A2 | En el médico | ~55 s |
| 11 | `a2-06-variedades` | A2 | Tú, vos y vosotros | ~60 s |

## 6. Roteiros

### Vídeo 1 — `a1-01-saludos` · ¡Hola! ¿Cómo te llamas?

- **Aula no app:** A1.1 · Cumprimentos e apresentações (A1)
- **Objetivo:** Cumprimentar, dizer o nome, perguntar como a pessoa está e se despedir.
- **Cenário:** Pátio de uma escola de idiomas em Madri, manhã ensolarada. Lucía e Diego se conhecem no primeiro dia de aula.
- **Personagens:** Profe Carmen (`es-ES-ElviraNeural`), Diego (`es-MX-JorgeNeural`), Lucía (`es-ES-XimenaNeural`)
- **Duração alvo:** ~50 s · **velocidade da voz:** `-20%`
- **Cartão de título (2,5 s, sem fala):** "A1.1 · ¡Hola! ¿Cómo te llamas?"

| # | Quem | Fala em espanhol (= texto exato da legenda) | Tradução (não vai no vídeo) | Direção de cena |
|---|---|---|---|---|
| 1 | Profe Carmen | ¡Hola! Soy Carmen, tu profesora. Hoy vamos a aprender a saludar y a presentarnos. | Olá! Sou Carmen, sua professora. Hoje vamos aprender a cumprimentar e a nos apresentar. | Carmen olha para a câmera e acena. |
| 2 | Diego | ¡Hola! Buenos días. | Oi! Bom dia. | Diego chega com a mochila e acena para Lucía. |
| 3 | Lucía | ¡Buenos días! ¿Cómo te llamas? | Bom dia! Como você se chama? | Lucía sorri, curiosa. |
| 4 | Diego | Me llamo Diego. ¿Y tú? | Eu me chamo Diego. E você? | Diego aponta para si mesmo em «Me llamo Diego». |
| 5 | Lucía | Yo me llamo Lucía. Mucho gusto. | Eu me chamo Lucía. Muito prazer. | Eles apertam as mãos. |
| 6 | Diego | Encantado, Lucía. ¿Cómo estás? | Encantado, Lucía. Como você está? | — |
| 7 | Lucía | Muy bien, gracias. ¿Y tú? | Muito bem, obrigada. E você? | Polegar para cima. |
| 8 | Diego | Bien también. ¡Hasta luego! | Bem também. Até logo! | Diego começa a se afastar. |
| 9 | Lucía | ¡Adiós, hasta luego! | Tchau, até logo! | Lucía acena. |
| 10 | Profe Carmen | Recuerda: para decir tu nombre, usa «me llamo». Para despedirte, «hasta luego». | Lembre: para dizer seu nome, use «me llamo». Para se despedir, «hasta luego». | Carmen mostra um cartaz com «Me llamo…» e «Hasta luego». |

**Cartão do «Recuerda» (aparece na tela durante a última fala da Profe Carmen):**

- **¿Cómo te llamas? — Me llamo…** — Como você se chama? — Eu me chamo…
- **Mucho gusto / Encantado, encantada** — Muito prazer
- **¿Cómo estás? — Muy bien, gracias. ¿Y tú?** — Como você está? — Muito bem, obrigado/a. E você?
- **Adiós / Hasta luego** — Tchau / Até logo

---

### Vídeo 2 — `a1-02-origen` · ¿De dónde eres?

- **Aula no app:** A1.2 · Origem, idade e números (A1)
- **Objetivo:** Dizer de onde você é, a sua idade e trocar números de telefone.
- **Cenário:** Festa de boas-vindas de intercambistas num terraço em Montevidéu, fim de tarde, luzinhas penduradas.
- **Personagens:** Profe Carmen (`es-ES-ElviraNeural`), Valentina (`es-UY-ValentinaNeural`), Diego (`es-MX-JorgeNeural`)
- **Duração alvo:** ~55 s · **velocidade da voz:** `-20%`
- **Cartão de título (2,5 s, sem fala):** "A1.2 · ¿De dónde eres?"

| # | Quem | Fala em espanhol (= texto exato da legenda) | Tradução (não vai no vídeo) | Direção de cena |
|---|---|---|---|---|
| 1 | Profe Carmen | Hola de nuevo. Hoy vamos a hablar de la edad y del país de origen. | Olá de novo. Hoje vamos falar da idade e do país de origem. | — |
| 2 | Valentina | Hola, Diego. ¿De dónde eres? | Oi, Diego. De onde você é? | Valentina segura um copo de suco. |
| 3 | Diego | Soy de México, de Guadalajara. ¿Y tú? | Sou do México, de Guadalajara. E você? | — |
| 4 | Valentina | Yo soy uruguaya, de Montevideo. | Eu sou uruguaia, de Montevidéu. | Ela aponta para a cidade ao fundo. |
| 5 | Diego | ¡Qué bien! ¿Cuántos años tienes? | Que legal! Quantos anos você tem? | — |
| 6 | Valentina | Tengo veintidós años. ¿Y tú? | Tenho vinte e dois anos. E você? | Mostra 2 e 2 com os dedos. |
| 7 | Diego | Yo tengo veinticinco. Y hablo un poco de portugués. | Eu tenho vinte e cinco. E falo um pouco de português. | Gesto de «um pouquinho» com os dedos. |
| 8 | Valentina | ¡Genial! ¿Me das tu número de teléfono? | Ótimo! Você me passa seu número de telefone? | Valentina pega o celular. |
| 9 | Diego | Claro: seis, dos, siete, cero, nueve. | Claro: seis, dois, sete, zero, nove. | Fala devagar, número por número. |
| 10 | Profe Carmen | Recuerda: «tengo veintidós años». En español, la edad se dice con el verbo «tener». | Lembre: «tengo veintidós años». Em espanhol, a idade se diz com o verbo «tener» (ter). | — |

**Cartão do «Recuerda» (aparece na tela durante a última fala da Profe Carmen):**

- **¿De dónde eres? — Soy de México.** — De onde você é? — Sou do México.
- **Soy uruguaya / Soy brasileño** — Nacionalidade com «ser»
- **¿Cuántos años tienes? — Tengo veintidós años.** — A idade usa «tener», não «ser»
- **cero, uno, dos, tres… diez, veinte** — Números de 0 a 20

---

### Vídeo 3 — `a1-03-familia` · Mi familia

- **Aula no app:** A1.3 · A família e os possessivos (A1)
- **Objetivo:** Falar da família e usar «mi» e «mis».
- **Cenário:** Café aconchegante em Madri. Lucía mostra fotos da família no celular para Valentina.
- **Personagens:** Profe Carmen (`es-ES-ElviraNeural`), Valentina (`es-UY-ValentinaNeural`), Lucía (`es-ES-XimenaNeural`)
- **Duração alvo:** ~55 s · **velocidade da voz:** `-20%`
- **Cartão de título (2,5 s, sem fala):** "A1.3 · Mi familia"

| # | Quem | Fala em espanhol (= texto exato da legenda) | Tradução (não vai no vídeo) | Direção de cena |
|---|---|---|---|---|
| 1 | Profe Carmen | Hoy vamos a hablar de la familia. | Hoje vamos falar da família. | — |
| 2 | Valentina | ¿Quién es este chico de la foto? | Quem é esse garoto da foto? | Plano do celular com a foto de um adolescente. |
| 3 | Lucía | Es mi hermano Pablo. Tiene quince años. | É meu irmão Pablo. Ele tem quinze anos. | — |
| 4 | Valentina | ¿Y la señora? | E a senhora? | — |
| 5 | Lucía | Es mi madre, Ana. Y este es mi padre, Luis. | É minha mãe, Ana. E este é meu pai, Luis. | Lucía desliza para a próxima foto. |
| 6 | Valentina | ¿Tienes más hermanos? | Você tem mais irmãos? | — |
| 7 | Lucía | Sí, tengo una hermana mayor. Se llama Marta. | Sim, tenho uma irmã mais velha. Ela se chama Marta. | — |
| 8 | Valentina | ¡Qué familia tan bonita! Yo soy hija única. | Que família bonita! Eu sou filha única. | — |
| 9 | Lucía | ¿Y tus abuelos viven en Montevideo? | E seus avós moram em Montevidéu? | — |
| 10 | Valentina | Sí, mis abuelos viven cerca de mi casa. | Sim, meus avós moram perto da minha casa. | Valentina sorri com carinho. |
| 11 | Profe Carmen | Recuerda: «mi» para una persona y «mis» para varias: mi hermano, mis abuelos. | Lembre: «mi» para uma pessoa e «mis» para várias: mi hermano, mis abuelos. | — |

**Cartão do «Recuerda» (aparece na tela durante a última fala da Profe Carmen):**

- **padre, madre, hermano, hermana, abuelos** — pai, mãe, irmão, irmã, avós
- **mi hermano / mis abuelos** — meu irmão / meus avós
- **una hermana mayor** — uma irmã mais velha
- **hija única** — filha única

---

### Vídeo 4 — `a1-04-cafeteria` · En la cafetería

- **Aula no app:** A1.4 · Pedir na cafeteria (A1)
- **Objetivo:** Pedir comida e bebida e perguntar quanto custa.
- **Cenário:** Balcão de uma cafeteria tradicional em Madri, com azulejos e uma máquina de café brilhante.
- **Personagens:** Profe Carmen (`es-ES-ElviraNeural`), Camarero (`es-ES-AlvaroNeural`), Diego (`es-MX-JorgeNeural`)
- **Duração alvo:** ~50 s · **velocidade da voz:** `-15%`
- **Cartão de título (2,5 s, sem fala):** "A1.4 · En la cafetería"

| # | Quem | Fala em espanhol (= texto exato da legenda) | Tradução (não vai no vídeo) | Direção de cena |
|---|---|---|---|---|
| 1 | Profe Carmen | Hoy vamos a pedir algo en una cafetería. | Hoje vamos pedir algo numa cafeteria. | — |
| 2 | Camarero | Buenas tardes. ¿Qué quieres tomar? | Boa tarde. O que você quer beber? | O garçom limpa o balcão. |
| 3 | Diego | Quiero un café con leche, por favor. | Quero um café com leite, por favor. | — |
| 4 | Camarero | ¿Algo para comer? | Algo para comer? | — |
| 5 | Diego | Sí, un bocadillo de queso. ¿Tienen zumo de naranja? | Sim, um sanduíche de queijo. Vocês têm suco de laranja? | Diego aponta para a vitrine. |
| 6 | Camarero | Sí, claro. ¿Grande o pequeño? | Sim, claro. Grande ou pequeno? | — |
| 7 | Diego | Pequeño, gracias. ¿Cuánto es? | Pequeno, obrigado. Quanto é? | Diego pega a carteira. |
| 8 | Camarero | Son seis euros con cincuenta. | São seis euros e cinquenta. | — |
| 9 | Diego | Aquí tiene. ¡Gracias! | Aqui está. Obrigado! | Entrega o dinheiro. |
| 10 | Profe Carmen | Recuerda: para pedir, usa «quiero…, por favor». Para pagar, pregunta «¿cuánto es?». | Lembre: para pedir, use «quiero…, por favor». Para pagar, pergunte «¿cuánto es?». | — |

**Cartão do «Recuerda» (aparece na tela durante a última fala da Profe Carmen):**

- **Quiero un café con leche, por favor.** — Quero um café com leite, por favor.
- **un bocadillo de queso / un zumo de naranja** — um sanduíche de queijo / um suco de laranja
- **¿Cuánto es? — Son seis euros.** — Quanto é? — São seis euros.
- **Aquí tiene.** — Aqui está.

---

### Vídeo 5 — `a1-05-rutina` · ¿Qué hora es?

- **Aula no app:** A1.5 · Rotina e horas (A1)
- **Objetivo:** Perguntar e dizer as horas e contar a rotina do dia.
- **Cenário:** Biblioteca da escola, mesa com livros e um relógio grande na parede. Diego e Lucía tentam marcar um horário para estudar.
- **Personagens:** Profe Carmen (`es-ES-ElviraNeural`), Diego (`es-MX-JorgeNeural`), Lucía (`es-ES-XimenaNeural`)
- **Duração alvo:** ~55 s · **velocidade da voz:** `-15%`
- **Cartão de título (2,5 s, sem fala):** "A1.5 · ¿Qué hora es?"

| # | Quem | Fala em espanhol (= texto exato da legenda) | Tradução (não vai no vídeo) | Direção de cena |
|---|---|---|---|---|
| 1 | Profe Carmen | Hoy vamos a hablar de la rutina y de la hora. | Hoje vamos falar da rotina e das horas. | — |
| 2 | Diego | Lucía, ¿qué hora es? | Lucía, que horas são? | — |
| 3 | Lucía | Son las cuatro y media. | São quatro e meia. | Ela olha o relógio na parede: 4:30. |
| 4 | Diego | ¿Estudiamos juntos mañana por la mañana? | Estudamos juntos amanhã de manhã? | — |
| 5 | Lucía | Por la mañana no puedo. Me levanto a las siete y trabajo hasta las dos. | De manhã não posso. Eu me levanto às sete e trabalho até as duas. | — |
| 6 | Diego | ¿Y por la tarde? | E à tarde? | — |
| 7 | Lucía | Por la tarde voy al gimnasio a las cinco. | À tarde vou à academia às cinco. | — |
| 8 | Diego | Entonces, ¿a las siete de la tarde? | Então, às sete da noite? | — |
| 9 | Lucía | ¡Perfecto! Normalmente ceno a las nueve. | Perfeito! Normalmente janto às nove. | Eles anotam na agenda. |
| 10 | Profe Carmen | Recuerda: «es la una», pero «son las dos, son las tres». Y para tu rutina: «me levanto a las siete». | Lembre: «es la una», mas «son las dos, son las tres». E para a sua rotina: «me levanto a las siete». | — |

**Cartão do «Recuerda» (aparece na tela durante a última fala da Profe Carmen):**

- **¿Qué hora es? — Son las cuatro y media.** — Que horas são? — São quatro e meia.
- **Es la una / Son las dos** — «Es» só para uma hora; «son» para as outras
- **Me levanto a las siete.** — Eu me levanto às sete.
- **por la mañana / por la tarde / por la noche** — de manhã / à tarde / à noite

---

### Vídeo 6 — `a2-01-compras` · De compras

- **Aula no app:** A2.1 · Compras: roupas e preços (A2)
- **Objetivo:** Comprar roupa: pedir um tamanho, experimentar e perguntar o preço.
- **Cenário:** Loja de roupas no bairro de Palermo, em Buenos Aires. Araras de jaquetas, um provador com cortina.
- **Personagens:** Profe Carmen (`es-ES-ElviraNeural`), Vendedora (`es-AR-ElenaNeural`), Valentina (`es-UY-ValentinaNeural`)
- **Duração alvo:** ~60 s · **velocidade da voz:** `-10%`
- **Cartão de título (2,5 s, sem fala):** "A2.1 · De compras"

| # | Quem | Fala em espanhol (= texto exato da legenda) | Tradução (não vai no vídeo) | Direção de cena |
|---|---|---|---|---|
| 1 | Profe Carmen | Hoy vamos de compras. Vamos a preguntar precios y tallas. | Hoje vamos às compras. Vamos perguntar preços e tamanhos. | — |
| 2 | Vendedora | Hola, ¿te puedo ayudar? | Oi, posso te ajudar? | — |
| 3 | Valentina | Sí, busco una chaqueta para el invierno. | Sim, procuro uma jaqueta para o inverno. | — |
| 4 | Vendedora | Tenemos esta azul y esa negra. ¿Qué talla usas? | Temos esta azul e essa preta. Que tamanho você usa? | A vendedora segura a azul e aponta para a preta na arara. |
| 5 | Valentina | La talla M. ¿Me puedo probar la azul? | O tamanho M. Posso experimentar a azul? | — |
| 6 | Vendedora | Claro, el probador está al fondo. | Claro, o provador fica no fundo. | — |
| 7 | Valentina | Me queda un poco grande. ¿Tiene una más pequeña? | Ficou um pouco grande. Tem uma menor? | Valentina sai do provador com as mangas compridas demais. |
| 8 | Vendedora | Sí, aquí tienes la talla S. | Sim, aqui está o tamanho P (S). | — |
| 9 | Valentina | Esta me queda perfecta. ¿Cuánto cuesta? | Esta ficou perfeita. Quanto custa? | Ela se olha no espelho, feliz. |
| 10 | Vendedora | Cuesta cuarenta mil pesos, pero hoy tiene un descuento del veinte por ciento. | Custa quarenta mil pesos, mas hoje tem um desconto de vinte por cento. | — |
| 11 | Profe Carmen | Recuerda: «me queda grande» quiere decir que la ropa es grande para ti. Y para el precio: «¿cuánto cuesta?». | Lembre: «me queda grande» quer dizer que a roupa está grande para você. E para o preço: «¿cuánto cuesta?». | — |

**Cartão do «Recuerda» (aparece na tela durante a última fala da Profe Carmen):**

- **Busco una chaqueta. ¿Qué talla usas?** — Procuro uma jaqueta. Que tamanho você usa?
- **¿Me puedo probar la azul?** — Posso experimentar a azul?
- **Me queda grande / perfecta** — Ficou grande / perfeita (em mim)
- **¿Cuánto cuesta?** — Quanto custa?

---

### Vídeo 7 — `a2-02-direcciones` · ¿Dónde está el museo?

- **Aula no app:** A2.2 · Direções na cidade (A2)
- **Objetivo:** Pedir e entender direções na rua.
- **Cenário:** Rua da Cidade Velha de Montevidéu, com prédios antigos e uma praça ao fundo. Diego, turista, segura um mapa.
- **Personagens:** Profe Carmen (`es-ES-ElviraNeural`), Diego (`es-MX-JorgeNeural`), Señor Ruiz (`es-UY-MateoNeural`)
- **Duração alvo:** ~55 s · **velocidade da voz:** `-10%`
- **Cartão de título (2,5 s, sem fala):** "A2.2 · ¿Dónde está el museo?"

| # | Quem | Fala em espanhol (= texto exato da legenda) | Tradução (não vai no vídeo) | Direção de cena |
|---|---|---|---|---|
| 1 | Profe Carmen | Hoy vamos a pedir y entender direcciones en la ciudad. | Hoje vamos pedir e entender direções na cidade. | — |
| 2 | Diego | Disculpe, señor. ¿Dónde está el Museo de Arte? | Com licença, senhor. Onde fica o Museu de Arte? | Diego mostra o mapa. |
| 3 | Señor Ruiz | Está un poco lejos. ¿Va a pie? | Fica um pouco longe. O senhor vai a pé? | — |
| 4 | Diego | Sí, me gusta caminar. | Sim, gosto de caminhar. | — |
| 5 | Señor Ruiz | Siga todo recto por esta calle hasta la plaza. | Siga sempre reto por esta rua até a praça. | Aponta para a frente com a bengala. |
| 6 | Señor Ruiz | En la plaza, gire a la derecha. | Na praça, vire à direita. | Gesto claro para a direita. |
| 7 | Señor Ruiz | El museo está al lado de un banco, enfrente del parque. | O museu fica ao lado de um banco, em frente ao parque. | — |
| 8 | Diego | Entonces: recto, a la derecha en la plaza y al lado del banco. ¡Muchas gracias! | Então: reto, à direita na praça e ao lado do banco. Muito obrigado! | Diego repete contando nos dedos. |
| 9 | Señor Ruiz | De nada. ¡Que disfrute la visita! | De nada. Aproveite a visita! | — |
| 10 | Profe Carmen | Recuerda: «a la derecha», «a la izquierda» y «todo recto». Con personas que no conoces, usamos «usted»: «siga», «gire». | Lembre: «a la derecha» (à direita), «a la izquierda» (à esquerda) e «todo recto» (sempre reto). Com pessoas que você não conhece, usamos «usted»: «siga», «gire». | — |

**Cartão do «Recuerda» (aparece na tela durante a última fala da Profe Carmen):**

- **Disculpe, ¿dónde está el museo?** — Com licença, onde fica o museu?
- **Siga todo recto. Gire a la derecha / a la izquierda.** — Siga reto. Vire à direita / à esquerda.
- **al lado de / enfrente de / cerca / lejos** — ao lado de / em frente a / perto / longe
- **¡Muchas gracias! — De nada.** — Muito obrigado! — De nada.

---

### Vídeo 8 — `a2-03-fin-de-semana` · ¿Qué hiciste el fin de semana?

- **Aula no app:** A2.3 · O passado: o fim de semana (A2)
- **Objetivo:** Contar o que você fez no passado.
- **Cenário:** Segunda-feira de manhã, corredor da escola. Mateo (com a térmica de mate) encontra Lucía.
- **Personagens:** Profe Carmen (`es-ES-ElviraNeural`), Mateo (`es-AR-TomasNeural`), Lucía (`es-ES-XimenaNeural`)
- **Duração alvo:** ~55 s · **velocidade da voz:** `-10%`
- **Cartão de título (2,5 s, sem fala):** "A2.3 · ¿Qué hiciste el fin de semana?"

| # | Quem | Fala em espanhol (= texto exato da legenda) | Tradução (não vai no vídeo) | Direção de cena |
|---|---|---|---|---|
| 1 | Profe Carmen | Hoy vamos a contar qué hicimos el fin de semana. Es el pasado. | Hoje vamos contar o que fizemos no fim de semana. É o passado. | — |
| 2 | Mateo | ¡Hola, Lucía! ¿Qué hiciste el fin de semana? | Oi, Lucía! O que você fez no fim de semana? | — |
| 3 | Lucía | El sábado fui al cine con mi hermana. | No sábado fui ao cinema com minha irmã. | — |
| 4 | Mateo | ¿Y qué película viste? | E que filme você viu? | — |
| 5 | Lucía | Vimos una comedia argentina. ¡Me reí mucho! | Vimos uma comédia argentina. Ri muito! | Lucía ri lembrando do filme. |
| 6 | Lucía | ¿Y tú? ¿Qué hiciste? | E você? O que você fez? | — |
| 7 | Mateo | El domingo comí un asado con mis amigos en el parque. | No domingo comi um churrasco com meus amigos no parque. | Mateo mostra uma foto do asado no celular. |
| 8 | Mateo | Después jugamos al fútbol y llegué a casa muy cansado. | Depois jogamos futebol e cheguei em casa muito cansado. | Ele finge estar exausto. |
| 9 | Lucía | ¡Qué buen fin de semana! | Que fim de semana bom! | — |
| 10 | Profe Carmen | Recuerda: para acciones terminadas usamos el pretérito: fui, vi, comí, jugamos, llegué. | Lembre: para ações terminadas usamos o pretérito: fui, vi, comí, jugamos, llegué. | — |

**Cartão do «Recuerda» (aparece na tela durante a última fala da Profe Carmen):**

- **¿Qué hiciste el fin de semana?** — O que você fez no fim de semana?
- **Fui al cine. Vi una película.** — Fui ao cinema. Vi um filme.
- **Comí un asado. Llegué cansado.** — Comi um churrasco. Cheguei cansado.
- **Jugamos al fútbol. Vimos una comedia.** — Jogamos futebol. Vimos uma comédia.

---

### Vídeo 9 — `a2-04-planes` · Planes para el sábado

- **Aula no app:** A2.4 · Planos e gostos (A2)
- **Objetivo:** Falar de planos com «voy a» e dizer do que você gosta.
- **Cenário:** Parque de Montevidéu numa tarde de primavera. Valentina e Diego sentados num banco, tomando sorvete.
- **Personagens:** Profe Carmen (`es-ES-ElviraNeural`), Diego (`es-MX-JorgeNeural`), Valentina (`es-UY-ValentinaNeural`)
- **Duração alvo:** ~55 s · **velocidade da voz:** `-10%`
- **Cartão de título (2,5 s, sem fala):** "A2.4 · Planes para el sábado"

| # | Quem | Fala em espanhol (= texto exato da legenda) | Tradução (não vai no vídeo) | Direção de cena |
|---|---|---|---|---|
| 1 | Profe Carmen | Hoy vamos a hablar de planes y de lo que nos gusta. | Hoje vamos falar de planos e do que gostamos. | — |
| 2 | Diego | Valentina, ¿qué vas a hacer el sábado? | Valentina, o que você vai fazer no sábado? | — |
| 3 | Valentina | Voy a ir a la playa. ¿Te gusta la playa? | Vou à praia. Você gosta de praia? | — |
| 4 | Diego | Me gusta, pero me encanta más la montaña. | Gosto, mas adoro mais a montanha. | Diego faz o gesto de montanha com as mãos. |
| 5 | Valentina | ¿Y qué vas a hacer tú? | E o que você vai fazer? | — |
| 6 | Diego | Voy a visitar a mis tíos. Vamos a comer juntos. | Vou visitar meus tios. Vamos comer juntos. | — |
| 7 | Valentina | ¿Te gustan los conciertos? El domingo hay uno en el centro. | Você gosta de shows? No domingo tem um no centro. | — |
| 8 | Diego | ¡Sí, me gustan mucho! Vamos juntos el domingo. | Sim, gosto muito! Vamos juntos no domingo. | Diego se anima. |
| 9 | Valentina | ¡Genial! Voy a comprar las entradas. | Ótimo! Vou comprar os ingressos. | Valentina pega o celular. |
| 10 | Profe Carmen | Recuerda: «voy a» más un verbo para los planes. Y «me gusta» con una cosa, «me gustan» con varias. | Lembre: «voy a» mais um verbo para os planos. E «me gusta» com uma coisa, «me gustan» com várias. | — |

**Cartão do «Recuerda» (aparece na tela durante a última fala da Profe Carmen):**

- **¿Qué vas a hacer el sábado? — Voy a ir a la playa.** — O que você vai fazer no sábado? — Vou à praia.
- **Me gusta la playa. Me encanta la montaña.** — Gosto da praia. Adoro a montanha.
- **Me gustan los conciertos.** — Gosto de shows (várias coisas → gustan).
- **Voy a comprar las entradas.** — Vou comprar os ingressos.

---

### Vídeo 10 — `a2-05-medico` · En el médico

- **Aula no app:** A2.5 · No médico (A2)
- **Objetivo:** Dizer o que dói, entender o diagnóstico e os conselhos do médico.
- **Cenário:** Consultório claro na Cidade do México, com uma maca e um pôster do corpo humano. Mateo está resfriado, com cachecol.
- **Personagens:** Profe Carmen (`es-ES-ElviraNeural`), Doctora López (`es-MX-DaliaNeural`), Mateo (`es-AR-TomasNeural`)
- **Duração alvo:** ~55 s · **velocidade da voz:** `-10%`
- **Cartão de título (2,5 s, sem fala):** "A2.5 · En el médico"

| # | Quem | Fala em espanhol (= texto exato da legenda) | Tradução (não vai no vídeo) | Direção de cena |
|---|---|---|---|---|
| 1 | Profe Carmen | Hoy vamos al médico. Vamos a aprender a decir qué nos duele. | Hoje vamos ao médico. Vamos aprender a dizer o que dói. | — |
| 2 | Doctora López | Buenos días, Mateo. ¿Qué le pasa? | Bom dia, Mateo. O que o senhor tem? | — |
| 3 | Mateo | Me duele mucho la cabeza y tengo fiebre. | Minha cabeça dói muito e estou com febre. | Mateo leva a mão à testa. |
| 4 | Doctora López | ¿Desde cuándo? | Desde quando? | — |
| 5 | Mateo | Desde ayer por la noche. También me duele la garganta. | Desde ontem à noite. Também estou com dor de garganta. | Ele toca a garganta e tosse. |
| 6 | Doctora López | Es una gripe. Tiene que descansar y beber mucha agua. | É uma gripe. O senhor tem que descansar e beber muita água. | — |
| 7 | Doctora López | Tome esta pastilla cada ocho horas. | Tome este comprimido a cada oito horas. | Ela entrega uma caixinha de remédio. |
| 8 | Mateo | ¿Puedo ir a trabajar mañana? | Posso ir trabalhar amanhã? | — |
| 9 | Doctora López | No, mejor quédese en casa dos días. | Não, é melhor ficar em casa dois dias. | — |
| 10 | Profe Carmen | Recuerda: «me duele la cabeza», «me duelen los pies». Y para dar consejos: «tienes que» más un verbo. | Lembre: «me duele la cabeza» (dói a cabeça), «me duelen los pies» (doem os pés). E para dar conselhos: «tienes que» mais um verbo. | — |

**Cartão do «Recuerda» (aparece na tela durante a última fala da Profe Carmen):**

- **¿Qué le pasa? — Me duele la cabeza.** — O que o senhor tem? — Minha cabeça dói.
- **Tengo fiebre. Tengo gripe.** — Estou com febre. Estou com gripe.
- **Tiene que descansar y beber agua.** — O senhor tem que descansar e beber água.
- **una pastilla cada ocho horas** — um comprimido a cada oito horas

---

### Vídeo 11 — `a2-06-variedades` · Tú, vos y vosotros

- **Aula no app:** A2.6 · Variedades: tú, vos, usted e vosotros (A2)
- **Objetivo:** Conhecer as formas de tratamento em países diferentes.
- **Cenário:** Videochamada em tela dividida: Mateo em Buenos Aires (com o Obelisco pela janela) e Lucía em Madri (com telhados ao fundo).
- **Personagens:** Profe Carmen (`es-ES-ElviraNeural`), Mateo (`es-AR-TomasNeural`), Lucía (`es-ES-XimenaNeural`)
- **Duração alvo:** ~60 s · **velocidade da voz:** `-10%`
- **Cartão de título (2,5 s, sem fala):** "A2.6 · Tú, vos y vosotros"

| # | Quem | Fala em espanhol (= texto exato da legenda) | Tradução (não vai no vídeo) | Direção de cena |
|---|---|---|---|---|
| 1 | Profe Carmen | Hoy vamos a conocer variedades del español: tú, vos y vosotros. | Hoje vamos conhecer variedades do espanhol: tú, vos e vosotros. | — |
| 2 | Mateo | Che, Lucía, ¿vos sabés que en Argentina no decimos «tú»? | Ei, Lucía, você sabia que na Argentina não dizemos «tú»? | — |
| 3 | Lucía | ¿Ah, no? ¿Y qué decís? | Ah, não? E o que vocês dizem? | Lucía, surpresa, se aproxima da tela. |
| 4 | Mateo | Decimos «vos»: vos sos, vos tenés, vos hablás. | Dizemos «vos»: vos sos (você é), vos tenés (você tem), vos hablás (você fala). | Mateo conta nos dedos. |
| 5 | Lucía | ¡Qué curioso! En España, con los amigos usamos «vosotros»: ¿vosotros queréis un café? | Que curioso! Na Espanha, com os amigos usamos «vosotros»: vocês querem um café? | — |
| 6 | Mateo | En Argentina decimos «ustedes»: ¿ustedes quieren un café? | Na Argentina dizemos «ustedes»: vocês querem um café? | — |
| 7 | Lucía | Y con el profesor o con un señor mayor, todos usamos «usted». | E com o professor ou com um senhor mais velho, todos usamos «usted». | — |
| 8 | Mateo | ¡Exacto! Mismo idioma, distintas formas. ¡Y todas son correctas! | Exato! Mesma língua, formas diferentes. E todas estão corretas! | Os dois brindam com as xícaras pela tela. |
| 9 | Profe Carmen | Recuerda: «tú» y «vos» son informales; «usted» es formal. «Vosotros» solo se usa en España. | Lembre: «tú» e «vos» são informais; «usted» é formal. «Vosotros» só se usa na Espanha. | — |

**Cartão do «Recuerda» (aparece na tela durante a última fala da Profe Carmen):**

- **vos sos = tú eres · vos tenés = tú tienes** — «Vos» no lugar de «tú» (Argentina e Uruguai)
- **vosotros queréis (España) / ustedes quieren (América)** — «Vocês» entre amigos
- **usted** — Forma formal em todos os países

---

## 7. Como testar no app

1. Coloque os arquivos em `public/videos/` do projeto (`<id>.mp4`, `<id>.vtt` e, se tiver, `<id>.jpg`).
2. Rode o app (`npm run dev`) e comece um estudo. Se o vídeo foi encontrado, a etiqueta «Prévia · vídeo em produção» some e o vídeo real aparece.
3. Confira:
   - [ ] A legenda embaixo do player troca **junto** com quem está falando.
   - [ ] Tocar numa palavra pausa o vídeo e mostra a tradução.
   - [ ] Não há legenda dentro do vídeo.
   - [ ] Na mini-aula (que aparece quando o aluno erra uma pergunta), o botão «Rever trecho» toca a fala certa.
4. Se a legenda estiver dessincronizada, o problema está nos tempos do `.vtt`. Se ela não trocar nunca, o número de legendas não bate com o número de falas: o app avisa isso no console do navegador.

Enquanto um vídeo não existe, o app usa uma **prévia**: mostra quem está falando e lê as falas com a voz do navegador. Dá para lançar os vídeos aos poucos.

---

## Apêndice: todas as falas em JSON (para automação)

É o mesmo conteúdo das tabelas da seção 6, num formato que um script lê direto. A ordem das falas é a ordem das legendas.

```json
{
  "cast": {
    "Profe Carmen": {
      "from": "Madrid, España",
      "voice": "es-ES-ElviraNeural",
      "look": "Professora, ~40 anos, cabelo castanho preso, óculos redondos, blazer mostarda, sorriso acolhedor."
    },
    "Lucía": {
      "from": "Madrid, España",
      "voice": "es-ES-XimenaNeural",
      "look": "22 anos, cabelo preto curto (chanel), camiseta listrada vermelha e branca, brincos de argola."
    },
    "Diego": {
      "from": "Guadalajara, México",
      "voice": "es-MX-JorgeNeural",
      "look": "25 anos, cabelo cacheado, barba curta, camisa verde-oliva, mochila."
    },
    "Valentina": {
      "from": "Montevideo, Uruguay",
      "voice": "es-UY-ValentinaNeural",
      "look": "23 anos, cabelo ruivo longo, jaqueta jeans, cachecol celeste."
    },
    "Mateo": {
      "from": "Buenos Aires, Argentina",
      "voice": "es-AR-TomasNeural",
      "look": "24 anos, cabelo castanho bagunçado, moletom azul-marinho, sempre com uma garrafa térmica de mate."
    },
    "Camarero": {
      "from": "Madrid, España",
      "voice": "es-ES-AlvaroNeural",
      "look": "Garçom de ~50 anos, avental preto, bigode grisalho."
    },
    "Vendedora": {
      "from": "Buenos Aires, Argentina",
      "voice": "es-AR-ElenaNeural",
      "look": "Vendedora de ~35 anos, crachá, cabelo loiro preso, roupa elegante."
    },
    "Señor Ruiz": {
      "from": "Montevideo, Uruguay",
      "voice": "es-UY-MateoNeural",
      "look": "Senhor de ~70 anos, boina, bengala, casaco marrom."
    },
    "Doctora López": {
      "from": "Ciudad de México, México",
      "voice": "es-MX-DaliaNeural",
      "look": "Médica de ~45 anos, jaleco branco, estetoscópio, cabelo preto em coque."
    }
  },
  "videos": [
    {
      "id": "a1-01-saludos",
      "level": "A1",
      "lesson": "A1.1",
      "title": "¡Hola! ¿Cómo te llamas?",
      "setting": "Pátio de uma escola de idiomas em Madri, manhã ensolarada. Lucía e Diego se conhecem no primeiro dia de aula.",
      "speechRate": "-20%",
      "titleCard": "A1.1 · ¡Hola! ¿Cómo te llamas?",
      "recuerda": [
        "¿Cómo te llamas? — Me llamo…",
        "Mucho gusto / Encantado, encantada",
        "¿Cómo estás? — Muy bien, gracias. ¿Y tú?",
        "Adiós / Hasta luego"
      ],
      "lines": [
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "¡Hola! Soy Carmen, tu profesora. Hoy vamos a aprender a saludar y a presentarnos.",
          "direction": "Carmen olha para a câmera e acena."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "¡Hola! Buenos días.",
          "direction": "Diego chega com a mochila e acena para Lucía."
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "¡Buenos días! ¿Cómo te llamas?",
          "direction": "Lucía sorri, curiosa."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Me llamo Diego. ¿Y tú?",
          "direction": "Diego aponta para si mesmo em «Me llamo Diego»."
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "Yo me llamo Lucía. Mucho gusto.",
          "direction": "Eles apertam as mãos."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Encantado, Lucía. ¿Cómo estás?"
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "Muy bien, gracias. ¿Y tú?",
          "direction": "Polegar para cima."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Bien también. ¡Hasta luego!",
          "direction": "Diego começa a se afastar."
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "¡Adiós, hasta luego!",
          "direction": "Lucía acena."
        },
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Recuerda: para decir tu nombre, usa «me llamo». Para despedirte, «hasta luego».",
          "direction": "Carmen mostra um cartaz com «Me llamo…» e «Hasta luego»."
        }
      ]
    },
    {
      "id": "a1-02-origen",
      "level": "A1",
      "lesson": "A1.2",
      "title": "¿De dónde eres?",
      "setting": "Festa de boas-vindas de intercambistas num terraço em Montevidéu, fim de tarde, luzinhas penduradas.",
      "speechRate": "-20%",
      "titleCard": "A1.2 · ¿De dónde eres?",
      "recuerda": [
        "¿De dónde eres? — Soy de México.",
        "Soy uruguaya / Soy brasileño",
        "¿Cuántos años tienes? — Tengo veintidós años.",
        "cero, uno, dos, tres… diez, veinte"
      ],
      "lines": [
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Hola de nuevo. Hoy vamos a hablar de la edad y del país de origen."
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "Hola, Diego. ¿De dónde eres?",
          "direction": "Valentina segura um copo de suco."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Soy de México, de Guadalajara. ¿Y tú?"
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "Yo soy uruguaya, de Montevideo.",
          "direction": "Ela aponta para a cidade ao fundo."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "¡Qué bien! ¿Cuántos años tienes?"
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "Tengo veintidós años. ¿Y tú?",
          "direction": "Mostra 2 e 2 com os dedos."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Yo tengo veinticinco. Y hablo un poco de portugués.",
          "direction": "Gesto de «um pouquinho» com os dedos."
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "¡Genial! ¿Me das tu número de teléfono?",
          "direction": "Valentina pega o celular."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Claro: seis, dos, siete, cero, nueve.",
          "direction": "Fala devagar, número por número."
        },
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Recuerda: «tengo veintidós años». En español, la edad se dice con el verbo «tener»."
        }
      ]
    },
    {
      "id": "a1-03-familia",
      "level": "A1",
      "lesson": "A1.3",
      "title": "Mi familia",
      "setting": "Café aconchegante em Madri. Lucía mostra fotos da família no celular para Valentina.",
      "speechRate": "-20%",
      "titleCard": "A1.3 · Mi familia",
      "recuerda": [
        "padre, madre, hermano, hermana, abuelos",
        "mi hermano / mis abuelos",
        "una hermana mayor",
        "hija única"
      ],
      "lines": [
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Hoy vamos a hablar de la familia."
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "¿Quién es este chico de la foto?",
          "direction": "Plano do celular com a foto de um adolescente."
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "Es mi hermano Pablo. Tiene quince años."
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "¿Y la señora?"
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "Es mi madre, Ana. Y este es mi padre, Luis.",
          "direction": "Lucía desliza para a próxima foto."
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "¿Tienes más hermanos?"
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "Sí, tengo una hermana mayor. Se llama Marta."
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "¡Qué familia tan bonita! Yo soy hija única."
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "¿Y tus abuelos viven en Montevideo?"
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "Sí, mis abuelos viven cerca de mi casa.",
          "direction": "Valentina sorri com carinho."
        },
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Recuerda: «mi» para una persona y «mis» para varias: mi hermano, mis abuelos."
        }
      ]
    },
    {
      "id": "a1-04-cafeteria",
      "level": "A1",
      "lesson": "A1.4",
      "title": "En la cafetería",
      "setting": "Balcão de uma cafeteria tradicional em Madri, com azulejos e uma máquina de café brilhante.",
      "speechRate": "-15%",
      "titleCard": "A1.4 · En la cafetería",
      "recuerda": [
        "Quiero un café con leche, por favor.",
        "un bocadillo de queso / un zumo de naranja",
        "¿Cuánto es? — Son seis euros.",
        "Aquí tiene."
      ],
      "lines": [
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Hoy vamos a pedir algo en una cafetería."
        },
        {
          "speaker": "Camarero",
          "voice": "es-ES-AlvaroNeural",
          "es": "Buenas tardes. ¿Qué quieres tomar?",
          "direction": "O garçom limpa o balcão."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Quiero un café con leche, por favor."
        },
        {
          "speaker": "Camarero",
          "voice": "es-ES-AlvaroNeural",
          "es": "¿Algo para comer?"
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Sí, un bocadillo de queso. ¿Tienen zumo de naranja?",
          "direction": "Diego aponta para a vitrine."
        },
        {
          "speaker": "Camarero",
          "voice": "es-ES-AlvaroNeural",
          "es": "Sí, claro. ¿Grande o pequeño?"
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Pequeño, gracias. ¿Cuánto es?",
          "direction": "Diego pega a carteira."
        },
        {
          "speaker": "Camarero",
          "voice": "es-ES-AlvaroNeural",
          "es": "Son seis euros con cincuenta."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Aquí tiene. ¡Gracias!",
          "direction": "Entrega o dinheiro."
        },
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Recuerda: para pedir, usa «quiero…, por favor». Para pagar, pregunta «¿cuánto es?»."
        }
      ]
    },
    {
      "id": "a1-05-rutina",
      "level": "A1",
      "lesson": "A1.5",
      "title": "¿Qué hora es?",
      "setting": "Biblioteca da escola, mesa com livros e um relógio grande na parede. Diego e Lucía tentam marcar um horário para estudar.",
      "speechRate": "-15%",
      "titleCard": "A1.5 · ¿Qué hora es?",
      "recuerda": [
        "¿Qué hora es? — Son las cuatro y media.",
        "Es la una / Son las dos",
        "Me levanto a las siete.",
        "por la mañana / por la tarde / por la noche"
      ],
      "lines": [
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Hoy vamos a hablar de la rutina y de la hora."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Lucía, ¿qué hora es?"
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "Son las cuatro y media.",
          "direction": "Ela olha o relógio na parede: 4:30."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "¿Estudiamos juntos mañana por la mañana?"
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "Por la mañana no puedo. Me levanto a las siete y trabajo hasta las dos."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "¿Y por la tarde?"
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "Por la tarde voy al gimnasio a las cinco."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Entonces, ¿a las siete de la tarde?"
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "¡Perfecto! Normalmente ceno a las nueve.",
          "direction": "Eles anotam na agenda."
        },
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Recuerda: «es la una», pero «son las dos, son las tres». Y para tu rutina: «me levanto a las siete»."
        }
      ]
    },
    {
      "id": "a2-01-compras",
      "level": "A2",
      "lesson": "A2.1",
      "title": "De compras",
      "setting": "Loja de roupas no bairro de Palermo, em Buenos Aires. Araras de jaquetas, um provador com cortina.",
      "speechRate": "-10%",
      "titleCard": "A2.1 · De compras",
      "recuerda": [
        "Busco una chaqueta. ¿Qué talla usas?",
        "¿Me puedo probar la azul?",
        "Me queda grande / perfecta",
        "¿Cuánto cuesta?"
      ],
      "lines": [
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Hoy vamos de compras. Vamos a preguntar precios y tallas."
        },
        {
          "speaker": "Vendedora",
          "voice": "es-AR-ElenaNeural",
          "es": "Hola, ¿te puedo ayudar?"
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "Sí, busco una chaqueta para el invierno."
        },
        {
          "speaker": "Vendedora",
          "voice": "es-AR-ElenaNeural",
          "es": "Tenemos esta azul y esa negra. ¿Qué talla usas?",
          "direction": "A vendedora segura a azul e aponta para a preta na arara."
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "La talla M. ¿Me puedo probar la azul?"
        },
        {
          "speaker": "Vendedora",
          "voice": "es-AR-ElenaNeural",
          "es": "Claro, el probador está al fondo."
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "Me queda un poco grande. ¿Tiene una más pequeña?",
          "direction": "Valentina sai do provador com as mangas compridas demais."
        },
        {
          "speaker": "Vendedora",
          "voice": "es-AR-ElenaNeural",
          "es": "Sí, aquí tienes la talla S."
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "Esta me queda perfecta. ¿Cuánto cuesta?",
          "direction": "Ela se olha no espelho, feliz."
        },
        {
          "speaker": "Vendedora",
          "voice": "es-AR-ElenaNeural",
          "es": "Cuesta cuarenta mil pesos, pero hoy tiene un descuento del veinte por ciento."
        },
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Recuerda: «me queda grande» quiere decir que la ropa es grande para ti. Y para el precio: «¿cuánto cuesta?»."
        }
      ]
    },
    {
      "id": "a2-02-direcciones",
      "level": "A2",
      "lesson": "A2.2",
      "title": "¿Dónde está el museo?",
      "setting": "Rua da Cidade Velha de Montevidéu, com prédios antigos e uma praça ao fundo. Diego, turista, segura um mapa.",
      "speechRate": "-10%",
      "titleCard": "A2.2 · ¿Dónde está el museo?",
      "recuerda": [
        "Disculpe, ¿dónde está el museo?",
        "Siga todo recto. Gire a la derecha / a la izquierda.",
        "al lado de / enfrente de / cerca / lejos",
        "¡Muchas gracias! — De nada."
      ],
      "lines": [
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Hoy vamos a pedir y entender direcciones en la ciudad."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Disculpe, señor. ¿Dónde está el Museo de Arte?",
          "direction": "Diego mostra o mapa."
        },
        {
          "speaker": "Señor Ruiz",
          "voice": "es-UY-MateoNeural",
          "es": "Está un poco lejos. ¿Va a pie?"
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Sí, me gusta caminar."
        },
        {
          "speaker": "Señor Ruiz",
          "voice": "es-UY-MateoNeural",
          "es": "Siga todo recto por esta calle hasta la plaza.",
          "direction": "Aponta para a frente com a bengala."
        },
        {
          "speaker": "Señor Ruiz",
          "voice": "es-UY-MateoNeural",
          "es": "En la plaza, gire a la derecha.",
          "direction": "Gesto claro para a direita."
        },
        {
          "speaker": "Señor Ruiz",
          "voice": "es-UY-MateoNeural",
          "es": "El museo está al lado de un banco, enfrente del parque."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Entonces: recto, a la derecha en la plaza y al lado del banco. ¡Muchas gracias!",
          "direction": "Diego repete contando nos dedos."
        },
        {
          "speaker": "Señor Ruiz",
          "voice": "es-UY-MateoNeural",
          "es": "De nada. ¡Que disfrute la visita!"
        },
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Recuerda: «a la derecha», «a la izquierda» y «todo recto». Con personas que no conoces, usamos «usted»: «siga», «gire»."
        }
      ]
    },
    {
      "id": "a2-03-fin-de-semana",
      "level": "A2",
      "lesson": "A2.3",
      "title": "¿Qué hiciste el fin de semana?",
      "setting": "Segunda-feira de manhã, corredor da escola. Mateo (com a térmica de mate) encontra Lucía.",
      "speechRate": "-10%",
      "titleCard": "A2.3 · ¿Qué hiciste el fin de semana?",
      "recuerda": [
        "¿Qué hiciste el fin de semana?",
        "Fui al cine. Vi una película.",
        "Comí un asado. Llegué cansado.",
        "Jugamos al fútbol. Vimos una comedia."
      ],
      "lines": [
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Hoy vamos a contar qué hicimos el fin de semana. Es el pasado."
        },
        {
          "speaker": "Mateo",
          "voice": "es-AR-TomasNeural",
          "es": "¡Hola, Lucía! ¿Qué hiciste el fin de semana?"
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "El sábado fui al cine con mi hermana."
        },
        {
          "speaker": "Mateo",
          "voice": "es-AR-TomasNeural",
          "es": "¿Y qué película viste?"
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "Vimos una comedia argentina. ¡Me reí mucho!",
          "direction": "Lucía ri lembrando do filme."
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "¿Y tú? ¿Qué hiciste?"
        },
        {
          "speaker": "Mateo",
          "voice": "es-AR-TomasNeural",
          "es": "El domingo comí un asado con mis amigos en el parque.",
          "direction": "Mateo mostra uma foto do asado no celular."
        },
        {
          "speaker": "Mateo",
          "voice": "es-AR-TomasNeural",
          "es": "Después jugamos al fútbol y llegué a casa muy cansado.",
          "direction": "Ele finge estar exausto."
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "¡Qué buen fin de semana!"
        },
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Recuerda: para acciones terminadas usamos el pretérito: fui, vi, comí, jugamos, llegué."
        }
      ]
    },
    {
      "id": "a2-04-planes",
      "level": "A2",
      "lesson": "A2.4",
      "title": "Planes para el sábado",
      "setting": "Parque de Montevidéu numa tarde de primavera. Valentina e Diego sentados num banco, tomando sorvete.",
      "speechRate": "-10%",
      "titleCard": "A2.4 · Planes para el sábado",
      "recuerda": [
        "¿Qué vas a hacer el sábado? — Voy a ir a la playa.",
        "Me gusta la playa. Me encanta la montaña.",
        "Me gustan los conciertos.",
        "Voy a comprar las entradas."
      ],
      "lines": [
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Hoy vamos a hablar de planes y de lo que nos gusta."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Valentina, ¿qué vas a hacer el sábado?"
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "Voy a ir a la playa. ¿Te gusta la playa?"
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Me gusta, pero me encanta más la montaña.",
          "direction": "Diego faz o gesto de montanha com as mãos."
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "¿Y qué vas a hacer tú?"
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "Voy a visitar a mis tíos. Vamos a comer juntos."
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "¿Te gustan los conciertos? El domingo hay uno en el centro."
        },
        {
          "speaker": "Diego",
          "voice": "es-MX-JorgeNeural",
          "es": "¡Sí, me gustan mucho! Vamos juntos el domingo.",
          "direction": "Diego se anima."
        },
        {
          "speaker": "Valentina",
          "voice": "es-UY-ValentinaNeural",
          "es": "¡Genial! Voy a comprar las entradas.",
          "direction": "Valentina pega o celular."
        },
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Recuerda: «voy a» más un verbo para los planes. Y «me gusta» con una cosa, «me gustan» con varias."
        }
      ]
    },
    {
      "id": "a2-05-medico",
      "level": "A2",
      "lesson": "A2.5",
      "title": "En el médico",
      "setting": "Consultório claro na Cidade do México, com uma maca e um pôster do corpo humano. Mateo está resfriado, com cachecol.",
      "speechRate": "-10%",
      "titleCard": "A2.5 · En el médico",
      "recuerda": [
        "¿Qué le pasa? — Me duele la cabeza.",
        "Tengo fiebre. Tengo gripe.",
        "Tiene que descansar y beber agua.",
        "una pastilla cada ocho horas"
      ],
      "lines": [
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Hoy vamos al médico. Vamos a aprender a decir qué nos duele."
        },
        {
          "speaker": "Doctora López",
          "voice": "es-MX-DaliaNeural",
          "es": "Buenos días, Mateo. ¿Qué le pasa?"
        },
        {
          "speaker": "Mateo",
          "voice": "es-AR-TomasNeural",
          "es": "Me duele mucho la cabeza y tengo fiebre.",
          "direction": "Mateo leva a mão à testa."
        },
        {
          "speaker": "Doctora López",
          "voice": "es-MX-DaliaNeural",
          "es": "¿Desde cuándo?"
        },
        {
          "speaker": "Mateo",
          "voice": "es-AR-TomasNeural",
          "es": "Desde ayer por la noche. También me duele la garganta.",
          "direction": "Ele toca a garganta e tosse."
        },
        {
          "speaker": "Doctora López",
          "voice": "es-MX-DaliaNeural",
          "es": "Es una gripe. Tiene que descansar y beber mucha agua."
        },
        {
          "speaker": "Doctora López",
          "voice": "es-MX-DaliaNeural",
          "es": "Tome esta pastilla cada ocho horas.",
          "direction": "Ela entrega uma caixinha de remédio."
        },
        {
          "speaker": "Mateo",
          "voice": "es-AR-TomasNeural",
          "es": "¿Puedo ir a trabajar mañana?"
        },
        {
          "speaker": "Doctora López",
          "voice": "es-MX-DaliaNeural",
          "es": "No, mejor quédese en casa dos días."
        },
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Recuerda: «me duele la cabeza», «me duelen los pies». Y para dar consejos: «tienes que» más un verbo."
        }
      ]
    },
    {
      "id": "a2-06-variedades",
      "level": "A2",
      "lesson": "A2.6",
      "title": "Tú, vos y vosotros",
      "setting": "Videochamada em tela dividida: Mateo em Buenos Aires (com o Obelisco pela janela) e Lucía em Madri (com telhados ao fundo).",
      "speechRate": "-10%",
      "titleCard": "A2.6 · Tú, vos y vosotros",
      "recuerda": [
        "vos sos = tú eres · vos tenés = tú tienes",
        "vosotros queréis (España) / ustedes quieren (América)",
        "usted"
      ],
      "lines": [
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Hoy vamos a conocer variedades del español: tú, vos y vosotros."
        },
        {
          "speaker": "Mateo",
          "voice": "es-AR-TomasNeural",
          "es": "Che, Lucía, ¿vos sabés que en Argentina no decimos «tú»?"
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "¿Ah, no? ¿Y qué decís?",
          "direction": "Lucía, surpresa, se aproxima da tela."
        },
        {
          "speaker": "Mateo",
          "voice": "es-AR-TomasNeural",
          "es": "Decimos «vos»: vos sos, vos tenés, vos hablás.",
          "direction": "Mateo conta nos dedos."
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "¡Qué curioso! En España, con los amigos usamos «vosotros»: ¿vosotros queréis un café?"
        },
        {
          "speaker": "Mateo",
          "voice": "es-AR-TomasNeural",
          "es": "En Argentina decimos «ustedes»: ¿ustedes quieren un café?"
        },
        {
          "speaker": "Lucía",
          "voice": "es-ES-XimenaNeural",
          "es": "Y con el profesor o con un señor mayor, todos usamos «usted»."
        },
        {
          "speaker": "Mateo",
          "voice": "es-AR-TomasNeural",
          "es": "¡Exacto! Mismo idioma, distintas formas. ¡Y todas son correctas!",
          "direction": "Os dois brindam com as xícaras pela tela."
        },
        {
          "speaker": "Profe Carmen",
          "voice": "es-ES-ElviraNeural",
          "es": "Recuerda: «tú» y «vos» son informales; «usted» es formal. «Vosotros» solo se usa en España."
        }
      ]
    }
  ]
}
```

