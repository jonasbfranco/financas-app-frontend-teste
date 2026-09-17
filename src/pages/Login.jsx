import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { LockKeyhole, LogIn, UserRound } from "lucide-react";
import api from "../services/api";


    
function Login() {

    const navigate = useNavigate();
    const [form, setForm] = useState({ login: "", senha: "" });
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);



    function handleChange(e) {
        setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
    }


    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        setLoading(true);

        try {
            const { data } = await api.post("api/v1/login", form);
            
            //console.log(data)

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/dashboard");
        } catch (error) {
            setErro(error.response?.data?.message || "Não foi possível realizar o login.");
        } finally {
            setLoading(false);
        }
    }


  return (


    <main className="min-h-screen bg-slate-950 flex">

        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-blue-950">
            
            <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
            
            <div className="relative z-10 flex flex-col justify-between p-14 text-white">
                <div>
                    <div className="inline-flex items-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold tracking-wide backdrop-blur">
                        JBF • Tecnologia
                    </div>
                    <h1 className="mt-10 max-w-xl text-5xl font-bold leading-tight">
                        Acesso seguro ao sistema de finanças.
                    </h1>
                    <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
                        Centralize suas finanças e o gerenciamento de suas despesas e receitas em uma 
                        interface simples, moderna e preparada para evoluir.
                    </p>
                </div>
                <p className="text-sm text-slate-400">
                    © {new Date().getFullYear()} - JBF Ssistema Financeiro.
                </p>
            </div>
        </section>


        <section className="flex w-full items-center justify-center bg-slate-50 px-6 py-12 lg:w-1/2">
            <div className="w-full max-w-md">
                <div className="mb-8 lg:hidden">
                    <span className="text-xl font-bold text-slate-900">FINAN</span>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60 ring-1 ring-slate-200 sm:p-10">
                
                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                            Bem-vindo
                        </p>
                        <h2 className="mt-2 text-3xl font-bold text-slate-900">Entrar no sistema</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Informe seu usuário e senha para continuar.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Login
                            </label>

                            <div className="relative">
                                <UserRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    name="login"
                                    value={form.login}
                                    onChange={handleChange}
                                    required
                                    autoComplete="username"
                                    placeholder="Digite seu login"
                                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>


                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Senha
                            </label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    name="senha"
                                    value={form.senha}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    placeholder="Digite sua senha"
                                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        {erro && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {erro}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                            <LogIn className="h-5 w-5" />
                            {loading ? "Entrando..." : "Entrar"}
                        </button>


                    </form>

                    
                    <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
                        Administração do sistema?{" "}
                        <Link
                            to="/admin/usuarios"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Criar ou gerenciar usuários
                        </Link>
                    </div>
                    
                </div>
            
            </div>
        </section>




    </main> // Pagina toda
  )
}

export default Login
