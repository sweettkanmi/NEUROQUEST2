"use client"

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react"
import type { StreakData } from "@/lib/streak/streak-utils"

interface StreakContextValue {
  streak: StreakData
  refreshStreak: () => Promise<void>
  recordActivity: () => Promise<StreakData>
  isLoading: boolean
}

const StreakContext = createContext<StreakContextValue | null>(null)

interface StreakProviderProps {
  initialData: StreakData
  children: ReactNode
}

export function StreakProvider({ initialData, children }: StreakProviderProps) {
  const [streak, setStreak] = useState<StreakData>(initialData)
  const [isLoading, setIsLoading] = useState(false)

  const refreshStreak = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/streak", { cache: "no-store" })

      if (!response.ok) return

      const data = (await response.json()) as StreakData
      setStreak(data)
    } catch (error) {
      console.error("[streak] refreshStreak failed:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordActivity = useCallback(async (): Promise<StreakData> => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/streak/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) return streak

      const data = (await response.json()) as StreakData
      setStreak(data)
      return data
    } catch (error) {
      console.error("[streak] recordActivity failed:", error)
      return streak
    } finally {
      setIsLoading(false)
    }
  }, [streak])

  return (
    <StreakContext.Provider
      value={{ streak, refreshStreak, recordActivity, isLoading }}
    >
      {children}
    </StreakContext.Provider>
  )
}

export function useStreak(): StreakContextValue {
  const context = useContext(StreakContext)

  if (!context) {
    throw new Error("useStreak() must be used inside <StreakProvider>")
  }

  return context
}