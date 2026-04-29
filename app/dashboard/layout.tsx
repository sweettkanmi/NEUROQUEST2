import type { FC } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { StreakProvider } from "@/lib/streak/streak-context"
import { StreakNavBadge } from "@/components/streak/streak-nav-badge"
import { buildStreakData } from "@/lib/streak/streak-utils"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, level, xp, current_streak, longest_streak, last_activity_date")
    .eq("id", user.id)
    .single()

  const initialStreakData = buildStreakData(profile ?? {})

  return (
    <StreakProvider initialData={initialStreakData}>
      <div className="min-h-screen flex flex-col">
        <DashboardNavWithStreak
          email={user.email ?? ""}
          displayName={profile?.display_name ?? "Aventurero"}
          level={profile?.level ?? 1}
          xp={profile?.xp ?? 0}
        />
        <main className="flex-1">{children}</main>
      </div>
    </StreakProvider>
  )
}

interface DashboardNavWithStreakProps {
  email: string
  displayName: string
  level: number
  xp: number
}

const DashboardNavWithStreak: FC<DashboardNavWithStreakProps> = (props) => {
  return (
    <div className="relative">
      <DashboardNav {...props} />
      <StreakNavBadge />
    </div>
  )
}