import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { redirect } from "next/navigation"

export default function SignUpSuccessPage() {
  // With email confirmation disabled, users should go directly to dashboard
  // This page is kept as a fallback but will redirect
  redirect("/dashboard")
  
  return (
    <main className="min-h-screen flex items-center justify-center px-6 rpg-grid-bg">
      <div className="max-w-sm text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Cuenta creada</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Tu cuenta ha sido creada exitosamente.
          Ahora puedes iniciar sesion y comenzar tu aventura.
        </p>
        <Link
          href="/auth/login"
          className="text-sm text-primary hover:underline"
        >
          Iniciar sesion
        </Link>
      </div>
    </main>
  )
}
