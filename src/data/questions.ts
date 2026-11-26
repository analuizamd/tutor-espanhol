/** Questões estilo ENEM para os conceitos de vocabulário (feitas depois dos cartões). */
import type { ConceptCode } from "./concepts";
import type { EnemQuestion } from "./enem";

export const VOCAB_QUESTIONS: EnemQuestion[] = [
  // V1
  { id: "V1-1", conceptCode: "V1", source: "Notícia", text: "La universidad lanzó un programa de música y tecnología para estudiantes de escuelas públicas.", prompt: "El programa está dirigido a:", options: ["profesores jubilados.", "estudiantes de escuelas públicas.", "músicos famosos.", "empresas de tecnología.", "turistas."], correctIndex: 1, tipPt: "Procure ‘para…’ no final da frase.", tipEs: "Busca “para…”." },
  { id: "V1-2", conceptCode: "V1", source: "Cartaz", text: "Festival internacional de cine: películas, conciertos y debates. Entrada libre.", prompt: "El cartel anuncia un evento:", options: ["deportivo.", "cultural.", "religioso.", "político.", "escolar."], correctIndex: 1, tipPt: "Cine, conciertos, debates são cognatos.", tipEs: "Cine, conciertos = cultura." },
  { id: "V1-3", conceptCode: "V1", source: "Notícia", text: "El gobierno presentó un plan para reducir la contaminación del aire en las grandes ciudades.", prompt: "El plan quiere:", options: ["aumentar el transporte.", "reducir la contaminación.", "construir ciudades.", "vender coches.", "cerrar escuelas."], correctIndex: 1, tipPt: "‘Reducir la contaminación’ é quase português.", tipEs: "Reducir = reduzir." },
  // V2
  { id: "V2-1", conceptCode: "V2", source: "Mensagem", text: "¿Cuál es tu apellido? Necesito completar el formulario.", prompt: "La persona quiere saber el:", options: ["apelido carinhoso.", "sobrenome.", "endereço.", "telefone.", "idade."], correctIndex: 1, tipPt: "Apellido é falso amigo.", tipEs: "Apellido ≠ apelido." },
  { id: "V2-2", conceptCode: "V2", source: "Diálogo", text: "— ¿Dónde está Ana?\n— En la oficina, vuelve en un rato.", prompt: "Ana está:", options: ["na oficina mecânica, volta em um mês.", "no escritório, volta logo.", "com um rato.", "em casa, dormindo.", "na escola."], correctIndex: 1, tipPt: "Oficina e rato são falsos amigos.", tipEs: "Oficina = escritório; rato = momento." },
  { id: "V2-3", conceptCode: "V2", source: "Post", text: "¡Gran noticia! Laura está embarazada y el bebé llega en mayo.", prompt: "La noticia es que Laura:", options: ["está envergonhada.", "está grávida.", "está doente.", "vai viajar.", "mudou de casa."], correctIndex: 1, tipPt: "Pense no bebê que chega em maio.", tipEs: "Piensa en el bebé." },
  // V3
  { id: "V3-1", conceptCode: "V3", source: "Bilhete", text: "Mamá: compré zanahorias, cebollas y una lechuga para la ensalada.", prompt: "La persona compró:", options: ["ropa.", "verduras.", "carne.", "bebidas.", "libros."], correctIndex: 1, tipPt: "Que tipo de coisa vai na salada?", tipEs: "Ensalada → verduras." },
  { id: "V3-2", conceptCode: "V3", source: "Mensagem", text: "Mi jefe dijo que el sueldo de este mes llega el día 5.", prompt: "El texto habla de:", options: ["escuela.", "salud.", "trabajo.", "viaje.", "deporte."], correctIndex: 2, tipPt: "Jefe e sueldo pertencem a que tema?", tipEs: "Jefe, sueldo → trabajo." },
  { id: "V3-3", conceptCode: "V3", source: "Aviso escolar", text: "Mañana no hay clase de Química. Traed la tiza y los cuadernos para la asignatura de Arte.", prompt: "“Asignatura” significa:", options: ["assinatura.", "matéria escolar.", "prova.", "professora.", "sala."], correctIndex: 1, tipPt: "Arte, Química… o que é isso na escola?", tipEs: "Arte, Química = asignaturas." },
  // V4
  { id: "V4-1", conceptCode: "V4", source: "Notícia", text: "Basura en las playas: voluntarios recogieron tres toneladas de plástico. La basura llega al mar por los ríos.", prompt: "El tema del texto es:", options: ["el turismo de playa.", "la basura y la contaminación del mar.", "los deportes acuáticos.", "la pesca.", "el clima."], correctIndex: 1, tipPt: "Que palavra aparece no título e se repete?", tipEs: "Palabra repetida: basura." },
  { id: "V4-2", conceptCode: "V4", source: "Manchete", text: "El desempleo juvenil baja por tercer año: más jóvenes consiguen su primer empleo.", prompt: "El titular trata de:", options: ["educación infantil.", "empleo de los jóvenes.", "vacaciones.", "salud pública.", "vivienda."], correctIndex: 1, tipPt: "Desempleo e empleo são a chave.", tipEs: "Desempleo, empleo." },
  { id: "V4-3", conceptCode: "V4", source: "Artigo", text: "Comer bien, dormir ocho horas y hacer ejercicio: tres claves para cuidar la salud en la adolescencia.", prompt: "La palabra-clave que resume el tema es:", options: ["adolescencia.", "salud.", "horas.", "claves.", "ejercicio."], correctIndex: 1, tipPt: "Qual palavra reúne comer, dormir e exercício?", tipEs: "¿Qué une comer, dormir y ejercicio?" },
];

export function vocabQuestionsFor(code: ConceptCode): EnemQuestion[] {
  return VOCAB_QUESTIONS.filter((q) => q.conceptCode === code);
}
