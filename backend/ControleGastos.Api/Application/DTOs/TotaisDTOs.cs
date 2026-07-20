namespace ControleGastos.Api.Application.DTOs;

public record PessoaTotaisDto(string Nome, decimal TotalReceitas, decimal TotalDespesas, decimal Saldo);

public record ConsultaTotaisResponseDto(
    IEnumerable<PessoaTotaisDto> Pessoas,
    decimal TotalGeralReceitas,
    decimal TotalGeralDespesas,
    decimal SaldoLiquidoGeral
);