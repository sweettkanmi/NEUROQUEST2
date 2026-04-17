import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InventoryClient } from "@/components/inventory/inventory-client"

export default async function InventoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const [{ data: inventory }, { data: chests }] = await Promise.all([
    supabase
      .from("inventory_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("chests")
      .select("id, is_opened, created_at, game_session_id, rarity, perk_type")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ])

  return <InventoryClient items={inventory ?? []} chests={chests ?? []} />
}
