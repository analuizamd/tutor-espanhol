/**
 * Diagnóstico inicial: 10 questões estilo ENEM (5 alternativas), uma por conceito avaliado.
 */
import type { EnemQuestion } from "./enem";

export const DIAGNOSTIC_QUESTIONS: (EnemQuestion & { conceptCode: NonNullable<EnemQuestion["conceptCode"]> })[] = [
  {
    id: "D-V1", conceptCode: "V1", source: "Anúncio",
    text: "La biblioteca municipal ofrece cursos gratuitos de fotografía digital para jóvenes de 15 a 20 años. Inscripciones abiertas hasta el viernes.",
    prompt: "Según el anuncio, la biblioteca ofrece:",
    options: ["libros para vender.", "cursos de fotografía.", "empleo para jóvenes.", "viajes gratuitos.", "computadoras nuevas."],
    correctIndex: 1, tipPt: "Procure palavras parecidas com o português.", tipEs: "Busca palabras transparentes.",
  },
  {
    id: "D-G1", conceptCode: "G1", source: "Diálogo",
    text: "— Buenos días, señor Gómez. ¿Usted desea un café?\n— Sí, gracias, muy amable.",
    prompt: "El uso de “usted” en el diálogo indica:",
    options: ["intimidad entre amigos.", "una conversación entre niños.", "trato formal y respetuoso.", "que hablan varias personas.", "enojo de quien habla."],
    correctIndex: 2, tipPt: "Usted equivale a ‘o senhor’.", tipEs: "Usted = formal.",
  },
  {
    id: "D-T1", conceptCode: "T1", source: "Cartaz",
    text: "¡No tires el aceite por el desagüe! Llévalo al punto limpio de tu barrio. El planeta te lo agradece.",
    prompt: "Ese texto tiene como objetivo principal:",
    options: ["narrar una historia.", "vender aceite de cocina.", "informar el precio del aceite.", "convencer al lector a cambiar un hábito.", "explicar una receta."],
    correctIndex: 3, tipPt: "Verbos no imperativo (no tires, llévalo) indicam campanha.", tipEs: "Imperativo = campaña.",
  },
  {
    id: "D-V2", conceptCode: "V2", source: "Mensagem",
    text: "Ayer cenamos en un restaurante peruano. ¡La comida estaba exquisita!",
    prompt: "La palabra “exquisita” significa que la comida estaba:",
    options: ["estranha.", "deliciosa.", "fria.", "cara.", "salgada."],
    correctIndex: 1, tipPt: "Cuidado: é um falso amigo.", tipEs: "Falso amigo.",
  },
  {
    id: "D-V3", conceptCode: "V3", source: "Lista",
    text: "Para la cena: leche, huevos, zanahorias, pan y una lechuga.",
    prompt: "La lista habla de:",
    options: ["ropa.", "muebles.", "alimentos.", "materiales escolares.", "medicinas."],
    correctIndex: 2, tipPt: "Leche, huevos, pan… pense no tema.", tipEs: "Piensa en el tema.",
  },
  {
    id: "D-V4", conceptCode: "V4", source: "Notícia",
    text: "Sequía en el sur: los embalses están al 20 %. El gobierno pide ahorrar agua en casa y en la industria, ya que no se esperan lluvias hasta octubre.",
    prompt: "El tema central del texto es:",
    options: ["la escasez de agua.", "el turismo en el sur.", "la industria del cine.", "el calor en octubre.", "las elecciones del gobierno."],
    correctIndex: 0, tipPt: "Sequía, embalses, agua, lluvias: que palavras se repetem?", tipEs: "Palabras repetidas.",
  },
  {
    id: "D-G2", conceptCode: "G2", source: "Mensagem",
    text: "Este sábado voy a visitar a mis abuelos en Córdoba.",
    prompt: "La expresión “voy a visitar” indica:",
    options: ["una acción en el pasado.", "un hábito diario.", "un plan para el futuro.", "una orden.", "una duda."],
    correctIndex: 2, tipPt: "Ir a + infinitivo = plano.", tipEs: "Ir a + infinitivo.",
  },
  {
    id: "D-L1", conceptCode: "L1", source: "Artigo",
    text: "Muchos adolescentes duermen menos de seis horas por noche por usar el móvil hasta tarde. Los especialistas advierten que la falta de sueño perjudica la memoria y el rendimiento escolar.",
    prompt: "La idea principal del texto es que:",
    options: ["los móviles son caros.", "los adolescentes estudian poco.", "dormir poco por el móvil perjudica el aprendizaje.", "los especialistas usan el móvil.", "la memoria mejora de noche."],
    correctIndex: 2, tipPt: "Resuma o texto numa frase.", tipEs: "Resume en una frase.",
  },
  {
    id: "D-C1", conceptCode: "C1", source: "Diálogo",
    text: "— Che, ¿vos tenés auto?\n— No, yo tomo el colectivo todos los días.",
    prompt: "Por el vocabulario (vos, colectivo), los hablantes probablemente son de:",
    options: ["España.", "México.", "Argentina.", "Cuba.", "Guinea Ecuatorial."],
    correctIndex: 2, tipPt: "Vos + che + colectivo é típico do Rio da Prata.", tipEs: "Vos, che → Río de la Plata.",
  },
  {
    id: "D-L2", conceptCode: "L2", source: "Aviso",
    text: "El museo abre de martes a domingo, de 10 a 18 h. La entrada es gratuita los miércoles.",
    prompt: "¿Qué día la entrada no cuesta nada?",
    options: ["Lunes.", "Martes.", "Miércoles.", "Sábado.", "Domingo."],
    correctIndex: 2, tipPt: "Procure ‘gratuita’ no texto.", tipEs: "Busca “gratuita”.",
  },
];
