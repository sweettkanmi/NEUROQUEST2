// app/api/subjects/create-quiz/route.ts
// Creates a game session from static subject questions (no PDF, no AI needed).
// Then records the link in subject_game_sessions for progress tracking.
// ⚠️ Does NOT touch /api/game/create — uses same DB tables directly.

import { createClient } from "@/lib/supabase/server"
import { getSubjectById } from "@/lib/subjects/config"

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 })
  }

  try {
    const { subjectId, moduleId, sectionId, quizType } = await req.json()

    if (!subjectId || !quizType) {
      return Response.json({ error: "Faltan datos" }, { status: 400 })
    }

    const subject = getSubjectById(subjectId)
    if (!subject) {
      return Response.json({ error: "Materia no encontrada" }, { status: 404 })
    }

    // ── Resolve the questions depending on quiz type ──────
    let questions: {
      question_text: string
      options: string[]
      correct_option: number
      explanation: string
    }[] = []

    if (quizType === "diagnostic") {
      questions = subject.diagnosticTest
    } else if (quizType === "section" && moduleId && sectionId) {
      const module = subject.modules.find((m) => m.id === moduleId)
      const section = module?.sections.find((s) => s.id === sectionId)
      if (!section) {
        return Response.json({ error: "Sección no encontrada" }, { status: 404 })
      }
      questions = section.questions
    } else {
      return Response.json({ error: "Tipo de quiz inválido" }, { status: 400 })
    }

    // ── Create game session (same table as existing system) ──
    const sessionName =
      quizType === "diagnostic"
        ? `${subject.title} – Diagnóstico`
        : (() => {
            const mod = subject.modules.find((m) => m.id === moduleId)
            const sec = mod?.sections.find((s) => s.id === sectionId)
            return `${subject.title}: ${sec?.title ?? "Quiz"}`
          })()

    const { data: session, error: sessionError } = await supabase
      .from("game_sessions")
      .insert({
        user_id: user.id,
        pdf_name: sessionName,
        difficulty: "normal",
        total_questions: questions.length,
        lives_remaining: 3,
        status: "in_progress",
      })
      .select("id")
      .single()

    if (sessionError || !session) {
      console.error("Session error:", sessionError)
      return Response.json({ error: "Error al crear la sesión" }, { status: 500 })
    }

    // ── Insert questions (same table as existing system) ───
    const questionsToInsert = questions.map((q, index) => ({
      session_id: session.id,
      user_id: user.id,
      question_text: q.question_text,
      options: q.options,
      correct_option: q.correct_option,
      explanation: q.explanation,
      difficulty: "normal",
      question_index: index,
    }))

    const { error: questionsError } = await supabase
      .from("questions")
      .insert(questionsToInsert)

    if (questionsError) {
      console.error("Questions error:", questionsError)
      return Response.json({ error: "Error al guardar preguntas" }, { status: 500 })
    }

    // ── Link session to its subject context ───────────────
    const { error: linkError } = await supabase.from("subject_game_sessions").insert({
      user_id: user.id,
      session_id: session.id,
      subject_id: subjectId,
      module_id: moduleId ?? null,
      section_id: sectionId ?? null,
      quiz_type: quizType,
    })

    if (linkError) {
      console.error("Link error:", linkError)
      // Non-fatal — session still works, progress just won't auto-save
    }

    return Response.json({ sessionId: session.id })
  } catch (err) {
    console.error("Subject quiz create error:", err)
    return Response.json({ error: "Error interno" }, { status: 500 })
  }
}