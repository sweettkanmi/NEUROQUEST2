"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Question } from "@/lib/types"
import { Check, X, ArrowRight, Loader2, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuestionCardProps {
  question: Question
  questionNumber: number
  onAnswer: (questionId: string, answer: number) => Promise<{
    isCorrect: boolean
    correctOption: number
    explanation: string
    xpEarned: number
  }>
  onNext: () => void
  isAnswered: boolean
  removedOptions: number[]
  hintText: string | null
}

export function QuestionCard({
  question,
  questionNumber,
  onAnswer,
  onNext,
  isAnswered: wasAlreadyAnswered,
  removedOptions,
  hintText,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [result, setResult] = useState<{
    isCorrect: boolean
    correctOption: number
    explanation: string
    xpEarned: number
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isAnswered = wasAlreadyAnswered || result !== null
  const options: string[] = Array.isArray(question.options) ? question.options : []

  async function handleSelect(index: number) {
    if (isAnswered || submitting) return
    setSelectedAnswer(index)
    setSubmitting(true)

    try {
      const data = await onAnswer(question.id, index)
      setResult(data)
    } catch {
      setSubmitting(false)
    }
  }

  function getOptionStyle(index: number) {
    if (!result) {
      if (removedOptions.includes(index)) {
        return "opacity-30 pointer-events-none border-border"
      }
      if (selectedAnswer === index && submitting) {
        return "border-primary bg-primary/10 ring-2 ring-primary/30"
      }
      return "border-border hover:border-muted-foreground hover:bg-secondary/30 cursor-pointer"
    }

    if (index === result.correctOption) {
      return "border-primary bg-primary/10 ring-2 ring-primary/30"
    }
    if (index === selectedAnswer && !result.isCorrect) {
      return "border-destructive bg-destructive/10 ring-2 ring-destructive/30"
    }
    return "border-border opacity-50"
  }

  return (
    <motion.div
      className="w-full max-w-2xl"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      {/* Question */}
      <div className="mb-6">
        <span className="text-xs font-mono text-muted-foreground mb-2 block">
          PREGUNTA {questionNumber}
        </span>
        <h2 className="text-lg md:text-xl font-semibold text-foreground leading-relaxed">
          {question.question_text}
        </h2>
      </div>

      {/* Hint */}
      <AnimatePresence>
        {hintText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-lg bg-rpg-gold/10 border border-rpg-gold/30 flex items-start gap-2"
          >
            <Lightbulb className="w-4 h-4 text-rpg-gold mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">{hintText}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {options.map((option, index) => (
          <motion.button
            key={index}
            className={`relative flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${getOptionStyle(index)}`}
            onClick={() => handleSelect(index)}
            disabled={isAnswered || submitting || removedOptions.includes(index)}
            whileHover={!isAnswered && !submitting ? { scale: 1.01 } : {}}
            whileTap={!isAnswered && !submitting ? { scale: 0.99 } : {}}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-mono
              ${result && index === result.correctOption
                ? "bg-primary text-primary-foreground"
                : result && index === selectedAnswer && !result.isCorrect
                ? "bg-destructive text-destructive-foreground"
                : "bg-secondary text-muted-foreground"
              }`}
            >
              {result && index === result.correctOption ? (
                <Check className="w-4 h-4" />
              ) : result && index === selectedAnswer && !result.isCorrect ? (
                <X className="w-4 h-4" />
              ) : (
                String.fromCharCode(65 + index)
              )}
            </div>
            <span className="text-sm text-foreground">{option}</span>
            {submitting && selectedAnswer === index && !result && (
              <Loader2 className="w-4 h-4 animate-spin text-primary ml-auto" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Result feedback */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className={`p-4 rounded-xl border ${
              result.isCorrect
                ? "bg-primary/5 border-primary/30"
                : "bg-destructive/5 border-destructive/30"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {result.isCorrect ? (
                  <>
                    <Check className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-primary">Correcto! +{result.xpEarned} XP</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-destructive" />
                    <span className="font-semibold text-destructive">Incorrecto - Perdiste una vida</span>
                  </>
                )}
              </div>
              {result.explanation && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.explanation}
                </p>
              )}
            </div>

            <Button
              onClick={onNext}
              className="w-full mt-4"
              size="lg"
            >
              Siguiente pregunta
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
