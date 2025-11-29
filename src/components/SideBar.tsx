"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdPointOfSale,
  MdAnalytics,
  MdLogout,
  MdDiscount,
} from "react-icons/md";
import { FaBoxOpen, FaTshirt } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth-actions";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: MdDashboard },
  { href: "/admin/ventas", label: "Punto de Venta", icon: MdPointOfSale },
  { href: "/admin/inventario", label: "Inventario", icon: FaTshirt },
  { href: "/admin/pacas", label: "Gestión de Pacas", icon: FaBoxOpen },
  {
    href: "/admin/liquidacion",
    label: "Liquidación / Ofertas",
    icon: MdDiscount,
  },
  { href: "/admin/reportes", label: "Reportes", icon: MdAnalytics },
];

interface SidebarProps {
  isCollapsed?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  isCollapsed = false,
  isMobile = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "bg-slate-900 text-white flex flex-col h-full transition-all duration-300 border-r border-slate-800",
        !isMobile && isCollapsed ? "w-20" : "w-64",
        isMobile ? "w-full" : "",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 border-b border-slate-800 h-16",
          !isMobile && isCollapsed ? "justify-center px-0" : "px-6",
        )}
      >
        <div className="bg-pink-600 p-2 rounded-lg shrink-0">
          <FaTshirt size={20} className="text-white" />
        </div>
        {(!isCollapsed || isMobile) && (
          <div className="overflow-hidden whitespace-nowrap">
            <h1 className="text-xl font-bold tracking-wide">ISELA</h1>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-2 overflow-y-auto mt-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              title={isCollapsed ? item.label : ""}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-pink-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
                !isMobile && isCollapsed ? "justify-center" : "",
              )}
            >
              <item.icon size={24} className="shrink-0" />

              {(!isCollapsed || isMobile) && (
                <span className="font-medium text-base whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-slate-800">
        <button
          type="button"
          onClick={() => logoutAction()}
          className={cn(
            "flex items-center gap-4 px-3 py-3 w-full text-slate-400 hover:bg-red-900/20 hover:text-red-400 rounded-xl transition-colors",
            !isMobile && isCollapsed ? "justify-center" : "",
          )}
        >
          <MdLogout size={24} className="shrink-0" />
          {(!isCollapsed || isMobile) && (
            <span className="font-medium text-base whitespace-nowrap">
              Salir
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
