/** Baralhos de cartões por conceito de vocabulário (V). Frente em espanhol, verso em português. */
import type { ConceptCode } from "./concepts";
import type { Flashcard } from "./enem";

export const FLASHCARD_DECKS: Partial<Record<ConceptCode, Flashcard[]>> = {
  V1: [
    { id: "v1-1", front: "la sociedad", back: "a sociedade", example: "La sociedad cambia con la tecnología." },
    { id: "v1-2", front: "importante", back: "importante", example: "Es importante leer el título." },
    { id: "v1-3", front: "el problema", back: "o problema (masculino!)", example: "El problema es la contaminación." },
    { id: "v1-4", front: "la universidad", back: "a universidade", example: "Estudio en la universidad pública." },
    { id: "v1-5", front: "la tecnología", back: "a tecnologia", example: "La tecnología ayuda en clase." },
    { id: "v1-6", front: "el medio ambiente", back: "o meio ambiente", example: "Hay que cuidar el medio ambiente." },
    { id: "v1-7", front: "la información", back: "a informação", example: "La información está en internet." },
    { id: "v1-8", front: "el gobierno", back: "o governo", example: "El gobierno anunció nuevas medidas." },
  ],
  V2: [
    { id: "v2-1", front: "embarazada", back: "grávida", example: "Mi hermana está embarazada de cinco meses.", falseFriend: "Não é ‘envergonhada’ (= avergonzada)." },
    { id: "v2-2", front: "exquisito", back: "delicioso", example: "¡Este pastel está exquisito!", falseFriend: "Não é ‘esquisito’ (= raro)." },
    { id: "v2-3", front: "el apellido", back: "o sobrenome", example: "Mi apellido es Rodríguez.", falseFriend: "Não é ‘apelido’ (= apodo)." },
    { id: "v2-4", front: "un rato", back: "um momento", example: "Espérame un rato, por favor.", falseFriend: "Não é ‘rato’ (= ratón)." },
    { id: "v2-5", front: "la oficina", back: "o escritório", example: "Trabajo en una oficina en el centro.", falseFriend: "Não é ‘oficina mecânica’ (= taller)." },
    { id: "v2-6", front: "el polvo", back: "o pó, a poeira", example: "Hay mucho polvo en los muebles.", falseFriend: "Não é ‘polvo’ (= pulpo)." },
    { id: "v2-7", front: "largo", back: "comprido", example: "El camino es muy largo.", falseFriend: "Não é ‘largo’ (= ancho)." },
    { id: "v2-8", front: "la cena", back: "o jantar", example: "La cena es a las nueve.", falseFriend: "Não é ‘cena’ de filme (= escena)." },
  ],
  V3: [
    { id: "v3-1", front: "la almohada", back: "o travesseiro", example: "Necesito otra almohada." },
    { id: "v3-2", front: "la zanahoria", back: "a cenoura", example: "La sopa lleva zanahoria." },
    { id: "v3-3", front: "la pizarra", back: "a lousa", example: "La profe escribe en la pizarra." },
    { id: "v3-4", front: "el sueldo", back: "o salário", example: "Mi sueldo es bajo." },
    { id: "v3-5", front: "la asignatura", back: "a matéria (escolar)", example: "Mi asignatura favorita es Historia." },
    { id: "v3-6", front: "el jefe", back: "o chefe", example: "Mi jefe es muy simpático." },
    { id: "v3-7", front: "la ventana", back: "a janela", example: "Abre la ventana, hace calor." },
    { id: "v3-8", front: "la receta", back: "a receita (médica ou de cozinha)", example: "El médico me dio una receta." },
  ],
  V4: [
    { id: "v4-1", front: "la sequía", back: "a seca", example: "La sequía afecta al campo." },
    { id: "v4-2", front: "el desempleo", back: "o desemprego", example: "El desempleo bajó este año." },
    { id: "v4-3", front: "la basura", back: "o lixo", example: "Separa la basura para reciclar." },
    { id: "v4-4", front: "la vivienda", back: "a moradia", example: "La vivienda es cara en la ciudad." },
    { id: "v4-5", front: "la salud", back: "a saúde", example: "El deporte es bueno para la salud." },
    { id: "v4-6", front: "el titular", back: "a manchete", example: "El titular del periódico habla de la sequía." },
  ],
};
