"use client"
// components/subjects/section-client.tsx
// Renders theory content and the "Start Quiz" button for a section.
// After game ends, calls /api/subjects/complete-quiz to update progress.

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Subject, SubjectModule, SubjectSection } from "@/lib/subjects/config"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Swords, BookOpen, ChevronRight } from "lucide-react"
import { toast } from "sonner"

interface SectionClientProps {
  subject: Subject
  module: SubjectModule
  section: SubjectSection
  isCompleted: boolean
}

export function SectionClient({
  subject,
  module,
  section,
  isCompleted,
}: SectionClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [theoryRead, setTheoryRead] = useState(isCompleted)

  const startQuiz = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/subjects/create-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: subject.id,
          moduleId: module.id,
          sectionId: section.id,
          quizType: "section",
        }),
      })
      const data = await res.json()
      if (data.sessionId) {
        router.push(`/game/${data.sessionId}`)
      } else {
        toast.error(data.error ?? "Error al crear el quiz")
      }
    } catch {
      toast.error("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  // Render simple markdown-ish content (no extra deps)
  const renderTheory = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-base font-bold text-foreground mt-5 mb-2 first:mt-0">
            {line.replace("## ", "")}
          </h2>
        )
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={i} className="font-semibold text-foreground mb-1">
            {line.replace(/\*\*/g, "")}
          </p>
        )
      }
      if (line.startsWith("- ")) {
        return (
          <li key={i} className="text-sm text-muted-foreground ml-4 mb-0.5 list-disc">
            {line.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}
          </li>
        )
      }
      if (line.startsWith("| ")) {
        // simple table row
        const cells = line.split("|").filter(Boolean).map(c => c.trim())
        if (cells.every(c => c.startsWith("---"))) return null
        return (
          <div key={i} className="flex gap-2 text-xs text-muted-foreground border-b border-border/20 py-1">
            {cells.map((cell, ci) => (
              <span key={ci} className="flex-1">{cell}</span>
            ))}
          </div>
        )
      }
      if (line.trim() === "") return <div key={i} className="h-2" />
      // Inline bold
      const parts = line.split(/\*\*(.*?)\*\*/)
      return (
        <p key={i} className="text-sm text-muted-foreground mb-1">
          {parts.map((p, pi) =>
            pi % 2 === 1 ? (
              <strong key={pi} className="text-foreground">
                {p}
              </strong>
            ) : (
              p
            )
          )}
        </p>
      )
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <button onClick={() => router.push("/dashboard/subjects")} className="hover:text-foreground transition-colors">
          Materias
        </button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => router.push(`/dashboard/subjects/${subject.id}`)} className="hover:text-foreground transition-colors">
          {subject.title}
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{section.title}</span>
      </div>

      {/* Section header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{module.title}</p>
          <h1 className="text-xl font-bold text-foreground">{section.title}</h1>
          {isCompleted && (
            <div className="flex items-center gap-1 text-xs text-green-400 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>Completada</span>
            </div>
          )}
        </div>
      </div>

      {/* Theory card */}
      <div className="rounded-xl border border-border/50 bg-rpg-surface p-5 mb-6">
        <div className="prose prose-sm max-w-none">
          {renderTheory(section.theoryContent)}
        </div>
      </div>

      {/* Read confirmation + quiz launch */}
      {!theoryRead ? (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setTheoryRead(true)}
        >
          He leído el contenido → Ir al Quiz
        </Button>
      ) : (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Swords className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Quiz de la Sección</p>
              <p className="text-xs text-muted-foreground">
                {section.questions.length} preguntas · XP + vidas + perks activos
              </p>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={startQuiz}
            disabled={loading}
          >
            {loading ? "Iniciando..." : isCompleted ? "Repetir Quiz" : "Iniciar Quiz"}
          </Button>
        </div>
      )}

      <Button
        variant="ghost"
        className="mt-4 text-muted-foreground w-full"
        onClick={() => router.push(`/dashboard/subjects/${subject.id}`)}
      >
        ← Volver a {subject.title}
      </Button>
    </div>
  )
}