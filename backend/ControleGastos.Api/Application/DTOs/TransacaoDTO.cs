using ControleGastos.Api.Domain.Enums;

namespace ControleGastos.Api.Application.DTOs;

public record CreateTransacaoDto(string Descricao, decimal Valor, TipoTransacao Tipo, int PessoaId, DateTime Data);
public record TransacaoResponseDto(int Id, string Descricao, decimal Valor, string Tipo, int PessoaId, DateTime Data);