"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Heart, Star, Swords } from "lucide-react"
import { DIFFICULTY_CONFIG } from "@/lib/types"

interface GameHUDProps {
  lives: number
  xp: number
  currentQuestion: number
  totalQuestions: number
  pdfName: string
  difficulty: string
}

export function GameHUD({ lives, xp, currentQuestion, totalQuestions, pdfName, difficulty }: GameHUDProps) {
  const config = DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG]
  const progress = (currentQuestion / totalQuestions) * 100

  return (
    <header className="border-b border-border/50 bg-rpg-surface px-4 py-3">
      <div className="max-w-3xl mx-auto">
        {/* Top row: lives, title, XP */}
        <div className="flex items-center justify-between mb-2">
          {/* Lives */}
          <div className="flex items-center gap-1">
            <AnimatePresence mode="popLayout">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`heart-${i}`}
                  initial={{ scale: 1 }}
                  animate={i < lives ? { scale: [1, 1.2, 1] } : { scale: 0.8, opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      i < lives
                        ? "text-rpg-health fill-rpg-health"
                        : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Title */}
          <div className="flex items-center gap-2 text-center">
            <Swords className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
              {pdfName}
            </span>
            <span className={`text-xs font-mono ${config?.color ?? "text-muted-foreground"}`}>
              {config?.label ?? difficulty}
            </span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-rpg-gold fill-rpg-gold" />
            <motion.span
              key={xp}
              className="text-sm font-mono text-rpg-gold"
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {xp} XP
            </motion.span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">Pregunta {currentQuestion} de {totalQuestions}</span>
        </div>
      </div>
    </header>
  )
}
