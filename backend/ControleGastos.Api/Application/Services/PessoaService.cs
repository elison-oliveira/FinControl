using ControleGastos.Api.Application.DTOs;
using ControleGastos.Api.Domain.Entities;
using ControleGastos.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Application.Services;

public class PessoaService
{
    private readonly AppDbContext _context;

    public PessoaService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PessoaResponseDto> CriarAsync(CreatePessoaDto dto)
    {
        // Validação: Não pode ter nascido no futuro
        if (dto.DataNascimento.Date > DateTime.Today) 
            throw new ArgumentException("A data de nascimento não pode ser no futuro.");

        var pessoa = new Pessoa { Nome = dto.Nome, DataNascimento = dto.DataNascimento };
        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        return new PessoaResponseDto(pessoa.Id, pessoa.Nome, pessoa.DataNascimento, pessoa.Idade);
    }

    public async Task<IEnumerable<PessoaResponseDto>> ListarAsync()
    {
        var pessoas = await _context.Pessoas.ToListAsync();
        return pessoas.Select(p => new PessoaResponseDto(p.Id, p.Nome, p.DataNascimento, p.Idade));
    }

    public async Task DeletarAsync(int id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa == null) throw new KeyNotFoundException("Pessoa não encontrada.");

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();
    }
}