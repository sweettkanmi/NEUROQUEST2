import { createClient } from "@/lib/supabase/server"
import { getTodayUtc } from "@/lib/streak/streak-utils"
import { updateUserStreak } from "@/lib/streak/update-streak"

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 })
  }

  const result = await updateUserStreak(user.id)

  if (!result) {
    return Response.json({ error: "Error al actualizar racha" }, { status: 500 })
  }

  return Response.json({
    current_streak: result.current_streak,
    longest_streak: result.longest_streak,
    already_counted: result.already_counted,
    active_today: true,
    last_activity_date: getTodayUtc(),
  })
}