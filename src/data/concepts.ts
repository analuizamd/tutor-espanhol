/**
 * Mapa das aulas de espanhol A1 e A2 (11 aulas), com nível no grafo e pré-requisitos diretos.
 * Cada aula tem um vídeo de conversa (src/data/videos.ts).
 * Nível no grafo = 1 + maior nível entre os pré-requisitos.
 * Área = nível do Quadro Europeu (A1 iniciante, A2 básico).
 * Textos usados pelo tutor simulado:
 * - rulePt / ruleEs: lembrete da regra (degrau 1 da escada de dicas)
 * - explanationPt: explicação completa (Básico/Médio); explanationEs: curta (Avançado)
 */

export type ConceptCode =
  | "A1.1" | "A1.2" | "A1.3" | "A1.4" | "A1.5"
  | "A2.1" | "A2.2" | "A2.3" | "A2.4" | "A2.5" | "A2.6";

export type Area = "A1" | "A2";

export const AREA_LABEL: Record<Area, string> = {
  A1: "A1 · Iniciante",
  A2: "A2 · Básico",
};

export interface Concept {
  code: ConceptCode;
  name: string;
  area: Area;
  level: 0 | 1 | 2 | 3 | 4;
  prereqs: ConceptCode[];
  rulePt: string;
  ruleEs: string;
  explanationPt: string;
  explanationEs: string;
}

