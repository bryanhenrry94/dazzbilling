import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, FileText, DollarSign } from "lucide-react"

interface StatsCardsProps {
  totalClientes: number
  totalProductos: number
  totalFacturas: number
  ingresosMes: number
}

export function StatsCards({ totalClientes, totalProductos, totalFacturas, ingresosMes }: StatsCardsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const stats = [
    {
      title: "Clientes",
      value: totalClientes,
      icon: Users,
      description: "Total de clientes",
    },
    {
      title: "Productos",
      value: totalProductos,
      icon: Package,
      description: "Total de productos",
    },
    {
      title: "Facturas",
      value: totalFacturas,
      icon: FileText,
      description: "Total de facturas",
    },
    {
      title: "Ingresos del Mes",
      value: formatPrice(ingresosMes),
      icon: DollarSign,
      description: "Facturas emitidas",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-500">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
