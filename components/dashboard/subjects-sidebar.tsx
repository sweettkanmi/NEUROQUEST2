"use client"

import { useRouter } from "next/navigation"
import { Subject } from "@/lib/subjects/config"
import { BookOpen, CheckCircle2, Lock, ChevronRight, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface SubjectProgress {
  subject_id: string
  diagnostic_passed: boolean
  subject_completed: boolean
  completed_modules: string[]
  completed_sections: string[]
}

interface SubjectsSidebarProps {
  subjects: Subject[]
  progressMap: Record<string, SubjectProgress>
}

export function SubjectsSidebar({ subjects, progressMap }: SubjectsSidebarProps) {
  const router = useRouter()

  // Calculate overall progress
  const totalModules = subjects.reduce((sum, s) => sum + s.modules.length, 0)
  const completedModules = subjects.reduce((sum, s) => {
    const progress = progressMap[s.id]
    return sum + (progress?.completed_modules?.length ?? 0)
  }, 0)
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Materias</h2>
        </div>
        <button
          onClick={() => router.push("/dashboard/subjects")}
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          Ver todas
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Overall progress */}
      <div className="mb-4 p-3 rounded-lg bg-secondary/30">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Progreso general</span>
          <span className="font-mono">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-1.5" />
      </div>

      {/* Subjects list */}
      <div className="flex flex-col gap-2">
        {subjects.map((subject) => {
          const progress = progressMap[subject.id]
          const diagnosticPassed = progress?.diagnostic_passed ?? false
          const completed = progress?.subject_completed ?? false
          const completedMods = progress?.completed_modules?.length ?? 0
          const totalMods = subject.modules.length
          const subjectProgress = totalMods > 0 ? Math.round((completedMods / totalMods) * 100) : 0

          return (
            <button
              key={subject.id}
              onClick={() => router.push(`/dashboard/subjects/${subject.id}`)}
              className="group flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left"
            >
              {/* Subject icon */}
              <span className="text-2xl shrink-0">{subject.icon}</span>

              {/* Subject info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {subject.title}
                  </p>
                  {completed && (
                    <Sparkles className="w-3.5 h-3.5 text-rpg-gold shrink-0" />
                  )}
                </div>

                {completed ? (
                  <div className="flex items-center gap-1 text-xs text-rpg-gold mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completada</span>
                  </div>
                ) : !diagnosticPassed ? (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Lock className="w-3 h-3" />
                    <span>Test requerido</span>
                  </div>
                ) : (
                  <div className="mt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-rpg-xp transition-all duration-300"
                          style={{ width: `${subjectProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono w-8">
                        {subjectProgress}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Arrow */}
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )
        })}
      </div>

      {/* Quick action */}
      {subjects.some((s) => {
        const p = progressMap[s.id]
        return !p?.diagnostic_passed
      }) && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            Completa los tests diagnósticos para desbloquear módulos
          </p>
        </div>
      )}
    </div>
  )
}
