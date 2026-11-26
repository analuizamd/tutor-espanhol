/**
 * Vídeos de conversa — um por aula (A1/A2).
 *
 * Este arquivo é a FONTE DOS ROTEIROS: docs/videos/ROTEIROS.md foi gerado a partir dele.
 * Se mudar uma fala aqui, atualize o vídeo/legenda correspondente (a ordem das falas = ordem das legendas).
 *
 * Os vídeos gerados ficam em public/videos/<id>.mp4 (+ <id>.vtt com os tempos e <id>.jpg de capa).
 * Enquanto o vídeo não existir, o app usa um player de prévia com a voz do navegador.
 *
 * Método depois do vídeo (ver src/state/StudySession.tsx):
 *   verificar (pergunta principal) → se errar, ensinar (mini-aula com o trecho do vídeo) → verificar de novo (variante).
 */
import type { ConceptCode } from "./concepts";

export interface CastMember {
  /** Nome que aparece na legenda e no vídeo. */
  name: string;
  /** De onde é (aparece no vídeo). */
  from: string;
  /** Voz sugerida (Microsoft Edge TTS / edge-tts). */
  voice: string;
  /** Descrição visual para manter o personagem igual em todos os vídeos. */
  look: string;
}

/** Elenco fixo — os mesmos personagens em todos os vídeos. */
export const CAST: Record<string, CastMember> = {
  Carmen: { name: "Profe Carmen", from: "Madrid, España", voice: "es-ES-ElviraNeural", look: "Professora, ~40 anos, cabelo castanho preso, óculos redondos, blazer mostarda, sorriso acolhedor." },
  Lucía: { name: "Lucía", from: "Madrid, España", voice: "es-ES-XimenaNeural", look: "22 anos, cabelo preto curto (chanel), camiseta listrada vermelha e branca, brincos de argola." },
  Diego: { name: "Diego", from: "Guadalajara, México", voice: "es-MX-JorgeNeural", look: "25 anos, cabelo cacheado, barba curta, camisa verde-oliva, mochila." },
  Valentina: { name: "Valentina", from: "Montevideo, Uruguay", voice: "es-UY-ValentinaNeural", look: "23 anos, cabelo ruivo longo, jaqueta jeans, cachecol celeste." },
  Mateo: { name: "Mateo", from: "Buenos Aires, Argentina", voice: "es-AR-TomasNeural", look: "24 anos, cabelo castanho bagunçado, moletom azul-marinho, sempre com uma garrafa térmica de mate." },
  Camarero: { name: "Camarero", from: "Madrid, España", voice: "es-ES-AlvaroNeural", look: "Garçom de ~50 anos, avental preto, bigode grisalho." },
  Vendedora: { name: "Vendedora", from: "Buenos Aires, Argentina", voice: "es-AR-ElenaNeural", look: "Vendedora de ~35 anos, crachá, cabelo loiro preso, roupa elegante." },
  "Señor Ruiz": { name: "Señor Ruiz", from: "Montevideo, Uruguay", voice: "es-UY-MateoNeural", look: "Senhor de ~70 anos, boina, bengala, casaco marrom." },
  "Doctora López": { name: "Doctora López", from: "Ciudad de México, México", voice: "es-MX-DaliaNeural", look: "Médica de ~45 anos, jaleco branco, estetoscópio, cabelo preto em coque." },
};

export interface VideoLine {
  /** Chave do personagem em CAST. */
  speaker: keyof typeof CAST;
  /** Fala em espanhol (exatamente o que é dito e o texto da legenda). */
  es: string;
  /** Tradução para o português (aparece ao tocar na legenda). */
  pt: string;
  /** Direção de cena para quem gera o vídeo (gesto, emoção, plano). */
  direction?: string;
}

export interface CheckItem {
  prompt: string;
  options: string[];
  correctIndex: number;
}

export type CheckKind = "compreensao" | "vocabulario" | "uso";

export const CHECK_KIND_LABEL: Record<CheckKind, string> = {
  compreensao: "Compreensão",
  vocabulario: "Vocabulário",
  uso: "Usar na conversa",
};

export interface CheckQuestion {
  id: string;
  kind: CheckKind;
  /** Pergunta da primeira verificação. */
  main: CheckItem;
  /** Variante usada na re-verificação, depois da mini-aula. */
  retry: CheckItem;
  /** Índice da fala do vídeo que ensina este ponto (usado em "Rever trecho"). */
  lineIndex: number;
  /** Sugestão (degrau 2 da escada de dicas). */
  tipPt: string;
  /** Mini-aula mostrada quando o aluno erra. */
  teachPt: string;
}

export interface VideoLesson {
  /** Id do vídeo = nome dos arquivos (public/videos/<id>.mp4). */
  id: string;
  conceptCode: ConceptCode;
  title: string;
  /** Objetivo da aula, em português. */
  goalPt: string;
  /** Cenário do vídeo. */
  setting: string;
  /** Duração alvo em segundos (aproximada). */
  targetSec: number;
  /** Velocidade de fala sugerida para o TTS (A1 mais devagar). */
  speechRate: string;
  lines: VideoLine[];
  /** O que a aula ensina (aparece no resumo final). */
  teaches: { es: string; pt: string }[];
  questions: CheckQuestion[];
}

