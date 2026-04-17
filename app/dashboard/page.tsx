import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { SUBJECTS } from "@/lib/subjects/config"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: recentSessions } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch subject progress for sidebar
  const { data: subjectProgress } = await supabase
    .from("user_subject_progress")
    .select("*")
    .eq("user_id", user.id)

  const progressMap = Object.fromEntries(
    (subjectProgress ?? []).map((p) => [p.subject_id, p])
  )

  return (
    <DashboardContent
      profile={profile}
      recentSessions={recentSessions ?? []}
      subjects={SUBJECTS}
      subjectProgressMap={progressMap}
    />
  )
}
