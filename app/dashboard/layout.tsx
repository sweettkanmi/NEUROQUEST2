import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav
        email={user.email ?? ""}
        displayName={profile?.display_name ?? "Aventurero"}
        level={profile?.level ?? 1}
        xp={profile?.xp ?? 0}
      />
      <main className="flex-1">{children}</main>
    </div>
  )
}
