export type StarId =
  | "forja"
  | "ahora"
  | "motores"
  | "fundamentos"
  | "soberania"
  | "legado";

/** An image/figure that can be attached to a star to enrich its reader. */
export interface StarMedia {
  /** Image source (e.g. "/media/sapzurro.jpg" served from /public). */
  src: string;
  /** Accessible description. */
  alt?: string;
  /** Optional caption shown under the image. */
  caption?: string;
}

export interface StarData {
  id: StarId;
  /** Order index in the linear journey. 0 = central star. */
  index: number;
  name: string;
  /** Short evocative phrase shown under the name. */
  tagline: string;
  /** What this star represents (one line, used in lists / labels). */
  represents: string;
  /** Main narrative paragraph. Supports inline **bold** markup. */
  body: string;
  /** Key bullet points. */
  points: string[];
  /** Priority for the interview, per the plan. */
  priority: "Muy alta" | "Alta" | "Media";
  /**
   * Optional images shown in the reader. Drop files in /public and reference
   * them here, e.g. media: [{ src: "/media/coffi.png", caption: "Coffi" }].
   */
  media?: StarMedia[];
  /** Visual: relative size (radius in scene units). */
  size: number;
  /** Visual: position in 3D space [x, y, z]. Central star at origin. */
  position: [number, number, number];
  /** Core color (hot center) as hex. */
  core: string;
  /** Glow / halo color as hex. */
  glow: string;
}

/**
 * Content derived from:
 *  - Vision_Completa_EAFIT_PotenciaE_JuanEsteban.md
 *  - Pitch_PotenciaE_90segundos_JuanEsteban.md
 *  - Plan_Experiencia_Web_La_Forja.md
 *
 * Layout: the central star sits at the origin. Secondary stars spiral
 * outward — closer = more immediate/urgent, farther = longer horizon —
 * matching the "tamaño y brillo reflejan importancia y urgencia" rule.
 */

