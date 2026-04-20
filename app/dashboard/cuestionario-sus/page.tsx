"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ClipboardList, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

const SUS_QUESTIONS = [
  "Creo que me gustaria usar este sistema con frecuencia.",
  "Encontre el sistema innecesariamente complejo.",
  "Pense que el sistema era facil de usar.",
  "Creo que necesitaria el apoyo de una persona tecnica para poder usar este sistema.",
  "Encontre que las funciones del sistema estaban bien integradas.",
  "Pense que habia demasiada inconsistencia en este sistema.",
  "Imagino que la mayoria de las personas aprenderian a usar este sistema muy rapidamente.",
  "Encontre el sistema muy complicado de usar.",
  "Me senti muy seguro usando el sistema.",
  "Necesite aprender muchas cosas antes de poder usar el sistema.",
]

const LIKERT_OPTIONS = [
  { value: "1", label: "Totalmente en desacuerdo" },
  { value: "2", label: "En desacuerdo" },
  { value: "3", label: "Neutral" },
  { value: "4", label: "De acuerdo" },
  { value: "5", label: "Totalmente de acuerdo" },
]

interface SurveyResult {
  susScore: number
  surveyId: string
}

export default function CuestionarioSusPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<SurveyResult | null>(null)

  const handleAnswerChange = useCallback((questionIndex: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [`q${questionIndex + 1}`]: value
    }))
  }, [])

  const isFormComplete = SUS_QUESTIONS.every((_, index) => answers[`q${index + 1}`])

  const handleSubmit = useCallback(async () => {
    if (!isFormComplete) {
      toast.error("Por favor responde todas las preguntas antes de enviar.")
      return
    }

    setLoading(true)

    try {
      const payload = {
        q1: parseInt(answers.q1),
        q2: parseInt(answers.q2),
        q3: parseInt(answers.q3),
        q4: parseInt(answers.q4),
        q5: parseInt(answers.q5),
        q6: parseInt(answers.q6),
        q7: parseInt(answers.q7),
        q8: parseInt(answers.q8),
        q9: parseInt(answers.q9),
        q10: parseInt(answers.q10),
      }

      const response = await fetch("/api/sus-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el cuestionario")
      }

      setResult({
        susScore: data.susScore,
        surveyId: data.surveyId,
      })
      setSubmitted(true)
      toast.success("Cuestionario enviado exitosamente!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al enviar el cuestionario")
    } finally {
      setLoading(false)
    }
  }, [answers, isFormComplete])

  const getScoreInterpretation = (score: number) => {
    if (score >= 85) return { text: "Excelente", color: "text-primary" }
    if (score >= 68) return { text: "Por encima del promedio", color: "text-primary" }
    if (score >= 50) return { text: "Promedio", color: "text-rpg-gold" }
    return { text: "Por debajo del promedio", color: "text-rpg-health" }
  }

  if (submitted && result) {
    const interpretation = getScoreInterpretation(result.susScore)
    
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card border border-border/50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Cuestionario Completado
          </h1>
          <p className="text-muted-foreground mb-6">
            Gracias por completar el cuestionario de usabilidad.
          </p>
          
          <div className="bg-secondary/50 rounded-lg p-6 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Tu puntaje SUS</p>
            <p className="text-4xl font-bold text-foreground mb-2">
              {result.susScore.toFixed(1)}
            </p>
            <p className={`text-sm font-medium ${interpretation.color}`}>
              {interpretation.text}
            </p>
          </div>

          <p className="text-xs text-muted-foreground mb-6">
            El puntaje SUS promedio es 68. Un puntaje superior indica una mejor usabilidad percibida.
          </p>

          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full"
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Cuestionario SUS
              </h1>
              <p className="text-muted-foreground text-sm">
                System Usability Scale
              </p>
            </div>
          </div>
          <p className="text-muted-foreground">
            Por favor, evalua tu experiencia con el sistema respondiendo las siguientes preguntas. 
            Selecciona la opcion que mejor represente tu nivel de acuerdo con cada afirmacion.
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {SUS_QUESTIONS.map((question, index) => (
            <div
              key={index}
              className="bg-card border border-border/50 rounded-xl p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold text-foreground">
                  {index + 1}
                </span>
                <p className="text-foreground font-medium pt-1">{question}</p>
              </div>

              <RadioGroup
                value={answers[`q${index + 1}`] || ""}
                onValueChange={(value) => handleAnswerChange(index, value)}
                className="grid gap-2"
              >
                {LIKERT_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center space-x-3 rounded-lg border p-3 transition-colors cursor-pointer ${
                      answers[`q${index + 1}`] === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border/50 hover:bg-secondary/50"
                    }`}
                    onClick={() => handleAnswerChange(index, option.value)}
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`q${index + 1}-${option.value}`}
                      className="border-muted-foreground"
                    />
                    <Label
                      htmlFor={`q${index + 1}-${option.value}`}
                      className="flex-1 cursor-pointer text-sm text-foreground"
                    >
                      <span className="font-mono text-muted-foreground mr-2">
                        {option.value}.
                      </span>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>

        {/* Progress and Submit */}
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {!isFormComplete && (
                <AlertCircle className="w-4 h-4 text-rpg-gold" />
              )}
              <span className="text-sm text-muted-foreground">
                {Object.keys(answers).length} de {SUS_QUESTIONS.length} preguntas respondidas
              </span>
            </div>
            <div className="w-32 h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${(Object.keys(answers).length / SUS_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isFormComplete || loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Cuestionario"
            )}
          </Button>

          {!isFormComplete && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              Debes responder todas las preguntas para enviar el cuestionario.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
