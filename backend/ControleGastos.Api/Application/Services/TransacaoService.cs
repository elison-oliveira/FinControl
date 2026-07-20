using ControleGastos.Api.Application.DTOs;
using ControleGastos.Api.Domain.Entities;
using ControleGastos.Api.Domain.Enums;
using ControleGastos.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Application.Services;

public class TransacaoService
{
    private readonly AppDbContext _context;

    public TransacaoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TransacaoResponseDto> CriarAsync(CreateTransacaoDto dto)
    {
        var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
        if (pessoa == null) throw new KeyNotFoundException("Pessoa não encontrada.");

        // REGRA DE NEGÓCIO: Menor de idade só pode registrar despesa
        if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
        {
            throw new ArgumentException("Pessoas menores de 18 anos só podem registrar despesas.");
        }

        if (dto.Valor <= 0) throw new ArgumentException("O valor da transação deve ser maior que zero.");

        var transacao = new Transacao
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            PessoaId = dto.PessoaId,
            Data = dto.Data 
        };

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        return new TransacaoResponseDto(transacao.Id, transacao.Descricao, transacao.Valor, transacao.Tipo.ToString(), transacao.PessoaId, transacao.Data);
    }

    public async Task<IEnumerable<TransacaoResponseDto>> ListarAsync()
    {
        return await _context.Transacoes
            .OrderByDescending(t => t.Data)
            .Select(t => new TransacaoResponseDto(t.Id, t.Descricao, t.Valor, t.Tipo.ToString(), t.PessoaId, t.Data))
            .ToListAsync();
    }
}