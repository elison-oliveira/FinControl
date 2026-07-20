namespace ControleGastos.Api.Domain.Entities;

/// <summary>
/// Representa uma pessoa no sistema, contendo seus dados básicos e suas transações vinculadas.
/// </summary>
public class Pessoa
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public DateTime DataNascimento { get; set; }

    // Propriedade calculada em tempo real (não será salva no banco de dados)
    public int Idade 
    { 
        get 
        {
            var hoje = DateTime.Today;
            var idade = hoje.Year - DataNascimento.Year;
            // Desconta um ano se a pessoa ainda não fez aniversário no ano atual
            if (DataNascimento.Date > hoje.AddYears(-idade)) idade--;
            return idade;
        } 
    }

    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}