// export const STARS: StarData[] = [
//   {
//     id: "forja",
//     index: 0,
//     name: "La Forja",
//     tagline: "Potencia E y yo",
//     represents: "Juan Esteban + Potencia E — origen y catalizador.",
//     body: "Aquí nace todo. Soy Juan Esteban Deossa, de Sapzurro, Chocó. Llegué a un límite donde el software ya no bastaba: las líneas de código cambian experiencias, pero no cambian la materia ni la energía que sostiene la vida de una comunidad. Potencia E es el vehículo que remueve la barrera económica y me permite entrar a Ingeniería Física en EAFIT con la cabeza y el corazón completamente libres para forjar.",
//     points: [
//       "Mi límite no fue técnico, fue existencial: del universo digital a los átomos.",
//       "Potencia E no es un crédito tradicional: es una alianza de mutualidad.",
//       "Apuesto por mi capacidad futura de generar valor — equidad y disciplina.",
//       "Ciencia + Arte + Tecnología + Magia al servicio de la vida consciente.",
//     ],
//     priority: "Muy alta",
//     size: 2.1,
//     position: [0, 0, 0],
//     core: "#fff4d6",
//     glow: "#ff9d2f",
//   },
//   {
//     id: "ahora",
//     index: 1,
//     name: "El Ahora",
//     tagline: "El primer fuego",
//     represents: "Potencia E, inicio de Ingeniería Física y disciplina diaria.",
//     body: "El presente en movimiento: aprobar Potencia E y comenzar Ingeniería Física en EAFIT con financiación completa. Es la disciplina de cada mañana, el ritmo de forja sostenido. Context y Coffi siguen activos como laboratorio paralelo mientras me integro a GEMA y al semillero de Cohetería desde el primer semestre.",
//     points: [
//       "Beca semestres 1–6 + AIC semestres 7–9.",
//       "Integración a GEMA y al semillero de Cohetería desde el día uno.",
//       "Mantener el ritmo de Context + Coffi sin pausar.",
//       "Cultura de pago simbólica, participación activa y disciplina manifiesta.",
//     ],
//     priority: "Muy alta",
//     size: 1.25,
//     position: [6.5, 0.8, -1.5],
//     core: "#ffe9b0",
//     glow: "#ffbf57",
//   },
//   {
//     id: "motores",
//     index: 2,
//     name: "Los Motores",
//     tagline: "La prueba de ejecución",
//     represents: "Context y Coffi como evidencia viva de que sé construir.",
//     body: "Context es la empresa madre, el cerebro estratégico donde nacen las invenciones contextuales. Coffi es el primer producto: la infraestructura humana del trabajo remoto y mi laboratorio de validación. No son ideas: son ejecución real que demuestra mentalidad de Ingeniero de Producto, el puente entre rigor técnico, diseño emocional y velocidad de startup.",
//     points: [
//       "Context — cerebro estratégico de invenciones contextuales.",
//       "Coffi — laboratorio de validación humana del trabajo remoto.",
//       "Mentalidad de Product Builder probada (WorldSkills + Global66).",
//       "Camino a reconocimiento nacional + alianza con Global66.",
//     ],
//     priority: "Alta",
//     size: 1.15,
//     position: [-9.5, -1.6, -3],
//     core: "#cdfff3",
//     glow: "#46d6c2",
//   },
//   {
//     id: "fundamentos",
//     index: 3,
//     name: "Los Fundamentos",
//     tagline: "Dominar la capa cero",
//     represents: "GEMA, Cohetería y la física fundamental.",
//     body: "El rigor científico: electromagnetismo aplicado, termofluidos, instrumentación, física del estado sólido y de plasmas. En los grupos de investigación de EAFIT no voy solo a aprender — voy a acelerar la transición de conceptos teóricos a prototipos tangibles y escalables, llevando proyectos del laboratorio al spin-off a través de OnGoing.",
//     points: [
//       "GEMA — Electromagnetismo Aplicado.",
//       "Semillero de Cohetería y Propulsión.",
//       "Primer prototipo energético o de defensa dentro de EAFIT.",
//       "OnGoing como vehículo de spin-offs Deep Tech.",
//     ],
//     priority: "Media",
//     size: 1.2,
//     position: [13.5, 2.6, -6],
//     core: "#dbe9ff",
//     glow: "#5a9bff",
//   },
//   {
//     id: "soberania",
//     index: 4,
//     name: "Soberanía",
//     tagline: "Sapzurro como modelo vivo",
//     represents: "Energía limpia y defensa para la comunidad.",
//     body: "El propósito raíz hecho infraestructura: un modelo de soberanía tecnológica y energética que empieza en Sapzurro — sistemas limpios basados en electromagnetismo, solar y energía marítima, autosuficientes, replicables y con capacidad real de defensa para proteger la libertad de la comunidad. Porque una comunidad con energía accede al conocimiento, a la conexión y al futuro.",
//     points: [
//       "Energías limpias: solar, marítima y electromagnetismo aplicado.",
//       "Autosuficiente, replicable y con defensa comunitaria.",
//       "Sapzurro: de periferia olvidada a centro de referencia.",
//       "Progreso que protege, defiende y potencia.",
//     ],
//     priority: "Alta",
//     size: 1.3,
//     position: [-15, 3, -9],
//     core: "#d8ffe2",
//     glow: "#56d97f",
//   },
//   {
//     id: "legado",
//     index: 5,
//     name: "El Legado",
//     tagline: "Un nuevo paradigma",
//     represents: "Colombia como potencia Deep Tech y espacial.",
//     body: "El horizonte largo: Colombia reconocida como hub estratégico de tecnología y exploración espacial en la región, y un nuevo paradigma latinoamericano donde la tecnología tiene alma — que integra sostenibilidad, defensa de la libertad y progreso consciente. Demostrar que desde las regiones más olvidadas se puede liderar innovación de clase mundial.",
//     points: [
//       "Colombia como hub de tecnología y exploración espacial.",
//       "Tecnología con alma: sostenibilidad + libertad + progreso.",
//       "De consumidores a creadores de Deep Tech.",
//       "Un nuevo paradigma para toda Latinoamérica.",
//     ],
//     priority: "Media",
//     size: 1.25,
//     position: [19, -3.5, -13],
//     core: "#f1e3ff",
//     glow: "#b07cff",
//   },
// ];
export const STARS: StarData[] = [
  {
    id: "forja",
    index: 0,
    name: "La Forja",
    tagline: "Potencia E y yo",
    represents: "Juan Esteban + Potencia E — origen y catalizador.",
    body: "Llegué a un punto donde las líneas de código ya no alcanzaban a tocar la materia que sostiene la vida de una comunidad. El universo digital me había dado herramientas poderosas, pero no bastaban para transformar realidades como la de Sapzurro. Por eso elijo Ingeniería Física en EAFIT. Potencia E aparece como la alianza que disuelve la barrera económica y me permite entrar a este camino con la cabeza y el corazón completamente libres para forjar. No es un préstamo: es un pacto de mutualidad donde apuesto por mi capacidad futura de generar valor.",
    points: [
      "Mi límite no fue técnico, fue existencial: del universo digital a los átomos.",
      "Potencia E es alianza, no deuda: equidad, disciplina y confianza mutua.",
      "Ciencia + Arte + Tecnología + Magia al servicio de la vida consciente.",
      "Todo lo que viene nace de esta forja compartida.",
    ],
    priority: "Muy alta",
    size: 2.1,
    position: [0, 0, 0],
    core: "#fff4d6",
    glow: "#ff9d2f",
  },
  {
    id: "ahora",
    index: 1,
    name: "El Ahora",
    tagline: "La alianza que se activa",
    represents: "Potencia E como alianza estratégica y mi rol como futuro líder.",
    body: "Este es el momento en que la alianza se vuelve realidad. Potencia E no solo me da la posibilidad de estudiar Ingeniería Física sin la presión económica: me da la oportunidad de convertirme en alguien que multiplica valor dentro de la comunidad. Traigo la experiencia de estar trabajado como ingeniero de software en Global66, donde tengo un aprendizaje  invaluable en liderazgo y construcción de sistemas que escalan. Esa misma capacidad de ejecución y visión sistémica quiero ponerla al servicio de Potencia E y de toda la comunidad estudiantil de EAFIT. No busco solo formarme: busco ser un puente que inspire y eleve a quienes vienen detrás.",
    points: [
      "Potencia E como alianza de mutualidad que libera mi energía para crear.",
      "Experiencia en Global66: sistemas que escalan y liderazgo bajo presión.",
      "Potencial de ser líder entre los becados de Potencia E y en la comunidad EAFIT.",
      "Disciplina, ejecución y visión como devolución real al programa.",
    ],
    priority: "Muy alta",
    size: 1.25,
    position: [6.5, 0.8, -1.5],
    core: "#ffe9b0",
    glow: "#ffbf57",
  },
  {
  id: "motores",
  index: 2,
  name: "Los Motores",
  tagline: "El arte de construir lo que importa",
  represents: "Capacidad de Product Builder y visión de aportar a la comunidad EAFIT.",
  body: "Ya he construido y gestiono activamente dos sistemas que operan desde la lógica del contexto: Coffi, la infraestructura humana para el trabajo remoto, y Cerebro, el cerebro central vivo que mantiene una sola verdad para humanos e IA. Esta experiencia me ha permitido desarrollar una capacidad real de Product Builder: ver el todo, diseñar con intención y llevar ideas hasta su funcionamiento. Quiero llevar esa misma mentalidad a la comunidad de EAFIT, creando herramientas y sistemas contextuales que ayuden a otros constructores —estudiantes, investigadores y emprendedores— a navegar la complejidad de sus proyectos con mayor claridad y propósito.",
  points: [
    "Coffi y Cerebro: dos sistemas contextuales ya construidos y en funcionamiento.",
    "Capacidad demostrada de Product Builder: visión, diseño y ejecución real.",
    "Deseo de implementar soluciones contextuales dentro de la comunidad EAFIT.",
    "Herramientas que ayuden a otros product builders y constructores de la universidad.",
  ],
  priority: "Alta",
  size: 1.15,
  position: [-9.5, -1.6, -3],
  core: "#cdfff3",
  glow: "#46d6c2",
},
  {
    id: "fundamentos",
    index: 3,
    name: "Los Fundamentos",
    tagline: "Dominar la capa cero",
    represents: "GEMA, Cohetería y la física fundamental.",
    body: "Aquí comienza el dominio de lo esencial. En GEMA y en el semillero de Cohetería no solo aprenderé electromagnetismo aplicado, termofluidos e instrumentación: voy a acelerar el paso de la teoría a lo tangible. Llevaré la mentalidad de quien construye sistemas hacia los laboratorios, para que los conceptos no se queden en papeles, sino que se conviertan en prototipos que puedan escalar. OnGoing será el puente que permita que esos hallazgos salgan del laboratorio y se transformen en iniciativas de Deep Tech con impacto real.",
    points: [
      "GEMA y el semillero de Cohetería como espacios de rigor y aplicación.",
      "Acelerar la transición de la teoría a prototipos tangibles.",
      "OnGoing como vehículo para convertir conocimiento en iniciativas reales.",
      "Construir desde la capa cero con mentalidad de quien ejecuta.",
    ],
    priority: "Media",
    size: 1.2,
    position: [13.5, 2.6, -6],
    core: "#dbe9ff",
    glow: "#5a9bff",
  },
  {
    id: "soberania",
    index: 4,
    name: "Soberanía",
    tagline: "Sapzurro como modelo vivo",
    represents: "Energía limpia y defensa para la comunidad.",
    body: "Este es el corazón que late detrás de todo. Quiero construir un modelo de soberanía tecnológica y energética que comience en Sapzurro: sistemas limpios, autosuficientes y replicables, donde el electromagnetismo, la energía solar y la marítima se integren con capacidad real de defensa comunitaria. Porque cuando una comunidad tiene energía, tiene acceso al conocimiento, a la conexión y a la posibilidad de proteger su propia libertad. Sapzurro no es solo un origen: es el primer territorio donde esta visión debe volverse carne y realidad.",
    points: [
      "Un modelo de soberanía energética basado en electromagnetismo y energías limpias.",
      "Autosuficiente, replicable y con capacidad de defensa comunitaria.",
      "Sapzurro como primer territorio donde la visión se hace realidad.",
      "Progreso que protege, defiende y devuelve dignidad.",
    ],
    priority: "Alta",
    size: 1.3,
    position: [-15, 3, -9],
    core: "#d8ffe2",
    glow: "#56d97f",
  },
  {
    id: "legado",
    index: 5,
    name: "El Legado",
    tagline: "Un nuevo paradigma",
    represents: "Colombia como potencia Deep Tech y espacial.",
    body: "El horizonte que se expande más allá de mí. Aspiro a que Colombia se convierta en un referente de tecnología y exploración espacial en la región, y a que nazca un nuevo paradigma latinoamericano donde la tecnología tenga alma: que integre sostenibilidad, defensa de la libertad y progreso consciente. Demostrar que desde las regiones más profundas y olvidadas es posible liderar innovación de clase mundial cuando se tiene el rigor, la visión y el ecosistema correcto.",
    points: [
      "Colombia como hub estratégico de tecnología y exploración espacial.",
      "Tecnología con alma: sostenibilidad, libertad y progreso consciente.",
      "De consumidores a creadores de Deep Tech en Latinoamérica.",
      "Un paradigma que nace desde la raíz y se expande hacia el futuro.",
    ],
    priority: "Media",
    size: 1.25,
    position: [19, -3.5, -13],
    core: "#f1e3ff",
    glow: "#b07cff",
  },
];

export const CENTRAL_STAR = STARS[0];
export const SECONDARY_STARS = STARS.slice(1);

export const getStar = (id: StarId): StarData =>
  STARS.find((s) => s.id === id) as StarData;
