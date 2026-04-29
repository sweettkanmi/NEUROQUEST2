import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LeaderboardRow, RecordsLeaderboards } from "@/lib/records/types"
import { Flame, Gamepad2, RefreshCw, Star, Target, Trophy, type LucideIcon } from "lucide-react"

type LeaderboardConfig = {
  title: string
  description: string
  valueLabel: string
  emptyText: string
  icon: LucideIcon
  accentClassName: string
  rows: LeaderboardRow[]
}

interface RecordsContentProps {
  leaderboards: RecordsLeaderboards
}

export function RecordsContent({ leaderboards }: RecordsContentProps) {
  const leaderboardConfigs: LeaderboardConfig[] = [
    {
      title: "Day Streak",
      description: "Rachas diarias activas",
      valueLabel: "dias",
      emptyText: "Todavia no hay rachas registradas.",
      icon: Flame,
      accentClassName: "text-rpg-health",
      rows: leaderboards.day_streak,
    },
    {
      title: "Nivel",
      description: "Jugadores con mayor nivel",
      valueLabel: "nivel",
      emptyText: "Todavia no hay niveles registrados.",
      icon: Star,
      accentClassName: "text-rpg-gold",
      rows: leaderboards.level,
    },
    {
      title: "Cantidad de partidas",
      description: "Total de sesiones jugadas",
      valueLabel: "partidas",
      emptyText: "Todavia no hay partidas registradas.",
      icon: Gamepad2,
      accentClassName: "text-primary",
      rows: leaderboards.games_played,
    },
    {
      title: "Aciertos",
      description: "Total de respuestas correctas",
      valueLabel: "aciertos",
      emptyText: "Todavia no hay aciertos registrados.",
      icon: Target,
      accentClassName: "text-rpg-mana",
      rows: leaderboards.correct_answers,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-rpg-gold" />
            RECORDS
          </div>

          <h1 className="text-2xl font-bold text-foreground">Leaderboards de NeuroQuest</h1>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Top 50 por categoria. Cada tablero usa datos reales de Supabase y se revalida cada 3 horas.
          </p>
        </div>

        <Badge variant="secondary" className="w-fit gap-1.5 rounded-full px-3 py-1 text-xs">
          <RefreshCw className="h-3.5 w-3.5" />
          Actualizacion cada 3h
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {leaderboardConfigs.map((leaderboard) => (
          <LeaderboardCard key={leaderboard.title} leaderboard={leaderboard} />
        ))}
      </div>
    </div>
  )
}

function LeaderboardCard({ leaderboard }: { leaderboard: LeaderboardConfig }) {
  const Icon = leaderboard.icon
  const topPlayer = leaderboard.rows[0]

  return (
    <Card className="overflow-hidden border-border/50 bg-card/95 py-0">
      <CardHeader className="border-b border-border/50 px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/70">
              <Icon className={`h-5 w-5 ${leaderboard.accentClassName}`} />
            </div>

            <div>
              <CardTitle className="text-base text-foreground">{leaderboard.title}</CardTitle>
              <CardDescription>{leaderboard.description}</CardDescription>
            </div>
          </div>

          {topPlayer ? (
            <div className="hidden rounded-lg border border-border/50 bg-secondary/40 px-3 py-2 text-right sm:block">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Top 1</p>
              <p className="max-w-28 truncate text-sm font-semibold text-foreground">{topPlayer.username}</p>
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-[4rem_1fr_7rem] border-b border-border/50 bg-secondary/25 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:grid-cols-[4.5rem_1fr_8rem] sm:px-5">
          <span>Rank</span>
          <span>Usuario</span>
          <span className="text-right">Record</span>
        </div>

        <div className="h-[360px] overflow-y-auto">
          {leaderboard.rows.length > 0 ? (
            <div className="divide-y divide-border/40">
              {leaderboard.rows.map((row) => (
                <LeaderboardRowItem
                  key={`${leaderboard.title}-${row.rank}-${row.username}`}
                  row={row}
                  valueLabel={leaderboard.valueLabel}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
              {leaderboard.emptyText}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function LeaderboardRowItem({ row, valueLabel }: { row: LeaderboardRow; valueLabel: string }) {
  return (
    <div className="grid grid-cols-[4rem_1fr_7rem] items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-secondary/30 sm:grid-cols-[4.5rem_1fr_8rem] sm:px-5">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary font-mono text-xs font-bold text-foreground">
          #{row.rank}
        </span>
      </div>

      <p className="truncate font-medium text-foreground">{row.username}</p>

      <div className="text-right">
        <p className="font-mono text-sm font-bold text-rpg-gold">{row.value.toLocaleString("es-CO")}</p>
        <p className="text-[10px] text-muted-foreground">{valueLabel}</p>
      </div>
    </div>
  )
}