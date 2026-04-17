import { redirect } from "next/navigation"

export default function SignUpSuccessPage() {
  // Redirect to login page - users should sign in after registration
  redirect("/auth/login")
}
