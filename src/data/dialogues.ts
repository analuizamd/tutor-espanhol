/**
 * Diálogos em "vídeo" (player simulado com legendas cronometradas).
 * `videoUrl` fica vazio até existir um vídeo real.
 * Os diálogos das gírias (por país) estão marcados como "a revisar pelo grupo".
 */
import type { ConceptCode } from "./concepts";
import type { Dialogue } from "./enem";

export const DIALOGUES: Dialogue[] = [
  {
    id: "playa",
    title: "Planejando uma viagem à praia",
    speakers: [{ name: "Lucía", from: "México" }, { name: "Diego", from: "México" }],
    videoUrl: "",
    durationSec: 36,
    summary: "Lucía e Diego combinam uma viagem à praia no fim de semana: decidem ir de ônibus no sábado cedo e levar protetor solar.",
    lines: [
      { at: 0, speaker: "Lucía", es: "Oye, Diego, ¿vamos a la playa este fin de semana?", pt: "Ei, Diego, vamos à praia neste fim de semana?" },
      { at: 5, speaker: "Diego", es: "¡Claro! Pero no tengo coche, está en el taller.", pt: "Claro! Mas não tenho carro, está na oficina." },
      { at: 10, speaker: "Lucía", es: "No pasa nada. Podemos ir en autobús el sábado temprano.", pt: "Não tem problema. Podemos ir de ônibus no sábado cedo." },
      { at: 16, speaker: "Diego", es: "Perfecto. ¿Y dónde vamos a dormir?", pt: "Perfeito. E onde vamos dormir?" },
      { at: 21, speaker: "Lucía", es: "Mi tía tiene una casa cerca del mar. Ella nos invita.", pt: "Minha tia tem uma casa perto do mar. Ela nos convida." },
      { at: 27, speaker: "Diego", es: "¡Qué bien! Voy a llevar la sombrilla y el protector solar.", pt: "Que bom! Vou levar o guarda-sol e o protetor solar." },
      { at: 32, speaker: "Lucía", es: "Y yo, la comida. ¡Nos vemos el sábado!", pt: "E eu, a comida. Nos vemos no sábado!" },
    ],
    questions: [
      { id: "playa-1", prompt: "¿Cómo van a viajar Lucía y Diego?", options: ["En coche.", "En avión.", "En autobús.", "En bicicleta.", "En tren."], correctIndex: 2, tipPt: "Diego não tem carro: qual a solução de Lucía?", tipEs: "¿Qué propone Lucía?" },
      { id: "playa-2", prompt: "En el diálogo, la palabra “taller” significa:", options: ["oficina mecânica.", "escritório.", "loja.", "garagem de casa.", "estacionamento."], correctIndex: 0, tipPt: "Onde fica um carro que está sendo consertado?", tipEs: "¿Dónde se arregla un coche?" },
      { id: "playa-3", prompt: "Se puede inferir que los amigos no van a pagar hotel porque:", options: ["van a acampar.", "duermen en el autobús.", "la tía de Lucía los invita a su casa.", "vuelven el mismo día.", "Diego tiene un hotel."], correctIndex: 2, tipPt: "Quem tem uma casa perto do mar?", tipEs: "¿Quién tiene una casa?" },
    ],
  },
  {
    id: "restaurante",
    title: "No restaurante",
    speakers: [{ name: "Camarero", from: "Espanha" }, { name: "Clara", from: "Colômbia" }],
    videoUrl: "",
    durationSec: 38,
    summary: "Clara pede comida num restaurante. Ela é vegetariana, pede uma salada e uma sopa, mas reclama, com ironia, da demora.",
    lines: [
      { at: 0, speaker: "Camarero", es: "Buenas noches. ¿Ya sabe qué va a pedir?", pt: "Boa noite. Já sabe o que vai pedir?" },
      { at: 5, speaker: "Clara", es: "Sí. Soy vegetariana. ¿Qué me recomienda?", pt: "Sim. Sou vegetariana. O que me recomenda?" },
      { at: 10, speaker: "Camarero", es: "La ensalada de la casa y la sopa de verduras están exquisitas.", pt: "A salada da casa e a sopa de legumes estão deliciosas." },
      { at: 16, speaker: "Clara", es: "Perfecto, las dos, por favor. Y un agua sin gas.", pt: "Perfeito, as duas, por favor. E uma água sem gás." },
      { at: 22, speaker: "Camarero", es: "Muy bien. Enseguida se lo traigo.", pt: "Muito bem. Já trago." },
      { at: 27, speaker: "Clara", es: "(Cuarenta minutos después) ¡Qué rápido! Casi me duermo esperando.", pt: "(Quarenta minutos depois) Que rápido! Quase dormi esperando." },
      { at: 33, speaker: "Camarero", es: "Disculpe la demora, hoy hay mucha gente.", pt: "Desculpe a demora, hoje há muita gente." },
    ],
    questions: [
      { id: "rest-1", prompt: "¿Por qué Clara pide recomendación al camarero?", options: ["Porque no tiene dinero.", "Porque es vegetariana.", "Porque no le gusta la sopa.", "Porque está con prisa.", "Porque no habla español."], correctIndex: 1, tipPt: "Ela conta algo sobre si antes de pedir.", tipEs: "¿Qué dice Clara de sí misma?" },
      { id: "rest-2", prompt: "Cuando Clara dice “¡Qué rápido!”, ella:", options: ["elogia el servicio.", "habla con ironía de la demora.", "pide más comida.", "agradece al camarero.", "quiere irse pronto."], correctIndex: 1, tipPt: "Foram 40 minutos de espera…", tipEs: "Cuarenta minutos… ¿es rápido?" },
      { id: "rest-3", prompt: "En el diálogo, “exquisitas” quiere decir:", options: ["esquisitas.", "caras.", "deliciosas.", "frias.", "pequenas."], correctIndex: 2, tipPt: "Falso amigo!", tipEs: "Falso amigo." },
    ],
  },
  {
    id: "vos-vosotros",
    title: "Argentina e Espanha: vos e vosotros",
    speakers: [{ name: "Martín", from: "Argentina" }, { name: "Elena", from: "Espanha" }],
    videoUrl: "",
    durationSec: 40,
    summary: "Martín (argentino, usa ‘vos’) e Elena (espanhola, usa ‘vosotros’) comparam palavras dos seus países: auto/coche, colectivo/autobús, celular/móvil.",
    lines: [
      { at: 0, speaker: "Martín", es: "Che, Elena, ¿vos de dónde sos?", pt: "Ei, Elena, você é de onde?" },
      { at: 5, speaker: "Elena", es: "Soy de Madrid. ¿Y tú? Hablas diferente.", pt: "Sou de Madri. E você? Você fala diferente." },
      { at: 10, speaker: "Martín", es: "Soy de Buenos Aires. Allá decimos “vos” en vez de “tú”.", pt: "Sou de Buenos Aires. Lá dizemos ‘vos’ em vez de ‘tú’." },
      { at: 16, speaker: "Elena", es: "¡Qué curioso! Y en España, a un grupo de amigos le decimos “vosotros”.", pt: "Que curioso! E na Espanha, para um grupo de amigos dizemos ‘vosotros’." },
      { at: 23, speaker: "Martín", es: "Nosotros decimos “ustedes”. Y al autobús lo llamamos colectivo.", pt: "Nós dizemos ‘ustedes’. E ao ônibus chamamos ‘colectivo’." },
      { at: 30, speaker: "Elena", es: "Y yo cojo el coche; tú tomás el auto, ¿no?", pt: "E eu pego o carro; você pega o ‘auto’, não é?" },
      { at: 35, speaker: "Martín", es: "¡Exacto! Mismo idioma, palabras distintas.", pt: "Exato! Mesma língua, palavras diferentes." },
    ],
    questions: [
      { id: "vos-1", prompt: "¿Qué forma usa Martín para hablar con un amigo?", options: ["Tú.", "Vos.", "Usted.", "Vosotros.", "Él."], correctIndex: 1, tipPt: "Ele mesmo explica na terceira fala.", tipEs: "Lo dice en la tercera línea." },
      { id: "vos-2", prompt: "Para Elena, “vosotros” se usa:", options: ["con una persona mayor.", "con un grupo de amigos en España.", "solo en Argentina.", "en cartas formales.", "con el profesor."], correctIndex: 1, tipPt: "Ela fala de um grupo de amigos.", tipEs: "Un grupo de amigos." },
      { id: "vos-3", prompt: "La idea principal del diálogo es que:", options: ["el español de Argentina es incorrecto.", "en España no hay autobuses.", "el español tiene variedades regionales.", "Martín no entiende a Elena.", "todos dicen “vosotros”."], correctIndex: 2, tipPt: "Leia a última fala de Martín.", tipEs: "Lee la última línea." },
    ],
  },
];

