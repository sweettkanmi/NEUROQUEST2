"use client"

import { motion } from "framer-motion"
import { InventoryItem } from "@/lib/types"
import { Heart, Divide, SkipForward, Zap, Lightbulb } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ITEM_ICONS: Record<string, React.ElementType> = {
  extra_life: Heart,
  fifty_fifty: Divide,
  skip_question: SkipForward,
  double_xp: Zap,
  hint: Lightbulb,
}

interface PowerUpBarProps {
  inventory: InventoryItem[]
  onUseItem: (itemType: string) => void
  disabled: boolean
}

export function PowerUpBar({ inventory, onUseItem, disabled }: PowerUpBarProps) {
  if (inventory.length === 0) return null

  return (
    <div className="border-t border-border/50 bg-rpg-surface px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs text-muted-foreground mb-2">Power-ups:</p>
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={200}>
            {inventory.map((item) => {
              const Icon = ITEM_ICONS[item.item_type] || Zap
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <motion.button
                      className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors ${
                        disabled
                          ? "border-border text-muted-foreground opacity-50 cursor-not-allowed"
                          : "border-border text-foreground hover:border-primary hover:bg-primary/5 cursor-pointer"
                      }`}
                      onClick={() => !disabled && onUseItem(item.item_type)}
                      whileHover={!disabled ? { scale: 1.05 } : {}}
                      whileTap={!disabled ? { scale: 0.95 } : {}}
                      disabled={disabled}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-mono">{item.quantity}</span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-medium">{item.item_name}</p>
                    <p className="text-xs text-muted-foreground">{item.item_description}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
