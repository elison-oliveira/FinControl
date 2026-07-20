import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Pessoa } from '../types';
import { Trash2, UserPlus, Users, Search, Inbox, AlertTriangle } from 'lucide-react';

export function Pessoas() {
  const queryClient = useQueryClient();
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [busca, setBusca] = useState('');
  
  const [pessoaParaDeletar, setPessoaParaDeletar] = useState<{id: number, nome: string} | null>(null);

  const { data: pessoas, isLoading } = useQuery<Pessoa[]>({
    queryKey: ['pessoas'], queryFn: async () => (await api.get('/pessoas')).data,
  });

  const createMutation = useMutation({
    mutationFn: async (novaPessoa: Omit<Pessoa, 'id' | 'idade'>) => await api.post('/pessoas', novaPessoa),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['pessoas'] }); 
      setNome(''); 
      setDataNascimento(''); 
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await api.delete(`/pessoas/${id}`),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['pessoas'] });
      setPessoaParaDeletar(null);
    },
  });

  const pessoasFiltradas = pessoas?.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* Modal de Confirmação de Exclusão */}
      {pessoaParaDeletar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-4 text-red-600">
              <div className="p-3 bg-red-100 rounded-full shrink-0">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Excluir Cadastro?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir <strong>{pessoaParaDeletar.nome}</strong>? 
              Todas as transações financeiras vinculadas a esta pessoa serão apagadas permanentemente. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setPessoaParaDeletar(null)}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={deleteMutation.isPending}
              >
                Cancelar
              </button>
              <button 
                onClick={() => deleteMutation.mutate(pessoaParaDeletar.id)}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-3 bg-blue-100 text-blue-600 rounded-xl"><Users size={28} /></div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Clientes & Pessoas</h2>
            <p className="text-gray-500 text-xs md:text-sm">Gerencie o cadastro de usuários.</p>
          </div>
        </div>
        
        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 w-full md:w-72 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
          <Search size={18} className="text-gray-400 mr-2 shrink-0" />
          <input type="text" placeholder="Buscar por nome..." value={busca} onChange={(e) => setBusca(e.target.value)} className="bg-transparent outline-none text-sm w-full" />
        </div>
      </div>

      {/* Formulário de Cadastro */}
      <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ nome, dataNascimento }); }} 
            className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-5 gap-4 items-end relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Nome Completo</label>
          <input required type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ex: Maria da Silva" />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Data de Nascimento</label>
          <input required type="date" max={new Date().toISOString().split("T")[0]} value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-700" />
        </div>
        <button type="submit" disabled={createMutation.isPending} className="w-full bg-slate-900 text-white rounded-xl p-3 font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 md:h-[50px] shadow-md mt-2 md:mt-0">
          <UserPlus size={20} /> {createMutation.isPending ? 'Salvando...' : 'Adicionar'}
        </button>
      </form>

      {/* Listagem */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-24 md:h-28 bg-gray-200 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : pessoasFiltradas?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 md:p-12 flex flex-col items-center justify-center text-center text-gray-500">
          <Inbox size={48} className="text-gray-300 mb-4" />
          <p className="text-base md:text-lg font-medium text-gray-600">Nenhuma pessoa encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {pessoasFiltradas?.map((pessoa) => (
            <div key={pessoa.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 flex justify-between items-center group hover:shadow-md transition-all">
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-base md:text-lg shrink-0">
                  {pessoa.nome.substring(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-gray-900 text-base md:text-lg leading-tight truncate">{pessoa.nome}</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
                    {new Date(pessoa.dataNascimento).toLocaleDateString('pt-BR')} ({pessoa.idade} anos)
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setPessoaParaDeletar({ id: pessoa.id, nome: pessoa.nome })} 
                className="text-gray-400 hover:text-red-500 p-2 md:p-3 md:hover:bg-red-50 rounded-xl transition-all md:opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 ml-2" 
                title="Excluir cadastro"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}