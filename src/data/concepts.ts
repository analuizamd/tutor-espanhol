/**
 * Mapa de conceitos do espanhol do ENEM (18 conceitos) com área, nível no grafo e pré-requisitos diretos.
 * Nível = 1 + maior nível entre os pré-requisitos.
 * Áreas: V = Vocabulário, G = Gramática em contexto, T = Gêneros textuais, L = Leitura, C = Cultura e variedades.
 * Textos usados pelo tutor simulado:
 * - rulePt / ruleEs: lembrete da regra (degrau 1 da escada de dicas)
 * - examplePt / exampleEs: exemplo parecido (degrau 3)
 * - explanationPt: explicação completa (nível Básico); explanationEs: curta (nível Avançado)
 */

export type ConceptCode =
  | "V1" | "G1" | "T1"
  | "V2" | "V3" | "V4" | "G2" | "G4"
  | "G3" | "L1" | "C1"
  | "L2" | "L3" | "L4" | "G5" | "C2"
  | "L5" | "L6";

export type Area = "V" | "G" | "T" | "L" | "C";

export const AREA_LABEL: Record<Area, string> = {
  V: "Vocabulário",
  G: "Gramática em contexto",
  T: "Gêneros textuais",
  L: "Leitura",
  C: "Cultura e variedades",
};

export interface Concept {
  code: ConceptCode;
  name: string;
  area: Area;
  level: 0 | 1 | 2 | 3 | 4;
  prereqs: ConceptCode[];
  /** Fase extra (gírias regionais). */
  extra?: boolean;
  rulePt: string;
  ruleEs: string;
  examplePt: string;
  exampleEs: string;
  explanationPt: string;
  explanationEs: string;
}

