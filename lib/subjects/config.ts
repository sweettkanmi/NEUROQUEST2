// ============================================================
// lib/subjects/config.ts
// Single source of truth for the entire subjects system.
// Add/edit subjects here — no component changes needed.
// ============================================================

export interface SubjectQuestion {
  question_text: string
  options: [string, string, string, string]
  correct_option: 0 | 1 | 2 | 3
  explanation: string
}

export interface SubjectSection {
  id: string
  title: string
  theoryContent: string // plain text / markdown-ish
  questions: SubjectQuestion[]
}

export interface SubjectModule {
  id: string
  title: string
  description: string
  icon: string
  sections: [SubjectSection, SubjectSection, SubjectSection, SubjectSection] // exactly 4
}

export interface Subject {
  id: string
  title: string
  description: string
  icon: string
  color: string // tailwind bg class for accent
  medalIcon: string // emoji awarded on completion
  diagnosticTest: SubjectQuestion[]
  modules: [SubjectModule, SubjectModule, SubjectModule] // exactly 3
}

// ─── ENGLISH ────────────────────────────────────────────────
const englishSubject: Subject = {
  id: "english",
  title: "Inglés",
  description: "Domina gramática, vocabulario y comprensión del idioma inglés",
  icon: "🇬🇧",
  color: "bg-blue-500",
  medalIcon: "🏅",
  diagnosticTest: [
    {
      question_text: "Which sentence is grammatically correct?",
      options: ["She don't like coffee.", "She doesn't likes coffee.", "She doesn't like coffee.", "She not like coffee."],
      correct_option: 2,
      explanation: "With third-person singular (she/he/it) we use 'doesn't' + base verb.",
    },
    {
      question_text: "Choose the correct past tense: 'Yesterday I ___ to the market.'",
      options: ["go", "goes", "going", "went"],
      correct_option: 3,
      explanation: "'Went' is the simple past of 'go'.",
    },
    {
      question_text: "What is the plural of 'child'?",
      options: ["childs", "childes", "children", "childrens"],
      correct_option: 2,
      explanation: "'Children' is the irregular plural of 'child'.",
    },
    {
      question_text: "Which word is a synonym of 'happy'?",
      options: ["sad", "angry", "joyful", "tired"],
      correct_option: 2,
      explanation: "'Joyful' means feeling great happiness, same as 'happy'.",
    },
    {
      question_text: "Select the correct article: '___ apple a day keeps the doctor away.'",
      options: ["A", "An", "The", "—"],
      correct_option: 1,
      explanation: "'An' is used before words starting with a vowel sound (a, e, i, o, u).",
    },
    {
      question_text: "'I have never ___ to Paris.' Complete with the correct form.",
      options: ["be", "been", "being", "was"],
      correct_option: 1,
      explanation: "Present perfect uses 'have/has + past participle'. The past participle of 'be' is 'been'.",
    },
  ],
  modules: [
    {
      id: "english-m1",
      title: "Gramática Esencial",
      description: "Tiempos verbales, artículos y estructura de oraciones",
      icon: "📝",
      sections: [
        {
          id: "english-m1-s1",
          title: "Presente Simple vs Continuo",
          theoryContent: `## Presente Simple
Usamos el presente simple para rutinas, hábitos y hechos permanentes.
- I **work** every day.
- She **doesn't like** spicy food.

## Presente Continuo
Usamos el presente continuo para acciones que ocurren ahora o temporalmente.
- I **am working** right now.
- They **are traveling** this week.

**Estructura:**
- Afirmativo: Subject + am/is/are + verb-ing
- Negativo: Subject + am/is/are + not + verb-ing
- Pregunta: Am/Is/Are + subject + verb-ing?`,
          questions: [
            {
              question_text: "Which sentence uses Present Continuous correctly?",
              options: ["She is work now.", "She working now.", "She is working now.", "She are working now."],
              correct_option: 2,
              explanation: "Present Continuous = subject + is/am/are + verb-ing. 'She' uses 'is'.",
            },
            {
              question_text: "'Every morning, he ___ coffee.' Choose the correct form.",
              options: ["is drinking", "drinks", "drink", "are drinking"],
              correct_option: 1,
              explanation: "Daily routines use simple present. With 'he', add -s to the verb.",
            },
            {
              question_text: "Which sentence is in Present Simple?",
              options: ["They are playing football.", "They play football every Saturday.", "They played football.", "They will play football."],
              correct_option: 1,
              explanation: "'They play football every Saturday' uses simple present for a recurring habit.",
            },
            {
              question_text: "Identify the error: 'He is knowing the answer.'",
              options: ["'is' should be 'are'", "'knowing' should be 'knows' — stative verbs don't use -ing", "No error", "'the' should be 'an'"],
              correct_option: 1,
              explanation: "'Know' is a stative verb and doesn't normally use the continuous form. Use 'He knows the answer.'",
            },
          ],
        },
        {
          id: "english-m1-s2",
          title: "Pasado Simple y Continuo",
          theoryContent: `## Pasado Simple
Para acciones completadas en el pasado.
- I **visited** London last year.
- She **didn't go** to the party.

## Pasado Continuo
Para acciones en progreso en un momento pasado.
- I **was reading** when he called.
- They **were playing** all afternoon.

**Verbos irregulares frecuentes:**
go → went | eat → ate | see → saw | have → had | make → made`,
          questions: [
            {
              question_text: "Complete: 'While I ___ dinner, the phone rang.'",
              options: ["cooked", "was cooking", "cook", "am cooking"],
              correct_option: 1,
              explanation: "For an action in progress when another action interrupted, use Past Continuous.",
            },
            {
              question_text: "What is the past tense of 'buy'?",
              options: ["buyed", "boughted", "bought", "buyd"],
              correct_option: 2,
              explanation: "'Buy' is an irregular verb. Its past tense is 'bought'.",
            },
            {
              question_text: "'She ___ TV all evening.' Choose the correct form.",
              options: ["watch", "watches", "watched", "is watching"],
              correct_option: 2,
              explanation: "'All evening' indicates a completed action in the past, so use simple past: 'watched'.",
            },
            {
              question_text: "Which sentence uses Past Continuous?",
              options: ["I went to school.", "I was going to school.", "I have gone to school.", "I go to school."],
              correct_option: 1,
              explanation: "Past Continuous = was/were + verb-ing. 'I was going' is the correct form.",
            },
          ],
        },
        {
          id: "english-m1-s3",
          title: "Presente Perfecto",
          theoryContent: `## Presente Perfecto
Conecta el pasado con el presente. Formación: **have/has + past participle**

**Usos principales:**
1. Experiencias de vida: *I have visited Japan.*
2. Acciones recientes con resultado presente: *She has broken her leg.*
3. Con 'for' y 'since': *I have lived here for 5 years / since 2019.*

**Palabras clave:** already, yet, just, ever, never, for, since

**Participios irregulares:**
go → gone | see → seen | write → written | take → taken | give → given`,
          questions: [
            {
              question_text: "Choose the correct sentence using Present Perfect:",
              options: ["I have went there.", "I have gone there.", "I have go there.", "I went there yesterday."],
              correct_option: 1,
              explanation: "Present Perfect uses 'have/has + past participle'. 'Gone' is the past participle of 'go'.",
            },
            {
              question_text: "'She ___ the report yet.' Complete with 'finish'.",
              options: ["haven't finished", "hasn't finished", "didn't finished", "doesn't finished"],
              correct_option: 1,
              explanation: "With 'she' (third person), use 'hasn't'. 'Yet' is common in negatives and questions.",
            },
            {
              question_text: "Which key word signals Present Perfect?",
              options: ["yesterday", "last week", "in 2010", "already"],
              correct_option: 3,
              explanation: "'Already', 'just', 'ever', 'never', 'yet', 'for', 'since' are typical Present Perfect markers.",
            },
            {
              question_text: "'___ you ever eaten sushi?' Select the correct auxiliary.",
              options: ["Did", "Do", "Have", "Are"],
              correct_option: 2,
              explanation: "Questions about life experiences use 'Have/Has + subject + past participle?'",
            },
          ],
        },
        {
          id: "english-m1-s4",
          title: "Futuro: Will vs Going To",
          theoryContent: `## Will
Para predicciones espontáneas, decisiones en el momento y promesas.
- It **will** rain tomorrow (prediction).
- I **will** help you (promise / spontaneous decision).

## Going To
Para planes e intenciones ya decididos, y predicciones con evidencia.
- I **am going to** study tonight (plan).
- Look at those clouds — it **is going to** rain (evidence).

**Consejo práctico:**
Si ya lo tenías pensado → going to
Si lo decides en este momento → will`,
          questions: [
            {
              question_text: "Which is correct for a spontaneous offer? 'Don't worry, I ___ help you.'",
              options: ["am going to", "will", "am", "go to"],
              correct_option: 1,
              explanation: "Spontaneous decisions and offers at the moment of speaking use 'will'.",
            },
            {
              question_text: "Select the planned intention: 'She ___ study medicine next year.'",
              options: ["will", "is going to", "goes to", "shall"],
              correct_option: 1,
              explanation: "Pre-planned intentions and decisions already made use 'going to'.",
            },
            {
              question_text: "Identify the error: 'They going to travel next month.'",
              options: ["'next month' is wrong", "Missing 'are' before 'going to'", "'travel' should be 'traveling'", "No error"],
              correct_option: 1,
              explanation: "'Going to' requires the auxiliary 'be': They **are** going to travel.",
            },
            {
              question_text: "'The phone is ringing. I ___ answer it.' Best option:",
              options: ["am going to", "will", "am", "have"],
              correct_option: 1,
              explanation: "Spontaneous decisions made at the moment of speaking use 'will'.",
            },
          ],
        },
      ],
    },
    {
      id: "english-m2",
      title: "Vocabulario y Expresiones",
      description: "Phrasal verbs, conectores y vocabulario esencial",
      icon: "💬",
      sections: [
        {
          id: "english-m2-s1",
          title: "Phrasal Verbs Esenciales",
          theoryContent: `## ¿Qué es un Phrasal Verb?
Un verbo + partícula (preposición o adverbio) que juntos forman un nuevo significado.

**Los más usados:**
| Phrasal Verb | Significado |
|---|---|
| give up | rendirse / dejar de hacer algo |
| look for | buscar |
| find out | descubrir / enterarse |
| turn on/off | encender / apagar |
| put off | posponer |
| run out of | quedarse sin |
| come up with | idear / proponer |
| get along with | llevarse bien con |

**Consejo:** Aprende los phrasal verbs en contexto, no de forma aislada.`,
          questions: [
            {
              question_text: "What does 'give up' mean?",
              options: ["to offer something", "to quit / stop doing something", "to lift an object", "to give a gift"],
              correct_option: 1,
              explanation: "'Give up' means to quit or stop trying to do something.",
            },
            {
              question_text: "'I ___ my keys everywhere.' The correct phrasal verb:",
              options: ["look after", "look for", "look up", "look into"],
              correct_option: 1,
              explanation: "'Look for' means to search for something.",
            },
            {
              question_text: "Choose the correct sentence: 'She ___ a great plan.'",
              options: ["came up with", "came up to", "came across with", "came in to"],
              correct_option: 0,
              explanation: "'Come up with' means to think of or suggest an idea.",
            },
            {
              question_text: "What does 'run out of' mean in 'We ran out of milk'?",
              options: ["to spill something", "to have no more of something", "to go running", "to discard something"],
              correct_option: 1,
              explanation: "'Run out of' means to use all of something so none is left.",
            },
          ],
        },
        {
          id: "english-m2-s2",
          title: "Conectores y Cohesión",
          theoryContent: `## Conectores (Linking Words)
Los conectores unen ideas y dan coherencia al texto.

**Adición:** and, also, in addition, furthermore, moreover
**Contraste:** but, however, although, even though, on the other hand
**Causa:** because, since, as, due to, owing to
**Consecuencia:** so, therefore, thus, as a result, consequently
**Ejemplo:** for example, for instance, such as
**Conclusión:** in conclusion, to sum up, finally, in summary

**Ejemplos en contexto:**
- I was tired; **however**, I finished my homework.
- **Although** it was raining, we went for a walk.
- She studied hard; **as a result**, she passed the exam.`,
          questions: [
            {
              question_text: "Choose the correct connector: 'He is rich ___ unhappy.'",
              options: ["because", "therefore", "but", "also"],
              correct_option: 2,
              explanation: "'But' introduces a contrast between two ideas.",
            },
            {
              question_text: "'___ it was cold, they swam in the lake.' Best connector:",
              options: ["Because", "Although", "Therefore", "Also"],
              correct_option: 1,
              explanation: "'Although' introduces a concessive clause (unexpected contrast).",
            },
            {
              question_text: "Which connector signals a result or consequence?",
              options: ["however", "furthermore", "therefore", "although"],
              correct_option: 2,
              explanation: "'Therefore' indicates a result or logical consequence of what was said before.",
            },
            {
              question_text: "'She studied hard. ___, she got top marks.' Choose the best option.",
              options: ["However", "Although", "As a result", "Because"],
              correct_option: 2,
              explanation: "'As a result' introduces the consequence of a previous action.",
            },
          ],
        },
        {
          id: "english-m2-s3",
          title: "Vocabulario en Contexto",
          theoryContent: `## Estrategias para aprender vocabulario

**1. Inferencia por contexto**
Adivina el significado de palabras desconocidas a partir del resto de la oración.

**2. Familias de palabras**
- happy (adj) → happiness (n) → happily (adv) → unhappy (adj)
- create (v) → creative (adj) → creativity (n) → creator (n)

**3. Prefijos y sufijos comunes**
| Prefijo | Significado | Ejemplo |
|---|---|---|
| un- | negación | unhappy |
| re- | de nuevo | redo |
| pre- | antes | preview |
| over- | exceso | overwork |

| Sufijo | Significado | Ejemplo |
|---|---|---|
| -tion | acción/resultado | education |
| -ful | lleno de | beautiful |
| -less | sin | hopeless |`,
          questions: [
            {
              question_text: "What does the prefix 'un-' mean in 'uncomfortable'?",
              options: ["very", "not / opposite", "again", "before"],
              correct_option: 1,
              explanation: "The prefix 'un-' indicates negation or opposite: uncomfortable = not comfortable.",
            },
            {
              question_text: "Which word is a noun form of 'create'?",
              options: ["creative", "creatively", "creativity", "created"],
              correct_option: 2,
              explanation: "'Creativity' is the noun form of 'create'. The suffix '-ity' forms nouns.",
            },
            {
              question_text: "'The instructions were ___ and easy to follow.' Correct word:",
              options: ["complicated", "ambiguous", "clear", "confusing"],
              correct_option: 2,
              explanation: "Context clue: 'easy to follow' indicates the instructions were 'clear'.",
            },
            {
              question_text: "Which suffix forms an adjective meaning 'without'?",
              options: ["-ful", "-tion", "-less", "-ment"],
              correct_option: 2,
              explanation: "The suffix '-less' means 'without'. Example: hopeless = without hope.",
            },
          ],
        },
        {
          id: "english-m2-s4",
          title: "Reading Comprehension",
          theoryContent: `## Estrategias de Comprensión Lectora

**Skimming** – Leer rápido para captar la idea general.
**Scanning** – Buscar información específica.
**Detailed reading** – Leer con atención para comprender todo.

**Tipos de preguntas frecuentes:**
- Main idea / topic: ¿De qué trata el texto?
- Specific information: ¿Qué dice el texto sobre X?
- Vocabulary in context: ¿Qué significa Y en el párrafo Z?
- Inference: ¿Qué se puede deducir de...?
- Author's purpose: ¿Por qué escribe el autor esto?

**Consejo clave:** Siempre lee las preguntas ANTES de leer el texto para saber qué buscar.`,
          questions: [
            {
              question_text: "What is 'skimming' used for?",
              options: ["Finding a specific word", "Getting a general idea of the text", "Memorizing every detail", "Translating the text"],
              correct_option: 1,
              explanation: "Skimming means reading quickly to get the main idea without reading every word.",
            },
            {
              question_text: "When should you use 'scanning'?",
              options: ["To understand the author's opinion", "To find a specific piece of information", "To read every word carefully", "To summarize a text"],
              correct_option: 1,
              explanation: "Scanning is used to locate specific information (a date, a name, a fact) quickly.",
            },
            {
              question_text: "Which question type asks you to deduce what the author implies?",
              options: ["Main idea", "Specific information", "Inference", "Vocabulary"],
              correct_option: 2,
              explanation: "Inference questions ask you to draw conclusions from information that isn't stated explicitly.",
            },
            {
              question_text: "What is the best strategy before reading an exam text?",
              options: ["Read the text three times slowly", "Read the questions first to know what to look for", "Translate every unknown word", "Skip difficult paragraphs"],
              correct_option: 1,
              explanation: "Reading the questions first helps you focus on relevant parts of the text.",
            },
          ],
        },
      ],
    },
    {
      id: "english-m3",
      title: "Escritura y Pronunciación",
      description: "Redacción de textos, ortografía y pronunciación",
      icon: "✍️",
      sections: [
        {
          id: "english-m3-s1",
          title: "Tipos de Textos",
          theoryContent: `## Principales Tipos de Textos en Inglés

**Email formal:**
- Saludo: Dear Mr./Ms. [Apellido],
- Cierre: Yours sincerely, / Kind regards,
- Lenguaje formal, sin contracciones.

**Email informal:**
- Saludo: Hi [nombre], / Hey!
- Cierre: Best, / Take care,
- Contracciones y lenguaje casual.

**Essay (argumentativo):**
1. Introduction (tesis)
2. Body paragraphs (argumentos + evidencia)
3. Conclusion (resumen y reiteración de tesis)

**Narración:**
Introduce personajes, lugar y conflicto. Usa tiempos pasados.`,
          questions: [
            {
              question_text: "Which closing is appropriate for a formal email?",
              options: ["See you!", "Take care!", "Yours sincerely,", "Bye!"],
              correct_option: 2,
              explanation: "'Yours sincerely' (with a named recipient) or 'Yours faithfully' (without name) are formal email closings.",
            },
            {
              question_text: "In an argumentative essay, where does the thesis statement go?",
              options: ["In the conclusion", "In the middle of the body", "At the beginning (introduction)", "It is not required"],
              correct_option: 2,
              explanation: "The thesis statement appears in the introduction and states the main argument of the essay.",
            },
            {
              question_text: "Which feature is typical of informal writing?",
              options: ["Formal vocabulary", "No contractions", "Contractions like 'I'm', 'don't'", "Passive voice"],
              correct_option: 2,
              explanation: "Informal writing uses contractions, casual vocabulary and a friendly tone.",
            },
            {
              question_text: "Which tense is primarily used in a narrative text?",
              options: ["Present Simple", "Future with 'will'", "Past Simple", "Present Perfect"],
              correct_option: 2,
              explanation: "Narratives describe past events, so they primarily use the Past Simple tense.",
            },
          ],
        },
        {
          id: "english-m3-s2",
          title: "Ortografía y Puntuación",
          theoryContent: `## Reglas Ortográficas Clave

**Adding -ing:**
- Verbs ending in -e: remove e + add -ing → write → writing
- Short verbs with CVC pattern: double final consonant → run → running
- Other verbs: add -ing directly → play → playing

**Adding -ed (regular past):**
- Most verbs: add -ed → walk → walked
- Ending in -e: add -d → live → lived
- Ending in consonant + y: change y→i + add -ed → study → studied
- CVC pattern: double consonant + add -ed → plan → planned

**Puntuación esencial:**
- Comma (,): listas, cláusulas condicionales, after connectors
- Apostrophe ('): contracciones (don't) y posesivos (Mary's)
- Semicolon (;): unir oraciones independientes relacionadas`,
          questions: [
            {
              question_text: "What is the correct -ing form of 'sit'?",
              options: ["siting", "siting", "sitting", "sits"],
              correct_option: 2,
              explanation: "'Sit' follows the CVC pattern (consonant-vowel-consonant). Double the final consonant: sitting.",
            },
            {
              question_text: "What is the past tense of 'study'?",
              options: ["studyed", "studid", "studied", "studed"],
              correct_option: 2,
              explanation: "Verbs ending in consonant + y: change y to i and add -ed → studied.",
            },
            {
              question_text: "Which sentence uses the apostrophe correctly?",
              options: ["Its raining outside.", "The dog wagged it's tail.", "It's a beautiful day.", "The student's are here."],
              correct_option: 2,
              explanation: "'It's' = 'it is' (contraction). 'Its' is the possessive pronoun (no apostrophe).",
            },
            {
              question_text: "What is the correct -ing form of 'write'?",
              options: ["writeing", "writting", "writing", "writng"],
              correct_option: 2,
              explanation: "Verbs ending in silent -e: remove the -e and add -ing → writing.",
            },
          ],
        },
        {
          id: "english-m3-s3",
          title: "Pronunciación y Fonética",
          theoryContent: `## Fundamentos de Pronunciación

**Vocales largas vs cortas:**
- /iː/ (long) – sheep, feet, meet
- /ɪ/ (short) – ship, fit, bit

**Consonantes frecuentemente confundidas:**
- /θ/ (th sin voz) – think, three, bath
- /ð/ (th con voz) – this, that, mother
- /v/ vs /b/ – very ≠ berry | vine ≠ bine
- /w/ vs /v/ – wine ≠ vine

**Acento en palabras de múltiples sílabas:**
- PHOtograph | phoTOgrapher | photoGRAphic

**Entonación básica:**
- Preguntas Yes/No → entonación ascendente ↗
- Preguntas Wh- → entonación descendente ↘`,
          questions: [
            {
              question_text: "In which word is 'th' pronounced as /θ/ (voiceless)?",
              options: ["this", "that", "think", "the"],
              correct_option: 2,
              explanation: "'Think' uses the voiceless /θ/ sound. 'This', 'that' and 'the' use the voiced /ð/.",
            },
            {
              question_text: "Which vowel sound does 'sheep' contain?",
              options: ["/ɪ/ short i", "/iː/ long ee", "/eɪ/ ay", "/æ/ short a"],
              correct_option: 1,
              explanation: "'Sheep' contains the long /iː/ sound, as in feet, meet.",
            },
            {
              question_text: "Where is the stress in 'photograph'?",
              options: ["pho-TO-graph", "PHO-to-graph", "pho-to-GRAPH", "All syllables equally"],
              correct_option: 1,
              explanation: "'PHOtograph' has stress on the first syllable. It shifts in 'phoTOgrapher'.",
            },
            {
              question_text: "Which intonation pattern is used for Yes/No questions?",
              options: ["Falling ↘", "Rising ↗", "Flat →", "It doesn't matter"],
              correct_option: 1,
              explanation: "Yes/No questions typically end with a rising intonation ↗ in English.",
            },
          ],
        },
        {
          id: "english-m3-s4",
          title: "Redacción de Párrafos",
          theoryContent: `## Estructura de un Párrafo Eficaz

Un párrafo bien escrito tiene tres partes:

**1. Topic sentence (oración temática)**
Introduce la idea principal del párrafo.
*Example: "Regular exercise has numerous benefits for mental health."*

**2. Supporting sentences (oraciones de apoyo)**
Desarrollan y evidencian la idea principal.
*Example: "Studies show that 30 minutes of daily exercise reduces anxiety..."*

**3. Concluding sentence (oración de cierre)**
Resume o conecta con la siguiente idea.
*Example: "Clearly, incorporating exercise into daily routines is essential."*

**Consejos:**
- Un párrafo = una idea
- Usa conectores para fluir entre oraciones
- Evita repeticiones innecesarias`,
          questions: [
            {
              question_text: "What is the function of a 'topic sentence'?",
              options: ["To give an example", "To conclude the paragraph", "To introduce the main idea", "To contradict the thesis"],
              correct_option: 2,
              explanation: "The topic sentence states the main idea of the paragraph and sets up what follows.",
            },
            {
              question_text: "How many main ideas should a well-structured paragraph have?",
              options: ["As many as possible", "Two or three", "Only one", "It doesn't matter"],
              correct_option: 2,
              explanation: "A well-structured paragraph focuses on one main idea, developed with supporting details.",
            },
            {
              question_text: "Which sentence best serves as a topic sentence?",
              options: ["However, it was raining.", "Exercise is beneficial.", "In conclusion, we can see that...", "For example, running and swimming..."],
              correct_option: 1,
              explanation: "'Exercise is beneficial' clearly states a main idea that can be developed with supporting details.",
            },
            {
              question_text: "What is the role of the concluding sentence in a paragraph?",
              options: ["Introduce a new topic", "Summarize or close the paragraph's idea", "Provide the first example", "Ask a question"],
              correct_option: 1,
              explanation: "The concluding sentence wraps up the paragraph's idea or transitions to the next paragraph.",
            },
          ],
        },
      ],
    },
  ],
}