export const CONCEPTS: Concept[] = [
  // ---------- A1 ----------
  {
    code: "A1.1", name: "Cumprimentos e apresentações", area: "A1", level: 0, prereqs: [],
    rulePt: "Para perguntar o nome: «¿Cómo te llamas?». Para responder: «Me llamo…». Ao conhecer alguém: «Mucho gusto» ou «Encantado/a».",
    ruleEs: "¿Cómo te llamas? — Me llamo… Mucho gusto.",
    explanationPt: "Para cumprimentar: «Hola», «Buenos días» (até o almoço), «Buenas tardes», «Buenas noches». Para se apresentar, use «Me llamo + nome» (eu me chamo) ou «Soy + nome». Ao conhecer alguém: «Mucho gusto» ou «Encantado» (homem) / «Encantada» (mulher). Para perguntar como a pessoa está: «¿Cómo estás?» — «Muy bien, gracias. ¿Y tú?». Para se despedir: «Adiós», «Hasta luego».",
    explanationEs: "Hola, me llamo… Mucho gusto. ¿Cómo estás? Hasta luego.",
  },
  {
    code: "A1.2", name: "Origem, idade e números", area: "A1", level: 1, prereqs: ["A1.1"],
    rulePt: "Origem: «Soy de + lugar». Idade: «Tengo + número + años» (com o verbo tener, nunca «soy … años»).",
    ruleEs: "Soy de México. Tengo veinte años.",
    explanationPt: "Para dizer de onde você é: «Soy de Brasil», «Soy brasileño/brasileña». Para perguntar: «¿De dónde eres?». A idade usa o verbo «tener»: «¿Cuántos años tienes?» — «Tengo dieciocho años». Números: cero, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez… veinte (20), veintidós (22), veinticinco (25), treinta (30).",
    explanationEs: "Origen: soy de… Edad: tengo … años.",
  },
  {
    code: "A1.3", name: "A família e os possessivos", area: "A1", level: 1, prereqs: ["A1.1"],
    rulePt: "«Mi» para uma pessoa ou coisa (mi madre) e «mis» para várias (mis abuelos). Família: padre, madre, hermano/a, abuelo/a.",
    ruleEs: "Mi hermano, mis abuelos.",
    explanationPt: "Família: padre (pai), madre (mãe), padres (pais), hermano/hermana (irmão/irmã), abuelo/abuela (avô/avó), tío/tía (tio/tia), primo/prima. Possessivos: «mi/mis» (meu, minha / meus, minhas), «tu/tus» (seu, de você), «su/sus» (dele, dela). Eles mudam só no plural, não no gênero: mi padre, mi madre, mis padres. «Mayor» = mais velho; «hijo/hija único/a» = filho/a único/a.",
    explanationEs: "Mi/mis, tu/tus, su/sus: cambian en plural.",
  },
  {
    code: "A1.4", name: "Pedir na cafeteria", area: "A1", level: 2, prereqs: ["A1.2"],
    rulePt: "Para pedir: «Quiero …, por favor». Para perguntar o preço: «¿Cuánto es?».",
    ruleEs: "Quiero un café, por favor. ¿Cuánto es?",
    explanationPt: "Numa cafeteria o garçom pergunta «¿Qué quieres tomar?» (o que vai beber?) ou «¿Algo para comer?». Para pedir: «Quiero un café con leche, por favor» ou «Para mí, un zumo». Palavras úteis: zumo/jugo (suco), bocadillo (sanduíche, na Espanha), queso (queijo), agua con gas / sin gas. Para pagar: «¿Cuánto es?» — «Son seis euros». «Aquí tiene» = aqui está.",
    explanationEs: "Quiero…, por favor. ¿Cuánto es?",
  },
  {
    code: "A1.5", name: "Rotina e horas", area: "A1", level: 2, prereqs: ["A1.2", "A1.3"],
    rulePt: "Que horas são: «Es la una» / «Son las dos…». Quando algo acontece: «a las + hora» (me levanto a las siete).",
    ruleEs: "Son las cuatro. Me levanto a las siete.",
    explanationPt: "Para perguntar a hora: «¿Qué hora es?». Resposta: «Es la una» (só para 1h) e «Son las dos, son las tres…». «Y media» = e meia, «y cuarto» = e quinze, «menos cuarto» = quinze para. Para dizer quando você faz algo: «Me levanto a las siete», «Ceno a las nueve». Partes do dia: por la mañana (de manhã), por la tarde (à tarde), por la noche (à noite). Verbos da rotina com «me»: me levanto, me ducho, me acuesto.",
    explanationEs: "¿Qué hora es? Son las… Hago algo a las…",
  },
  // ---------- A2 ----------
  {
    code: "A2.1", name: "Compras: roupas e preços", area: "A2", level: 3, prereqs: ["A1.4"],
    rulePt: "«¿Cuánto cuesta?» para o preço. «Me queda grande/pequeño/bien» = a roupa ficou grande/pequena/bem em mim.",
    ruleEs: "¿Cuánto cuesta? Me queda grande.",
    explanationPt: "Na loja: «Busco una chaqueta» (procuro uma jaqueta), «¿Qué talla usas?» (que tamanho você usa?), «¿Me puedo probar esta?» (posso experimentar?), «el probador» (o provador). Para dizer como ficou: «Me queda grande / pequeña / bien / perfecta». Preço: «¿Cuánto cuesta?» (uma peça), «¿Cuánto cuestan?» (várias). Demonstrativos: «este/esta» (perto de mim), «ese/esa» (perto de você). Cores: azul, negro, blanco, rojo, verde.",
    explanationEs: "Talla, probador, me queda bien, ¿cuánto cuesta?",
  },
  {
    code: "A2.2", name: "Direções na cidade", area: "A2", level: 3, prereqs: ["A1.5"],
    rulePt: "«¿Dónde está …?» para perguntar. Respostas: «todo recto» (sempre reto), «a la derecha» (à direita), «a la izquierda» (à esquerda).",
    ruleEs: "¿Dónde está…? Todo recto, a la derecha.",
    explanationPt: "Para pedir ajuda na rua: «Disculpe, ¿dónde está el museo?». Direções: «siga todo recto» (siga reto), «gire a la derecha / a la izquierda» (vire à direita / à esquerda), «hasta la plaza» (até a praça). Lugar: «al lado de» (ao lado de), «enfrente de» (em frente a), «detrás de» (atrás de), «cerca» (perto), «lejos» (longe). Com desconhecidos usamos «usted», então os verbos ficam «siga», «gire», «tome».",
    explanationEs: "Recto, derecha, izquierda, al lado de, enfrente de.",
  },
  {
    code: "A2.3", name: "O passado: o fim de semana", area: "A2", level: 3, prereqs: ["A1.5"],
    rulePt: "Para ações terminadas (ayer, el sábado, el fin de semana pasado) use o pretérito: fui, vi, comí, jugué, llegué.",
    ruleEs: "Ayer fui al cine y comí con amigos.",
    explanationPt: "O pretérito indefinido conta ações terminadas num tempo que já acabou: ayer (ontem), el sábado, la semana pasada. Verbos em -ar: hablar → hablé, jugar → jugué, llegar → llegué. Em -er/-ir: comer → comí, salir → salí. Irregulares muito comuns: ir/ser → fui, ver → vi, hacer → hice. Com «nosotros»: fuimos, vimos, comimos, jugamos. Pergunta: «¿Qué hiciste el fin de semana?».",
    explanationEs: "Acciones terminadas: fui, vi, comí, jugué.",
  },
  {
    code: "A2.4", name: "Planos e gostos", area: "A2", level: 4, prereqs: ["A2.3"],
    rulePt: "Planos: «voy a + verbo» (voy a ir). Gostos: «me gusta» + uma coisa, «me gustan» + várias.",
    ruleEs: "Voy a ir a la playa. Me gustan los conciertos.",
    explanationPt: "Para planos use «ir a + infinitivo»: voy a estudiar, vas a viajar, vamos a comer — o «a» é obrigatório (diferente do português). Para gostos: «me gusta la playa» (uma coisa ou um verbo: me gusta bailar) e «me gustan los conciertos» (várias coisas). «Me encanta» = adoro. Para perguntar: «¿Te gusta…?». Negativo: «No me gusta».",
    explanationEs: "Voy a + infinitivo. Me gusta / me gustan.",
  },
  {
    code: "A2.5", name: "No médico", area: "A2", level: 4, prereqs: ["A2.1", "A2.2"],
    rulePt: "Dor: «me duele» + uma parte do corpo (me duele la cabeza), «me duelen» + várias. Conselho: «tienes que / tiene que» + verbo.",
    ruleEs: "Me duele la cabeza. Tienes que descansar.",
    explanationPt: "No médico ele pergunta «¿Qué le pasa?» (o que o senhor tem?). Para responder: «Me duele la cabeza / la garganta / el estómago» e «Me duelen los pies». Sintomas: «tengo fiebre» (febre), «tengo tos» (tosse), «tengo gripe». Conselhos com obrigação: «tiene que descansar» (usted), «tienes que beber agua» (tú). «Una pastilla» = um comprimido; «cada ocho horas» = a cada oito horas. Cuidado: «hambre» é fome.",
    explanationEs: "Me duele…, tengo fiebre, tienes que descansar.",
  },
  {
    code: "A2.6", name: "Variedades: tú, vos, usted e vosotros", area: "A2", level: 4, prereqs: ["A2.3"],
    rulePt: "«Tú» e «vos» são informais (vos na Argentina e no Uruguai). «Usted» é formal. «Vosotros» (vocês, informal) só na Espanha; na América Latina, «ustedes».",
    ruleEs: "Tú/vos informal, usted formal, vosotros solo en España.",
    explanationPt: "O espanhol muda de país para país e todas as formas são corretas. Na Argentina e no Uruguai usa-se «vos» com verbos próprios: vos sos (tú eres), vos tenés (tú tienes), vos hablás (tú hablas). «Usted» é a forma formal em todos os países (com professores, desconhecidos, pessoas mais velhas). No plural, a Espanha usa «vosotros» entre amigos (vosotros queréis) e «ustedes» na forma formal; a América Latina usa sempre «ustedes».",
    explanationEs: "Tú/vos, usted, vosotros (España) y ustedes (América).",
  },
];

export const CONCEPT_BY_CODE = Object.fromEntries(CONCEPTS.map((c) => [c.code, c])) as Record<ConceptCode, Concept>;

/** Ordem oficial dos códigos (usada como desempate). */
export const CONCEPT_ORDER: ConceptCode[] = CONCEPTS.map((c) => c.code);
