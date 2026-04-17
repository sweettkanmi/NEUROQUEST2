// Este endpoint ha sido reemplazado por dos rutas separadas:
// POST /api/game/chest/save  → guarda cofre al inventario al terminar partida
// POST /api/game/chest/open  → abre cofre con ruleta y da item

export async function POST() {
  return Response.json(
    {
      error:
        "Endpoint deprecado. Usa /api/game/chest/save para guardar cofres y /api/game/chest/open para abrirlos.",
    },
    { status: 410 }
  )
}