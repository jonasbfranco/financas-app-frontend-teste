import { LogOut, Menu, UserRound } from "lucide-react";
import { useNavigate } from "react-router";
import { getCurrentUser, logout } from "../utils/auth";

export default function Header({ onMenu }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenu}
            className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <p className="font-semibold text-slate-900">Sistema Financeiro</p>
            <p className="text-xs text-slate-500">Gestão centralizada de receitas e despesas</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">{user?.nome}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <UserRound className="h-5 w-5" />
          </div>

          <button
            onClick={handleLogout}
            title="Sair"
            className="rounded-xl p-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
