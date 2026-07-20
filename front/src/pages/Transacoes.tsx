import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Pessoa, Transacao } from '../types';
import { ArrowDownCircle, ArrowUpCircle, AlertCircle, Plus, WalletCards, Filter } from 'lucide-react';

export function Transacoes() {
  const queryClient = useQueryClient();
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'Receita' | 'Despesa'>('Despesa');
  const [pessoaId, setPessoaId] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [erroNegocio, setErroNegocio] = useState<string | null>(null);
  
  const [filtroAtual, setFiltroAtual] = useState<'Todas' | 'Receita' | 'Despesa'>('Todas');

  const { data: transacoes, isLoading: isLoadingTransacoes } = useQuery<Transacao[]>({ queryKey: ['transacoes'], queryFn: async () => (await api.get('/transacoes')).data });
  const { data: pessoas } = useQuery<Pessoa[]>({ queryKey: ['pessoas'], queryFn: async () => (await api.get('/pessoas')).data });

  const createMutation = useMutation({
    mutationFn: async (novaTransacao: Omit<Transacao, 'id'>) => await api.post('/transacoes', novaTransacao),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['transacoes'] }); setDescricao(''); setValor(''); setErroNegocio(null); },
    onError: (error: any) => setErroNegocio(error.response?.data?.erro || 'Ocorreu um erro ao salvar.')
  });

  const transacoesFiltradas = transacoes?.filter(t => filtroAtual === 'Todas' || t.tipo === filtroAtual);

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-10">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="p-2 md:p-3 bg-emerald-100 text-emerald-600 rounded-xl"><WalletCards size={28} /></div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Lançamentos</h2>
          <p className="text-gray-500 text-xs md:text-sm">Registre receitas e despesas.</p>
        </div>
      </div>

      {erroNegocio && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-3">
          <AlertCircle size={24} className="shrink-0" /> 
          <span className="text-sm md:text-base"><strong>Bloqueado:</strong> {erroNegocio}</span>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ descricao, valor: Number(valor), tipo, pessoaId: Number(pessoaId), data }); }} 
            className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 items-end">
        
        <div className="sm:col-span-2 md:col-span-3">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descrição</label>
          <input required type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Material" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Valor (R$)</label>
          <input required type="number" min="0.01" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="0,00" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Data</label>
          <input required type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-600" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipo</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as 'Receita' | 'Despesa')} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 font-medium">
            <option value="Despesa">📉 Despesa</option>
            <option value="Receita">📈 Receita</option>
          </select>
        </div>
        <div className="sm:col-span-2 md:col-span-3">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Responsável</label>
          <select required value={pessoaId} onChange={(e) => setPessoaId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled>Selecione...</option>
            {pessoas?.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2 md:col-span-12 flex justify-end mt-2 md:mt-2 md:pt-4 md:border-t border-gray-100">
          <button type="submit" disabled={createMutation.isPending} className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-md hover:shadow-lg">
            <Plus size={20} /> Lançar Transação
          </button>
        </div>
      </form>

      {/* Histórico / Extrato */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Abas de Filtro - Habilitado scroll horizontal no mobile */}
        <div className="px-4 py-4 md:px-6 md:py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Filter size={18} className="text-gray-400" /> Extrato</h3>
          <div className="flex bg-gray-200 p-1 rounded-xl overflow-x-auto whitespace-nowrap hide-scrollbar w-full sm:w-auto">
            {(['Todas', 'Receita', 'Despesa'] as const).map(aba => (
              <button 
                key={aba} onClick={() => setFiltroAtual(aba)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filtroAtual === aba ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {aba}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Transações */}
        <div className="divide-y divide-gray-50">
          {isLoadingTransacoes ? (
            <div className="p-8 text-center text-gray-400 animate-pulse">Carregando extrato...</div>
          ) : transacoesFiltradas?.length === 0 ? (
            <div className="p-8 md:p-12 text-center text-gray-500">Nenhuma transação encontrada.</div>
          ) : (
            transacoesFiltradas?.map((t) => (
              <div key={t.id} className="p-4 md:p-5 hover:bg-gray-50 transition-colors flex flex-row items-center justify-between group gap-2">
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                  <div className={`p-2 md:p-3 rounded-full shrink-0 ${t.tipo === 'Receita' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {t.tipo === 'Receita' ? <ArrowUpCircle size={20} className="md:w-6 md:h-6" /> : <ArrowDownCircle size={20} className="md:w-6 md:h-6" />}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-gray-900 text-sm md:text-base truncate">{t.descricao}</h4>
                    <p className="text-[11px] md:text-sm text-gray-500 mt-0.5 truncate">
                      {new Date(t.data).toLocaleDateString('pt-BR')} • {pessoas?.find(p => p.id === t.pessoaId)?.nome || 'Pessoa excluída'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <p className={`text-sm md:text-xl font-bold whitespace-nowrap ${t.tipo === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.tipo === 'Receita' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                  </p>
                  <span className={`hidden md:inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${t.tipo === 'Receita' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {t.tipo}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}