using ControleGastos.Api.Application.DTOs;
using ControleGastos.Api.Domain.Enums;
using ControleGastos.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Application.Services;

public class TotaisService
{
    private readonly AppDbContext _context;

    public TotaisService(AppDbContext context)
    {
        _context = context;
    }

    // Paramentros opcionais para filtrar por data
    public async Task<ConsultaTotaisResponseDto> CalcularTotaisAsync(DateTime? dataInicio, DateTime? dataFim)
    {
        var pessoas = await _context.Pessoas
            .Include(p => p.Transacoes)
            .ToListAsync();

        var pessoasTotais = pessoas.Select(p => 
        {
            var transacoes = p.Transacoes.AsEnumerable();

            // Aplica os filtros caso tenham sido enviados
            if (dataInicio.HasValue) 
                transacoes = transacoes.Where(t => t.Data.Date >= dataInicio.Value.Date);
            
            if (dataFim.HasValue) 
                transacoes = transacoes.Where(t => t.Data.Date <= dataFim.Value.Date);

            var receitas = transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
            var despesas = transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);

            return new PessoaTotaisDto(p.Nome, receitas, despesas, receitas - despesas);
        }).ToList();

        var totalGeralReceitas = pessoasTotais.Sum(p => p.TotalReceitas);
        var totalGeralDespesas = pessoasTotais.Sum(p => p.TotalDespesas);
        var saldoLiquidoGeral = totalGeralReceitas - totalGeralDespesas;

        return new ConsultaTotaisResponseDto(pessoasTotais, totalGeralReceitas, totalGeralDespesas, saldoLiquidoGeral);
    }
}