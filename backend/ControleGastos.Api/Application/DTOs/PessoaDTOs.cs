namespace ControleGastos.Api.Application.DTOs;

public record CreatePessoaDto(string Nome, DateTime DataNascimento);

public record PessoaResponseDto(int Id, string Nome, DateTime DataNascimento, int Idade);