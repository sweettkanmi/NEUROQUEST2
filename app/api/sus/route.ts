import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  // Verify streak >= 3 and level >= 3
  const { data: profile } = await supabase
    .from("profiles")
    .select("current_streak, level")
    .eq("id", user.id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 })
  }

  if (profile.current_streak < 3 || profile.level < 3) {
    return NextResponse.json(
      { error: "Necesitas al menos 3 días de racha y nivel 3 para completar el formulario SUS." },
      { status: 403 }
    )
  }

  const body = await req.json()
  const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = body

  // Validate all 10 questions are present and between 1-5
  const questions = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10]
  if (questions.some((q) => typeof q !== "number" || q < 1 || q > 5)) {
    return NextResponse.json({ error: "Respuestas inválidas" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("sus_responses")
    .insert({
      user_id: user.id,
      q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
    })
    .select("sus_score")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, sus_score: data.sus_score })
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  // Check if user already submitted
  const { data } = await supabase
    .from("sus_responses")
    .select("id, sus_score, submitted_at")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  return NextResponse.json({ submitted: !!data, response: data ?? null })
}