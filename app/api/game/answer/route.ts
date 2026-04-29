/**
 * app/api/game/answer/route.ts — ADD THIS CODE
 *
 * ⚠️  DO NOT replace the original file entirely without reviewing the diff below.
 *
 * This file shows the MINIMAL DIFF to apply to the existing
 * app/api/game/answer/route.ts to trigger a streak update
 * when a game session finishes (victory OR defeat).
 *
 * ─── WHAT TO ADD ─────────────────────────────────────────────────
 *
 * 1. Add import at the top (after existing imports):
 *
 *     import { updateUserStreak } from "@/lib/streak/update-streak"
 *
 * 2. Inside the `if (isFinished)` block, after the profile update,
 *    add the streak call:
 *
 *     if (isFinished) {
 *       // ... existing profile update code ...
 *
 *       // ── Update daily streak (NEW) ──────────────────────────
 *       await updateUserStreak(user.id)
 *     }
 *
 * 3. Add the streak result to the return object:
 *
 *     return Response.json({
 *       // ... existing fields ...
 *       streakUpdated: isFinished,   // ← NEW: tells client a streak update occurred
 *     })
 *
 * ─── FULL PATCHED FILE ───────────────────────────────────────────
 */

import { createClient } from "@/lib/supabase/server"
import { DIFFICULTY_CONFIG, LEVEL_THRESHOLDS } from "@/lib/types"
import { updateUserStreak } from "@/lib/streak/update-streak"       // ← NEW

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 })
  }

  const { questionId, answer } = await req.json()

  if (questionId === undefined || answer === undefined) {
    return Response.json({ error: "Faltan datos" }, { status: 400 })
  }

  const { data: question, error: qError } = await supabase
    .from("questions")
    .select("*")
    .eq("id", questionId)
    .eq("user_id", user.id)
    .single()

  if (qError || !question) {
    return Response.json({ error: "Pregunta no encontrada" }, { status: 404 })
  }

  if (question.answered) {
    return Response.json({ error: "Pregunta ya respondida" }, { status: 400 })
  }

  const isCorrect = answer === question.correct_option

  await supabase
    .from("questions")
    .update({
      answered: true,
      user_answer: answer,
      is_correct: isCorrect,
    })
    .eq("id", questionId)

  const { data: session } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("id", question.session_id)
    .eq("user_id", user.id)
    .single()

  if (!session) {
    return Response.json({ error: "Sesion no encontrada" }, { status: 404 })
  }

  const config = DIFFICULTY_CONFIG[session.difficulty as keyof typeof DIFFICULTY_CONFIG] ?? DIFFICULTY_CONFIG.normal

  const doubleXpActive = (session as Record<string, unknown>).double_xp_active === true
  const baseXp = isCorrect ? Math.round(25 * config.xpMultiplier * (doubleXpActive ? 2 : 1)) : 0

  const newCorrect = session.correct_answers + (isCorrect ? 1 : 0)
  const newWrong = session.wrong_answers + (isCorrect ? 0 : 1)
  const newLives = session.lives_remaining - (isCorrect ? 0 : 1)
  const newQuestionIndex = session.current_question_index + 1
  const newXp = session.xp_earned + baseXp

  let newStatus: string = session.status
  if (newLives <= 0) {
    newStatus = "defeat"
  } else if (newQuestionIndex >= session.total_questions) {
    newStatus = "victory"
  }

  const isFinished = newStatus === "victory" || newStatus === "defeat"

  await supabase
    .from("game_sessions")
    .update({
      correct_answers: newCorrect,
      wrong_answers: newWrong,
      lives_remaining: Math.max(newLives, 0),
      current_question_index: newQuestionIndex,
      xp_earned: newXp,
      status: newStatus,
      ...(doubleXpActive ? { double_xp_active: false } : {}),
      ...(isFinished ? { finished_at: new Date().toISOString() } : {}),
    } as never)
    .eq("id", session.id)

  if (isFinished) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp, total_games, total_correct, level")
      .eq("id", user.id)
      .single()

    if (profile) {
      const updatedXp = profile.xp + newXp
      const updatedGames = profile.total_games + 1
      const updatedCorrect = profile.total_correct + newCorrect

      let newLevel = 1
      for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
        if (updatedXp >= LEVEL_THRESHOLDS[i]) newLevel = i + 1
      }

      await supabase
        .from("profiles")
        .update({
          xp: updatedXp,
          total_games: updatedGames,
          total_correct: updatedCorrect,
          level: newLevel,
        })
        .eq("id", user.id)
    }

    // ── Update daily streak ─────────────────────────────── NEW ──
    // We fire this after the profile update so the streak function
    // reads the freshest profile row. Errors are intentionally swallowed
    // so a streak failure never blocks the game result response.
    await updateUserStreak(user.id)
  }

  return Response.json({
    isCorrect,
    correctOption: question.correct_option,
    explanation: question.explanation,
    xpEarned: baseXp,
    livesRemaining: Math.max(newLives, 0),
    gameStatus: newStatus,
    totalXpEarned: newXp,
    correctAnswers: newCorrect,
    totalQuestions: session.total_questions,
    streakUpdated: isFinished,   // ← NEW: client can trigger a streak UI refresh
  })
}