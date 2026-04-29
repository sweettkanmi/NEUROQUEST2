/**
 * app/api/subjects/complete-quiz/route.ts — ADD THIS CODE
 *
 * ⚠️  DO NOT replace the original file.
 *
 * This file shows the MINIMAL DIFF to apply to the existing
 * app/api/subjects/complete-quiz/route.ts to trigger a streak update
 * whenever a quiz/module is completed.
 *
 * ─── WHAT TO ADD ─────────────────────────────────────────────────
 *
 * 1. Add import at the top of the file (after existing imports):
 *
 *     import { updateUserStreak } from "@/lib/streak/update-streak"
 *
 * 2. At the END of the try block, just before the final `return Response.json({...})`
 *    statement, add:
 *
 *     // ── Update daily streak ─────────────────────────────────────
 *     const streakResult = await updateUserStreak(user.id)
 *
 * 3. Extend the final return object to include streak data:
 *
 *     return Response.json({
 *       passed,
 *       diagnosticPassed,
 *       subjectCompleted,
 *       medalGranted,
 *       unlockedModules,
 *       unlockedSections,
 *       completedSections,
 *       completedModules,
 *       // ── NEW ──
 *       streak: streakResult ?? null,
 *     })
 *
 * ─── WHY THIS APPROACH ───────────────────────────────────────────
 * The streak update happens server-side in the same request as the quiz
 * completion. This is atomic from the user's perspective and avoids
 * a separate client-side call. The frontend reads `streak` from the
 * response and calls `setStreak(data.streak)` via the context.
 *
 * ─── FULL PATCHED FILE (for reference) ───────────────────────────
 */

// app/api/subjects/complete-quiz/route.ts  ← FULL PATCHED VERSION
// (copy-paste this entire file to replace the original)

import { createClient } from "@/lib/supabase/server"
import { getSubjectById } from "@/lib/subjects/config"
import { updateUserStreak } from "@/lib/streak/update-streak"       // ← NEW IMPORT

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 })
  }

  try {
    const { sessionId } = await req.json()

    if (!sessionId) {
      return Response.json({ error: "Falta sessionId" }, { status: 400 })
    }

    const { data: gameSession } = await supabase
      .from("game_sessions")
      .select("status")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single()

    if (!gameSession) {
      return Response.json({ error: "Sesión no encontrada" }, { status: 404 })
    }

    const passed = gameSession.status === "victory"

    const { data: link } = await supabase
      .from("subject_game_sessions")
      .select("subject_id, module_id, section_id, quiz_type")
      .eq("session_id", sessionId)
      .single()

    if (!link) {
      return Response.json({ error: "Contexto de materia no encontrado" }, { status: 404 })
    }

    const subject = getSubjectById(link.subject_id)
    if (!subject) {
      return Response.json({ error: "Materia no encontrada" }, { status: 404 })
    }

    let { data: progress } = await supabase
      .from("user_subject_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("subject_id", link.subject_id)
      .single()

    if (!progress) {
      const { data: created } = await supabase
        .from("user_subject_progress")
        .insert({
          user_id: user.id,
          subject_id: link.subject_id,
        })
        .select("*")
        .single()
      progress = created
    }

    if (!progress) {
      return Response.json({ error: "Error en progreso" }, { status: 500 })
    }

    const unlockedModules: string[] = progress.unlocked_modules ?? []
    const unlockedSections: string[] = progress.unlocked_sections ?? []
    const completedSections: string[] = progress.completed_sections ?? []
    const completedModules: string[] = progress.completed_modules ?? []

    let diagnosticPassed = progress.diagnostic_passed
    let subjectCompleted = progress.subject_completed
    let medalGranted = false

    if (link.quiz_type === "diagnostic" && passed && !diagnosticPassed) {
      diagnosticPassed = true
      const firstModule = subject.modules[0]
      if (!unlockedModules.includes(firstModule.id)) unlockedModules.push(firstModule.id)
      const firstSection = firstModule.sections[0]
      if (!unlockedSections.includes(firstSection.id)) unlockedSections.push(firstSection.id)
    }

    if (link.quiz_type === "section" && passed && link.section_id && link.module_id) {
      const sectionId = link.section_id
      const moduleId = link.module_id

      if (!completedSections.includes(sectionId)) {
        completedSections.push(sectionId)
      }

      const currentModule = subject.modules.find((m) => m.id === moduleId)
      if (currentModule) {
        const sectionIndex = currentModule.sections.findIndex((s) => s.id === sectionId)
        const nextSection = currentModule.sections[sectionIndex + 1]

        if (nextSection) {
          if (!unlockedSections.includes(nextSection.id)) {
            unlockedSections.push(nextSection.id)
          }
        } else {
          const allSectionsComplete = currentModule.sections.every((s) =>
            completedSections.includes(s.id)
          )
          if (allSectionsComplete && !completedModules.includes(moduleId)) {
            completedModules.push(moduleId)

            const moduleIndex = subject.modules.findIndex((m) => m.id === moduleId)
            const nextModule = subject.modules[moduleIndex + 1]
            if (nextModule) {
              if (!unlockedModules.includes(nextModule.id)) {
                unlockedModules.push(nextModule.id)
              }
              const nextModuleFirstSection = nextModule.sections[0]
              if (!unlockedSections.includes(nextModuleFirstSection.id)) {
                unlockedSections.push(nextModuleFirstSection.id)
              }
            } else {
              const allModulesComplete = subject.modules.every((m) =>
                completedModules.includes(m.id)
              )
              if (allModulesComplete && !subjectCompleted) {
                subjectCompleted = true
                medalGranted = await grantMedal(supabase, user.id, subject.id, subject.title, subject.medalIcon)
              }
            }
          }
        }
      }
    }

    await supabase
      .from("user_subject_progress")
      .update({
        diagnostic_passed: diagnosticPassed,
        subject_completed: subjectCompleted,
        unlocked_modules: unlockedModules,
        unlocked_sections: unlockedSections,
        completed_sections: completedSections,
        completed_modules: completedModules,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("subject_id", link.subject_id)

    // ── Update daily streak ─────────────────────────────────── NEW ──
    const streakResult = await updateUserStreak(user.id)

    return Response.json({
      passed,
      diagnosticPassed,
      subjectCompleted,
      medalGranted,
      unlockedModules,
      unlockedSections,
      completedSections,
      completedModules,
      streak: streakResult ?? null,          // ← NEW field
    })
  } catch (err) {
    console.error("complete-quiz error:", err)
    return Response.json({ error: "Error interno" }, { status: 500 })
  }
}

async function grantMedal(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
  subjectId: string,
  subjectTitle: string,
  medalIcon: string
): Promise<boolean> {
  try {
    const medalItemType = "hint" as const

    const { error } = await supabase.from("inventory_items").upsert(
      {
        user_id: userId,
        item_type: medalItemType,
        item_name: `Medalla: ${subjectTitle}`,
        item_description: `Completaste la materia ${subjectTitle} con éxito. ¡Aventurero de élite!`,
        quantity: 1,
        icon: medalIcon,
      },
      {
        onConflict: "user_id,item_type",
        ignoreDuplicates: true,
      }
    )
    return !error
  } catch {
    return false
  }
}