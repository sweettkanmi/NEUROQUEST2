// app/dashboard/subjects/page.tsx
// Lists all available subjects with user's progress for each.

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SUBJECTS } from "@/lib/subjects/config"
import { SubjectsClient } from "@/components/subjects/subjects-client"

export default async function SubjectsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Fetch progress for all subjects in one query
  const { data: progressRows } = await supabase
    .from("user_subject_progress")
    .select("*")
    .eq("user_id", user.id)

  const progressMap = Object.fromEntries(
    (progressRows ?? []).map((p) => [p.subject_id, p])
  )

  return <SubjectsClient subjects={SUBJECTS} progressMap={progressMap} />
}