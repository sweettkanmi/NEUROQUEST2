import { createClient } from "@/lib/supabase/server"
import { buildStreakData } from "@/lib/streak/streak-utils"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 })
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("current_streak, longest_streak, last_activity_date")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    return Response.json({ error: "Perfil no encontrado" }, { status: 404 })
  }

  return Response.json(buildStreakData(profile))
}