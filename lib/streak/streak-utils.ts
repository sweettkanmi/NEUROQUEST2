export interface StreakData {
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  active_today: boolean
}

export interface StreakUpdateResult {
  current_streak: number
  longest_streak: number
  already_counted: boolean
}

export function getTodayUtc(): string {
  return new Date().toISOString().slice(0, 10)
}

export function isStreakActiveToday(lastActivityDate: string | null): boolean {
  if (!lastActivityDate) return false
  return lastActivityDate === getTodayUtc()
}

export function buildStreakData(profile: {
  current_streak?: number | null
  longest_streak?: number | null
  last_activity_date?: string | null
}): StreakData {
  const lastActivityDate = profile.last_activity_date ?? null

  return {
    current_streak: profile.current_streak ?? 0,
    longest_streak: profile.longest_streak ?? 0,
    last_activity_date: lastActivityDate,
    active_today: isStreakActiveToday(lastActivityDate),
  }
}