// ─── DATABASE ───────────────────────────────────────────────
const databaseSubject: Subject = {
  id: "database",
  title: "Base de Datos",
  description: "Modelos relacionales, SQL, normalización y diseño de BD",
  icon: "🗄️",
  color: "bg-green-500",
  medalIcon: "🥇",
  diagnosticTest: [
    {
      question_text: "¿Qué es una clave primaria (Primary Key)?",
      options: [
        "Un campo que puede tener valores duplicados",
        "Un identificador único para cada fila en una tabla",
        "Una relación entre dos tablas",
        "Un tipo de consulta SQL",
      ],
      correct_option: 1,
      explanation: "La clave primaria identifica de manera única cada fila en una tabla y no puede tener valores nulos ni duplicados.",
    },
    {
      question_text: "¿Cuál es la función del comando SELECT en SQL?",
      options: ["Insertar datos", "Eliminar una tabla", "Recuperar datos de una o más tablas", "Crear una nueva base de datos"],
      correct_option: 2,
      explanation: "SELECT es el comando DML usado para consultar y recuperar datos de las tablas.",
    },
    {
      question_text: "¿Qué significa 'normalización' en bases de datos?",
      options: [
        "Hacer que todos los datos sean del mismo tipo",
        "Organizar la BD para reducir redundancia y dependencias",
        "Cifrar los datos para mayor seguridad",
        "Hacer copias de seguridad",
      ],
      correct_option: 1,
      explanation: "La normalización organiza las tablas y columnas para reducir redundancia de datos y mejorar la integridad.",
    },
    {
      question_text: "¿Qué tipo de JOIN retorna solo las filas con coincidencias en AMBAS tablas?",
      options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"],
      correct_option: 2,
      explanation: "INNER JOIN retorna únicamente las filas donde hay coincidencia en las condiciones de ambas tablas.",
    },
    {
      question_text: "¿Qué es una Foreign Key (Clave Foránea)?",
      options: [
        "Un campo que identifica la tabla",
        "Un campo que referencia la clave primaria de otra tabla",
        "Un índice que acelera búsquedas",
        "Una restricción de campo único",
      ],
      correct_option: 1,
      explanation: "La clave foránea establece y refuerza el vínculo entre dos tablas, referenciando la PK de la tabla padre.",
    },
    {
      question_text: "¿Cuál sentencia SQL se usa para modificar datos existentes?",
      options: ["INSERT", "SELECT", "UPDATE", "ALTER"],
      correct_option: 2,
      explanation: "UPDATE modifica los valores de una o más columnas en filas existentes de una tabla.",
    },
  ],
  modules: [
    {
      id: "database-m1",
      title: "Fundamentos de BD",
      description: "Modelos, entidades, relaciones y tipos de datos",
      icon: "📊",
      sections: [
        {
          id: "database-m1-s1",
          title: "Modelos de Datos",
          theoryContent: `## Modelos de Bases de Datos

**Modelo Relacional**
Organiza datos en tablas (relaciones) con filas y columnas. Es el más usado.
- Tablas (entidades)
- Columnas (atributos)
- Filas (tuplas/registros)

**Modelo Jerárquico**
Los datos se organizan en árbol (padre-hijo). Ejemplo: sistema de archivos.

**Modelo de Red**
Extensión del jerárquico que permite múltiples padres.

**Modelo Orientado a Objetos**
Los datos se almacenan como objetos (similar a POO).

**Modelo NoSQL**
- Documental (MongoDB)
- Clave-Valor (Redis)
- Columnar (Cassandra)
- Grafos (Neo4j)`,
          questions: [
            {
              question_text: "¿Qué modelo organiza datos en tablas con filas y columnas?",
              options: ["Modelo Jerárquico", "Modelo de Red", "Modelo Relacional", "Modelo de Grafos"],
              correct_option: 2,
              explanation: "El modelo relacional, introducido por Codd en 1970, usa tablas bidimensionales.",
            },
            {
              question_text: "¿Cuál es un ejemplo de base de datos NoSQL documental?",
              options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
              correct_option: 2,
              explanation: "MongoDB es una BD documental NoSQL que almacena datos en documentos tipo JSON.",
            },
            {
              question_text: "En el modelo relacional, ¿cómo se llama cada fila de una tabla?",
              options: ["Atributo", "Columna", "Dominio", "Tupla"],
              correct_option: 3,
              explanation: "Cada fila en una tabla relacional se denomina tupla o registro.",
            },
            {
              question_text: "¿Qué BD se usa principalmente para almacenar pares clave-valor?",
              options: ["Oracle", "Redis", "PostgreSQL", "MySQL"],
              correct_option: 1,
              explanation: "Redis es una BD en memoria tipo clave-valor, usada principalmente para caché.",
            },
          ],
        },
        {
          id: "database-m1-s2",
          title: "Modelo Entidad-Relación",
          theoryContent: `## Diagrama Entidad-Relación (ER)

El modelo ER es una herramienta para diseñar la estructura de la BD antes de implementarla.

**Componentes:**
- **Entidad**: Objeto del mundo real (Estudiante, Curso)
- **Atributo**: Propiedad de una entidad (Nombre, ID)
- **Relación**: Asociación entre entidades (Estudiante inscrito en Curso)

**Tipos de cardinalidad:**
- 1:1 (uno a uno)
- 1:N (uno a muchos)
- M:N (muchos a muchos)

**Atributos especiales:**
- Clave (identificador único)
- Multivalorado (teléfonos múltiples)
- Derivado (edad calculada desde fecha nacimiento)
- Compuesto (dirección = calle + ciudad + código)`,
          questions: [
            {
              question_text: "¿Qué representa una 'entidad' en el modelo ER?",
              options: ["Una relación entre tablas", "Un objeto del mundo real con existencia independiente", "Una consulta SQL", "Un tipo de índice"],
              correct_option: 1,
              explanation: "Una entidad representa un objeto del mundo real (persona, lugar, cosa) que tiene existencia propia.",
            },
            {
              question_text: "¿Qué tipo de cardinalidad describe que UN profesor puede impartir VARIOS cursos?",
              options: ["1:1", "1:N", "M:N", "N:1"],
              correct_option: 1,
              explanation: "1:N (uno a muchos): un profesor ↔ varios cursos. El '1' está del lado del profesor.",
            },
            {
              question_text: "¿Cuál es un atributo 'derivado'?",
              options: ["Un atributo con múltiples valores", "Un atributo calculado a partir de otros", "Un atributo compuesto", "El identificador único"],
              correct_option: 1,
              explanation: "Un atributo derivado se calcula a partir de otros atributos. Ejemplo: edad (calculada desde fecha de nacimiento).",
            },
            {
              question_text: "Una relación M:N entre Estudiantes y Cursos requiere:",
              options: ["Nada extra", "Una tabla intermedia (tabla de asociación)", "Eliminar una de las tablas", "Usar solo claves foráneas directas"],
              correct_option: 1,
              explanation: "Las relaciones M:N se implementan con una tabla intermedia que contiene las FK de ambas entidades.",
            },
          ],
        },
        {
          id: "database-m1-s3",
          title: "Tipos de Datos en SQL",
          theoryContent: `## Tipos de Datos en SQL

**Numéricos:**
- INT / INTEGER – enteros
- BIGINT – enteros grandes
- DECIMAL(p,s) / NUMERIC – decimales exactos
- FLOAT / REAL – decimales aproximados

**Cadenas de texto:**
- CHAR(n) – longitud fija
- VARCHAR(n) – longitud variable (hasta n)
- TEXT – texto largo sin límite

**Fecha y hora:**
- DATE – solo fecha (YYYY-MM-DD)
- TIME – solo hora
- DATETIME / TIMESTAMP – fecha + hora

**Lógico:**
- BOOLEAN / BOOL – TRUE o FALSE

**Binarios:**
- BLOB – datos binarios (imágenes, archivos)`,
          questions: [
            {
              question_text: "¿Qué tipo de dato se usa para almacenar texto de longitud variable hasta 255 caracteres?",
              options: ["CHAR(255)", "VARCHAR(255)", "TEXT", "BLOB"],
              correct_option: 1,
              explanation: "VARCHAR(n) almacena texto de longitud variable hasta n caracteres, eficiente en espacio.",
            },
            {
              question_text: "¿Cuál es la diferencia entre CHAR y VARCHAR?",
              options: ["No hay diferencia", "CHAR es de longitud fija; VARCHAR es de longitud variable", "CHAR acepta números; VARCHAR no", "VARCHAR solo acepta mayúsculas"],
              correct_option: 1,
              explanation: "CHAR(n) siempre ocupa n bytes (rellena con espacios). VARCHAR(n) ocupa solo los bytes necesarios.",
            },
            {
              question_text: "Para guardar el precio de un producto (ej. 19.99), ¿qué tipo es más apropiado?",
              options: ["INT", "VARCHAR", "DECIMAL(10,2)", "BOOLEAN"],
              correct_option: 2,
              explanation: "DECIMAL(10,2) guarda valores exactos con 2 decimales, ideal para valores monetarios.",
            },
            {
              question_text: "¿Qué tipo de dato almacena valores TRUE o FALSE?",
              options: ["INT", "CHAR(1)", "BOOLEAN", "BIT"],
              correct_option: 2,
              explanation: "BOOLEAN (o BOOL) almacena valores lógicos: TRUE o FALSE.",
            },
          ],
        },
        {
          id: "database-m1-s4",
          title: "Integridad y Restricciones",
          theoryContent: `## Restricciones (Constraints)

Las restricciones aseguran la integridad y coherencia de los datos.

**PRIMARY KEY**
Identifica de forma única cada fila. No permite NULL ni duplicados.

**FOREIGN KEY**
Referencia la PK de otra tabla. Asegura integridad referencial.

**UNIQUE**
Garantiza que todos los valores en una columna sean distintos.

**NOT NULL**
El campo no puede quedar vacío.

**CHECK**
Define una condición que los valores deben cumplir.
\`\`\`sql
CHECK (edad >= 18)
CHECK (salario > 0)
\`\`\`

**DEFAULT**
Asigna un valor por defecto si no se proporciona.
\`\`\`sql
status VARCHAR(20) DEFAULT 'activo'
\`\`\``,
          questions: [
            {
              question_text: "¿Qué restricción garantiza que no haya valores NULL en una columna?",
              options: ["UNIQUE", "PRIMARY KEY", "NOT NULL", "CHECK"],
              correct_option: 2,
              explanation: "NOT NULL impide que una columna acepte valores vacíos/nulos.",
            },
            {
              question_text: "¿Qué hace la restricción CHECK?",
              options: ["Crea un índice", "Define una condición que los valores deben cumplir", "Establece un valor predeterminado", "Enlaza dos tablas"],
              correct_option: 1,
              explanation: "CHECK define una regla de validación. Si el valor insertado no cumple la condición, se rechaza.",
            },
            {
              question_text: "¿Puede una tabla tener múltiples columnas con restricción UNIQUE?",
              options: ["No, solo una", "Sí, varias columnas pueden tener UNIQUE", "Solo si son claves foráneas", "Solo con permiso especial"],
              correct_option: 1,
              explanation: "Una tabla puede tener múltiples columnas UNIQUE. Cada una garantiza unicidad independientemente.",
            },
            {
              question_text: "¿Qué ocurre si intentas insertar un valor que viola una FOREIGN KEY?",
              options: ["El valor se inserta igual", "Se genera un error de integridad referencial", "El registro padre se elimina", "La FK se ignora"],
              correct_option: 1,
              explanation: "Violar una FK genera un error de integridad referencial. El dato no se inserta.",
            },
          ],
        },
      ],
    },
    {
      id: "database-m2",
      title: "SQL Fundamental",
      description: "DDL, DML, consultas y operadores",
      icon: "💻",
      sections: [
        {
          id: "database-m2-s1",
          title: "DDL – Definición de Datos",
          theoryContent: `## DDL (Data Definition Language)

Los comandos DDL definen la estructura de la base de datos.

**CREATE** – Crea objetos (tablas, vistas, índices)
\`\`\`sql
CREATE TABLE estudiantes (
  id INT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  edad INT CHECK (edad >= 0)
);
\`\`\`

**ALTER** – Modifica la estructura de un objeto existente
\`\`\`sql
ALTER TABLE estudiantes ADD COLUMN telefono VARCHAR(15);
ALTER TABLE estudiantes DROP COLUMN telefono;
\`\`\`

**DROP** – Elimina un objeto permanentemente
\`\`\`sql
DROP TABLE estudiantes;
\`\`\`

**TRUNCATE** – Vacía una tabla (más rápido que DELETE sin WHERE)
\`\`\`sql
TRUNCATE TABLE estudiantes;
\`\`\``,
          questions: [
            {
              question_text: "¿Qué comando DDL se usa para agregar una nueva columna a una tabla existente?",
              options: ["CREATE", "INSERT", "ALTER TABLE ... ADD COLUMN", "UPDATE"],
              correct_option: 2,
              explanation: "ALTER TABLE con ADD COLUMN modifica la estructura de una tabla existente para agregar nuevas columnas.",
            },
            {
              question_text: "¿Cuál es la diferencia entre DROP TABLE y TRUNCATE?",
              options: ["No hay diferencia", "DROP elimina la tabla y su estructura; TRUNCATE solo borra los datos", "TRUNCATE elimina la tabla; DROP solo borra datos", "DROP es más rápido"],
              correct_option: 1,
              explanation: "DROP TABLE elimina tabla + estructura. TRUNCATE elimina todos los datos pero conserva la estructura.",
            },
            {
              question_text: "¿A qué categoría pertenece el comando CREATE TABLE?",
              options: ["DML", "DCL", "DDL", "TCL"],
              correct_option: 2,
              explanation: "CREATE es un comando DDL (Data Definition Language) que define la estructura de la BD.",
            },
            {
              question_text: "¿Se puede recuperar una tabla eliminada con DROP TABLE sin backup?",
              options: ["Sí, siempre", "Solo si hay transacción abierta (en algunos SGBD)", "Nunca", "Solo con el comando RESTORE"],
              correct_option: 1,
              explanation: "En la mayoría de SGBD, DROP dentro de una transacción abierta puede revertirse. Sin transacción, es irreversible.",
            },
          ],
        },
        {
          id: "database-m2-s2",
          title: "DML – Manipulación de Datos",
          theoryContent: `## DML (Data Manipulation Language)

Los comandos DML manipulan los datos dentro de las tablas.

**INSERT** – Inserta nuevas filas
\`\`\`sql
INSERT INTO estudiantes (nombre, email, edad)
VALUES ('Ana García', 'ana@mail.com', 20);
\`\`\`

**SELECT** – Consulta datos
\`\`\`sql
SELECT nombre, edad FROM estudiantes WHERE edad > 18;
\`\`\`

**UPDATE** – Modifica datos existentes
\`\`\`sql
UPDATE estudiantes SET email = 'nuevo@mail.com' WHERE id = 1;
\`\`\`

**DELETE** – Elimina filas
\`\`\`sql
DELETE FROM estudiantes WHERE edad < 18;
\`\`\`

⚠️ **Siempre usar WHERE en UPDATE y DELETE para evitar modificar toda la tabla.**`,
          questions: [
            {
              question_text: "¿Qué ocurre si ejecutas UPDATE sin cláusula WHERE?",
              options: ["No hace nada", "Genera un error", "Actualiza TODAS las filas de la tabla", "Solo actualiza la primera fila"],
              correct_option: 2,
              explanation: "Sin WHERE, UPDATE afecta a todas las filas. Siempre especifica una condición para evitar cambios masivos.",
            },
            {
              question_text: "¿Qué comando inserta nuevas filas en una tabla?",
              options: ["UPDATE", "ADD", "INSERT INTO", "CREATE"],
              correct_option: 2,
              explanation: "INSERT INTO tabla (columnas) VALUES (valores) es el comando para agregar nuevas filas.",
            },
            {
              question_text: "¿Cuál es la sintaxis correcta para eliminar estudiantes menores de 18 años?",
              options: [
                "REMOVE FROM estudiantes WHERE edad < 18",
                "DELETE FROM estudiantes WHERE edad < 18",
                "DROP FROM estudiantes WHERE edad < 18",
                "ERASE estudiantes WHERE edad < 18",
              ],
              correct_option: 1,
              explanation: "La sintaxis correcta es DELETE FROM tabla WHERE condición.",
            },
            {
              question_text: "¿A qué categoría pertenece el comando SELECT?",
              options: ["DDL", "DML", "DCL", "TCL"],
              correct_option: 1,
              explanation: "SELECT es DML (Data Manipulation Language), aunque algunos lo clasifican como DQL (Data Query Language).",
            },
          ],
        },
        {
          id: "database-m2-s3",
          title: "Consultas Avanzadas SELECT",
          theoryContent: `## Cláusulas del SELECT

\`\`\`sql
SELECT columnas
FROM tabla
WHERE condición
GROUP BY columna
HAVING condición_grupo
ORDER BY columna [ASC|DESC]
LIMIT n;
\`\`\`

**ORDER BY**: Ordena resultados
\`\`\`sql
SELECT * FROM productos ORDER BY precio DESC;
\`\`\`

**GROUP BY + Funciones de agregación**
\`\`\`sql
SELECT categoria, COUNT(*) AS total, AVG(precio) AS promedio
FROM productos
GROUP BY categoria;
\`\`\`

**HAVING**: Filtra grupos (como WHERE pero para grupos)
\`\`\`sql
SELECT categoria, COUNT(*) AS total
FROM productos
GROUP BY categoria
HAVING COUNT(*) > 5;
\`\`\`

**Funciones de agregación:** COUNT, SUM, AVG, MAX, MIN`,
          questions: [
            {
              question_text: "¿Cuál es la diferencia entre WHERE y HAVING?",
              options: [
                "No hay diferencia",
                "WHERE filtra filas antes de agrupar; HAVING filtra grupos después de GROUP BY",
                "HAVING filtra filas; WHERE filtra columnas",
                "WHERE se usa con JOINs; HAVING no",
              ],
              correct_option: 1,
              explanation: "WHERE filtra filas individuales antes del agrupamiento. HAVING filtra los resultados del GROUP BY.",
            },
            {
              question_text: "¿Qué función cuenta el número de filas?",
              options: ["SUM()", "AVG()", "COUNT()", "MAX()"],
              correct_option: 2,
              explanation: "COUNT(*) cuenta todas las filas; COUNT(columna) excluye NULLs.",
            },
            {
              question_text: "¿Cómo se ordenan resultados de mayor a menor precio?",
              options: ["ORDER BY precio ASC", "ORDER BY precio DESC", "SORT BY precio", "GROUP BY precio DESC"],
              correct_option: 1,
              explanation: "ORDER BY columna DESC ordena de mayor a menor (descendente).",
            },
            {
              question_text: "¿Qué hace LIMIT 10 en una consulta SELECT?",
              options: ["Limita las columnas devueltas a 10", "Retorna solo las primeras 10 filas", "Filtra filas con valor menor a 10", "Crea un índice de 10 filas"],
              correct_option: 1,
              explanation: "LIMIT n restringe el número de filas devueltas por la consulta.",
            },
          ],
        },
        {
          id: "database-m2-s4",
          title: "JOINs en SQL",
          theoryContent: `## Tipos de JOIN

Los JOINs combinan filas de dos o más tablas según una condición.

**INNER JOIN**
Solo filas con coincidencia en AMBAS tablas.
\`\`\`sql
SELECT e.nombre, c.titulo
FROM estudiantes e
INNER JOIN inscripciones i ON e.id = i.estudiante_id
INNER JOIN cursos c ON i.curso_id = c.id;
\`\`\`

**LEFT JOIN (LEFT OUTER JOIN)**
Todas las filas de la tabla izquierda + coincidencias de la derecha (NULL si no hay).

**RIGHT JOIN**
Todas las filas de la tabla derecha + coincidencias de la izquierda.

**FULL OUTER JOIN**
Todas las filas de ambas tablas, NULL donde no hay coincidencia.

**CROSS JOIN**
Producto cartesiano: todas las combinaciones posibles.`,
          questions: [
            {
              question_text: "¿Qué tipo de JOIN incluye TODAS las filas de la tabla izquierda, haya o no coincidencia?",
              options: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "CROSS JOIN"],
              correct_option: 2,
              explanation: "LEFT JOIN retorna todas las filas de la tabla izquierda. Si no hay coincidencia en la derecha, aparece NULL.",
            },
            {
              question_text: "¿Cuántas filas produce un CROSS JOIN entre tabla A (3 filas) y tabla B (4 filas)?",
              options: ["3", "4", "7", "12"],
              correct_option: 3,
              explanation: "CROSS JOIN es el producto cartesiano: 3 × 4 = 12 combinaciones.",
            },
            {
              question_text: "¿Qué JOIN retorna solo filas con coincidencia en ambas tablas?",
              options: ["LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "INNER JOIN"],
              correct_option: 3,
              explanation: "INNER JOIN es el más restrictivo: solo incluye filas donde la condición se cumple en ambas tablas.",
            },
            {
              question_text: "Si una columna aparece como NULL en el resultado de un LEFT JOIN, significa:",
              options: ["Error en la consulta", "No existe un registro coincidente en la tabla derecha", "El valor fue eliminado", "Es un valor calculado"],
              correct_option: 1,
              explanation: "En LEFT JOIN, NULL en columnas de la tabla derecha indica que no hay registro coincidente para esa fila izquierda.",
            },
          ],
        },
      ],
    },
    {
      id: "database-m3",
      title: "Diseño y Optimización",
      description: "Normalización, índices, transacciones y seguridad",
      icon: "⚙️",
      sections: [
        {
          id: "database-m3-s1",
          title: "Normalización",
          theoryContent: `## Formas Normales

La normalización reduce redundancia y mejora la integridad de datos.

**Primera Forma Normal (1FN)**
- Todos los atributos son atómicos (no divisibles)
- No hay grupos repetitivos

**Segunda Forma Normal (2FN)**
- Cumple 1FN
- Todo atributo no clave depende de TODA la clave primaria (no de parte de ella)

**Tercera Forma Normal (3FN)**
- Cumple 2FN
- No hay dependencias transitivas (atributo no clave → otro atributo no clave)

**BCNF (Boyce-Codd NF)**
- Versión más estricta de 3FN

**Regla general:** "Los hechos no clave dependen de la clave, toda la clave y nada más que la clave."`,
          questions: [
            {
              question_text: "¿Qué elimina principalmente la Primera Forma Normal (1FN)?",
              options: ["Dependencias transitivas", "Dependencias parciales", "Grupos repetitivos y atributos no atómicos", "Claves foráneas"],
              correct_option: 2,
              explanation: "1FN requiere que todos los valores sean atómicos y elimina grupos repetitivos (ej: múltiples teléfonos en una columna).",
            },
            {
              question_text: "¿Cuál es el objetivo principal de la normalización?",
              options: ["Hacer consultas más lentas", "Reducir redundancia de datos y dependencias anómalas", "Aumentar el número de tablas", "Eliminar todas las claves"],
              correct_option: 1,
              explanation: "La normalización reduce redundancia, evita anomalías de inserción/actualización/eliminación y mejora integridad.",
            },
            {
              question_text: "Una tabla en 2FN requiere que todos los atributos no clave dependan de:",
              options: ["Solo una parte de la clave compuesta", "Toda la clave primaria completa", "Otros atributos no clave", "La clave foránea"],
              correct_option: 1,
              explanation: "2FN elimina dependencias parciales: todo atributo no clave debe depender de la PK completa.",
            },
            {
              question_text: "¿Qué tipo de dependencia elimina la 3FN?",
              options: ["Dependencias parciales", "Dependencias transitivas", "Dependencias circulares", "Dependencias de clave foránea"],
              correct_option: 1,
              explanation: "3FN elimina dependencias transitivas: A→B→C donde B no es clave. La solución es crear una nueva tabla para B→C.",
            },
          ],
        },
        {
          id: "database-m3-s2",
          title: "Índices y Rendimiento",
          theoryContent: `## Índices en Bases de Datos

Un índice acelera las búsquedas al igual que el índice de un libro.

**Crear un índice:**
\`\`\`sql
CREATE INDEX idx_apellido ON empleados(apellido);
CREATE UNIQUE INDEX idx_email ON usuarios(email);
\`\`\`

**Ventajas:**
- Búsquedas mucho más rápidas (O(log n) vs O(n))
- Excelente para columnas usadas en WHERE, JOIN, ORDER BY

**Desventajas:**
- Ocupan espacio en disco
- Ralentizan INSERT, UPDATE, DELETE (el índice se actualiza)

**Tipos de índices:**
- **B-Tree**: El más común. Bueno para comparaciones (=, <, >, BETWEEN)
- **Hash**: Solo para igualdad exacta (=)
- **Full-Text**: Para búsqueda de texto completo
- **Composite**: Índice sobre varias columnas

**EXPLAIN / EXPLAIN ANALYZE**: Muestra el plan de ejecución de una consulta.`,
          questions: [
            {
              question_text: "¿Cuál es el principal beneficio de un índice de base de datos?",
              options: ["Reduce el tamaño de la tabla", "Acelera la búsqueda y recuperación de datos", "Elimina duplicados automáticamente", "Protege los datos con cifrado"],
              correct_option: 1,
              explanation: "Un índice permite localizar filas rápidamente sin escanear toda la tabla.",
            },
            {
              question_text: "¿En qué operaciones puede un índice PERJUDICAR el rendimiento?",
              options: ["SELECT con WHERE", "ORDER BY", "INSERT, UPDATE, DELETE", "GROUP BY"],
              correct_option: 2,
              explanation: "INSERT, UPDATE y DELETE deben actualizar también el índice, lo que agrega overhead.",
            },
            {
              question_text: "¿Qué tipo de índice es más adecuado para búsquedas de igualdad exacta?",
              options: ["B-Tree", "Full-Text", "Hash", "Composite"],
              correct_option: 2,
              explanation: "El índice Hash es óptimo para igualdad (=) pero no soporta rangos o comparaciones.",
            },
            {
              question_text: "¿Para qué se usa EXPLAIN en SQL?",
              options: ["Para agregar comentarios al código", "Para ver el plan de ejecución de una consulta", "Para crear índices automáticamente", "Para documentar tablas"],
              correct_option: 1,
              explanation: "EXPLAIN muestra cómo el motor va a ejecutar la consulta: qué índices usa, el costo estimado, etc.",
            },
          ],
        },
        {
          id: "database-m3-s3",
          title: "Transacciones y ACID",
          theoryContent: `## Transacciones

Una transacción es un conjunto de operaciones que se ejecutan como una unidad.

**Propiedades ACID:**
- **A – Atomicidad**: Todo o nada. Si falla una parte, se revierte todo.
- **C – Consistencia**: La BD pasa de un estado válido a otro válido.
- **I – Aislamiento**: Las transacciones concurrentes no se interfieren.
- **D – Durabilidad**: Los cambios confirmados persisten aunque el sistema falle.

**Comandos TCL:**
\`\`\`sql
BEGIN;                    -- Inicia la transacción
UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;
UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;
COMMIT;                   -- Confirma los cambios
-- o
ROLLBACK;                 -- Revierte todos los cambios
\`\`\`

**SAVEPOINT**: Punto de guardado dentro de la transacción.
\`\`\`sql
SAVEPOINT sp1;
ROLLBACK TO sp1;
\`\`\``,
          questions: [
            {
              question_text: "¿Qué significa la propiedad 'A' de ACID?",
              options: ["Autorización", "Atomicidad – la transacción es todo o nada", "Agilidad", "Autenticación"],
              correct_option: 1,
              explanation: "Atomicidad garantiza que todas las operaciones de la transacción se completan o ninguna lo hace.",
            },
            {
              question_text: "¿Qué hace ROLLBACK en una transacción?",
              options: ["Confirma los cambios permanentemente", "Revierte todos los cambios de la transacción", "Inicia una nueva transacción", "Crea un punto de guardado"],
              correct_option: 1,
              explanation: "ROLLBACK deshace todos los cambios realizados desde el BEGIN de la transacción actual.",
            },
            {
              question_text: "La propiedad 'D' (Durabilidad) garantiza que:",
              options: [
                "Los datos son legibles por todos los usuarios",
                "Los cambios confirmados persisten incluso ante fallos del sistema",
                "Las transacciones se ejecutan en tiempo real",
                "Los datos se eliminan automáticamente",
              ],
              correct_option: 1,
              explanation: "Durabilidad asegura que una vez hecho el COMMIT, los datos persisten aunque el servidor se reinicie.",
            },
            {
              question_text: "En una transferencia bancaria (débito + crédito), ¿qué propiedad ACID es más crítica?",
              options: ["Consistencia", "Aislamiento", "Atomicidad", "Durabilidad"],
              correct_option: 2,
              explanation: "Atomicidad es crucial: si falla el débito o el crédito, ambas operaciones deben revertirse para evitar inconsistencias.",
            },
          ],
        },
        {
          id: "database-m3-s4",
          title: "Seguridad y Permisos",
          theoryContent: `## DCL – Data Control Language

Los comandos DCL controlan el acceso a los datos.

**GRANT** – Concede permisos
\`\`\`sql
GRANT SELECT, INSERT ON estudiantes TO usuario_app;
GRANT ALL PRIVILEGES ON DATABASE mi_bd TO admin_user;
\`\`\`

**REVOKE** – Revoca permisos
\`\`\`sql
REVOKE INSERT ON estudiantes FROM usuario_app;
\`\`\`

**Roles**
Agrupan permisos para asignarlos a múltiples usuarios.
\`\`\`sql
CREATE ROLE rol_lectura;
GRANT SELECT ON ALL TABLES TO rol_lectura;
GRANT rol_lectura TO usuario1, usuario2;
\`\`\`

**Principio de mínimo privilegio:**
Dar a cada usuario solo los permisos que necesita para su función.

**Vistas como capa de seguridad:**
\`\`\`sql
CREATE VIEW vista_publica AS
SELECT id, nombre FROM empleados; -- oculta salario, etc.
\`\`\``,
          questions: [
            {
              question_text: "¿Qué comando concede permisos a un usuario en SQL?",
              options: ["ALLOW", "PERMIT", "GRANT", "ASSIGN"],
              correct_option: 2,
              explanation: "GRANT es el comando DCL para otorgar privilegios sobre objetos de la base de datos.",
            },
            {
              question_text: "¿Qué es el 'principio de mínimo privilegio'?",
              options: [
                "Dar acceso de administrador a todos los usuarios",
                "Dar a cada usuario solo los permisos estrictamente necesarios",
                "Eliminar todos los permisos por defecto",
                "Compartir contraseñas entre usuarios del mismo rol",
              ],
              correct_option: 1,
              explanation: "El principio de mínimo privilegio reduce el riesgo de seguridad limitando el acceso a lo estrictamente necesario.",
            },
            {
              question_text: "¿Cómo puede una vista mejorar la seguridad?",
              options: [
                "Cifra los datos automáticamente",
                "Expone solo las columnas autorizadas, ocultando datos sensibles",
                "Elimina usuarios no autorizados",
                "Crea copias de seguridad automáticas",
              ],
              correct_option: 1,
              explanation: "Las vistas actúan como una 'ventana' a la tabla, mostrando solo las columnas/filas autorizadas.",
            },
            {
              question_text: "¿Qué hace REVOKE?",
              options: ["Concede nuevos permisos", "Elimina un usuario", "Quita permisos previamente otorgados", "Crea un nuevo rol"],
              correct_option: 2,
              explanation: "REVOKE retira permisos que fueron concedidos anteriormente con GRANT.",
            },
          ],
        },
      ],
    },
  ],
}

// ─── SUBJECTS REGISTRY ──────────────────────────────────────
export const SUBJECTS: Subject[] = [englishSubject, databaseSubject]

export function getSubjectById(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id)
}

export function getModuleById(subjectId: string, moduleId: string): SubjectModule | undefined {
  return getSubjectById(subjectId)?.modules.find((m) => m.id === moduleId)
}

export function getSectionById(subjectId: string, moduleId: string, sectionId: string): SubjectSection | undefined {
  return getModuleById(subjectId, moduleId)?.sections.find((s) => s.id === sectionId)
}