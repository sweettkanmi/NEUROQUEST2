"use client"

import { useStreak } from "@/lib/streak/streak-context"
import { cn } from "@/lib/utils"

function FireIconLit({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2C12 2 6 8.5 6 13.5C6 17.09 8.69 20 12 20C15.31 20 18 17.09 18 13.5C18 8.5 12 2 12 2Z" />
      <path
        d="M12 8C12 8 9 12 9 14.5C9 16.16 10.34 17.5 12 17.5C13.66 17.5 15 16.16 15 14.5C15 12 12 8 12 8Z"
        fill="white"
        fillOpacity="0.35"
      />
    </svg>
  )
}

function FireIconGray({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2C12 2 6 8.5 6 13.5C6 17.09 8.69 20 12 20C15.31 20 18 17.09 18 13.5C18 8.5 12 2 12 2Z" />
    </svg>
  )
}

interface StreakIndicatorProps {
  variant?: "compact" | "full"
  className?: string
}

export function StreakIndicator({ variant = "compact", className }: StreakIndicatorProps) {
  const { streak, isLoading } = useStreak()
  const { current_streak, longest_streak, active_today } = streak

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-1 select-none",
          isLoading && "opacity-60 pointer-events-none",
          className,
        )}
        title={
          active_today
            ? `¡Racha activa! ${current_streak} día${current_streak !== 1 ? "s" : ""} consecutivos`
            : "Completa una actividad para mantener tu racha"
        }
        aria-label={`Racha: ${current_streak} días`}
      >
        {active_today ? (
          <FireIconLit className="w-5 h-5 text-orange-500 drop-shadow-[0_0_6px_rgba(249,115,22,0.7)]" />
        ) : (
          <FireIconGray className="w-5 h-5 text-muted-foreground/50" />
        )}
        <span
          className={cn(
            "text-sm font-mono font-semibold tabular-nums",
            active_today ? "text-orange-500" : "text-muted-foreground/60",
          )}
        >
          {current_streak}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300",
        active_today ? "border-orange-500/40 bg-orange-500/10" : "border-border/50 bg-card",
        isLoading && "opacity-60",
        className,
      )}
      aria-label={`Racha diaria: ${current_streak} días`}
    >
      <div className="relative">
        {active_today ? (
          <>
            <FireIconLit className="w-8 h-8 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-orange-400" />
          </>
        ) : (
          <FireIconGray className="w-8 h-8 text-muted-foreground/40" />
        )}
      </div>

      <div className="text-center">
        <p className={cn(
          "text-2xl font-bold font-mono tabular-nums leading-none",
          active_today ? "text-orange-500" : "text-muted-foreground/50",
        )}>
          {current_streak}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {current_streak === 1 ? "día" : "días"}
        </p>
      </div>

      <p className="text-xs text-muted-foreground text-center leading-tight">
        {active_today ? (
          <span className="text-orange-400 font-medium">¡Racha activa hoy!</span>
        ) : (
          "Completa una actividad"
        )}
      </p>

      {longest_streak > 0 && (
        <p className="text-[10px] text-muted-foreground/60">
          Récord: {longest_streak} {longest_streak === 1 ? "día" : "días"}
        </p>
      )}
    </div>
  )
}