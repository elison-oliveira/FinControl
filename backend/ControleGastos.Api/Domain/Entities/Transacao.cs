using ControleGastos.Api.Domain.Enums;

namespace ControleGastos.Api.Domain.Entities;

/// <summary>
/// Representa um registro financeiro (receita ou despesa) vinculado a uma pessoa.
/// </summary>
public class Transacao
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }
    public DateTime Data { get; set; } = DateTime.Now; 

    public int PessoaId { get; set; }
    public Pessoa? Pessoa { get; set; }
}