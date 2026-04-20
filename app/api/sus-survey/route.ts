import { createClient } from "@/lib/supabase/server"

interface SusSurveyPayload {
  q1: number
  q2: number
  q3: number
  q4: number
  q5: number
  q6: number
  q7: number
  q8: number
  q9: number
  q10: number
}

// Calcula el puntaje SUS segun la metodologia estandar
// Preguntas impares (1,3,5,7,9): restar 1 del valor
// Preguntas pares (2,4,6,8,10): restar el valor de 5
// Sumar todas y multiplicar por 2.5
function calculateSusScore(answers: SusSurveyPayload): number {
  const oddQuestions = [answers.q1, answers.q3, answers.q5, answers.q7, answers.q9]
  const evenQuestions = [answers.q2, answers.q4, answers.q6, answers.q8, answers.q10]
  
  const oddSum = oddQuestions.reduce((sum, val) => sum + (val - 1), 0)
  const evenSum = evenQuestions.reduce((sum, val) => sum + (5 - val), 0)
  
  return (oddSum + evenSum) * 2.5
}

// Valida que todas las respuestas esten en el rango 1-5
function validateAnswers(answers: SusSurveyPayload): boolean {
  const values = Object.values(answers)
  return values.length === 10 && values.every(v => 
    typeof v === 'number' && v >= 1 && v <= 5 && Number.isInteger(v)
  )
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const answers: SusSurveyPayload = {
      q1: body.q1,
      q2: body.q2,
      q3: body.q3,
      q4: body.q4,
      q5: body.q5,
      q6: body.q6,
      q7: body.q7,
      q8: body.q8,
      q9: body.q9,
      q10: body.q10,
    }

    if (!validateAnswers(answers)) {
      return Response.json(
        { error: "Todas las respuestas deben estar entre 1 y 5" },
        { status: 400 }
      )
    }

    const susScore = calculateSusScore(answers)

    const { data, error } = await supabase
      .from("sus_surveys")
      .insert({
        user_id: user.id,
        ...answers,
        sus_score: susScore,
      })
      .select()
      .single()

    if (error) {
      console.error("Error al guardar cuestionario SUS:", error)
      return Response.json(
        { error: "Error al guardar el cuestionario" },
        { status: 500 }
      )
    }

    return Response.json({
      success: true,
      susScore,
      surveyId: data.id,
      message: "Cuestionario guardado exitosamente",
    })
  } catch (err) {
    console.error("Error en API SUS:", err)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from("sus_surveys")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error al obtener cuestionarios SUS:", error)
      return Response.json(
        { error: "Error al obtener los cuestionarios" },
        { status: 500 }
      )
    }

    return Response.json({ surveys: data })
  } catch (err) {
    console.error("Error en API SUS:", err)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