export const CONCEPTS: Concept[] = [
  // ---------- Nível 0 ----------
  {
    code: "V1", name: "Cognatos e palavras transparentes", area: "V", level: 0, prereqs: [],
    rulePt: "Muitas palavras do espanhol se parecem com o português e têm o mesmo sentido (cognatos). Use-as como âncora para entender o texto.",
    ruleEs: "Usa las palabras parecidas al portugués para entender.",
    examplePt: "“La universidad ofrece un programa de música” — universidade, programa e música são transparentes.",
    exampleEs: "universidad, programa, música = palabras transparentes.",
    explanationPt: "No ENEM, você não precisa entender todas as palavras. Comece pelos cognatos — palavras quase iguais ao português, como 'problema', 'importante', 'sociedad', 'tecnología'. Eles mostram o assunto do texto. Depois, use o contexto para deduzir o resto. Cuidado só com os falsos amigos, que parecem iguais mas mudam de sentido.",
    explanationEs: "Los cognados te dan el tema del texto. Cuidado con los falsos amigos.",
  },
  {
    code: "G1", name: "Pronomes e formas de tratamento: tú, vos, usted, vosotros", area: "G", level: 0, prereqs: [],
    rulePt: "Tú = você (informal). Vos = você (informal na Argentina e no Uruguai). Usted = o senhor/a senhora (formal). Vosotros = vocês (informal, só na Espanha).",
    ruleEs: "Tú/vos: informal. Usted: formal. Vosotros: solo España.",
    examplePt: "Na Argentina: “¿Vos tenés tiempo?”. Com um cliente: “¿Usted necesita ayuda?”.",
    exampleEs: "Vos tenés / tú tienes / usted tiene / vosotros tenéis.",
    explanationPt: "O espanhol tem várias formas de dizer 'você'. 'Tú' é informal e usado na maioria dos países. 'Vos' também é informal e aparece na Argentina e no Uruguai, com verbos próprios (vos sos, vos tenés). 'Usted' é formal, como 'o senhor', e conjuga como 'él'. No plural, a Espanha usa 'vosotros' (informal) e 'ustedes' (formal); a América Latina usa 'ustedes' para tudo. No ENEM, essas formas mostram o grau de formalidade e a origem de quem fala.",
    explanationEs: "Tú/vos informal, usted formal; vosotros (España) y ustedes (América).",
  },
  {
    code: "T1", name: "Gêneros textuais e função social: tirinha, notícia, propaganda, canção", area: "T", level: 0, prereqs: [],
    rulePt: "Cada gênero tem uma função: a notícia informa, a propaganda convence, a tirinha critica com humor, a canção expressa sentimentos ou ideias.",
    ruleEs: "Noticia informa, publicidad convence, tira cómica critica con humor.",
    examplePt: "Uma campanha com “¡Vacúnate ya!” é propaganda: quer convencer o leitor a agir.",
    exampleEs: "“¡Recicla hoy!” = campaña publicitaria.",
    explanationPt: "Antes de ler os detalhes, identifique o gênero: título e data indicam notícia; verbos no imperativo (compra, participa, recicla) indicam propaganda ou campanha; quadrinhos com balões indicam tirinha, que costuma criticar algo com humor; versos e refrão indicam canção. Saber o gênero ajuda a responder qual é o objetivo do texto — uma pergunta muito comum no ENEM.",
    explanationEs: "Identifica el género primero: te dice el objetivo del texto.",
  },
  // ---------- Nível 1 ----------
  {
    code: "V2", name: "Falsos amigos", area: "V", level: 1, prereqs: ["V1"],
    rulePt: "Falsos amigos parecem palavras do português, mas têm outro sentido: embarazada = grávida, exquisito = delicioso, apellido = sobrenome.",
    ruleEs: "Ojo: embarazada = grávida, exquisito = delicioso.",
    examplePt: "“El pastel está exquisito” = o bolo está delicioso (não ‘esquisito’).",
    exampleEs: "rato = momento; polvo = pó; oficina = escritório.",
    explanationPt: "Falsos amigos (heterosemánticos) são as pegadinhas preferidas do ENEM. Alguns importantes: 'embarazada' (grávida), 'exquisito' (delicioso), 'apellido' (sobrenome), 'rato' (momento), 'oficina' (escritório), 'polvo' (pó), 'largo' (comprido), 'cena' (jantar), 'pelado' (careca), 'borracha' (bêbada), 'salsa' (molho). Se o sentido 'em português' deixar a frase estranha, desconfie: pode ser um falso amigo.",
    explanationEs: "Si el sentido no encaja, piensa en un falso amigo.",
  },
  {
    code: "V3", name: "Vocabulário do cotidiano por tema", area: "V", level: 1, prereqs: ["V1"],
    rulePt: "Agrupe palavras por tema (casa, comida, escola, trabalho, saúde): o tema do texto ajuda a adivinhar as palavras novas.",
    ruleEs: "Piensa en el tema: comida, escuela, trabajo, salud.",
    examplePt: "Num texto sobre escola: pizarra (lousa), tiza (giz), asignatura (matéria).",
    exampleEs: "Escuela: pizarra, tiza, asignatura.",
    explanationPt: "Vocabulário do dia a dia aparece em quase toda questão: alimentos (leche, huevo, zanahoria), casa (cocina, almohada, ventana), escola (asignatura, pizarra, nota), trabalho (sueldo, jefe, empresa), corpo e saúde (dolor, gripe, receta). Estudar por tema é mais eficiente: quando você sabe o assunto, as palavras vizinhas ficam mais fáceis.",
    explanationEs: "Estudia por temas: el contexto te ayuda.",
  },
  {
    code: "V4", name: "Palavras-chave e tema do texto", area: "V", level: 1, prereqs: ["V1", "T1"],
    rulePt: "Palavras que se repetem, aparecem no título ou estão em destaque costumam indicar o tema do texto.",
    ruleEs: "Busca palabras repetidas y el título.",
    examplePt: "Se ‘agua’, ‘sequía’ e ‘lluvia’ se repetem, o tema é a falta de água.",
    exampleEs: "agua + sequía + lluvia → tema: escasez de agua.",
    explanationPt: "Para achar o tema rapidamente: leia o título, a fonte e a primeira frase; marque palavras que se repetem ou pertencem ao mesmo campo de sentido. O tema é o assunto geral (ex.: meio ambiente), não um detalhe. Muitas alternativas erradas do ENEM falam de um detalhe verdadeiro, mas que não é o tema.",
    explanationEs: "Título + palabras repetidas = tema.",
  },
  {
    code: "G2", name: "Presente e futuro próximo (ir a + infinitivo)", area: "G", level: 1, prereqs: ["G1"],
    rulePt: "Presente: hablo, comes, vive. Futuro próximo: ir (voy, vas, va, vamos, van) + a + infinitivo: “voy a estudiar”.",
    ruleEs: "Futuro próximo: ir + a + infinitivo.",
    examplePt: "“Mañana vamos a viajar” = amanhã vamos viajar.",
    exampleEs: "Esta noche voy a cenar con mis padres.",
    explanationPt: "O presente descreve hábitos e fatos (Trabajo en un banco). Para planos e intenções, o espanhol usa 'ir a + infinitivo' — diferente do português, que não usa o 'a': 'Voy a estudiar' = vou estudar. Esse 'a' é obrigatório. Em textos, o futuro próximo indica planos ou previsões.",
    explanationEs: "Voy a + infinitivo para planes. No olvides la 'a'.",
  },
  {
    code: "G4", name: "Conectores e ideias de contraste", area: "G", level: 1, prereqs: ["V1"],
    rulePt: "Conectores ligam ideias: sin embargo / pero / aunque = contraste; porque / ya que = causa; por lo tanto / así que = conclusão.",
    ruleEs: "Sin embargo, aunque = contraste. Por lo tanto = conclusión.",
    examplePt: "“Estudió mucho; sin embargo, no aprobó” = estudou muito; no entanto, não passou.",
    exampleEs: "Aunque llueve, salimos.",
    explanationPt: "Conectores mostram a lógica do texto. Contraste: pero, sin embargo, no obstante, aunque, a pesar de. Causa: porque, ya que, puesto que. Conclusão: por lo tanto, por eso, así que. Adição: además, también. Atenção: 'todavía' significa 'ainda' (não 'todavia'), e 'aunque' é 'embora/mesmo que'. No ENEM, a ideia principal costuma vir depois de um conector de contraste.",
    explanationEs: "Después de 'sin embargo' suele venir la idea importante.",
  },
  // ---------- Nível 2 ----------
  {
    code: "G3", name: "Passado: pretérito indefinido e perfecto", area: "G", level: 2, prereqs: ["G2"],
    rulePt: "Indefinido: ação terminada num tempo passado (ayer comí). Perfecto: haber + particípio, ligado ao presente (hoy he comido).",
    ruleEs: "Ayer comí (indefinido); hoy he comido (perfecto).",
    examplePt: "“Ayer fui al cine” x “Esta semana he ido dos veces al cine”.",
    exampleEs: "El año pasado viajé; este año he viajado poco.",
    explanationPt: "O espanhol tem dois passados muito comuns. O pretérito indefinido (hablé, comiste, vivió) fala de ações concluídas num período já terminado: ayer, el año pasado, en 2010. O pretérito perfecto (he hablado, has comido) usa 'haber' + particípio e fala de ações num período que ainda não acabou ou ligadas ao presente: hoy, esta semana, nunca, ya. Em português costumamos usar só o 'falei' para os dois.",
    explanationEs: "Indefinido: tiempo terminado. Perfecto: tiempo que incluye el ahora.",
  },
  {
    code: "L1", name: "Ideia principal do texto", area: "L", level: 2, prereqs: ["V4"],
    rulePt: "A ideia principal é o que o texto defende ou informa no geral — costuma aparecer no título, no início ou depois de um conector de contraste.",
    ruleEs: "La idea principal resume todo el texto, no un detalle.",
    examplePt: "Num texto sobre celulares na escola, a ideia principal pode ser ‘o uso excessivo atrapalha o aprendizado’.",
    exampleEs: "Idea principal = lo que el texto quiere decir en una frase.",
    explanationPt: "Para achar a ideia principal, pergunte: 'se eu tivesse que resumir o texto numa frase, qual seria?'. Desconfie de alternativas que trazem um detalhe correto mas pequeno, ou que exageram ('todos', 'nunca', 'sempre'). A resposta certa costuma ser mais geral e fiel ao texto.",
    explanationEs: "Resume el texto en una frase. Evita detalles y exageraciones.",
  },
  {
    code: "C1", name: "Variedades do espanhol: Espanha, Argentina, Uruguai", area: "C", level: 2, prereqs: ["G1", "V3"],
    rulePt: "O espanhol muda de país para país: a Espanha usa vosotros e ‘coche’; Argentina e Uruguai usam vos (vos sos) e ‘auto’.",
    ruleEs: "España: vosotros, coche. Río de la Plata: vos, auto.",
    examplePt: "Espanha: “¿Vosotros cogéis el autobús?”. Argentina: “¿Vos tomás el colectivo?”.",
    exampleEs: "ordenador (España) = computadora (América).",
    explanationPt: "Não existe um espanhol 'certo': há variedades. Na Espanha: vosotros, coche, ordenador, móvil, zumo, e o 'z' com som de 'th'. Na Argentina e no Uruguai (rioplatense): vos (vos sos, vos tenés), auto, computadora, celular, jugo, colectivo (ônibus) e o 'll/y' com som de 'ch/j'. O ENEM valoriza essa diversidade e pergunta de onde é quem fala.",
    explanationEs: "Variedades: España (vosotros, coche) y Río de la Plata (vos, auto).",
  },
  // ---------- Nível 3 ----------
  {
    code: "L2", name: "Informações específicas do texto", area: "L", level: 3, prereqs: ["L1"],
    rulePt: "Para achar um dado específico (data, lugar, número, motivo), volte ao trecho exato do texto — não responda de memória.",
    ruleEs: "Vuelve al texto y busca el dato exacto.",
    examplePt: "Se a pergunta é ‘quando’, procure datas e palavras como ‘mañana’, ‘el lunes’.",
    exampleEs: "¿Cuándo? Busca fechas: el lunes, mañana, en julio.",
    explanationPt: "Perguntas de informação específica pedem um dado do texto: quem, quando, onde, quanto, por quê. Identifique a palavra-chave da pergunta, localize-a no texto e leia a frase ao redor. Alternativas erradas costumam trocar números, datas ou pessoas.",
    explanationEs: "Localiza la palabra clave de la pregunta en el texto.",
  },
  {
    code: "L3", name: "Inferência e sentido pelo contexto", area: "L", level: 3, prereqs: ["L1", "V2"],
    rulePt: "Inferir é deduzir o que não está escrito com todas as letras, a partir das pistas do texto.",
    ruleEs: "Deduce con las pistas del texto.",
    examplePt: "“Llegó empapado y con el paraguas roto” → estava chovendo forte.",
    exampleEs: "Llegó empapado → llovía.",
    explanationPt: "Na inferência, a resposta não está copiada no texto, mas é a única conclusão possível a partir das pistas. Também vale para palavras desconhecidas: olhe as palavras ao redor e pergunte que sentido faria. Cuidado para não inventar: a inferência precisa ter base no texto.",
    explanationEs: "Inferir: concluir con base en pistas, sin inventar.",
  },
  {
    code: "L4", name: "Referência: o que o pronome retoma", area: "L", level: 3, prereqs: ["G1", "L1"],
    rulePt: "Pronomes (lo, la, le, les, este, ese, su) retomam algo dito antes. Volte e procure a palavra que concorda em gênero e número.",
    ruleEs: "Lo/la/les retoman algo dicho antes.",
    examplePt: "“Compré un libro y lo leí en un día” — ‘lo’ retoma ‘un libro’.",
    exampleEs: "Vi a María y la saludé (la = María).",
    explanationPt: "Questões de referência perguntam a quem ou a que um pronome se refere. 'Lo' (masc. sing.), 'la' (fem. sing.), 'los/las' (plural), 'le/les' (objeto indireto), 'su/sus' (dele, dela, deles), 'este/ese/aquel'. Volte ao trecho anterior e teste: troque o pronome pela palavra candidata e veja se a frase faz sentido.",
    explanationEs: "Sustituye el pronombre por el candidato y comprueba.",
  },
  {
    code: "G5", name: "Tempos verbais como pista de sentido", area: "G", level: 3, prereqs: ["G2", "G3"],
    rulePt: "O tempo verbal mostra se algo é hábito (presente), plano (ir a), fato concluído (indefinido) ou experiência ligada ao agora (perfecto).",
    ruleEs: "El tiempo verbal indica hábito, plan o pasado.",
    examplePt: "“Vamos a cerrar la tienda” indica um plano, não algo que já aconteceu.",
    exampleEs: "Cerramos (hábito) / vamos a cerrar (plan) / cerramos ayer (pasado).",
    explanationPt: "Muitas questões do ENEM dependem de perceber o tempo verbal: o texto fala de algo que já aconteceu, que acontece sempre ou que ainda vai acontecer? Presente = hábito ou fato; ir a + infinitivo = plano; indefinido = ação concluída; perfecto = experiência até agora; imperativo = ordem ou conselho.",
    explanationEs: "Fíjate en el verbo: ¿pasado, hábito o plan?",
  },
  {
    code: "C2", name: "Gírias e expressões regionais", area: "C", level: 3, prereqs: ["C1", "V3"], extra: true,
    rulePt: "Cada país tem suas gírias: guay (Espanha), che (Argentina), bo (Uruguai).",
    ruleEs: "Guay (España), che (Argentina), bo (Uruguay).",
    examplePt: "“¡Qué guay!” = que legal! (Espanha). “Che, ¿vamos?” = ei, vamos? (Argentina).",
    exampleEs: "¡Qué guay! / Che, ¿vamos? / Bo, ¿todo bien?",
    explanationPt: "Gírias aparecem em tirinhas, canções e diálogos do ENEM. Na Espanha: guay (legal), vale (ok), mola (curto/gosto), currar (trabalhar). Na Argentina: che (ei), laburo (trabalho), pibe (garoto), quilombo (bagunça). No Uruguai: bo (ei), ta (ok), gurí (criança), pila (muito). O contexto quase sempre ajuda a deduzir o sentido.",
    explanationEs: "Jerga: usa el contexto para deducir.",
  },
  // ---------- Nível 4 ----------
  {
    code: "L5", name: "Intenção do autor e tom: humor, ironia, crítica", area: "L", level: 4, prereqs: ["L3", "G4"],
    rulePt: "Pergunte ‘por que o autor escreveu isso?’: informar, convencer, criticar ou fazer rir. Ironia é dizer o contrário do que se pensa.",
    ruleEs: "¿Para qué escribe el autor? Informar, criticar, hacer reír.",
    examplePt: "“¡Qué bien! Otra vez sin luz” é irônico: a pessoa está irritada.",
    exampleEs: "“¡Genial, otro lunes!” = ironía.",
    explanationPt: "Intenção é o objetivo do texto; tom é o jeito (sério, irônico, humorístico, indignado). Tirinhas e charges costumam criticar comportamentos sociais com humor. A ironia aparece quando a fala contradiz a situação. Procure exageros, contrastes entre imagem e texto e palavras emotivas.",
    explanationEs: "Intención = objetivo; tono = actitud. Busca contrastes.",
  },
  {
    code: "L6", name: "Texto verbal e não verbal", area: "L", level: 4, prereqs: ["L3", "T1"],
    rulePt: "Em tirinhas, propagandas e infográficos, o sentido nasce da soma de imagem + palavras.",
    ruleEs: "Imagen + texto juntos construyen el sentido.",
    examplePt: "Um cartaz com um planeta derretendo e “¿Y ahora qué?” critica o aquecimento global.",
    exampleEs: "Imagen de planeta + “¿Y ahora?” = crítica ambiental.",
    explanationPt: "Quando o texto tem imagem, ela não é decoração: expressões faciais, cores, símbolos e a ordem dos quadros fazem parte da mensagem. Leia a imagem e o texto juntos e veja se um contradiz o outro (humor, ironia) ou se reforça (campanha).",
    explanationEs: "Lee la imagen y el texto juntos.",
  },
];

export const CONCEPT_BY_CODE = Object.fromEntries(CONCEPTS.map((c) => [c.code, c])) as Record<ConceptCode, Concept>;

/** Ordem oficial dos códigos (usada como desempate). */
export const CONCEPT_ORDER: ConceptCode[] = CONCEPTS.map((c) => c.code);
