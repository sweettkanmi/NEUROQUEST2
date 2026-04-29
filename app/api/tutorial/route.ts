import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// PATCH /api/tutorial
// Body: { action: "complete" | "skip" }
export async function PATCH(req: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action } = (await req.json()) as { action: "complete" | "skip" }

    if (action !== "complete" && action !== "skip") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const updates =
      action === "complete"
        ? {
            tutorial_completed: true,
            tutorial_completed_at: new Date().toISOString(),
          }
        : { tutorial_skipped: true }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, action })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}