"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ClienteForm } from "./customer-form"

export function ClienteFormButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-slate-900 hover:bg-slate-800">
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Cliente
      </Button>
      <ClienteForm open={open} onOpenChange={setOpen} />
    </>
  )
}
