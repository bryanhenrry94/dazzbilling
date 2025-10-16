import { BookOpen, FileText } from "lucide-react"
import Link from "next/link"

export default function ContabilidadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Módulo de Contabilidad</h1>
        <p className="text-slate-600">Gestiona el sistema contable de tu empresa</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/dashboard/contabilidad/cuentas"
          className="group rounded-lg border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900 group-hover:text-blue-600">Plan de Cuentas</h3>
          <p className="text-slate-600">Administra el catálogo de cuentas contables de tu empresa</p>
        </Link>

        <Link
          href="/dashboard/contabilidad/asientos"
          className="group rounded-lg border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900 group-hover:text-green-600">Asientos Contables</h3>
          <p className="text-slate-600">Registra y consulta los movimientos contables de tu negocio</p>
        </Link>
      </div>
    </div>
  )
}
