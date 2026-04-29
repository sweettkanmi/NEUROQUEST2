"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Swords, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      toast.error("Por favor completa todos los campos")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      })

      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Credenciales incorrectas. Verifica tu correo y contrasena.")
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Tu cuenta no ha sido confirmada. Contacta al administrador.")
        } else {
          toast.error(error.message)
        }
        return
      }

      toast.success("Bienvenido de vuelta, aventurero!")
      router.push("/dashboard")
      router.refresh()
    } catch {
      toast.error("Error de conexion. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }, [email, password, router])

  return (
    <main className="min-h-screen flex items-center justify-center px-6 rpg-grid-bg">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4 glow-primary">
            <Swords className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Iniciar Sesion</h1>
          <p className="text-sm text-muted-foreground mt-1">Continua tu aventura</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-foreground">Correo electronico</Label>
            <Input
              id="email"
              type="email"
              placeholder="aventurero@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-foreground">Contrasena</Label>
            <Input
              id="password"
              type="password"
              placeholder="Tu contrasena secreta"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input border-border text-foreground"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Entrar al reino"
            )}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          No tienes cuenta?{" "}
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Registrate aqui
          </Link>
        </p>
        <p className="text-xs text-center text-muted-foreground mt-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            Volver al inicio
          </Link>
        </p>
      </div>
    </main>
  )
}
