export type LeaderboardKey = "day_streak" | "level" | "games_played" | "correct_answers"

export interface LeaderboardRow {
  rank: number
  username: string
  value: number
}

export interface RecordsLeaderboards {
  day_streak: LeaderboardRow[]
  level: LeaderboardRow[]
  games_played: LeaderboardRow[]
  correct_answers: LeaderboardRow[]
}