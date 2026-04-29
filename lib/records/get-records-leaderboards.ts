import { createClient } from "@/lib/supabase/server"
import type { LeaderboardRow, RecordsLeaderboards } from "@/lib/records/types"

const EMPTY_LEADERBOARDS: RecordsLeaderboards = {
  day_streak: [],
  level: [],
  games_played: [],
  correct_answers: [],
}

function normalizeRows(value: unknown): LeaderboardRow[] {
  if (!Array.isArray(value)) return []

  return value
    .map((row) => {
      if (!row || typeof row !== "object") return null

      const record = row as Record<string, unknown>

      const rank = Number(record.rank)
      const username =
        typeof record.username === "string" && record.username.trim().length > 0
          ? record.username
          : "Aventurero"
      const numericValue = Number(record.value)

      if (!Number.isFinite(rank) || !Number.isFinite(numericValue)) return null

      return {
        rank,
        username,
        value: numericValue,
      }
    })
    .filter((row): row is LeaderboardRow => row !== null)
}

export async function getRecordsLeaderboards(): Promise<RecordsLeaderboards> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("get_records_leaderboards", {
    p_limit: 50,
  })

  if (error) {
    console.error("get_records_leaderboards error:", error)
    return EMPTY_LEADERBOARDS
  }

  const payload = data && typeof data === "object" ? (data as Record<string, unknown>) : {}

  return {
    day_streak: normalizeRows(payload.day_streak),
    level: normalizeRows(payload.level),
    games_played: normalizeRows(payload.games_played),
    correct_answers: normalizeRows(payload.correct_answers),
  }
}