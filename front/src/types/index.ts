export interface Pessoa {
    id: number;
    nome: string;
    dataNascimento: string;
    idade: number;
}
  
export interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    tipo: 'Receita' | 'Despesa';
    pessoaId: number;
    data: string; 
}

export interface PessoaTotais {
    nome: string;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}
  
export interface ConsultaTotaisResponse {
    pessoas: PessoaTotais[];
    totalGeralReceitas: number;
    totalGeralDespesas: number;
    saldoLiquidoGeral: number;
}