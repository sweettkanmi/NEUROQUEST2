import { createClient } from "@/lib/supabase/server"
import type { ChestReward } from "@/lib/types"

const ITEM_ICONS: Record<string, string> = {
  extra_life: "❤️",
  fifty_fifty: "⚖️",
  skip_question: "⏭️",
  double_xp: "⚡",
  hint: "💡",
}

const CHEST_POOL: ChestReward[] = [
  { item_type: "extra_life",    item_name: "Vida Extra",       item_description: "Recupera una vida durante la batalla",              rarity: "common"    },
  { item_type: "fifty_fifty",   item_name: "50/50",            item_description: "Elimina dos opciones incorrectas",                  rarity: "rare"      },
  { item_type: "skip_question", item_name: "Saltar Pregunta",  item_description: "Salta una pregunta sin perder vida",                rarity: "rare"      },
  { item_type: "double_xp",     item_name: "Doble XP",         item_description: "Duplica la XP de tu proxima respuesta correcta",   rarity: "legendary" },
  { item_type: "hint",          item_name: "Pista",            item_description: "Recibe una pista sobre la respuesta correcta",      rarity: "common"    },
]

function rollChest(): ChestReward {
  const roll = Math.random()
  let pool: ChestReward[]
  if (roll < 0.1)       pool = CHEST_POOL.filter((i) => i.rarity === "legendary")
  else if (roll < 0.35) pool = CHEST_POOL.filter((i) => i.rarity === "rare")
  else                  pool = CHEST_POOL.filter((i) => i.rarity === "common")
  if (pool.length === 0) pool = CHEST_POOL
  return pool[Math.floor(Math.random() * pool.length)]
}

function buildRouletteItems(): ChestReward[] {
  const expanded = [...CHEST_POOL, ...CHEST_POOL, ...CHEST_POOL, ...CHEST_POOL]
  for (let i = expanded.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[expanded[i], expanded[j]] = [expanded[j], expanded[i]]
  }
  return expanded
}

// POST /api/game/chest/open
export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 })
  }

  const { chestId } = await req.json()

  if (!chestId) {
    return Response.json({ error: "Falta chestId" }, { status: 400 })
  }

  // Verificar que el cofre existe, es de este usuario y no fue abierto
  const { data: chest, error: chestError } = await supabase
    .from("chests")
    .select("id, is_opened")
    .eq("id", chestId)
    .eq("user_id", user.id)
    .single()

  if (chestError || !chest) {
    console.error("[chest/open] chest error:", chestError)
    return Response.json({ error: "Cofre no encontrado", detail: chestError?.message }, { status: 404 })
  }

  if (chest.is_opened) {
    return Response.json({ error: "El cofre ya fue abierto" }, { status: 400 })
  }

  const reward = rollChest()
  const rouletteItems = buildRouletteItems()

  // Marcar cofre como abierto y guardar la rareza obtenida
  const { error: updateError } = await supabase
    .from("chests")
    .update({
      is_opened: true,
      rarity: reward.rarity,
      perk_type: reward.item_type,
    })
    .eq("id", chestId)

  if (updateError) {
    console.error("[chest/open] update error:", updateError)
    return Response.json({ error: "Error al abrir cofre", detail: updateError.message }, { status: 500 })
  }

  // Guardar el item en el inventario
  const icon = ITEM_ICONS[reward.item_type] ?? "⚡"

  const { data: existingItem } = await supabase
    .from("inventory_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("item_type", reward.item_type)
    .maybeSingle()

  if (existingItem) {
    await supabase
      .from("inventory_items")
      .update({ quantity: existingItem.quantity + 1 })
      .eq("id", existingItem.id)
  } else {
    await supabase.from("inventory_items").insert({
      user_id: user.id,
      item_type: reward.item_type,
      item_name: reward.item_name,
      item_description: reward.item_description,
      icon,
    })
  }

  return Response.json({ reward, rouletteItems })
}