export const VIDEO_LESSONS: VideoLesson[] = [
  // ======================= A1 =======================
  {
    id: "a1-01-saludos",
    conceptCode: "A1.1",
    title: "¡Hola! ¿Cómo te llamas?",
    goalPt: "Cumprimentar, dizer o nome, perguntar como a pessoa está e se despedir.",
    setting: "Pátio de uma escola de idiomas em Madri, manhã ensolarada. Lucía e Diego se conhecem no primeiro dia de aula.",
    targetSec: 50,
    speechRate: "-20%",
    lines: [
      { speaker: "Carmen", es: "¡Hola! Soy Carmen, tu profesora. Hoy vamos a aprender a saludar y a presentarnos.", pt: "Olá! Sou Carmen, sua professora. Hoje vamos aprender a cumprimentar e a nos apresentar.", direction: "Carmen olha para a câmera e acena." },
      { speaker: "Diego", es: "¡Hola! Buenos días.", pt: "Oi! Bom dia.", direction: "Diego chega com a mochila e acena para Lucía." },
      { speaker: "Lucía", es: "¡Buenos días! ¿Cómo te llamas?", pt: "Bom dia! Como você se chama?", direction: "Lucía sorri, curiosa." },
      { speaker: "Diego", es: "Me llamo Diego. ¿Y tú?", pt: "Eu me chamo Diego. E você?", direction: "Diego aponta para si mesmo em «Me llamo Diego»." },
      { speaker: "Lucía", es: "Yo me llamo Lucía. Mucho gusto.", pt: "Eu me chamo Lucía. Muito prazer.", direction: "Eles apertam as mãos." },
      { speaker: "Diego", es: "Encantado, Lucía. ¿Cómo estás?", pt: "Encantado, Lucía. Como você está?" },
      { speaker: "Lucía", es: "Muy bien, gracias. ¿Y tú?", pt: "Muito bem, obrigada. E você?", direction: "Polegar para cima." },
      { speaker: "Diego", es: "Bien también. ¡Hasta luego!", pt: "Bem também. Até logo!", direction: "Diego começa a se afastar." },
      { speaker: "Lucía", es: "¡Adiós, hasta luego!", pt: "Tchau, até logo!", direction: "Lucía acena." },
      { speaker: "Carmen", es: "Recuerda: para decir tu nombre, usa «me llamo». Para despedirte, «hasta luego».", pt: "Lembre: para dizer seu nome, use «me llamo». Para se despedir, «hasta luego».", direction: "Carmen mostra um cartaz com «Me llamo…» e «Hasta luego»." },
    ],
    teaches: [
      { es: "¿Cómo te llamas? — Me llamo…", pt: "Como você se chama? — Eu me chamo…" },
      { es: "Mucho gusto / Encantado, encantada", pt: "Muito prazer" },
      { es: "¿Cómo estás? — Muy bien, gracias. ¿Y tú?", pt: "Como você está? — Muito bem, obrigado/a. E você?" },
      { es: "Adiós / Hasta luego", pt: "Tchau / Até logo" },
    ],
    questions: [
      {
        id: "a1-01-q1", kind: "compreensao", lineIndex: 3,
        main: { prompt: "¿Cómo se llama el chico?", options: ["Lucía", "Diego", "Carmen", "Mateo"], correctIndex: 1 },
        retry: { prompt: "¿Cómo se llama la chica?", options: ["Carmen", "Valentina", "Lucía", "Diego"], correctIndex: 2 },
        tipPt: "Preste atenção na resposta para «¿Cómo te llamas?».",
        teachPt: "Para dizer o nome, o espanhol usa «me llamo» (literalmente, «eu me chamo»). No vídeo, Diego responde «Me llamo Diego» e Lucía responde «Yo me llamo Lucía».",
      },
      {
        id: "a1-01-q2", kind: "vocabulario", lineIndex: 4,
        main: { prompt: "«Mucho gusto» significa:", options: ["Gosto muito de comida.", "Muito prazer.", "Muito obrigado.", "Até logo."], correctIndex: 1 },
        retry: { prompt: "Diego diz «Encantado» quando conhece Lucía. Isso quer dizer:", options: ["Estou cansado.", "Muito prazer.", "Que tempo bonito.", "Boa noite."], correctIndex: 1 },
        tipPt: "É o que dizemos quando conhecemos alguém pela primeira vez.",
        teachPt: "Quando conhecemos alguém, dizemos «Mucho gusto» ou «Encantado» (se quem fala é homem) / «Encantada» (se é mulher). É o nosso «muito prazer». Lucía diz «Mucho gusto» e Diego responde «Encantado».",
      },
      {
        id: "a1-01-q3", kind: "uso", lineIndex: 6,
        main: { prompt: "Alguém pergunta: «¿Cómo estás?». Qual a melhor resposta?", options: ["Me llamo Ana.", "Muy bien, gracias.", "Hasta luego.", "Buenos días."], correctIndex: 1 },
        retry: { prompt: "Uma amiga pergunta «¿Cómo estás?». Responda:", options: ["Bien, ¿y tú?", "Me llamo Pedro.", "Mucho gusto.", "Adiós."], correctIndex: 0 },
        tipPt: "A pergunta é sobre como a pessoa está, não sobre o nome.",
        teachPt: "«¿Cómo estás?» pergunta como a pessoa está. Responda «Muy bien, gracias» ou só «Bien» e devolva a pergunta: «¿Y tú?». Foi exatamente o que Lucía fez no vídeo.",
      },
    ],
  },
  {
    id: "a1-02-origen",
    conceptCode: "A1.2",
    title: "¿De dónde eres?",
    goalPt: "Dizer de onde você é, a sua idade e trocar números de telefone.",
    setting: "Festa de boas-vindas de intercambistas num terraço em Montevidéu, fim de tarde, luzinhas penduradas.",
    targetSec: 55,
    speechRate: "-20%",
    lines: [
      { speaker: "Carmen", es: "Hola de nuevo. Hoy vamos a hablar de la edad y del país de origen.", pt: "Olá de novo. Hoje vamos falar da idade e do país de origem." },
      { speaker: "Valentina", es: "Hola, Diego. ¿De dónde eres?", pt: "Oi, Diego. De onde você é?", direction: "Valentina segura um copo de suco." },
      { speaker: "Diego", es: "Soy de México, de Guadalajara. ¿Y tú?", pt: "Sou do México, de Guadalajara. E você?" },
      { speaker: "Valentina", es: "Yo soy uruguaya, de Montevideo.", pt: "Eu sou uruguaia, de Montevidéu.", direction: "Ela aponta para a cidade ao fundo." },
      { speaker: "Diego", es: "¡Qué bien! ¿Cuántos años tienes?", pt: "Que legal! Quantos anos você tem?" },
      { speaker: "Valentina", es: "Tengo veintidós años. ¿Y tú?", pt: "Tenho vinte e dois anos. E você?", direction: "Mostra 2 e 2 com os dedos." },
      { speaker: "Diego", es: "Yo tengo veinticinco. Y hablo un poco de portugués.", pt: "Eu tenho vinte e cinco. E falo um pouco de português.", direction: "Gesto de «um pouquinho» com os dedos." },
      { speaker: "Valentina", es: "¡Genial! ¿Me das tu número de teléfono?", pt: "Ótimo! Você me passa seu número de telefone?", direction: "Valentina pega o celular." },
      { speaker: "Diego", es: "Claro: seis, dos, siete, cero, nueve.", pt: "Claro: seis, dois, sete, zero, nove.", direction: "Fala devagar, número por número." },
      { speaker: "Carmen", es: "Recuerda: «tengo veintidós años». En español, la edad se dice con el verbo «tener».", pt: "Lembre: «tengo veintidós años». Em espanhol, a idade se diz com o verbo «tener» (ter)." },
    ],
    teaches: [
      { es: "¿De dónde eres? — Soy de México.", pt: "De onde você é? — Sou do México." },
      { es: "Soy uruguaya / Soy brasileño", pt: "Nacionalidade com «ser»" },
      { es: "¿Cuántos años tienes? — Tengo veintidós años.", pt: "A idade usa «tener», não «ser»" },
      { es: "cero, uno, dos, tres… diez, veinte", pt: "Números de 0 a 20" },
    ],
    questions: [
      {
        id: "a1-02-q1", kind: "compreensao", lineIndex: 3,
        main: { prompt: "¿De dónde es Valentina?", options: ["De México.", "De Uruguay.", "De España.", "De Argentina."], correctIndex: 1 },
        retry: { prompt: "¿De dónde es Diego?", options: ["De Uruguay.", "De Brasil.", "De México.", "De España."], correctIndex: 2 },
        tipPt: "Ela diz a nacionalidade e a cidade: Montevidéu.",
        teachPt: "Para dizer a origem: «Soy de + país/cidade» (Soy de México) ou a nacionalidade: «Soy uruguaya». No vídeo, Valentina diz «Yo soy uruguaya, de Montevideo» e Diego diz «Soy de México, de Guadalajara».",
      },
      {
        id: "a1-02-q2", kind: "uso", lineIndex: 5,
        main: { prompt: "Como se diz «Eu tenho 22 anos»?", options: ["Soy veintidós años.", "Tengo veintidós años.", "Estoy veintidós años.", "Hay veintidós años."], correctIndex: 1 },
        retry: { prompt: "Diego diz «Yo tengo veinticinco». Quantos anos ele tem?", options: ["15", "20", "25", "52"], correctIndex: 2 },
        tipPt: "Igual ao português: a idade é algo que a gente «tem».",
        teachPt: "A idade usa o verbo «tener»: «Tengo 22 años» (nunca «soy 22 años»). Veinte = 20, veintidós = 22, veinticinco = 25.",
      },
      {
        id: "a1-02-q3", kind: "vocabulario", lineIndex: 8,
        main: { prompt: "«Seis, dos, siete, cero, nueve» — qual é o número de Diego?", options: ["6 2 7 0 9", "7 2 6 0 9", "6 12 7 10 9", "3 2 7 0 5"], correctIndex: 0 },
        retry: { prompt: "«Nueve» é o número:", options: ["6", "9", "19", "11"], correctIndex: 1 },
        tipPt: "Vá número por número: seis, dos, siete…",
        teachPt: "Números de 0 a 10: cero, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez. Diego dá o telefone: seis (6), dos (2), siete (7), cero (0), nueve (9).",
      },
    ],
  },
  {
    id: "a1-03-familia",
    conceptCode: "A1.3",
    title: "Mi familia",
    goalPt: "Falar da família e usar «mi» e «mis».",
    setting: "Café aconchegante em Madri. Lucía mostra fotos da família no celular para Valentina.",
    targetSec: 55,
    speechRate: "-20%",
    lines: [
      { speaker: "Carmen", es: "Hoy vamos a hablar de la familia.", pt: "Hoje vamos falar da família." },
      { speaker: "Valentina", es: "¿Quién es este chico de la foto?", pt: "Quem é esse garoto da foto?", direction: "Plano do celular com a foto de um adolescente." },
      { speaker: "Lucía", es: "Es mi hermano Pablo. Tiene quince años.", pt: "É meu irmão Pablo. Ele tem quinze anos." },
      { speaker: "Valentina", es: "¿Y la señora?", pt: "E a senhora?" },
      { speaker: "Lucía", es: "Es mi madre, Ana. Y este es mi padre, Luis.", pt: "É minha mãe, Ana. E este é meu pai, Luis.", direction: "Lucía desliza para a próxima foto." },
      { speaker: "Valentina", es: "¿Tienes más hermanos?", pt: "Você tem mais irmãos?" },
      { speaker: "Lucía", es: "Sí, tengo una hermana mayor. Se llama Marta.", pt: "Sim, tenho uma irmã mais velha. Ela se chama Marta." },
      { speaker: "Valentina", es: "¡Qué familia tan bonita! Yo soy hija única.", pt: "Que família bonita! Eu sou filha única." },
      { speaker: "Lucía", es: "¿Y tus abuelos viven en Montevideo?", pt: "E seus avós moram em Montevidéu?" },
      { speaker: "Valentina", es: "Sí, mis abuelos viven cerca de mi casa.", pt: "Sim, meus avós moram perto da minha casa.", direction: "Valentina sorri com carinho." },
      { speaker: "Carmen", es: "Recuerda: «mi» para una persona y «mis» para varias: mi hermano, mis abuelos.", pt: "Lembre: «mi» para uma pessoa e «mis» para várias: mi hermano, mis abuelos." },
    ],
    teaches: [
      { es: "padre, madre, hermano, hermana, abuelos", pt: "pai, mãe, irmão, irmã, avós" },
      { es: "mi hermano / mis abuelos", pt: "meu irmão / meus avós" },
      { es: "una hermana mayor", pt: "uma irmã mais velha" },
      { es: "hija única", pt: "filha única" },
    ],
    questions: [
      {
        id: "a1-03-q1", kind: "vocabulario", lineIndex: 2,
        main: { prompt: "Pablo é o … de Lucía.", options: ["pai", "irmão", "avô", "primo"], correctIndex: 1 },
        retry: { prompt: "Ana é a … de Lucía.", options: ["irmã", "avó", "mãe", "tia"], correctIndex: 2 },
        tipPt: "«Hermano» parece «irmão»…",
        teachPt: "Família: padre (pai), madre (mãe), hermano/hermana (irmão/irmã), abuelo/abuela (avô/avó). Lucía diz «Es mi hermano Pablo» e «Es mi madre, Ana».",
      },
      {
        id: "a1-03-q2", kind: "compreensao", lineIndex: 6,
        main: { prompt: "¿Cuántos hermanos tiene Lucía?", options: ["Ninguno.", "Uno.", "Dos.", "Tres."], correctIndex: 2 },
        retry: { prompt: "¿Valentina tiene hermanos?", options: ["Sí, dos.", "No, es hija única.", "Sí, una hermana.", "Sí, un hermano mayor."], correctIndex: 1 },
        tipPt: "Conte: Pablo… e quem mais?",
        teachPt: "Lucía tem o Pablo e a Marta: dois irmãos. «Mayor» = mais velho/a. Valentina diz «Yo soy hija única»: filha única, sem irmãos.",
      },
      {
        id: "a1-03-q3", kind: "uso", lineIndex: 9,
        main: { prompt: "Complete: «___ abuelos viven en Montevideo.»", options: ["Mi", "Mis", "Me", "Mía"], correctIndex: 1 },
        retry: { prompt: "Complete: «___ madre se llama Ana.»", options: ["Mis", "Mi", "Me", "Yo"], correctIndex: 1 },
        tipPt: "«Abuelos» está no plural.",
        teachPt: "«Mi» acompanha uma palavra no singular (mi madre, mi casa) e «mis», uma no plural (mis abuelos). É como «meu/minha» e «meus/minhas», mas sem mudar para masculino ou feminino.",
      },
    ],
  },
  {
    id: "a1-04-cafeteria",
    conceptCode: "A1.4",
    title: "En la cafetería",
    goalPt: "Pedir comida e bebida e perguntar quanto custa.",
    setting: "Balcão de uma cafeteria tradicional em Madri, com azulejos e uma máquina de café brilhante.",
    targetSec: 50,
    speechRate: "-15%",
    lines: [
      { speaker: "Carmen", es: "Hoy vamos a pedir algo en una cafetería.", pt: "Hoje vamos pedir algo numa cafeteria." },
      { speaker: "Camarero", es: "Buenas tardes. ¿Qué quieres tomar?", pt: "Boa tarde. O que você quer beber?", direction: "O garçom limpa o balcão." },
      { speaker: "Diego", es: "Quiero un café con leche, por favor.", pt: "Quero um café com leite, por favor." },
      { speaker: "Camarero", es: "¿Algo para comer?", pt: "Algo para comer?" },
      { speaker: "Diego", es: "Sí, un bocadillo de queso. ¿Tienen zumo de naranja?", pt: "Sim, um sanduíche de queijo. Vocês têm suco de laranja?", direction: "Diego aponta para a vitrine." },
      { speaker: "Camarero", es: "Sí, claro. ¿Grande o pequeño?", pt: "Sim, claro. Grande ou pequeno?" },
      { speaker: "Diego", es: "Pequeño, gracias. ¿Cuánto es?", pt: "Pequeno, obrigado. Quanto é?", direction: "Diego pega a carteira." },
      { speaker: "Camarero", es: "Son seis euros con cincuenta.", pt: "São seis euros e cinquenta." },
      { speaker: "Diego", es: "Aquí tiene. ¡Gracias!", pt: "Aqui está. Obrigado!", direction: "Entrega o dinheiro." },
      { speaker: "Carmen", es: "Recuerda: para pedir, usa «quiero…, por favor». Para pagar, pregunta «¿cuánto es?».", pt: "Lembre: para pedir, use «quiero…, por favor». Para pagar, pergunte «¿cuánto es?»." },
    ],
    teaches: [
      { es: "Quiero un café con leche, por favor.", pt: "Quero um café com leite, por favor." },
      { es: "un bocadillo de queso / un zumo de naranja", pt: "um sanduíche de queijo / um suco de laranja" },
      { es: "¿Cuánto es? — Son seis euros.", pt: "Quanto é? — São seis euros." },
      { es: "Aquí tiene.", pt: "Aqui está." },
    ],
    questions: [
      {
        id: "a1-04-q1", kind: "compreensao", lineIndex: 2,
        main: { prompt: "¿Qué bebe Diego?", options: ["Un té.", "Un café con leche.", "Agua con gas.", "Un refresco."], correctIndex: 1 },
        retry: { prompt: "¿Qué come Diego?", options: ["Una pizza.", "Un bocadillo de queso.", "Una ensalada.", "Nada."], correctIndex: 1 },
        tipPt: "É a primeira coisa que ele pede.",
        teachPt: "Diego pede: «Quiero un café con leche, por favor» e depois «un bocadillo de queso». Na Espanha, «bocadillo» é um sanduíche feito com pão tipo baguete.",
      },
      {
        id: "a1-04-q2", kind: "vocabulario", lineIndex: 4,
        main: { prompt: "«Zumo de naranja» é:", options: ["suco de laranja", "sopa de laranja", "bolo de laranja", "chá de laranja"], correctIndex: 0 },
        retry: { prompt: "«Queso» é:", options: ["queijo", "quiche", "beijo", "doce"], correctIndex: 0 },
        tipPt: "«Naranja» é uma fruta laranja…",
        teachPt: "«Zumo» = suco (na Espanha; na América Latina se diz «jugo»). «Naranja» = laranja. «Queso» = queijo.",
      },
      {
        id: "a1-04-q3", kind: "uso", lineIndex: 6,
        main: { prompt: "Você quer saber o preço. Pergunte:", options: ["¿Cómo estás?", "¿Cuánto es?", "¿Qué hora es?", "¿Dónde está?"], correctIndex: 1 },
        retry: { prompt: "Você quer pedir uma água. Diga:", options: ["Quiero un agua, por favor.", "Tengo un agua.", "Soy un agua, por favor.", "¿Cuánto agua?"], correctIndex: 0 },
        tipPt: "«Cuánto» parece «quanto».",
        teachPt: "Para perguntar o preço: «¿Cuánto es?» (quanto é?). Para pedir: «Quiero + coisa, por favor». Diego usa as duas frases no vídeo.",
      },
    ],
  },
  {
    id: "a1-05-rutina",
    conceptCode: "A1.5",
    title: "¿Qué hora es?",
    goalPt: "Perguntar e dizer as horas e contar a rotina do dia.",
    setting: "Biblioteca da escola, mesa com livros e um relógio grande na parede. Diego e Lucía tentam marcar um horário para estudar.",
    targetSec: 55,
    speechRate: "-15%",
    lines: [
      { speaker: "Carmen", es: "Hoy vamos a hablar de la rutina y de la hora.", pt: "Hoje vamos falar da rotina e das horas." },
      { speaker: "Diego", es: "Lucía, ¿qué hora es?", pt: "Lucía, que horas são?" },
      { speaker: "Lucía", es: "Son las cuatro y media.", pt: "São quatro e meia.", direction: "Ela olha o relógio na parede: 4:30." },
      { speaker: "Diego", es: "¿Estudiamos juntos mañana por la mañana?", pt: "Estudamos juntos amanhã de manhã?" },
      { speaker: "Lucía", es: "Por la mañana no puedo. Me levanto a las siete y trabajo hasta las dos.", pt: "De manhã não posso. Eu me levanto às sete e trabalho até as duas." },
      { speaker: "Diego", es: "¿Y por la tarde?", pt: "E à tarde?" },
      { speaker: "Lucía", es: "Por la tarde voy al gimnasio a las cinco.", pt: "À tarde vou à academia às cinco." },
      { speaker: "Diego", es: "Entonces, ¿a las siete de la tarde?", pt: "Então, às sete da noite?" },
      { speaker: "Lucía", es: "¡Perfecto! Normalmente ceno a las nueve.", pt: "Perfeito! Normalmente janto às nove.", direction: "Eles anotam na agenda." },
      { speaker: "Carmen", es: "Recuerda: «es la una», pero «son las dos, son las tres». Y para tu rutina: «me levanto a las siete».", pt: "Lembre: «es la una», mas «son las dos, son las tres». E para a sua rotina: «me levanto a las siete»." },
    ],
    teaches: [
      { es: "¿Qué hora es? — Son las cuatro y media.", pt: "Que horas são? — São quatro e meia." },
      { es: "Es la una / Son las dos", pt: "«Es» só para uma hora; «son» para as outras" },
      { es: "Me levanto a las siete.", pt: "Eu me levanto às sete." },
      { es: "por la mañana / por la tarde / por la noche", pt: "de manhã / à tarde / à noite" },
    ],
    questions: [
      {
        id: "a1-05-q1", kind: "compreensao", lineIndex: 2,
        main: { prompt: "¿Qué hora es en el vídeo?", options: ["4:30", "5:00", "7:00", "2:30"], correctIndex: 0 },
        retry: { prompt: "«Son las cinco y media» é:", options: ["5:15", "5:30", "6:30", "4:50"], correctIndex: 1 },
        tipPt: "«Media» é a metade da hora.",
        teachPt: "«Y media» = e meia (:30). «Y cuarto» = e quinze (:15). Então «son las cuatro y media» = 4:30.",
      },
      {
        id: "a1-05-q2", kind: "compreensao", lineIndex: 4,
        main: { prompt: "¿A qué hora se levanta Lucía?", options: ["A las cinco.", "A las siete.", "A las nueve.", "A las dos."], correctIndex: 1 },
        retry: { prompt: "¿Hasta qué hora trabaja Lucía?", options: ["Hasta las siete.", "Hasta las dos.", "Hasta las cinco.", "Hasta las nueve."], correctIndex: 1 },
        tipPt: "Procure «me levanto a las…».",
        teachPt: "Lucía conta a rotina: «Me levanto a las siete» (às 7h) «y trabajo hasta las dos» (até as 14h). Para dizer a hora de uma ação: «a las + hora».",
      },
      {
        id: "a1-05-q3", kind: "uso", lineIndex: 8,
        main: { prompt: "Como se diz «Eu janto às nove»?", options: ["Ceno a las nueve.", "Ceno son las nueve.", "Como a nueve.", "Cena las nueve."], correctIndex: 0 },
        retry: { prompt: "Como se diz «Eu me levanto às seis»?", options: ["Levanto las seis.", "Me levanto a las seis.", "Soy levanto a las seis.", "Me levanto son seis."], correctIndex: 1 },
        tipPt: "Para quando algo acontece usamos «a las».",
        teachPt: "Para dizer quando você faz algo: verbo + «a las» + hora: «Ceno a las nueve», «Me levanto a las seis». O «son las…» só serve para dizer que horas são agora.",
      },
    ],
  },
  // ======================= A2 =======================
  {
    id: "a2-01-compras",
    conceptCode: "A2.1",
    title: "De compras",
    goalPt: "Comprar roupa: pedir um tamanho, experimentar e perguntar o preço.",
    setting: "Loja de roupas no bairro de Palermo, em Buenos Aires. Araras de jaquetas, um provador com cortina.",
    targetSec: 60,
    speechRate: "-10%",
    lines: [
      { speaker: "Carmen", es: "Hoy vamos de compras. Vamos a preguntar precios y tallas.", pt: "Hoje vamos às compras. Vamos perguntar preços e tamanhos." },
      { speaker: "Vendedora", es: "Hola, ¿te puedo ayudar?", pt: "Oi, posso te ajudar?" },
      { speaker: "Valentina", es: "Sí, busco una chaqueta para el invierno.", pt: "Sim, procuro uma jaqueta para o inverno." },
      { speaker: "Vendedora", es: "Tenemos esta azul y esa negra. ¿Qué talla usas?", pt: "Temos esta azul e essa preta. Que tamanho você usa?", direction: "A vendedora segura a azul e aponta para a preta na arara." },
      { speaker: "Valentina", es: "La talla M. ¿Me puedo probar la azul?", pt: "O tamanho M. Posso experimentar a azul?" },
      { speaker: "Vendedora", es: "Claro, el probador está al fondo.", pt: "Claro, o provador fica no fundo." },
      { speaker: "Valentina", es: "Me queda un poco grande. ¿Tiene una más pequeña?", pt: "Ficou um pouco grande. Tem uma menor?", direction: "Valentina sai do provador com as mangas compridas demais." },
      { speaker: "Vendedora", es: "Sí, aquí tienes la talla S.", pt: "Sim, aqui está o tamanho P (S)." },
      { speaker: "Valentina", es: "Esta me queda perfecta. ¿Cuánto cuesta?", pt: "Esta ficou perfeita. Quanto custa?", direction: "Ela se olha no espelho, feliz." },
      { speaker: "Vendedora", es: "Cuesta cuarenta mil pesos, pero hoy tiene un descuento del veinte por ciento.", pt: "Custa quarenta mil pesos, mas hoje tem um desconto de vinte por cento." },
      { speaker: "Carmen", es: "Recuerda: «me queda grande» quiere decir que la ropa es grande para ti. Y para el precio: «¿cuánto cuesta?».", pt: "Lembre: «me queda grande» quer dizer que a roupa está grande para você. E para o preço: «¿cuánto cuesta?»." },
    ],
    teaches: [
      { es: "Busco una chaqueta. ¿Qué talla usas?", pt: "Procuro uma jaqueta. Que tamanho você usa?" },
      { es: "¿Me puedo probar la azul?", pt: "Posso experimentar a azul?" },
      { es: "Me queda grande / perfecta", pt: "Ficou grande / perfeita (em mim)" },
      { es: "¿Cuánto cuesta?", pt: "Quanto custa?" },
    ],
    questions: [
      {
        id: "a2-01-q1", kind: "compreensao", lineIndex: 2,
        main: { prompt: "¿Qué busca Valentina?", options: ["Unos zapatos.", "Una chaqueta.", "Una camiseta.", "Un vestido."], correctIndex: 1 },
        retry: { prompt: "¿De qué color es la chaqueta que se prueba primero?", options: ["Negra.", "Roja.", "Azul.", "Blanca."], correctIndex: 2 },
        tipPt: "É uma roupa para o inverno.",
        teachPt: "«Busco una chaqueta» = procuro uma jaqueta. Ela experimenta primeiro a azul («¿Me puedo probar la azul?»). Cores: azul, negro/negra (preto), rojo (vermelho), blanco (branco).",
      },
      {
        id: "a2-01-q2", kind: "vocabulario", lineIndex: 6,
        main: { prompt: "«Me queda un poco grande» significa:", options: ["Fica um pouco longe.", "Ficou um pouco grande em mim.", "Sobrou um pouco.", "Quero uma grande."], correctIndex: 1 },
        retry: { prompt: "«Esta me queda perfecta» significa:", options: ["Esta ficou perfeita em mim.", "Eu fico perfeita.", "Quero a perfeita.", "Esta está quieta."], correctIndex: 0 },
        tipPt: "Valentina saiu do provador com as mangas compridas demais.",
        teachPt: "«Quedar» com roupa = ficar (bem ou mal) no corpo: «me queda grande» (ficou grande em mim), «me queda bien» (ficou bem). Não tem nada a ver com «ficar quieto».",
      },
      {
        id: "a2-01-q3", kind: "uso", lineIndex: 4,
        main: { prompt: "Você quer experimentar uma roupa. Pergunte:", options: ["¿Me puedo probar esta?", "¿Me puedo comer esta?", "¿Cuánto me queda?", "¿Dónde cuesta la talla?"], correctIndex: 0 },
        retry: { prompt: "Você quer saber o preço da camiseta. Pergunte:", options: ["¿Qué talla usas?", "¿Cuánto cuesta la camiseta?", "¿Me queda la camiseta?", "¿Dónde cuesta?"], correctIndex: 1 },
        tipPt: "«Probar» é provar/experimentar.",
        teachPt: "«Probarse» = experimentar roupa: «¿Me puedo probar la azul?». Para o preço: «¿Cuánto cuesta?» (uma peça) ou «¿Cuánto cuestan?» (várias).",
      },
    ],
  },
  {
    id: "a2-02-direcciones",
    conceptCode: "A2.2",
    title: "¿Dónde está el museo?",
    goalPt: "Pedir e entender direções na rua.",
    setting: "Rua da Cidade Velha de Montevidéu, com prédios antigos e uma praça ao fundo. Diego, turista, segura um mapa.",
    targetSec: 55,
    speechRate: "-10%",
    lines: [
      { speaker: "Carmen", es: "Hoy vamos a pedir y entender direcciones en la ciudad.", pt: "Hoje vamos pedir e entender direções na cidade." },
      { speaker: "Diego", es: "Disculpe, señor. ¿Dónde está el Museo de Arte?", pt: "Com licença, senhor. Onde fica o Museu de Arte?", direction: "Diego mostra o mapa." },
      { speaker: "Señor Ruiz", es: "Está un poco lejos. ¿Va a pie?", pt: "Fica um pouco longe. O senhor vai a pé?" },
      { speaker: "Diego", es: "Sí, me gusta caminar.", pt: "Sim, gosto de caminhar." },
      { speaker: "Señor Ruiz", es: "Siga todo recto por esta calle hasta la plaza.", pt: "Siga sempre reto por esta rua até a praça.", direction: "Aponta para a frente com a bengala." },
      { speaker: "Señor Ruiz", es: "En la plaza, gire a la derecha.", pt: "Na praça, vire à direita.", direction: "Gesto claro para a direita." },
      { speaker: "Señor Ruiz", es: "El museo está al lado de un banco, enfrente del parque.", pt: "O museu fica ao lado de um banco, em frente ao parque." },
      { speaker: "Diego", es: "Entonces: recto, a la derecha en la plaza y al lado del banco. ¡Muchas gracias!", pt: "Então: reto, à direita na praça e ao lado do banco. Muito obrigado!", direction: "Diego repete contando nos dedos." },
      { speaker: "Señor Ruiz", es: "De nada. ¡Que disfrute la visita!", pt: "De nada. Aproveite a visita!" },
      { speaker: "Carmen", es: "Recuerda: «a la derecha», «a la izquierda» y «todo recto». Con personas que no conoces, usamos «usted»: «siga», «gire».", pt: "Lembre: «a la derecha» (à direita), «a la izquierda» (à esquerda) e «todo recto» (sempre reto). Com pessoas que você não conhece, usamos «usted»: «siga», «gire»." },
    ],
    teaches: [
      { es: "Disculpe, ¿dónde está el museo?", pt: "Com licença, onde fica o museu?" },
      { es: "Siga todo recto. Gire a la derecha / a la izquierda.", pt: "Siga reto. Vire à direita / à esquerda." },
      { es: "al lado de / enfrente de / cerca / lejos", pt: "ao lado de / em frente a / perto / longe" },
      { es: "¡Muchas gracias! — De nada.", pt: "Muito obrigado! — De nada." },
    ],
    questions: [
      {
        id: "a2-02-q1", kind: "compreensao", lineIndex: 5,
        main: { prompt: "En la plaza, Diego tiene que girar…", options: ["a la izquierda.", "a la derecha.", "hacia atrás.", "dos veces."], correctIndex: 1 },
        retry: { prompt: "Antes de la plaza, Diego tiene que…", options: ["girar a la izquierda.", "tomar un taxi.", "seguir todo recto.", "volver al hotel."], correctIndex: 2 },
        tipPt: "«Derecha» lembra «direita».",
        teachPt: "O senhor explica em ordem: «Siga todo recto… hasta la plaza» (reto até a praça) e «En la plaza, gire a la derecha» (vire à direita). Derecha = direita; izquierda = esquerda.",
      },
      {
        id: "a2-02-q2", kind: "vocabulario", lineIndex: 6,
        main: { prompt: "«Enfrente del parque» significa:", options: ["atrás do parque", "em frente ao parque", "dentro do parque", "longe do parque"], correctIndex: 1 },
        retry: { prompt: "«Al lado de un banco» significa:", options: ["ao lado de um banco", "embaixo de um banco", "longe de um banco", "dentro de um banco"], correctIndex: 0 },
        tipPt: "«Enfrente» parece «em frente».",
        teachPt: "Palavras de lugar: «al lado de» (ao lado de), «enfrente de» (em frente a), «detrás de» (atrás de), «cerca de» (perto de), «lejos de» (longe de).",
      },
      {
        id: "a2-02-q3", kind: "uso", lineIndex: 1,
        main: { prompt: "Você está perdido e quer achar a estação. Pergunte:", options: ["¿Dónde está la estación?", "¿Cuánto es la estación?", "¿Cómo te llamas, estación?", "¿Qué hora es la estación?"], correctIndex: 0 },
        retry: { prompt: "Para pedir ajuda educadamente a um senhor na rua, você começa com:", options: ["¡Hasta luego!", "Disculpe, señor…", "¡De nada!", "Me queda grande."], correctIndex: 1 },
        tipPt: "Para lugares usamos «dónde».",
        teachPt: "Para perguntar onde fica algo: «¿Dónde está + lugar?». Comece com «Disculpe» (com licença) para ser educado e termine com «¡Muchas gracias!».",
      },
    ],
  },
  {
    id: "a2-03-fin-de-semana",
    conceptCode: "A2.3",
    title: "¿Qué hiciste el fin de semana?",
    goalPt: "Contar o que você fez no passado.",
    setting: "Segunda-feira de manhã, corredor da escola. Mateo (com a térmica de mate) encontra Lucía.",
    targetSec: 55,
    speechRate: "-10%",
    lines: [
      { speaker: "Carmen", es: "Hoy vamos a contar qué hicimos el fin de semana. Es el pasado.", pt: "Hoje vamos contar o que fizemos no fim de semana. É o passado." },
      { speaker: "Mateo", es: "¡Hola, Lucía! ¿Qué hiciste el fin de semana?", pt: "Oi, Lucía! O que você fez no fim de semana?" },
      { speaker: "Lucía", es: "El sábado fui al cine con mi hermana.", pt: "No sábado fui ao cinema com minha irmã." },
      { speaker: "Mateo", es: "¿Y qué película viste?", pt: "E que filme você viu?" },
      { speaker: "Lucía", es: "Vimos una comedia argentina. ¡Me reí mucho!", pt: "Vimos uma comédia argentina. Ri muito!", direction: "Lucía ri lembrando do filme." },
      { speaker: "Lucía", es: "¿Y tú? ¿Qué hiciste?", pt: "E você? O que você fez?" },
      { speaker: "Mateo", es: "El domingo comí un asado con mis amigos en el parque.", pt: "No domingo comi um churrasco com meus amigos no parque.", direction: "Mateo mostra uma foto do asado no celular." },
      { speaker: "Mateo", es: "Después jugamos al fútbol y llegué a casa muy cansado.", pt: "Depois jogamos futebol e cheguei em casa muito cansado.", direction: "Ele finge estar exausto." },
      { speaker: "Lucía", es: "¡Qué buen fin de semana!", pt: "Que fim de semana bom!" },
      { speaker: "Carmen", es: "Recuerda: para acciones terminadas usamos el pretérito: fui, vi, comí, jugamos, llegué.", pt: "Lembre: para ações terminadas usamos o pretérito: fui, vi, comí, jugamos, llegué." },
    ],
    teaches: [
      { es: "¿Qué hiciste el fin de semana?", pt: "O que você fez no fim de semana?" },
      { es: "Fui al cine. Vi una película.", pt: "Fui ao cinema. Vi um filme." },
      { es: "Comí un asado. Llegué cansado.", pt: "Comi um churrasco. Cheguei cansado." },
      { es: "Jugamos al fútbol. Vimos una comedia.", pt: "Jogamos futebol. Vimos uma comédia." },
    ],
    questions: [
      {
        id: "a2-03-q1", kind: "compreensao", lineIndex: 2,
        main: { prompt: "¿Adónde fue Lucía el sábado?", options: ["Al parque.", "Al cine.", "A la playa.", "Al museo."], correctIndex: 1 },
        retry: { prompt: "¿Qué comió Mateo el domingo?", options: ["Una pizza.", "Un asado.", "Una paella.", "Un bocadillo."], correctIndex: 1 },
        tipPt: "«Fui al…» — ela foi a que lugar?",
        teachPt: "Lucía: «El sábado fui al cine» (fui ao cinema). Mateo: «El domingo comí un asado» (comi um churrasco). «Fui» é o passado de «ir».",
      },
      {
        id: "a2-03-q2", kind: "vocabulario", lineIndex: 7,
        main: { prompt: "«Llegué a casa muy cansado» significa:", options: ["Cheguei em casa muito cansado.", "Liguei para casa cansado.", "Levei a casa cansado.", "Chego em casa cansado."], correctIndex: 0 },
        retry: { prompt: "«Me reí mucho» significa:", options: ["Eu chorei muito.", "Eu ri muito.", "Eu dormi muito.", "Eu corri muito."], correctIndex: 1 },
        tipPt: "«Llegar» = chegar.",
        teachPt: "Passado (pretérito indefinido) com «yo»: llegar → llegué (cheguei), reír → me reí (ri), comer → comí (comi), ir → fui (fui).",
      },
      {
        id: "a2-03-q3", kind: "uso", lineIndex: 7,
        main: { prompt: "Complete: «Ayer yo ___ al fútbol con mis amigos.»", options: ["juego", "jugué", "jugar", "jugaré"], correctIndex: 1 },
        retry: { prompt: "Complete: «El sábado nosotros ___ una película.»", options: ["vemos", "vimos", "ver", "veremos"], correctIndex: 1 },
        tipPt: "«Ayer» (ontem) pede o passado.",
        teachPt: "«Ayer», «el sábado» e «el fin de semana pasado» pedem o pretérito: yo jugué, nosotros vimos, yo fui. O presente seria «juego» / «vemos».",
      },
    ],
  },
  {
    id: "a2-04-planes",
    conceptCode: "A2.4",
    title: "Planes para el sábado",
    goalPt: "Falar de planos com «voy a» e dizer do que você gosta.",
    setting: "Parque de Montevidéu numa tarde de primavera. Valentina e Diego sentados num banco, tomando sorvete.",
    targetSec: 55,
    speechRate: "-10%",
    lines: [
      { speaker: "Carmen", es: "Hoy vamos a hablar de planes y de lo que nos gusta.", pt: "Hoje vamos falar de planos e do que gostamos." },
      { speaker: "Diego", es: "Valentina, ¿qué vas a hacer el sábado?", pt: "Valentina, o que você vai fazer no sábado?" },
      { speaker: "Valentina", es: "Voy a ir a la playa. ¿Te gusta la playa?", pt: "Vou à praia. Você gosta de praia?" },
      { speaker: "Diego", es: "Me gusta, pero me encanta más la montaña.", pt: "Gosto, mas adoro mais a montanha.", direction: "Diego faz o gesto de montanha com as mãos." },
      { speaker: "Valentina", es: "¿Y qué vas a hacer tú?", pt: "E o que você vai fazer?" },
      { speaker: "Diego", es: "Voy a visitar a mis tíos. Vamos a comer juntos.", pt: "Vou visitar meus tios. Vamos comer juntos." },
      { speaker: "Valentina", es: "¿Te gustan los conciertos? El domingo hay uno en el centro.", pt: "Você gosta de shows? No domingo tem um no centro." },
      { speaker: "Diego", es: "¡Sí, me gustan mucho! Vamos juntos el domingo.", pt: "Sim, gosto muito! Vamos juntos no domingo.", direction: "Diego se anima." },
      { speaker: "Valentina", es: "¡Genial! Voy a comprar las entradas.", pt: "Ótimo! Vou comprar os ingressos.", direction: "Valentina pega o celular." },
      { speaker: "Carmen", es: "Recuerda: «voy a» más un verbo para los planes. Y «me gusta» con una cosa, «me gustan» con varias.", pt: "Lembre: «voy a» mais um verbo para os planos. E «me gusta» com uma coisa, «me gustan» com várias." },
    ],
    teaches: [
      { es: "¿Qué vas a hacer el sábado? — Voy a ir a la playa.", pt: "O que você vai fazer no sábado? — Vou à praia." },
      { es: "Me gusta la playa. Me encanta la montaña.", pt: "Gosto da praia. Adoro a montanha." },
      { es: "Me gustan los conciertos.", pt: "Gosto de shows (várias coisas → gustan)." },
      { es: "Voy a comprar las entradas.", pt: "Vou comprar os ingressos." },
    ],
    questions: [
      {
        id: "a2-04-q1", kind: "compreensao", lineIndex: 2,
        main: { prompt: "¿Qué va a hacer Valentina el sábado?", options: ["Ir a la montaña.", "Ir a la playa.", "Visitar a sus tíos.", "Comprar ropa."], correctIndex: 1 },
        retry: { prompt: "¿Qué va a hacer Diego el sábado?", options: ["Ir a la playa.", "Visitar a sus tíos.", "Ir al cine.", "Trabajar."], correctIndex: 1 },
        tipPt: "Ouça a resposta dela para «¿qué vas a hacer?».",
        teachPt: "Planos com «ir a + verbo»: Valentina diz «Voy a ir a la playa» (vou à praia) e Diego diz «Voy a visitar a mis tíos» (vou visitar meus tios).",
      },
      {
        id: "a2-04-q2", kind: "vocabulario", lineIndex: 3,
        main: { prompt: "«Me encanta la montaña» significa:", options: ["Adoro a montanha.", "Tenho medo da montanha.", "Moro na montanha.", "Canto na montanha."], correctIndex: 0 },
        retry: { prompt: "«No me gusta» significa:", options: ["Não gosto.", "Não posso.", "Não sei.", "Não quero ir."], correctIndex: 0 },
        tipPt: "«Encantar» é mais forte que «gustar».",
        teachPt: "«Me gusta» = gosto; «me encanta» = adoro (gosto muito); «no me gusta» = não gosto. A coisa de que gostamos vem depois: «me gusta la playa».",
      },
      {
        id: "a2-04-q3", kind: "uso", lineIndex: 7,
        main: { prompt: "Complete: «Me ___ los conciertos.»", options: ["gusta", "gustan", "gusto", "gustamos"], correctIndex: 1 },
        retry: { prompt: "Complete: «Mañana yo ___ estudiar español.»", options: ["voy", "voy a", "fui a", "vamos"], correctIndex: 1 },
        tipPt: "«Los conciertos» está no plural.",
        teachPt: "«Gustar» concorda com a coisa: «me gusta el concierto» (uma), «me gustan los conciertos» (várias). E para planos não esqueça o «a»: «voy a estudiar».",
      },
    ],
  },
  {
    id: "a2-05-medico",
    conceptCode: "A2.5",
    title: "En el médico",
    goalPt: "Dizer o que dói, entender o diagnóstico e os conselhos do médico.",
    setting: "Consultório claro na Cidade do México, com uma maca e um pôster do corpo humano. Mateo está resfriado, com cachecol.",
    targetSec: 55,
    speechRate: "-10%",
    lines: [
      { speaker: "Carmen", es: "Hoy vamos al médico. Vamos a aprender a decir qué nos duele.", pt: "Hoje vamos ao médico. Vamos aprender a dizer o que dói." },
      { speaker: "Doctora López", es: "Buenos días, Mateo. ¿Qué le pasa?", pt: "Bom dia, Mateo. O que o senhor tem?" },
      { speaker: "Mateo", es: "Me duele mucho la cabeza y tengo fiebre.", pt: "Minha cabeça dói muito e estou com febre.", direction: "Mateo leva a mão à testa." },
      { speaker: "Doctora López", es: "¿Desde cuándo?", pt: "Desde quando?" },
      { speaker: "Mateo", es: "Desde ayer por la noche. También me duele la garganta.", pt: "Desde ontem à noite. Também estou com dor de garganta.", direction: "Ele toca a garganta e tosse." },
      { speaker: "Doctora López", es: "Es una gripe. Tiene que descansar y beber mucha agua.", pt: "É uma gripe. O senhor tem que descansar e beber muita água." },
      { speaker: "Doctora López", es: "Tome esta pastilla cada ocho horas.", pt: "Tome este comprimido a cada oito horas.", direction: "Ela entrega uma caixinha de remédio." },
      { speaker: "Mateo", es: "¿Puedo ir a trabajar mañana?", pt: "Posso ir trabalhar amanhã?" },
      { speaker: "Doctora López", es: "No, mejor quédese en casa dos días.", pt: "Não, é melhor ficar em casa dois dias." },
      { speaker: "Carmen", es: "Recuerda: «me duele la cabeza», «me duelen los pies». Y para dar consejos: «tienes que» más un verbo.", pt: "Lembre: «me duele la cabeza» (dói a cabeça), «me duelen los pies» (doem os pés). E para dar conselhos: «tienes que» mais um verbo." },
    ],
    teaches: [
      { es: "¿Qué le pasa? — Me duele la cabeza.", pt: "O que o senhor tem? — Minha cabeça dói." },
      { es: "Tengo fiebre. Tengo gripe.", pt: "Estou com febre. Estou com gripe." },
      { es: "Tiene que descansar y beber agua.", pt: "O senhor tem que descansar e beber água." },
      { es: "una pastilla cada ocho horas", pt: "um comprimido a cada oito horas" },
    ],
    questions: [
      {
        id: "a2-05-q1", kind: "compreensao", lineIndex: 2,
        main: { prompt: "¿Qué le duele a Mateo?", options: ["La espalda y los pies.", "La cabeza y la garganta.", "El estómago.", "Los ojos."], correctIndex: 1 },
        retry: { prompt: "Según la doctora, Mateo tiene…", options: ["una gripe.", "un brazo roto.", "alergia.", "hambre."], correctIndex: 0 },
        tipPt: "Ele leva a mão à testa e depois à garganta.",
        teachPt: "Mateo diz «Me duele mucho la cabeza» e «también me duele la garganta». A médica conclui: «Es una gripe». Corpo: cabeza (cabeça), garganta, estómago (estômago), espalda (costas).",
      },
      {
        id: "a2-05-q2", kind: "vocabulario", lineIndex: 6,
        main: { prompt: "«Tome esta pastilla cada ocho horas» significa:", options: ["Tome este comprimido a cada oito horas.", "Tome esta pasta às oito horas.", "Coma oito pastilhas.", "Tome banho às oito."], correctIndex: 0 },
        retry: { prompt: "«Tengo fiebre» significa:", options: ["Estou com fome.", "Estou com febre.", "Estou com frio.", "Estou feliz."], correctIndex: 1 },
        tipPt: "A médica entrega uma caixinha de remédio.",
        teachPt: "«Pastilla» = comprimido; «cada ocho horas» = a cada oito horas; «fiebre» = febre. Cuidado: «hambre» é fome.",
      },
      {
        id: "a2-05-q3", kind: "uso", lineIndex: 9,
        main: { prompt: "Seu estômago dói. Diga ao médico:", options: ["Me duele el estómago.", "Me duelen el estómago.", "Tengo duele el estómago.", "Soy el estómago."], correctIndex: 0 },
        retry: { prompt: "Complete o conselho: «Tienes que ___ mucha agua.»", options: ["bebes", "beber", "bebiste", "bebe"], correctIndex: 1 },
        tipPt: "Uma parte do corpo → «duele».",
        teachPt: "Para dor: «me duele» + uma parte do corpo (me duele el estómago) e «me duelen» + várias (me duelen los pies). Para conselho: «tienes que» + verbo terminado em -ar/-er/-ir (beber, descansar).",
      },
    ],
  },
  {
    id: "a2-06-variedades",
    conceptCode: "A2.6",
    title: "Tú, vos y vosotros",
    goalPt: "Conhecer as formas de tratamento em países diferentes.",
    setting: "Videochamada em tela dividida: Mateo em Buenos Aires (com o Obelisco pela janela) e Lucía em Madri (com telhados ao fundo).",
    targetSec: 60,
    speechRate: "-10%",
    lines: [
      { speaker: "Carmen", es: "Hoy vamos a conocer variedades del español: tú, vos y vosotros.", pt: "Hoje vamos conhecer variedades do espanhol: tú, vos e vosotros." },
      { speaker: "Mateo", es: "Che, Lucía, ¿vos sabés que en Argentina no decimos «tú»?", pt: "Ei, Lucía, você sabia que na Argentina não dizemos «tú»?" },
      { speaker: "Lucía", es: "¿Ah, no? ¿Y qué decís?", pt: "Ah, não? E o que vocês dizem?", direction: "Lucía, surpresa, se aproxima da tela." },
      { speaker: "Mateo", es: "Decimos «vos»: vos sos, vos tenés, vos hablás.", pt: "Dizemos «vos»: vos sos (você é), vos tenés (você tem), vos hablás (você fala).", direction: "Mateo conta nos dedos." },
      { speaker: "Lucía", es: "¡Qué curioso! En España, con los amigos usamos «vosotros»: ¿vosotros queréis un café?", pt: "Que curioso! Na Espanha, com os amigos usamos «vosotros»: vocês querem um café?" },
      { speaker: "Mateo", es: "En Argentina decimos «ustedes»: ¿ustedes quieren un café?", pt: "Na Argentina dizemos «ustedes»: vocês querem um café?" },
      { speaker: "Lucía", es: "Y con el profesor o con un señor mayor, todos usamos «usted».", pt: "E com o professor ou com um senhor mais velho, todos usamos «usted»." },
      { speaker: "Mateo", es: "¡Exacto! Mismo idioma, distintas formas. ¡Y todas son correctas!", pt: "Exato! Mesma língua, formas diferentes. E todas estão corretas!", direction: "Os dois brindam com as xícaras pela tela." },
      { speaker: "Carmen", es: "Recuerda: «tú» y «vos» son informales; «usted» es formal. «Vosotros» solo se usa en España.", pt: "Lembre: «tú» e «vos» são informais; «usted» é formal. «Vosotros» só se usa na Espanha." },
    ],
    teaches: [
      { es: "vos sos = tú eres · vos tenés = tú tienes", pt: "«Vos» no lugar de «tú» (Argentina e Uruguai)" },
      { es: "vosotros queréis (España) / ustedes quieren (América)", pt: "«Vocês» entre amigos" },
      { es: "usted", pt: "Forma formal em todos os países" },
    ],
    questions: [
      {
        id: "a2-06-q1", kind: "compreensao", lineIndex: 3,
        main: { prompt: "En Argentina, en vez de «tú», se dice…", options: ["usted", "vos", "vosotros", "él"], correctIndex: 1 },
        retry: { prompt: "«Vos sos» equivale a…", options: ["tú eres", "yo soy", "ellos son", "usted es"], correctIndex: 0 },
        tipPt: "Mateo explica isso logo depois da pergunta de Lucía.",
        teachPt: "Na Argentina e no Uruguai usa-se «vos» no lugar de «tú», com verbos próprios: vos sos (= tú eres), vos tenés (= tú tienes), vos hablás (= tú hablas).",
      },
      {
        id: "a2-06-q2", kind: "compreensao", lineIndex: 4,
        main: { prompt: "¿Dónde se usa «vosotros»?", options: ["En Argentina.", "En México.", "En España.", "En todos los países."], correctIndex: 2 },
        retry: { prompt: "Para hablar con un grupo de amigos en Argentina, se dice…", options: ["vosotros", "ustedes", "vos", "usted"], correctIndex: 1 },
        tipPt: "Quem usa «vosotros» no vídeo é a Lucía, de Madri.",
        teachPt: "«Vosotros» (vocês, informal) só se usa na Espanha. Na América Latina, para «vocês» usa-se sempre «ustedes».",
      },
      {
        id: "a2-06-q3", kind: "uso", lineIndex: 6,
        main: { prompt: "Você fala com um senhor mais velho que não conhece. Use:", options: ["¿Vos sabés dónde está el banco?", "¿Usted sabe dónde está el banco?", "¿Vosotros sabéis dónde está el banco?", "¿Tú sabes, che?"], correctIndex: 1 },
        retry: { prompt: "Você está em Madri falando com dois amigos. Use:", options: ["¿Usted quiere un café?", "¿Vosotros queréis un café?", "¿Vos querés un café?", "¿Tú queréis un café?"], correctIndex: 1 },
        tipPt: "Com desconhecidos mais velhos, usamos a forma formal.",
        teachPt: "Formal (desconhecidos, pessoas mais velhas, professor): «usted». Informal: «tú» (ou «vos» na Argentina e no Uruguai). No plural informal, na Espanha: «vosotros».",
      },
    ],
  },
];

export const LESSON_BY_CONCEPT = Object.fromEntries(VIDEO_LESSONS.map((l) => [l.conceptCode, l])) as Record<ConceptCode, VideoLesson>;
export const LESSON_BY_ID: Record<string, VideoLesson> = Object.fromEntries(VIDEO_LESSONS.map((l) => [l.id, l]));
