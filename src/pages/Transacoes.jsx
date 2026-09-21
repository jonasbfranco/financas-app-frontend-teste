import { Pencil, Plus, Search, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import PageTitle from "../components/PageTitle";
import { getCurrentUser } from "../utils/auth";


const forma_pagamento = [
  {
    "id": 1,
    "nome": "Pix"
  },
  {
    "id": 2,
    "nome": "Crédito"
  },
  {
    "id": 3,
    "nome": "Débito"
  },
  {
    "id": 4,
    "nome": "Débito CC"
  },
  {
    "id": 5,
    "nome": "Vale refeição"
  },
]



const status_pgto = [
  {
    "id": 1,
    "nome": "Pago"
  },
  {
    "id": 2,
    "nome": "Pendente"
  },
]


function capitalize(texto) {
  if (!texto) return "";

  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

const emptyForm = {
  id: null,
  usuario_id: "",
  categoria_id: "",
  tipo: "",
  valor: "",
  forma_pagamento: "",
  data: "",
  _pgto: "",
  descricao: ""
};

export default function Transacoes() {
  const user = getCurrentUser();
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [busca, setBusca] = useState("");
  const [_pgto, setStatus] = useState("");

  async function carregar() {
    //const u = await api.get("/api/v1/transactions");
    //const c = await api.get("/api/v1/categoria");
    const [t, c] = await Promise.all([
      api.get("/api/v1/transactions"),
      api.get("/api/v1/categoria")
    ]);
    //return console.log(u.data.usuarios);
    setTransacoes(t.data.transacao);
    setCategorias(c.data.categoria);
    //setPerfis(p.data);
  }


  useEffect(() => {
    carregar().catch(() => setStatus("Não foi possível carregar as transações."));
  }, []);


  const filtrados = useMemo(() => {
    const q = busca.toLowerCase();
    return transacoes.filter((t) =>
      [t.categoria_id, t.data, t.tipo, t.valor, t.forma_pagamento, t.status, t.descricao].some((v) =>
        String(v || "").toLowerCase().includes(q)
      )
    );
  }, [transacoes, busca]);

  function novo() {
  setForm({
      ...emptyForm,
      usuario_id: user.id
    });

    setShowForm(true);
    setStatus("");
  }

  function editar(transacao) {
    setForm({
      id: transacao.id,
      usuario_id: transacao.usuario_id,
      categoria_id: transacao.categoria_id,
      tipo: transacao.tipo,
      valor: transacao.valor,
      forma_pagamento: transacao.forma_pagamento,
      data: transacao.data,
      status: transacao.status,
      descricao: transacao.descricao
    });
    setShowForm(true);
    setStatus("");
  }

  async function salvar(e) {
    e.preventDefault();
    try {
      const payload = { ...form };
      // if (!payload.senha) delete payload.senha;
      // if (!payload.usuario_id) payload.user.id;

      if (form.id) {
        await api.put(`/api/v1/transactions/${form.id}`, payload);
        setStatus("Transação atualizada com sucesso.");
      } else {
        await api.post("/api/v1/transactions", payload);
        setStatus("Transação criada com sucesso.");
      }

      setShowForm(false);
      await carregar();
    } catch (error) {
      setStatus(error.response?.data?.message || "Erro ao salvar transação.");
    }
  }

  async function alternarAtivo(transacao) {
    try {
      await api.patch(`/api/v1/transactions/${transacao.id}/status`, { ativo: !transacao.ativo });
      await carregar();
    } catch (error) {
      setStatus(error.response?.data?.message || "Erro ao alterar status.");
    }
  }

  async function excluir(transacao){
    try {
      await api.delete(`/api/v1/transactions/${transacao.id}`);
      await carregar();
    } catch (error) {
      setStatus(error.response?.data?.message || "Erro ao excluir transação.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl w-full min-w-0">
      <PageTitle
        title="Transações"
        description="Cadastre, edite e controle os gastos."
        action={
          <button onClick={novo} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Nova transação
          </button>
        }
      />

      {status && (
        <div className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          {status}
        </div>
      )}

      

      {showForm && (
        <form onSubmit={salvar} className="mb-6 w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {form.id ? "Editar transação" : "Nova transação"}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm font-medium text-slate-500 hover:text-slate-900">
              Cancelar
            </button>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            <div>
              <label htmlFor="tipo" className="mb-1.5 block text-sm font-semibold text-slate-900"> Tipo <span>*</span></label>
              <select value={form.tipo} onChange={(e) => setForm({...form, tipo:e.target.value, categoria_id: ""})} className="min-w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                <option value="">Selecione um tipo</option>
                  <option value="RECEITA">Receita</option>
                  <option value="DESPESA">Despesa</option>
              </select>
            </div>

            <div>
              <label htmlFor="categoria_id" className="mb-1.5 block text-sm font-semibold text-slate-900"> Categoria <span>*</span></label>
              <select value={form.categoria_id} disabled={!form.tipo} onChange={(e) => setForm({...form, categoria_id:e.target.value})} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                <option value=""> {form.tipo ? "Selecione" : "Primeiro selecione o tipo"}</option>
                {categorias.filter((c) => c.tipo === form.tipo  && c.ativo).map((c) => <option key={c.id} value={c.id}>{capitalize(c.nome)}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="descricao" className="mb-1.5 block text-sm font-semibold text-slate-900"> Descrção <span>*</span></label>
                <input required placeholder="Ex.: Salário, supermercado..." value={form.descricao} onChange={(e) => setForm({...form, descricao:e.target.value})} className="min-w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </div>
            
            <div>
              <label htmlFor="valor" className="mb-1.5 block text-sm font-semibold text-slate-900"> Valor <span>*</span></label>
              <div className="flex overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <span className="px-4 py-3 flex w-11 shrink-0 items-center justify-center border-r border-slate-200 bg-slate-50 text-sm text-slate-500">
                  R$
                </span>
                <input required placeholder="Valor" value={form.valor} onChange={(e) => setForm({...form, valor:e.target.value})} className="min-w-full rounded-xl border=0 border-slate-300 px-4 py-3 outline-none" />
              </div>
            </div>

            <div>
              <label htmlFor="forma_pagamento" className="mb-1.5 block text-sm font-semibold text-slate-900"> Forma de Pgto <span>*</span></label>
              <select value={form.forma_pagamento} onChange={(e) => setForm({...form, forma_pagamento:e.target.value})} className="min-w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
              <option value=""> Selecione a forma de pgto </option>
              {forma_pagamento.map((c) => <option key={c.id} value={c.nome}>{capitalize(c.nome)}</option>)}
            </select>
            </div>
            
            <div>
              <label htmlFor="data" className="mb-1.5 block text-sm font-semibold text-slate-900"> Data <span>*</span></label>
              <input required type="date" placeholder="Data" value={form.data} onChange={(e) => setForm({...form, data:e.target.value})} className="min-w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </div>

             <div>
              <label htmlFor="status" className="mb-1.5 block text-sm font-semibold text-slate-900"> Status do Pgto <span>*</span></label>
              <select value={form.status} onChange={(e) => setForm({...form, status:e.target.value})} className="min-w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
              <option value=""> Selecione o tipo </option>
              {status_pgto.map((c) => <option key={c.id} value={c.nome.toUpperCase()}>{capitalize(c.nome)}</option>)}
            </select>
            </div>

            {/* <div className="flex items-end justify-end">
              <button className="min-w-full h-13 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800">
                Salvar transação
              </button>
            </div> */}

          </div>

            
            <div className="mt-8 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button type="reset" className="h-11 rounded-lg bg-slate-100 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-200">
                Limpar
              </button>

              <button type="submit" className="h-11 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700">
                Salvar transação
              </button>
            </div>
            
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

        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-full]">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="uppercase text-xs text-center px-5 py-3">Data</th>
                <th className="uppercase text-xs text-center px-5 py-3">Tipo</th>
                <th className="uppercase text-xs text-center px-5 py-3">Categoria</th>
                <th className="uppercase text-xs text-left   px-0 py-3">Descrição</th>
                <th className="uppercase text-xs text-center px-5 py-3">Valor</th>
                <th className="uppercase text-xs text-center px-5 py-3">Status</th>
                <th className="uppercase text-xs text-center px-0 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="text-center text-xs font-semibold text-slate-500">{new Date(u.data).toLocaleDateString("pt-BR")}</td>
                  <td className="text-center font-semibold text-slate-500"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold 
                      ${u.tipo === "RECEITA"  ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{u.tipo}</span></td>
                  
                  
                  <td className="text-center text-xs font-semibold text-slate-500">
                    {categorias.find(categoria => Number(categoria.id) === Number(u.categoria_id))?.nome}
                    {/* {categorias.find(categoria => categoria.id == u.categoria_id)?.nome} */}
                  </td>
                  
                  
                  <td className="text-left text-xs font-semibold truncate text-slate-500">{u.descricao }</td>
                  <td className="text-center text-md uppercase font-semibold text-slate-500">
                      <span className={`text-sm font-semibold ${u.tipo === "RECEITA" ? "text-green-600" : "text-red-600"}`}>
                        {u.tipo === "RECEITA" ? "+" : "-"} R${" "}
                        {Number(u.valor).toLocaleString("pt-BR", {minimumFractionDigits: 2,})}</span></td>
                  <td className="text-center text-md font-semibold text-slate-500">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          u.status === "PAGO" ? "bg-green-100 text-green-700"
                          : u.status === "PENDENTE" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600" }`}
                        >{u.status }</span>
                  </td>
                  <td className="flex justify-center items-center text-xs font-semibold px-0 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => editar(u)} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600" title="Editar">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => excluir(u)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" title="Excluir">
                        <Trash className="h-4 w-4" />
                      </button>
                      {/* <button onClick={() => alternarAtivo(u)} className={`rounded-lg p-2 ${u.ativo ? "text-slate-500 hover:bg-red-50 hover:text-red-600" : "text-emerald-600 hover:bg-emerald-50"}`} title={u.ativo ? "Inativar" : "Ativar"}>
                        <Power className="h-4 w-4" />
                      </button> */}
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
