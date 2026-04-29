"use client"

import { StreakIndicator } from "@/components/streak/streak-indicator"

export function StreakNavBadge() {
  return (
    <div className="absolute top-0 right-16 h-full hidden sm:flex items-center pointer-events-auto">
      <StreakIndicator variant="compact" />
    </div>
  )
}