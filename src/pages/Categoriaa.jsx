import { useEffect, useState, useRef } from 'react'
//import './index.css'
import api from '../../services/api'
import PageTitle from "../../components/PageTitle";
import { LockKeyhole, LogIn, UserRound } from "lucide-react";


function Categoriaa() {

  const [categorias, setCategorias] = useState([])
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  //let categorias = []

  const inputName = useRef()
  const inputTipo = useRef()

  async function getCategorias() {
    const categoriaFromApi = await api.get('/api/v1/categoria')

    setCategorias(categoriaFromApi.data.categoria);
    // console.log(categoriaFromApi.data.categoria);

  }


  async function createCategorias() {

    const dados = {
      nome: inputName.current.value,
      tipo: inputTipo.current.value,
      ativo: "true"
    };

    try {

    if (categoriaEditando) {
      // EDITAR
      await api.put(`/api/v1/categoria/${categoriaEditando}`, dados);

    } else {
      // CRIAR
      await api.post('/api/v1/categoria', dados);

    }

    await getCategorias();

    inputName.current.value = "";
    inputTipo.current.value = "";

    setCategoriaEditando(null);

  } catch (error) {
    console.error("Erro ao salvar categoria:", error);
  }


  }

   async function editCategorias(categoria) {
    setCategoriaEditando(categoria.id);

    inputName.current.value = categoria.nome;
    inputTipo.current.value = categoria.tipo;
  }


  async function deleteCategorias(id) {
    await api.delete(`/api/v1/categoria/${id}`)

    getCategorias()

  }



  useEffect(() => {
    getCategorias()
  },[])
 

  return (
     
      <div className="mx-auto max-w-7xl">
        
          <PageTitle
              title="Cadastro de Categorias"
              description="Cadastre as categorias de receitas e despesas para gerenciar seu orçamento."
          />

          <div className="w-full max-w-120 mt-20">

            <form action="" className="flex flex-col mb-4 w-full">
                {/* <h1 className="mt-10 max-w-xl text-3xl font-bold leading-tight mb-4 text-start">Cadastro de categoria</h1> */}
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input placeholder="Nome da categoria" type="text" name='nome' ref={inputName}
                      className="mb-4 w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      
                      />
                </div>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input placeholder="Tipo da categoria" type="text" name='tipo' ref={inputTipo}
                      className="mb-4 w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                </div>
                <button type='button' onClick={createCategorias}
                  className="mb-8 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-900 px-4 py-3 font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {categoriaEditando ? 'Atualizar categoria' : 'Salvar categoria'}
                </button>
              </form>

          </div>


          <div className="w-full max-w-120">

            {categorias.map( categoria => (
                
                <div key= {categoria.id} className="grid grid-cols-4 gap-4 w-full items-center mb-4 rounded-xl bg-slate-200 p-4">
                  <div className="col-span-2">
                    <p>Nome: <span>{categoria.nome}</span></p>
                    <p>Tipo: <span>{categoria.tipo}</span></p>
                  </div>
                  <div className="text-2xl col-span-1 text-center">
                    <button type="button" onClick={() => editCategorias(categoria)}
                      className="w-full text-2xl cursor-pointer">
                      ✏️
                    </button>
                  </div>
                  <div className="text-2xl col-span-1 text-center">
                    <button type="button" onClick={() => deleteCategorias(categoria.id)}
                      className="w-full text-2xl cursor-pointer" >
                      🗑️
                    </button>
                  </div>
                </div>

              ))}

          </div>
        
      </div>
  )
}

export default Categoriaa
