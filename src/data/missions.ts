/** Missões comunicativas (conceitos de gramática): mini-diálogo em passos, o aluno escolhe a melhor fala. */
import type { ConceptCode } from "./concepts";
import type { Mission } from "./enem";

export const MISSIONS: Mission[] = [
  {
    id: "m-hotel", conceptCode: "G1", title: "Fazer check-in em um hotel", npcName: "Recepcionista",
    situation: "Você chega a um hotel em Madri. Fale com a recepcionista de forma educada (formal).",
    steps: [
      { npc: "Buenas tardes, bienvenido. ¿En qué puedo ayudarle?", options: ["¿Qué querés, che?", "Buenas tardes. Tengo una reserva a nombre de Silva.", "Vosotros tenéis mi reserva."], correctIndex: 1, tipPt: "Com a recepcionista, fale de forma formal e direta." },
      { npc: "Perfecto. ¿Me deja su pasaporte, por favor?", options: ["Sí, aquí lo tiene.", "Sí, aquí lo tenés.", "Sí, aquí lo tenéis."], correctIndex: 0, tipPt: "Usted conjuga como ‘él’: tiene." },
      { npc: "Su habitación es la 305. ¿Necesita algo más?", options: ["¿Usted sabe dónde está el desayuno?", "¿Vos sabés dónde está el desayuno?", "¿Vosotros sabéis dónde está el desayuno?"], correctIndex: 0, tipPt: "Continue com ‘usted’." },
    ],
  },
  {
    id: "m-restaurante", conceptCode: "G2", title: "Pedir comida em um restaurante", npcName: "Camarero",
    situation: "Você está num restaurante em Sevilha e vai fazer o pedido.",
    steps: [
      { npc: "Hola, ¿qué va a tomar?", options: ["Voy tomar un zumo de naranja.", "Voy a tomar un zumo de naranja.", "Fui a tomar un zumo de naranja."], correctIndex: 1, tipPt: "Ir a + infinitivo — não esqueça o ‘a’." },
      { npc: "¿Y de comer?", options: ["Quiero una tortilla de patatas, por favor.", "Quise una tortilla ayer.", "Quiero comí una tortilla."], correctIndex: 0, tipPt: "Pedido agora = presente." },
      { npc: "¿Algo de postre después?", options: ["No, gracias. Después vamos a pasear.", "No, gracias. Después fuimos a pasear.", "No, gracias. Después pasear vamos."], correctIndex: 0, tipPt: "Plano para depois = ir a + infinitivo." },
      { npc: "Muy bien, ahora se lo traigo.", options: ["¡Muchas gracias!", "¡Mucho gracias!", "¡Muy gracias!"], correctIndex: 0, tipPt: "Muchas gracias." },
    ],
  },
  {
    id: "m-viaje", conceptCode: "G3", title: "Contar como foi a viagem", npcName: "Amiga",
    situation: "Você voltou de Buenos Aires e uma amiga pergunta como foi.",
    steps: [
      { npc: "¡Hola! ¿Qué tal el viaje del mes pasado?", options: ["¡Genial! El mes pasado visité Buenos Aires.", "¡Genial! El mes pasado he visitado Buenos Aires.", "¡Genial! El mes pasado visito Buenos Aires."], correctIndex: 0, tipPt: "‘El mes pasado’ = tempo terminado → indefinido." },
      { npc: "¿Y esta semana? ¿Ya has descansado?", options: ["Sí, esta semana descansé ayer mañana.", "Sí, esta semana he descansado mucho.", "Sí, esta semana descansaré mucho."], correctIndex: 1, tipPt: "‘Esta semana’ inclui o agora → perfecto." },
      { npc: "¿Qué comiste allá?", options: ["Comí empanadas y asado.", "He comí empanadas.", "Como empanadas mañana."], correctIndex: 0, tipPt: "Responda no mesmo tempo da pergunta (comiste → comí)." },
    ],
  },
  {
    id: "m-debate", conceptCode: "G4", title: "Dar sua opinião num debate", npcName: "Professora",
    situation: "Na aula, a professora pergunta sua opinião sobre o uso do celular na escola.",
    steps: [
      { npc: "¿Crees que el móvil ayuda en clase?", options: ["Ayuda a buscar información; sin embargo, distrae mucho.", "Ayuda a buscar información; por lo tanto, distrae mucho.", "Ayuda a buscar información; además, no ayuda."], correctIndex: 0, tipPt: "Ajuda, mas distrai: ideia de contraste." },
      { npc: "¿Y por qué distrae?", options: ["Aunque hay redes sociales.", "Porque hay muchas notificaciones.", "Sin embargo notificaciones."], correctIndex: 1, tipPt: "‘Por qué’ pede uma causa." },
      { npc: "Entonces, ¿qué propones?", options: ["Distrae; por lo tanto, propongo usarlo solo en actividades.", "Distrae; aunque propongo usarlo siempre.", "Distrae; pero sin embargo propongo."], correctIndex: 0, tipPt: "Conclusão: por lo tanto." },
    ],
  },
  {
    id: "m-tienda", conceptCode: "G5", title: "Entender os avisos de uma loja", npcName: "Vendedor",
    situation: "Você está numa loja em Montevidéu e precisa entender quando as coisas acontecem.",
    steps: [
      { npc: "La tienda va a cerrar en diez minutos.", options: ["Entendido, la tienda ya cerró.", "Entendido, tengo diez minutos para comprar.", "Entendido, la tienda siempre está cerrada."], correctIndex: 1, tipPt: "‘Va a cerrar’ = ainda vai fechar." },
      { npc: "Ayer vendimos todas las camisetas azules.", options: ["Entonces ya no hay camisetas azules.", "Entonces mañana venden azules.", "Entonces hay muchas azules."], correctIndex: 0, tipPt: "‘Vendimos’ (ayer) = ação concluída." },
      { npc: "Todos los lunes recibimos ropa nueva.", options: ["Es algo que pasó una vez.", "Es algo que pasa cada semana.", "Es algo que nunca pasa."], correctIndex: 1, tipPt: "Presente + ‘todos los lunes’ = hábito." },
    ],
  },
];

export function missionFor(code: ConceptCode, round = 0): Mission {
  const own = MISSIONS.filter((m) => m.conceptCode === code);
  const list = own.length ? own : MISSIONS;
  return list[round % list.length]!;
}
