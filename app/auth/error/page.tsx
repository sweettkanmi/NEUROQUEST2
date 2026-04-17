import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 rpg-grid-bg">
      <div className="max-w-sm text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Error de autenticacion</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Algo salio mal al verificar tu cuenta. El enlace puede haber expirado.
        </p>
        <Link
          href="/auth/login"
          className="text-sm text-primary hover:underline"
        >
          Intentar de nuevo
        </Link>
      </div>
    </main>
  )
}
