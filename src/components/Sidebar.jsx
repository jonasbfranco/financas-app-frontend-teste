import {
  Blocks,
  CircleDollarSign,
  LayoutDashboard,
  ShieldCheck,
  Users,
  X
} from "lucide-react";
import { NavLink } from "react-router";
import { getCurrentUser, hasPermission } from "../utils/auth";

const items = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    show: () => true
  },
  {
    to: "/admin/usuarios",
    label: "Usuários",
    icon: Users,
    show: () => hasPermission("USUARIOS_GERENCIAR")
  },
  {
    to: "/admin/perfis",
    label: "Perfis de acesso",
    icon: ShieldCheck,
    show: () => hasPermission("PERFIS_GERENCIAR")
  },
  {
    to: "/admin/modulos",
    label: "Módulos",
    icon: Blocks,
    show: () => hasPermission("MODULOS_GERENCIAR")
  },
  
  {
    to: "/categoria",
    label: "Categorias das Finanças",
    icon: Blocks,
    show: () => true
  },
  {
    to: "/transacoes",
    label: "Transações das Finanças",
    icon: CircleDollarSign,
    show: () => true
  },
  {
    to: "/admin/usuarios",
    label: "Usuários",
    icon: Users,
    show: () => true
  },
];

export default function Sidebar({ open, onClose }) {
  const user = getCurrentUser();

  return (
    <>
      {open && (
        <button
          aria-label="Fechar menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-800 bg-slate-950 text-white transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div>
            <p className="text-2xl font-black tracking-tight">FINAN</p>
            <p className="text-xs text-slate-400">Portal Finanças</p>
          </div>

          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-800 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-5">
          <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="truncate font-semibold">{user?.nome || user?.login}</p>
            <p className="mt-1 text-xs text-slate-400">
              {user?.role === "ADMIN" ? "Administrador" : user?.perfil_nome || "Usuário"}
            </p>
          </div>

          <nav className="space-y-1">
            {items.filter((item) => item.show()).map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
