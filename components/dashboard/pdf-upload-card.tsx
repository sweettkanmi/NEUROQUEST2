"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FileUp, Loader2, Swords, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DIFFICULTY_CONFIG } from "@/lib/types"
import { toast } from "sonner"

interface PdfUploadCardProps {
  onGameCreated: () => void
}

type Difficulty = "easy" | "normal" | "hard"

export function PdfUploadCard({ onGameCreated }: PdfUploadCardProps) {
  const [file, setFile] = useState<File | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>("normal")
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function handleFile(f: File | undefined) {
    if (!f) return
    if (f.type !== "application/pdf") {
      toast.error("Solo se permiten archivos PDF")
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("El archivo no puede superar 10MB")
      return
    }
    setFile(f)
  }

  async function handleStartGame() {
    if (!file) return
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("pdf", file)
      formData.append("difficulty", difficulty)

      const res = await fetch("/api/game/create", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error al crear la partida")
      }

      const { sessionId } = await res.json()
      onGameCreated()
      router.push(`/game/${sessionId}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado")
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="rounded-xl bg-card border border-border/50 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-rpg-gold" />
          <h2 className="text-lg font-semibold text-foreground">Nueva Partida</h2>
        </div>

        {/* Upload area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragOver
              ? "border-primary bg-primary/5"
              : file
              ? "border-primary/50 bg-primary/5"
              : "border-border hover:border-muted-foreground"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFile(e.dataTransfer.files[0])
          }}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <FileUp className={`w-8 h-8 mx-auto mb-3 ${file ? "text-primary" : "text-muted-foreground"}`} />
          {file ? (
            <p className="text-sm text-foreground font-medium">{file.name}</p>
          ) : (
            <>
              <p className="text-sm text-foreground mb-1">Arrastra tu PDF aqui</p>
              <p className="text-xs text-muted-foreground">o haz clic para seleccionar (max 10MB)</p>
            </>
          )}
        </div>

        {/* Difficulty selector */}
        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <p className="text-sm text-muted-foreground mb-2">Dificultad:</p>
              <div className="flex gap-2">
                {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((d) => {
                  const config = DIFFICULTY_CONFIG[d]
                  const isActive = difficulty === d
                  return (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        isActive
                          ? "bg-secondary border-primary/50 text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-border"
                      }`}
                    >
                      <span className={config.color}>{config.label}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {config.questions} preguntas
                      </span>
                    </button>
                  )
                })}
              </div>

              <Button
                onClick={handleStartGame}
                disabled={loading}
                className="w-full mt-4 glow-primary"
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando preguntas...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Swords className="w-4 h-4" />
                    Iniciar Batalla
                  </span>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