/** Diálogos da fase extra (gírias por país) — A REVISAR PELO GRUPO. */
export const SLANG_DIALOGUES: Record<"es" | "ar" | "uy", Dialogue> = {
  es: {
    id: "slang-es", title: "Gírias da Espanha", speakers: [{ name: "Pablo", from: "Espanha" }, { name: "Marta", from: "Espanha" }],
    videoUrl: "", durationSec: 32,
    summary: "Pablo convida Marta para um show; ela aceita, mas só depois de ‘currar’ (trabalhar).",
    lines: [
      { at: 0, speaker: "Pablo", es: "Tía, ¿vienes al concierto el viernes? ¡Va a estar guay!", pt: "Amiga, vem ao show na sexta? Vai ser legal!" },
      { at: 7, speaker: "Marta", es: "¡Vale! Me mola mucho ese grupo.", pt: "Ok! Curto muito essa banda." },
      { at: 13, speaker: "Pablo", es: "Genial. ¿Quedamos a las ocho?", pt: "Ótimo. Nos encontramos às oito?" },
      { at: 19, speaker: "Marta", es: "Mejor a las nueve, que curro hasta tarde.", pt: "Melhor às nove, porque trabalho até tarde." },
      { at: 26, speaker: "Pablo", es: "Vale, a las nueve. ¡Hasta el viernes!", pt: "Ok, às nove. Até sexta!" },
    ],
    questions: [
      { id: "es-1", prompt: "“Me mola ese grupo” significa que Marta:", options: ["odeia a banda.", "curte a banda.", "toca na banda.", "não conhece a banda.", "vendeu ingressos."], correctIndex: 1, tipPt: "Ela aceita o convite com entusiasmo.", tipEs: "Acepta con entusiasmo." },
      { id: "es-2", prompt: "¿Por qué Marta prefiere las nueve?", options: ["Porque estudia.", "Porque trabaja hasta tarde.", "Porque está cansada.", "Porque el concierto empieza a las diez.", "Porque vive lejos."], correctIndex: 1, tipPt: "Currar = trabalhar.", tipEs: "Currar = trabajar." },
    ],
  },
  ar: {
    id: "slang-ar", title: "Gírias da Argentina", speakers: [{ name: "Facu", from: "Argentina" }, { name: "Sofi", from: "Argentina" }],
    videoUrl: "", durationSec: 32,
    summary: "Facu reclama da bagunça (‘quilombo’) no trabalho; Sofi conta que o irmão pequeno (‘pibe’) bagunçou o quarto dela.",
    lines: [
      { at: 0, speaker: "Facu", es: "Che, Sofi, ¿cómo andás?", pt: "Ei, Sofi, como você está?" },
      { at: 5, speaker: "Sofi", es: "Bien, ¿y vos? ¿Qué tal el laburo?", pt: "Bem, e você? Como vai o trabalho?" },
      { at: 11, speaker: "Facu", es: "Un quilombo total, mil cosas para hacer.", pt: "Uma bagunça total, mil coisas para fazer." },
      { at: 18, speaker: "Sofi", es: "Te entiendo. Mi hermano, un pibe de diez años, desordenó toda mi pieza.", pt: "Te entendo. Meu irmão, um garoto de dez anos, bagunçou todo o meu quarto." },
      { at: 26, speaker: "Facu", es: "¡Jaja! Otro quilombo, che.", pt: "Haha! Outra bagunça, cara." },
    ],
    questions: [
      { id: "ar-1", prompt: "“Laburo” en el diálogo significa:", options: ["casa.", "trabalho.", "escola.", "festa.", "viagem."], correctIndex: 1, tipPt: "Sofi pergunta como vai algo do dia a dia de Facu.", tipEs: "Laburo = trabajo." },
      { id: "ar-2", prompt: "Facu usa “quilombo” para decir que:", options: ["está de vacaciones.", "hay mucho desorden y trabajo.", "está feliz.", "tiene un nuevo jefe.", "va a una fiesta."], correctIndex: 1, tipPt: "Ele tem ‘mil cosas para hacer’.", tipEs: "Mil cosas para hacer." },
    ],
  },
  uy: {
    id: "slang-uy", title: "Gírias do Uruguai", speakers: [{ name: "Nico", from: "Uruguai" }, { name: "Vale", from: "Uruguai" }],
    videoUrl: "", durationSec: 30,
    summary: "Nico e Vale combinam ir à praia com as crianças (‘gurises’); faz muito (‘pila’) calor.",
    lines: [
      { at: 0, speaker: "Nico", es: "Bo, ¿vamos a la playa con los gurises?", pt: "Ei, vamos à praia com as crianças?" },
      { at: 6, speaker: "Vale", es: "Ta, dale. Hace pila de calor hoy.", pt: "Ok, bora. Está fazendo muito calor hoje." },
      { at: 12, speaker: "Nico", es: "Llevo el mate y unos bizcochos.", pt: "Levo o mate e uns biscoitos." },
      { at: 18, speaker: "Vale", es: "Ta. Te espero en la rambla a las tres.", pt: "Ok. Te espero na orla às três." },
      { at: 24, speaker: "Nico", es: "Ta, nos vemos, bo.", pt: "Ok, nos vemos." },
    ],
    questions: [
      { id: "uy-1", prompt: "“Ta” en el diálogo equivale a:", options: ["não.", "ok, combinado.", "talvez.", "obrigado.", "tchau."], correctIndex: 1, tipPt: "Vale responde ao convite aceitando.", tipEs: "Responde aceptando." },
      { id: "uy-2", prompt: "“Hace pila de calor” significa que hace:", options: ["pouco calor.", "muito calor.", "frio.", "vento.", "chuva."], correctIndex: 1, tipPt: "Pila = muito.", tipEs: "Pila = mucho." },
    ],
  },
};

/** Diálogo usado para cada conceito de leitura/gêneros/cultura (rotaciona entre os 3). */
export function dialogueFor(code: ConceptCode, round = 0): Dialogue {
  if (code === "C1") return DIALOGUES[2]!;
  if (code === "C2") return Object.values(SLANG_DIALOGUES)[round % 3]!;
  const order: ConceptCode[] = ["T1", "L1", "L2", "L3", "L4", "L5", "L6"];
  const i = (Math.max(0, order.indexOf(code)) + round) % DIALOGUES.length;
  return DIALOGUES[i]!;
}
