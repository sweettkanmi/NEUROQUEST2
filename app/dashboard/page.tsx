import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { SUBJECTS } from "@/lib/subjects/config"
import { StreakStatsCard } from "@/components/streak/streak-stats-cards"
import { SusForm } from "@/components/sus/sus-form"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

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

  const { data: subjectProgress } = await supabase
    .from("user_subject_progress")
    .select("*")
    .eq("user_id", user.id)

  const progressMap = Object.fromEntries(
    (subjectProgress ?? []).map((p) => [p.subject_id, p])
  )

  // ── Tutorial visibility logic ──────────────────────────────────────────────
  // Show only if XP is 0 AND tutorial has not been completed or skipped
  const showTutorial =
    (profile?.xp ?? 0) === 0 &&
    !profile?.tutorial_completed &&
    !profile?.tutorial_skipped

  return (
    <>
      {/* Streak card — wrapped with data-tutorial for the onboarding overlay */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="mb-4 max-w-xs" data-tutorial="streak">
          <StreakStatsCard />
        </div>
      </div>

      <DashboardContent
        profile={profile}
        recentSessions={recentSessions ?? []}
        subjects={SUBJECTS}
        subjectProgressMap={progressMap}
        showTutorial={showTutorial}
        userId={user.id}
      />

      {/* SUS Form — only shown to logged-in users, locked until streak>=3 & level>=3 */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <SusForm
          currentStreak={profile?.current_streak ?? 0}
          level={profile?.level ?? 1}
        />
      </div>
    </>
  )
}