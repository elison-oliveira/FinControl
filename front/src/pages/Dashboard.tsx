import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { ConsultaTotaisResponse } from '../types';
import { TrendingUp, TrendingDown, Wallet, Calendar, FilterX, Activity } from 'lucide-react';

export function Dashboard() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const { data, isLoading } = useQuery<ConsultaTotaisResponse>({
    queryKey: ['totais', dataInicio, dataFim],
    queryFn: async () => {
      const response = await api.get('/totais', {
        params: { dataInicio: dataInicio || undefined, dataFim: dataFim || undefined }
      });
      return response.data;
    },
  });

  const limparFiltros = () => { setDataInicio(''); setDataFim(''); };

  // Função auxiliar para calcular a porcentagem de despesas sobre receitas
  const calcularSaudeFinanceira = (receitas: number, despesas: number) => {
    if (receitas === 0 && despesas > 0) return 100; // 100% de prejuízo
    if (receitas === 0 && despesas === 0) return 0;
    const percentual = (despesas / receitas) * 100;
    return percentual > 100 ? 100 : percentual;
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* Cabeçalho e Filtros */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Visão Geral</h2>
          <p className="text-gray-500 text-sm mt-1">Indicadores e saúde financeira do sistema.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 sm:flex-none">
            <Calendar size={18} className="text-gray-400 mr-2 shrink-0" />
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="bg-transparent outline-none text-sm text-gray-700 w-full" />
          </div>
          <span className="hidden sm:inline text-gray-400 font-medium">até</span>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 sm:flex-none">
            <Calendar size={18} className="text-gray-400 mr-2 shrink-0" />
            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="bg-transparent outline-none text-sm text-gray-700 w-full" />
          </div>
          {(dataInicio || dataFim) && (
            <button onClick={limparFiltros} className="p-2 w-full sm:w-auto text-red-500 bg-red-50 sm:bg-transparent hover:bg-red-100 rounded-xl transition flex justify-center items-center gap-2">
              <FilterX size={20} /> <span className="sm:hidden font-medium">Limpar</span>
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
        </div>
      ) : (
        <>
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">Receita Total</p>
                <p className="mt-1 md:mt-2 text-2xl md:text-3xl font-bold text-green-600">R$ {data?.totalGeralReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="p-3 md:p-4 bg-green-100 text-green-600 rounded-full shrink-0 relative z-10">
                <TrendingUp size={28} className="md:w-8 md:h-8" />
              </div>
            </div>

            <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-50 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">Despesa Total</p>
                <p className="mt-1 md:mt-2 text-2xl md:text-3xl font-bold text-red-600">R$ {data?.totalGeralDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="p-3 md:p-4 bg-red-100 text-red-600 rounded-full shrink-0 relative z-10">
                <TrendingDown size={28} className="md:w-8 md:h-8" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 md:p-6 rounded-2xl shadow-xl border border-slate-700 flex items-center justify-between text-white sm:col-span-2 lg:col-span-1 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <p className="text-xs md:text-sm font-semibold text-slate-300 uppercase tracking-wider">Saldo Líquido</p>
                <p className={`mt-1 md:mt-2 text-2xl md:text-3xl font-bold ${data!.saldoLiquidoGeral >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  R$ {data?.saldoLiquidoGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 md:p-4 bg-slate-700/50 rounded-full shrink-0 relative z-10 border border-slate-600">
                <Wallet size={28} className="md:w-8 md:h-8" />
              </div>
            </div>
          </div>

          {/* Lista de Pessoas com Métricas de Saúde */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 md:px-6 md:py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Activity className="text-blue-500" size={20} />
              <h3 className="text-base md:text-lg font-bold text-gray-800">Análise de Balanço por Pessoa</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {data?.pessoas.map((p, index) => {
                const percDespesa = calcularSaudeFinanceira(p.totalReceitas, p.totalDespesas);
                // Cor da barra baseada no comprometimento (Verde < 50%, Amarelo < 80%, Vermelho > 80%)
                const corBarra = percDespesa > 80 ? 'bg-red-500' : percDespesa > 50 ? 'bg-amber-400' : 'bg-emerald-500';

                return (
                  <div key={index} className="p-5 md:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      {/* Perfil */}
                      <div className="flex items-center gap-4 lg:w-1/4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0 border border-blue-200">
                          {p.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base md:text-lg leading-tight truncate">{p.nome}</h4>
                          <p className="text-xs text-gray-500 mt-1">Métricas individuais</p>
                        </div>
                      </div>

                      {/* Barra de Progresso Visual (Saúde) */}
                      <div className="flex-1 px-2 lg:px-8">
                        <div className="flex justify-between text-xs text-gray-500 font-semibold mb-2">
                          <span>Comprometimento da Receita</span>
                          <span>{percDespesa.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div className={`h-2.5 rounded-full ${corBarra} transition-all duration-1000`} style={{ width: `${percDespesa}%` }}></div>
                        </div>
                      </div>
                      
                      {/* Valores */}
                      <div className="grid grid-cols-3 lg:flex lg:items-center gap-2 lg:gap-8 lg:w-auto">
                        <div className="text-center lg:text-right bg-gray-50 lg:bg-transparent p-2 lg:p-0 rounded-lg">
                          <p className="text-[10px] md:text-xs text-gray-500 uppercase font-semibold mb-1">Receitas</p>
                          <p className="text-green-600 font-bold text-sm">R$ {p.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="text-center lg:text-right bg-gray-50 lg:bg-transparent p-2 lg:p-0 rounded-lg">
                          <p className="text-[10px] md:text-xs text-gray-500 uppercase font-semibold mb-1">Despesas</p>
                          <p className="text-red-600 font-bold text-sm">R$ {p.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="text-center lg:text-right min-w-[110px] bg-blue-50/50 lg:bg-gray-50 px-2 lg:px-4 py-2 rounded-lg lg:rounded-xl">
                          <p className="text-[10px] md:text-xs text-gray-500 uppercase font-semibold mb-1">Saldo</p>
                          <p className={`font-black text-sm ${p.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            R$ {p.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {data?.pessoas.length === 0 && (
                <div className="p-12 text-center text-gray-500">Nenhum dado financeiro encontrado para este período.</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}