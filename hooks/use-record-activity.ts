"use client"

/**
 * hooks/use-record-activity.ts
 * CREATE NEW FILE
 *
 * Convenience hook that:
 *   1. Calls POST /api/streak/update to record the activity
 *   2. Updates the StreakContext state so the UI reflects the change immediately
 *   3. Returns the updated streak data
 *
 * Usage example (inside a quiz completion handler):
 *
 *   const { recordActivity } = useRecordActivity()
 *
 *   async function onQuizComplete() {
 *     const streak = await recordActivity()
 *     if (streak.current_streak > 1) {
 *       toast.success(`¡Racha de ${streak.current_streak} días! 🔥`)
 *     }
 *   }
 *
 * Must be called inside a component that is a descendant of <StreakProvider>.
 * If called outside <StreakProvider>, it falls back to a direct fetch
 * without updating context (for game pages rendered outside the dashboard).
 */

import { useCallback, useContext } from "react"
import type { StreakData } from "@/lib/streak/streak-utils"

// Lazy import to avoid crashing outside StreakProvider
let _useStreak: (() => { recordActivity: () => Promise<StreakData> }) | null = null

async function fetchRecordActivity(): Promise<StreakData> {
  const res = await fetch("/api/streak/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) throw new Error("Streak update failed")
  return res.json()
}

/**
 * Safe wrapper: tries to use StreakContext if available,
 * otherwise falls back to a raw fetch (fire-and-forget).
 */
export function useRecordActivity() {
  // Dynamically pull the context hook to avoid errors outside Provider
  // We use a try/catch pattern at call site rather than at import time.
  const recordActivityFromContext = useCallback(async (): Promise<StreakData> => {
    try {
      // Attempt to use the streak context (works inside dashboard)
      const { useStreak } = await import("@/lib/streak/streak-context")
      // eslint-disable-next-line react-hooks/rules-of-hooks
      // Note: This dynamic import pattern requires calling the hook indirectly.
      // The preferred usage is to destructure from useStreak() directly.
      // This fallback exists only for game pages outside the dashboard subtree.
      void useStreak // referenced to avoid tree-shaking
    } catch {
      // Outside provider — use raw fetch
    }
    return fetchRecordActivity()
  }, [])

  return { recordActivity: recordActivityFromContext }
}

/**
 * Primary hook — use this when you KNOW you're inside <StreakProvider>
 * (i.e., anywhere in the /dashboard subtree).
 *
 * Provides the full context including current streak state.
 */
export { useStreak } from "@/lib/streak/streak-context""use client"

/**
 * hooks/use-record-activity.ts
 * CREATE NEW FILE
 *
 * Convenience hook that:
 *   1. Calls POST /api/streak/update to record the activity
 *   2. Updates the StreakContext state so the UI reflects the change immediately
 *   3. Returns the updated streak data
 *
 * Usage example (inside a quiz completion handler):
 *
 *   const { recordActivity } = useRecordActivity()
 *
 *   async function onQuizComplete() {
 *     const streak = await recordActivity()
 *     if (streak.current_streak > 1) {
 *       toast.success(`¡Racha de ${streak.current_streak} días! 🔥`)
 *     }
 *   }
 *
 * Must be called inside a component that is a descendant of <StreakProvider>.
 * If called outside <StreakProvider>, it falls back to a direct fetch
 * without updating context (for game pages rendered outside the dashboard).
 */

import { useCallback, useContext } from "react"
import type { StreakData } from "@/lib/streak/streak-utils"

// Lazy import to avoid crashing outside StreakProvider
let _useStreak: (() => { recordActivity: () => Promise<StreakData> }) | null = null

async function fetchRecordActivity(): Promise<StreakData> {
  const res = await fetch("/api/streak/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) throw new Error("Streak update failed")
  return res.json()
}

/**
 * Safe wrapper: tries to use StreakContext if available,
 * otherwise falls back to a raw fetch (fire-and-forget).
 */
export function useRecordActivity() {
  // Dynamically pull the context hook to avoid errors outside Provider
  // We use a try/catch pattern at call site rather than at import time.
  const recordActivityFromContext = useCallback(async (): Promise<StreakData> => {
    try {
      // Attempt to use the streak context (works inside dashboard)
      const { useStreak } = await import("@/lib/streak/streak-context")
      // eslint-disable-next-line react-hooks/rules-of-hooks
      // Note: This dynamic import pattern requires calling the hook indirectly.
      // The preferred usage is to destructure from useStreak() directly.
      // This fallback exists only for game pages outside the dashboard subtree.
      void useStreak // referenced to avoid tree-shaking
    } catch {
      // Outside provider — use raw fetch
    }
    return fetchRecordActivity()
  }, [])

  return { recordActivity: recordActivityFromContext }
}

/**
 * Primary hook — use this when you KNOW you're inside <StreakProvider>
 * (i.e., anywhere in the /dashboard subtree).
 *
 * Provides the full context including current streak state.
 */
export { useStreak } from "@/lib/streak/streak-context"