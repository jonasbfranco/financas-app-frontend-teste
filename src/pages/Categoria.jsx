import { Pencil, Plus, Power, Search, Trash, UserCheck, UserX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api"
import PageTitle from "../components/PageTitle";


const emptyForm = {
  id: null,
  nome: "",
  tipo: "",
  ativo: ""
};

export default function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");

  async function carregar() {

    const u = await api.get("/api/v1/categoria");

    //return console.log(u.data.categorias);
    setCategorias(u.data.categoria);
  }



  useEffect(() => {
    carregar().catch(() => setStatus("Não foi possível carregar as categorias."));
  }, []);



  const filtrados = useMemo(() => {
    const q = busca.toLowerCase();
    return categorias.filter((u) =>
      [u.nome, u.tipo].some((v) =>
        String(v || "").toLowerCase().includes(q)
      )
    );
  }, [categorias, busca]);

  function novo() {
    setForm(emptyForm);
    setShowForm(true);
    setStatus("");
  }

  function editar(cat) {
    setForm({
      id: cat.id,
      nome: cat.nome,
      tipo: cat.login,
      ativo: cat.ativo
    });
    setShowForm(true);
    setStatus("");
  }


  async function salvar(e) {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.senha) delete payload.senha;
      if (!payload.ativo) payload.senha;

      if (form.id) {
        await api.put(`/api/v1/usuario/${form.id}`, payload);
        setStatus("Usuário atualizado com sucesso.");
      } else {
        await api.post("/api/v1/usuario", payload);
        setStatus("Usuário criado com sucesso.");
      }

      setShowForm(false);
      await carregar();
    } catch (error) {
      setStatus(error.response?.data?.message || "Erro ao salvar usuário.");
    }
  }

  async function alternarAtivo(user) {
    try {
      await api.patch(`/api/v1/usuario/${user.id}/status`, { ativo: !user.ativo });
      await carregar();
    } catch (error) {
      setStatus(error.response?.data?.message || "Erro ao alterar status.");
    }
  }


  async function excluir(user){
    try {
      await api.delete(`/api/v1/usuario/${user.id}`);
      await carregar();
    } catch (error) {
      setStatus(error.response?.data?.message || "Erro ao excluir usuário.");
    }
  }



  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle
        title="Categorias"
        description="Cadastre, edite e controle as categorias."
        action={
          <button onClick={novo} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Nova categoria
          </button>
        }
      />

      {status && (
        <div className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          {status}
        </div>
      )}

      {showForm && (
        <form onSubmit={salvar} className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {form.id ? "Editar categoria" : "Nova categoria"}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm font-medium text-slate-500 hover:text-slate-900">
              Cancelar
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <input required placeholder="Nome completo" value={form.nome} onChange={(e) => setForm({...form, nome:e.target.value})} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            <input required placeholder="Login" value={form.login} onChange={(e) => setForm({...form, login:e.target.value})} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            <input required type="email" placeholder="E-mail" value={form.email} onChange={(e) => setForm({...form, email:e.target.value})} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            <input type="password" required={!form.id} minLength={8} placeholder={form.id ? "Nova senha (opcional)" : "Senha inicial"} value={form.senha} onChange={(e) => setForm({...form, senha:e.target.value})} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
             {/*<select value={form.perfil_id} onChange={(e) => setForm({...form, perfil_id:e.target.value})} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
              <option value="">Sem perfil específico</option> */}
              {/* {perfis.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)} */}
            {/* </select> */}

            <button className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800">
              Salvar usuário
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar usuário..."
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Nome</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categorias.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{u.nome}</p>
                  </td>
                  
                  <td className="px-5 py-4 text-sm text-slate-600">{u.tipo}</td>
                  
                                    
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${u.ativo ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                      {u.ativo ? <UserCheck className="h-3.5 w-3.5" /> : <UserX className="h-3.5 w-3.5" />}
                      {u.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => editar(u)} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600" title="Editar">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => alternarAtivo(u)} className={`rounded-lg p-2 ${u.ativo ? "text-slate-500 hover:bg-red-50 hover:text-red-600" : "text-emerald-600 hover:bg-emerald-50"}`} title={u.ativo ? "Inativar" : "Ativar"}>
                        <Power className="h-4 w-4" />
                      </button>
                      <button onClick={() => excluir(u)} className={`rounded-lg p-2 ${u.ativo ? "text-slate-500 hover:bg-red-50 hover:text-red-600" : "text-emerald-600 hover:bg-emerald-50"}`} title={u.ativo ? "Inativar" : "Ativar"}>
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
