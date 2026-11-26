/**
 * Mini dicionário espanhol → português para as legendas clicáveis.
 * Palavras sem entrada mostram a tradução da frase inteira.
 */
export const DICTIONARY: Record<string, string> = {
  oye: "ei, escuta", vamos: "vamos", a: "a, para", la: "a", el: "o", los: "os", las: "as", playa: "praia", este: "este", esta: "esta",
  fin: "fim", de: "de", semana: "semana", claro: "claro", pero: "mas", no: "não", tengo: "tenho", coche: "carro", está: "está",
  en: "em, no", taller: "oficina mecânica", pasa: "acontece", nada: "nada", podemos: "podemos", ir: "ir", autobús: "ônibus",
  sábado: "sábado", temprano: "cedo", perfecto: "perfeito", y: "e", dónde: "onde", dormir: "dormir", mi: "minha, meu",
  tía: "tia; (Espanha, gíria) amiga", tiene: "tem", una: "uma", un: "um", casa: "casa", cerca: "perto", del: "do", mar: "mar",
  ella: "ela", nos: "nos", invita: "convida", qué: "que", bien: "bem", voy: "vou", llevar: "levar", sombrilla: "guarda-sol",
  protector: "protetor", solar: "solar", yo: "eu", comida: "comida", vemos: "vemos",
  buenas: "boas", noches: "noites", ya: "já", sabe: "sabe", va: "vai", pedir: "pedir", sí: "sim", soy: "sou",
  vegetariana: "vegetariana", me: "me", recomienda: "recomenda", ensalada: "salada", sopa: "sopa", verduras: "legumes, verduras",
  están: "estão", exquisitas: "deliciosas (falso amigo!)", dos: "duas, dois", por: "por", favor: "favor", agua: "água",
  sin: "sem", gas: "gás", muy: "muito", enseguida: "já, em seguida", se: "se", lo: "o (pronome)", traigo: "trago",
  cuarenta: "quarenta", minutos: "minutos", después: "depois", rápido: "rápido", casi: "quase", duermo: "durmo",
  esperando: "esperando", disculpe: "desculpe", demora: "demora", hoy: "hoje", hay: "há, tem", mucha: "muita", gente: "gente",
  che: "ei, cara (Argentina)", vos: "você (Argentina/Uruguai)", sos: "és, é (com vos)", madrid: "Madri", tú: "você",
  hablas: "fala", diferente: "diferente", buenos: "bons", aires: "ares", allá: "lá", decimos: "dizemos", vez: "vez",
  curioso: "curioso", españa: "Espanha", grupo: "grupo", amigos: "amigos", le: "lhe", vosotros: "vocês (Espanha)",
  nosotros: "nós", ustedes: "vocês", al: "ao", llamamos: "chamamos", colectivo: "ônibus (Argentina)", cojo: "pego",
  tomás: "pega, toma (com vos)", auto: "carro (América)", exacto: "exato", mismo: "mesmo", idioma: "idioma, língua",
  palabras: "palavras", distintas: "diferentes",
  vienes: "vem", concierto: "show", viernes: "sexta-feira", estar: "estar", guay: "legal (Espanha)", vale: "ok (Espanha)",
  mola: "curto, gosto (Espanha)", mucho: "muito", ese: "esse", genial: "ótimo", quedamos: "nos encontramos, combinamos",
  las: "as", ocho: "oito", mejor: "melhor", nueve: "nove", que: "que, porque", curro: "trabalho (gíria, Espanha)",
  hasta: "até", tarde: "tarde", cómo: "como", andás: "anda, está (com vos)", tal: "tal", laburo: "trabalho (Argentina)",
  quilombo: "bagunça (Argentina)", total: "total", mil: "mil", cosas: "coisas", para: "para", hacer: "fazer",
  te: "te", entiendo: "entendo", hermano: "irmão", pibe: "garoto (Argentina)", diez: "dez", años: "anos",
  desordenó: "bagunçou", toda: "toda", pieza: "quarto (Argentina)", jaja: "haha", otro: "outro",
  bo: "ei (Uruguai)", con: "com", gurises: "crianças (Uruguai)", ta: "ok (Uruguai)", dale: "bora, vamos",
  hace: "faz", pila: "muito (Uruguai)", calor: "calor", llevo: "levo", mate: "chimarrão, mate", unos: "uns",
  bizcochos: "biscoitos, doces de padaria", espero: "espero", rambla: "orla, calçadão", tres: "três",
};

export function normalizeWord(w: string): string {
  return w.toLowerCase().replace(/[¿?¡!.,;:"“”«»()]/g, "").trim();
}

export function translateWord(w: string): string | null {
  return DICTIONARY[normalizeWord(w)] ?? null;
}
