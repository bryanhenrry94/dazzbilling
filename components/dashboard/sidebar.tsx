"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Panel", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Configuración",
    href: "/dashboard/settings",
    icon: Package,
  },
  {
    name: "Gestión",
    icon: Users,
    children: [
      { name: "Clientes", href: "/dashboard/customers", icon: Users },
      { name: "Productos", href: "/dashboard/products", icon: Package },
    ],
  },
  { name: "Facturas", href: "/dashboard/invoices", icon: FileText },
];

import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const handleToggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <h1 className="text-xl font-bold text-slate-700">FacturaEC</h1>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide pl-2">
            Menú Principal
          </span>
        </div>
        {navigation.map((item) => {
          if (item.children) {
            return (
              <div key={item.name} className="mb-2">
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none group",
                    openMenus[item.name]
                      ? "bg-slate-900 text-white shadow"
                      : "text-slate-700 hover:bg-slate-100 hover:shadow"
                  )}
                  onClick={() => handleToggleMenu(item.name)}
                >
                  <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  {item.name}
                  <span className="ml-auto text-xs">
                    {openMenus[item.name] ? (
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M6 15l6-6 6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </button>
                {openMenus[item.name] && (
                  <div className="ml-6 mt-1 space-y-1 border-l border-slate-100 pl-3">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isActive =
                        pathname === child.href ||
                        pathname?.startsWith(child.href + "/");
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium transition-colors group",
                            isActive
                              ? "bg-slate-900 text-white shadow"
                              : "text-slate-700 hover:bg-slate-100 hover:shadow"
                          )}
                        >
                          <ChildIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          } else {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-700 hover:bg-slate-100 hover:shadow"
                )}
              >
                <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                {item.name}
              </Link>
            );
          }
        })}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-700 hover:bg-slate-100"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
