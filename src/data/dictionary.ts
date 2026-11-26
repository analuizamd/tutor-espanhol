/**
 * Mini dicionário espanhol → português para as legendas clicáveis dos vídeos.
 * Cobre todas as palavras das falas de src/data/videos.ts (há um teste que garante isso).
 * Quem consulta é src/services/tutorService.ts (translateWord), que futuramente pode usar uma IA.
 */
export const DICTIONARY: Record<string, string> = {
  // nomes e lugares
  ana: "Ana (nome)", carmen: "Carmen (nome)", diego: "Diego (nome)", lucía: "Lucía (nome)", luis: "Luis (nome)",
  marta: "Marta (nome)", mateo: "Mateo (nome)", pablo: "Pablo (nome)", valentina: "Valentina (nome)",
  argentina: "Argentina", españa: "Espanha", méxico: "México", montevideo: "Montevidéu", guadalajara: "Guadalajara (cidade do México)",
  m: "M (tamanho médio)", s: "S (tamanho pequeno, P)",
  // artigos, pronomes, preposições
  a: "a, para, às", al: "ao, à (a + el)", de: "de", del: "do (de + el)", el: "o", la: "a", las: "as", los: "os", lo: "o (pronome)",
  un: "um", una: "uma", uno: "um", en: "em, no, na", con: "com", para: "para", por: "por; «por favor» = por favor",
  desde: "desde", hasta: "até", y: "e", o: "ou", pero: "mas", que: "que", qué: "que, o que (pergunta)",
  yo: "eu", tú: "você (informal)", vos: "você (Argentina e Uruguai)", usted: "o senhor, a senhora (formal)",
  vosotros: "vocês (informal, só na Espanha)", ustedes: "vocês", nos: "nos, a nós", me: "me, a mim", te: "te, a você",
  le: "lhe, a ele/ela", se: "se", ti: "você (depois de preposição: para ti = para você)",
  mi: "meu, minha", mis: "meus, minhas", tu: "seu, sua (de você)", tus: "seus, suas (de você)",
  este: "este", esta: "esta", esa: "essa", algo: "algo, alguma coisa", nada: "nada; «de nada» = de nada",
  todo: "tudo; «todo recto» = sempre reto", todos: "todos", todas: "todas", más: "mais", muy: "muito (antes de adjetivo)",
  mucho: "muito", mucha: "muita", muchas: "muitas", poco: "pouco; «un poco» = um pouco", tan: "tão", también: "também",
  no: "não", sí: "sim", ah: "ah", che: "ei, cara (Argentina)", solo: "só, somente",
  // perguntas
  cómo: "como", cuándo: "quando", cuánto: "quanto", cuántos: "quantos", dónde: "onde", quién: "quem",
  // cumprimentos
  hola: "oi, olá", adiós: "tchau, adeus", buenos: "bons; «buenos días» = bom dia", buenas: "boas; «buenas tardes» = boa tarde",
  días: "dias", tardes: "tardes", luego: "depois; «hasta luego» = até logo", gracias: "obrigado/a", favor: "favor",
  gusto: "prazer, gosto; «mucho gusto» = muito prazer", encantado: "encantado; = muito prazer", disculpe: "com licença, desculpe (formal)",
  genial: "ótimo, genial", claro: "claro", perfecto: "perfeito", perfecta: "perfeita", exacto: "exato", recuerda: "lembre-se",
  // verbos
  soy: "sou", eres: "é (tú: você é)", es: "é", sos: "é (vos sos = você é)", son: "são", está: "está, fica", estás: "está (tú: você está)",
  tengo: "tenho", tienes: "tem (tú: você tem)", tenés: "tem (vos tenés = você tem)", tiene: "tem; o senhor tem", tienen: "têm, vocês têm",
  tenemos: "temos", tener: "ter", hay: "há, tem", llamo: "chamo; «me llamo» = eu me chamo", llamas: "chama; «¿cómo te llamas?» = como você se chama?",
  llama: "chama; «se llama» = se chama", vamos: "vamos", voy: "vou", vas: "vai (tú: você vai)", va: "vai; o senhor vai",
  ir: "ir", fui: "fui (passado de ir)", quiero: "quero", quieres: "quer (tú: você quer)", quiere: "quer",
  quieren: "querem, vocês querem", queréis: "querem (vosotros: vocês querem)", puedo: "posso", das: "dá; «¿me das?» = você me dá/passa?",
  hablo: "falo", hablás: "fala (vos hablás = você fala)", hablar: "falar", decimos: "dizemos", decís: "dizem (vocês dizem)", decir: "dizer",
  dice: "diz", aprender: "aprender", saludar: "cumprimentar", presentarnos: "nos apresentar", conocer: "conhecer",
  conoces: "conhece (tú: você conhece)", hacer: "fazer", hiciste: "fez (tú: você fez)", hicimos: "fizemos", contar: "contar",
  comer: "comer", comí: "comi", ceno: "janto", beber: "beber", tomar: "tomar, beber", tome: "tome (formal)",
  levanto: "levanto; «me levanto» = eu me levanto", trabajo: "trabalho (eu trabalho / o trabalho)", trabajar: "trabalhar",
  estudiamos: "estudamos", vi: "vi", viste: "viu (tú: você viu)", vimos: "vimos", reí: "ri; «me reí» = eu ri",
  jugamos: "jogamos", llegué: "cheguei", visitar: "visitar", comprar: "comprar", pagar: "pagar", pedir: "pedir",
  dar: "dar", usa: "use; usa", usas: "usa (tú: você usa)", usamos: "usamos", busco: "procuro", ayudar: "ajudar",
  probar: "provar, experimentar", queda: "fica; «me queda grande» = ficou grande em mim", cuesta: "custa", siga: "siga (formal)",
  gire: "vire (formal)", caminar: "caminhar", disfrute: "aproveite (formal)", pasa: "acontece; «¿qué le pasa?» = o que o senhor tem?",
  duele: "dói", duelen: "doem", descansar: "descansar", quédese: "fique (formal)", viven: "vivem, moram",
  sabés: "sabe (vos sabés = você sabe)", gusta: "agrada; «me gusta» = eu gosto", gustan: "agradam; «me gustan» = eu gosto (de várias coisas)",
  encanta: "encanta; «me encanta» = eu adoro", pregunta: "pergunte; pergunta", preguntar: "perguntar", entender: "entender",
  despedirte: "se despedir", ayer: "ontem",
  // tempo
  años: "anos", hoy: "hoje", mañana: "amanhã; manhã («por la mañana» = de manhã)", tarde: "tarde", noche: "noite", hora: "hora", horas: "horas",
  media: "meia; «y media» = e meia", sábado: "sábado", domingo: "domingo", semana: "semana", fin: "fim; «fin de semana» = fim de semana",
  invierno: "inverno", después: "depois", entonces: "então", normalmente: "normalmente", nuevo: "novo; «de nuevo» = de novo", pasado: "passado",
  // números
  cero: "zero", dos: "dois", tres: "três", cuatro: "quatro", cinco: "cinco", seis: "seis", siete: "sete", ocho: "oito",
  nueve: "nove", quince: "quinze", veinte: "vinte", veintidós: "vinte e dois", veinticinco: "vinte e cinco",
  cuarenta: "quarenta", cincuenta: "cinquenta", mil: "mil", ciento: "cento; «por ciento» = por cento",
  // pessoas e família
  profesora: "professora", profesor: "professor", chico: "garoto, rapaz", señor: "senhor", señora: "senhora", amigos: "amigos",
  familia: "família", madre: "mãe", padre: "pai", hermano: "irmão", hermana: "irmã", hermanos: "irmãos", abuelos: "avós",
  tíos: "tios", hija: "filha", única: "única; «hija única» = filha única", mayor: "mais velho/a", persona: "pessoa", personas: "pessoas",
  // comida e cafeteria
  cafetería: "cafeteria", café: "café", leche: "leite", bocadillo: "sanduíche (Espanha)", queso: "queijo", zumo: "suco (Espanha)",
  naranja: "laranja", agua: "água", asado: "churrasco (Argentina e Uruguai)", euros: "euros", pesos: "pesos (moeda)",
  aquí: "aqui; «aquí tiene» = aqui está", grande: "grande", pequeño: "pequeno", pequeña: "pequena",
  // compras
  compras: "compras; «de compras» = às compras", chaqueta: "jaqueta", talla: "tamanho (de roupa)", tallas: "tamanhos", ropa: "roupa",
  azul: "azul", negra: "preta", probador: "provador", fondo: "fundo; «al fondo» = no fundo", precio: "preço", precios: "preços",
  descuento: "desconto", cosa: "coisa", varias: "várias",
  // cidade
  ciudad: "cidade", calle: "rua", plaza: "praça", museo: "museu", arte: "arte", banco: "banco", parque: "parque",
  centro: "centro", derecha: "direita", izquierda: "esquerda", recto: "reto", lado: "lado; «al lado de» = ao lado de",
  enfrente: "em frente", cerca: "perto", lejos: "longe", pie: "pé; «a pie» = a pé", direcciones: "direções", visita: "visita",
  gimnasio: "academia", cine: "cinema", película: "filme", comedia: "comédia", fútbol: "futebol", casa: "casa",
  playa: "praia", montaña: "montanha", conciertos: "shows, concertos", entradas: "ingressos", planes: "planos",
  // médico
  médico: "médico", cabeza: "cabeça", garganta: "garganta", pies: "pés", fiebre: "febre", gripe: "gripe",
  pastilla: "comprimido", cada: "cada; «cada ocho horas» = a cada oito horas", mejor: "melhor", consejos: "conselhos",
  // outros
  bien: "bem", buen: "bom", bonita: "bonita", cansado: "cansado", curioso: "curioso", juntos: "juntos", foto: "foto",
  teléfono: "telefone", número: "número", nombre: "nome", edad: "idade", país: "país", origen: "origem", rutina: "rotina",
  idioma: "idioma, língua", español: "espanhol", portugués: "português", uruguaya: "uruguaia", mismo: "mesmo",
  distintas: "diferentes", formas: "formas", variedades: "variedades", informales: "informais", formal: "formal",
  correctas: "corretas", verbo: "verbo", pretérito: "pretérito (passado)", acciones: "ações", terminadas: "terminadas",
};

export function normalizeWord(w: string): string {
  return w.toLowerCase().replace(/[¿?¡!.,;:"“”«»()…]/g, "").trim();
}

export function lookupWord(w: string): string | null {
  return DICTIONARY[normalizeWord(w)] ?? null;
}
