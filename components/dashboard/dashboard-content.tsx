"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Profile, GameSession, getLevelProgress, DIFFICULTY_CONFIG } from "@/lib/types"
import { PdfUploadCard } from "@/components/dashboard/pdf-upload-card"
import { StatsCard } from "@/components/dashboard/stats-card"
import { SubjectsSidebar } from "@/components/dashboard/subjects-sidebar"
import { Heart, Star, Trophy, Swords, Clock } from "lucide-react"
import type { Subject } from "@/lib/subjects/config"

interface SubjectProgress {
  subject_id: string
  diagnostic_passed: boolean
  subject_completed: boolean
  completed_modules: string[]
  completed_sections: string[]
}

interface DashboardContentProps {
  profile: Profile | null
  recentSessions: GameSession[]
  subjects: Subject[]
  subjectProgressMap: Record<string, SubjectProgress>
}

export function DashboardContent({ profile, recentSessions, subjects, subjectProgressMap }: DashboardContentProps) {
  const [, setRefreshKey] = useState(0)
  const p = profile ?? { level: 1, xp: 0, total_games: 0, total_correct: 0, display_name: "Aventurero" }
  const { progress, nextLevelXp } = getLevelProgress(p.xp)

  // Use total_correct from profile and total questions from all known sessions for accuracy
  const totalQuestionsEver = recentSessions.reduce((sum, s) => sum + s.total_questions, 0)
  const accuracy = totalQuestionsEver > 0
    ? Math.round((p.total_correct / totalQuestionsEver) * 100)
    : p.total_games > 0 ? Math.round((p.total_correct / (p.total_games * 10)) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Welcome section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Bienvenido, {p.display_name}
            </h1>
            <p className="text-muted-foreground">
              Nivel {p.level} &middot; {p.xp} / {nextLevelXp} XP
            </p>
            <div className="mt-3 h-2.5 rounded-full bg-secondary overflow-hidden max-w-md">
              <motion.div
                className="h-full rounded-full bg-rpg-xp"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatsCard icon={Star} label="Nivel" value={p.level} color="text-rpg-gold" />
            <StatsCard icon={Trophy} label="Partidas" value={p.total_games} color="text-primary" />
            <StatsCard icon={Heart} label="Aciertos" value={p.total_correct} color="text-rpg-health" />
            <StatsCard icon={Swords} label="Precision" value={`${accuracy}%`} color="text-rpg-mana" />
          </div>

          {/* New game card */}
          <PdfUploadCard onGameCreated={() => setRefreshKey((k) => k + 1)} />

          {/* Recent sessions */}
          {recentSessions.length > 0 && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Partidas recientes</h2>
              <div className="flex flex-col gap-2">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        session.status === "victory" ? "bg-primary" :
                        session.status === "defeat" ? "bg-destructive" :
                        "bg-rpg-gold"
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{session.pdf_name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className={DIFFICULTY_CONFIG[session.difficulty].color}>
                            {DIFFICULTY_CONFIG[session.difficulty].label}
                          </span>
                          <span>&middot;</span>
                          <span>{session.correct_answers}/{session.total_questions} correctas</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(session.created_at).toLocaleDateString("es")}</span>
                      {session.xp_earned > 0 && (
                        <span className="text-rpg-gold font-mono">+{session.xp_earned} XP</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Subjects sidebar - visible on large screens, stacked on mobile */}
        <motion.div
          className="lg:w-80 shrink-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="lg:sticky lg:top-20">
            <SubjectsSidebar subjects={subjects} progressMap={subjectProgressMap} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
