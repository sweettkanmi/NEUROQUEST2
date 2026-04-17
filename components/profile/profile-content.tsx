"use client"

import { motion } from "framer-motion"
import { Profile, GameSession, getLevelProgress, LEVEL_THRESHOLDS, DIFFICULTY_CONFIG } from "@/lib/types"
import { User, Star, Trophy, Heart, Swords, TrendingUp, Clock } from "lucide-react"

interface ProfileContentProps {
  profile: Profile | null
  sessions: GameSession[]
  email: string
}

export function ProfileContent({ profile, sessions, email }: ProfileContentProps) {
  const p = profile ?? {
    display_name: "Aventurero",
    level: 1,
    xp: 0,
    total_games: 0,
    total_correct: 0,
    created_at: new Date().toISOString(),
  }

  const { progress, nextLevelXp } = getLevelProgress(p.xp)
  const victories = sessions.filter((s) => s.status === "victory").length
  const defeats = sessions.filter((s) => s.status === "defeat").length
  const winRate = sessions.length > 0 ? Math.round((victories / sessions.length) * 100) : 0
  const totalXpFromSessions = sessions.reduce((sum, s) => sum + s.xp_earned, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="flex items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center glow-primary">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{p.display_name}</h1>
          <p className="text-sm text-muted-foreground">{email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-mono text-rpg-gold">Nivel {p.level}</span>
            <span className="text-xs text-muted-foreground">
              {p.xp} / {nextLevelXp} XP
            </span>
          </div>
        </div>
      </motion.div>

      {/* XP Progress */}
      <motion.div
        className="mb-8 p-4 rounded-xl bg-card border border-border/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progreso de nivel</span>
          <span className="text-sm font-mono text-rpg-gold">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-rpg-xp"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            Nv. {p.level} ({LEVEL_THRESHOLDS[p.level - 1] ?? 0} XP)
          </span>
          <span className="text-xs text-muted-foreground">
            Nv. {p.level + 1} ({nextLevelXp} XP)
          </span>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {[
          { icon: Trophy, label: "Victorias", value: victories, color: "text-primary" },
          { icon: Swords, label: "Derrotas", value: defeats, color: "text-destructive" },
          { icon: TrendingUp, label: "Win Rate", value: `${winRate}%`, color: "text-rpg-gold" },
          { icon: Star, label: "XP Total", value: totalXpFromSessions, color: "text-rpg-xp" },
          { icon: Heart, label: "Aciertos", value: p.total_correct, color: "text-rpg-health" },
          { icon: Clock, label: "Partidas", value: p.total_games, color: "text-rpg-mana" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="p-4 rounded-xl bg-card border border-border/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <p className="text-xl font-bold font-mono text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Game history */}
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Historial de partidas</h2>
          <div className="flex flex-col gap-2">
            {sessions.map((session) => {
              const config = DIFFICULTY_CONFIG[session.difficulty as keyof typeof DIFFICULTY_CONFIG]
              return (
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
                        <span className={config?.color ?? "text-muted-foreground"}>
                          {config?.label ?? session.difficulty}
                        </span>
                        <span>&middot;</span>
                        <span>{session.correct_answers}/{session.total_questions} correctas</span>
                        <span>&middot;</span>
                        <span className={
                          session.status === "victory" ? "text-primary" :
                          session.status === "defeat" ? "text-destructive" :
                          "text-rpg-gold"
                        }>
                          {session.status === "victory" ? "Victoria" :
                           session.status === "defeat" ? "Derrota" :
                           "En progreso"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs text-rpg-gold font-mono">+{session.xp_earned} XP</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(session.created_at).toLocaleDateString("es")}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
