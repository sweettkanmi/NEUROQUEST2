// app/dashboard/subjects/[subjectId]/page.tsx
// Shows the subject overview: diagnostic gate + module list.

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getSubjectById } from "@/lib/subjects/config"
import { SubjectDetailClient } from "@/components/subjects/subject-detail-client"

interface SubjectPageProps {
  params: Promise<{ subjectId: string }>
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subjectId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const subject = getSubjectById(subjectId)
  if (!subject) redirect("/dashboard/subjects")

  const { data: progress } = await supabase
    .from("user_subject_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("subject_id", subjectId)
    .single()

  return <SubjectDetailClient subject={subject} progress={progress ?? null} />
}