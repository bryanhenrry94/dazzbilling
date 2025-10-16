import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-4xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Sistema de Facturación Electrónica
          </h1>
          <p className="text-pretty text-lg text-slate-600 sm:text-xl">
            Solución completa para la emisión de facturas electrónicas en Ecuador. Cumple con todas las normativas del
            SRI.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-slate-900 hover:bg-slate-800">
            <Link href="/auth/register">Comenzar Gratis</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-slate-300 bg-transparent">
            <Link href="/auth/login">Iniciar Sesión</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">Fácil de usar</h3>
            <p className="text-sm text-slate-600">Interfaz intuitiva diseñada para PYMEs</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">Cumplimiento SRI</h3>
            <p className="text-sm text-slate-600">Cumple con todas las normativas ecuatorianas</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">Gestión completa</h3>
            <p className="text-sm text-slate-600">Clientes, productos y facturación en un solo lugar</p>
          </div>
        </div>
      </div>
    </div>
  )
}
