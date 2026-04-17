import Link from "next/link"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 rpg-grid-bg">
      <div className="max-w-sm text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Revisa tu correo</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Hemos enviado un enlace de confirmacion a tu correo electronico.
          Haz clic en el para activar tu cuenta y comenzar tu aventura.
        </p>
        <Link
          href="/auth/login"
          className="text-sm text-primary hover:underline"
        >
          Volver al inicio de sesion
        </Link>
      </div>
    </main>
  )
}
