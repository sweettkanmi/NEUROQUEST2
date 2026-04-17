import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import { DIFFICULTY_CONFIG } from "@/lib/types"

// Use the official Anthropic SDK directly — no AI SDK version conflicts
const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface GeneratedQuestion {
  question_text: string
  options: string[]
  correct_option: number
  explanation: string
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const pdfFile = formData.get("pdf") as File | null
    const difficulty = (formData.get("difficulty") as string) || "normal"

    if (!pdfFile) {
      return Response.json({ error: "No se envio el PDF" }, { status: 400 })
    }

    const validDifficulty = difficulty as keyof typeof DIFFICULTY_CONFIG
    const config = DIFFICULTY_CONFIG[validDifficulty] || DIFFICULTY_CONFIG.normal
    const numQuestions = config.questions

    // Extract PDF as base64
    const pdfBuffer = await pdfFile.arrayBuffer()
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64")

    // Generate questions using the official Anthropic SDK
    const response = await anthropicClient.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: pdfBase64,
              },
            },
            {
              type: "text",
              text: `Eres un experto creando preguntas de examen. Analiza el documento PDF adjunto y genera exactamente ${numQuestions} preguntas de opcion multiple en espanol.

Responde UNICAMENTE con un objeto JSON valido con esta estructura exacta, sin texto adicional, sin markdown, sin bloques de codigo:
{
  "questions": [
    {
      "question_text": "Texto de la pregunta",
      "options": ["Opcion A", "Opcion B", "Opcion C", "Opcion D"],
      "correct_option": 0,
      "explanation": "Explicacion breve de por que esta respuesta es correcta"
    }
  ]
}

Reglas:
- Genera exactamente ${numQuestions} preguntas
- Cada pregunta tiene exactamente 4 opciones (indices 0, 1, 2, 3)
- correct_option es el indice (0-3) de la opcion correcta
- Dificultad: ${config.label}
- Las preguntas deben cubrir los conceptos clave del documento
- Las opciones incorrectas deben ser plausibles
- Varia el tipo: conceptuales, aplicacion, analisis`,
            },
          ],
        },
      ],
    })

    // Parse the JSON response
    const content = response.content[0]
    if (content.type !== "text") {
      return Response.json({ error: "Respuesta inesperada del modelo" }, { status: 500 })
    }

    let parsed: { questions: GeneratedQuestion[] }
    try {
      // Strip any accidental markdown fences
      const cleaned = content.text.replace(/```json\n?|\n?```/g, "").trim()
      parsed = JSON.parse(cleaned)
    } catch {
      console.error("JSON parse error, raw response:", content.text.substring(0, 500))
      return Response.json({ error: "Error al parsear las preguntas generadas" }, { status: 500 })
    }

    if (!parsed.questions || parsed.questions.length === 0) {
      return Response.json({ error: "No se pudieron generar preguntas" }, { status: 500 })
    }

    // Validate each question
    const questions = parsed.questions.filter(
      (q) =>
        q.question_text &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correct_option === "number" &&
        q.correct_option >= 0 &&
        q.correct_option <= 3
    )

    if (questions.length === 0) {
      return Response.json({ error: "Las preguntas generadas no son validas" }, { status: 500 })
    }

    // Create game session
    const { data: session, error: sessionError } = await supabase
      .from("game_sessions")
      .insert({
        user_id: user.id,
        pdf_name: pdfFile.name.replace(".pdf", ""),
        difficulty: validDifficulty,
        total_questions: questions.length,
        lives_remaining: 3,
        status: "in_progress",
      })
      .select("id")
      .single()

    if (sessionError || !session) {
      console.error("Session error:", sessionError)
      return Response.json({ error: "Error al crear la sesion" }, { status: 500 })
    }

    // Insert questions
    const questionsToInsert = questions.map((q, index) => ({
      session_id: session.id,
      user_id: user.id,
      question_text: q.question_text,
      options: q.options,
      correct_option: q.correct_option,
      explanation: q.explanation || "",
      difficulty: validDifficulty,
      question_index: index,
    }))

    const { error: questionsError } = await supabase
      .from("questions")
      .insert(questionsToInsert)

    if (questionsError) {
      console.error("Questions error:", questionsError)
      return Response.json({ error: "Error al guardar preguntas" }, { status: 500 })
    }

    return Response.json({ sessionId: session.id })
  } catch (err) {
    console.error("Game create error:", err)
    return Response.json(
      { error: "Error al procesar el PDF" },
      { status: 500 }
    )
  }
}