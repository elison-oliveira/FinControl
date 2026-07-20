# 🚀 FinControl - Sistema de Controle de Gastos Residenciais

Um sistema completo de gestão financeira (Receitas e Despesas) desenvolvido como solução para desafio técnico. Focado em escalabilidade, boas práticas, arquitetura limpa e excelente experiência do usuário (UX/UI).

## 🛠 Tecnologias Utilizadas

**Backend:**
* [.NET 8](https://dotnet.microsoft.com/) & C#
* [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/) (ORM)
* [SQLite](https://www.sqlite.org/) (Banco de dados relacional embutido para facilitar o teste)
* Padrão N-Layer (API, Application/Services, Domain, Infrastructure)

**Frontend:**
* [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* [Vite](https://vitejs.dev/) (Build tool ultra rápido)
* [Tailwind CSS](https://tailwindcss.com/) (Estilização utilitária e responsiva)
* [TanStack Query / React Query](https://tanstack.com/query) (Gerenciamento de cache e requisições)
* [Axios](https://axios-http.com/) & [Lucide React](https://lucide.dev/) (Ícones)

---

## 🏗 Decisões de Arquitetura e Boas Práticas

Durante o desenvolvimento, priorizei práticas utilizadas em aplicações reais de produção:

1. **Auto-Migrate e SQLite:** Pensando na experiência do avaliador, o banco de dados SQLite é gerado e atualizado automaticamente ao rodar a API, sem necessidade de rodar scripts SQL manuais ou configurar containers Docker.
2. **Separação de Responsabilidades (SRP):** O Backend não possui regras de negócio nos *Controllers*. Tudo passa por *Services* e *DTOs*, garantindo que a camada de entrada seja limpa.
3. **Propriedades Calculadas:** Em vez de persistir a "Idade" no banco (o que geraria dados defasados com o tempo), o sistema persiste a **Data de Nascimento** e calcula a idade em tempo real na Entidade, utilizando essa computação para aplicar a regra de negócio.
4. **Integridade Referencial (Cascade Delete):** Configurado via Fluent API no EF Core. Ao excluir uma Pessoa, o próprio banco gerencia a exclusão de todas as suas transações.
5. **Enums Legíveis:** Configurado o `JsonStringEnumConverter` para que o frontend consuma e envie os tipos de transação como `Receita` e `Despesa` (Strings) em vez de inteiros numéricos opacos.
6. **Frontend Reativo:** Uso extensivo do `useQuery` e `useMutation` (TanStack Query) para atualizar a interface imediatamente após cadastros ou deleções sem necessidade de recarregar a página (F5). Interface 100% Mobile-First.

---

## 📋 Regras de Negócio Implementadas

- [x] Cadastro, listagem e deleção de Pessoas.
- [x] Deleção em cascata das transações ao deletar uma pessoa.
- [x] Cadastro e listagem de transações com data.
- [x] **Regra de Idade:** Menores de 18 anos só podem registrar `Despesas`. Tentativas de registrar `Receitas` retornam erro tratado no frontend.
- [x] Consulta de Totais: Dashboard interativo com filtros de data, exibindo o balanço consolidado e análise de saúde financeira individual.

---

## 🚀 Como Executar o Projeto

Certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (Versão 18+)
* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### 1. Rodando o Backend (API)

Abra um terminal, navegue até a pasta do backend e execute:

```bash
cd backend/ControleGastos.Api
dotnet build
dotnet run
```

A API iniciará na porta 5151.

*Nota: O banco de dados `ControleGastos.db` será criado automaticamente na primeira execução graças ao Auto-Migrate.*

Você pode testar os endpoints e visualizar o contrato da API acessando a interface do Swagger gerada automaticamente: `http://localhost:5151/swagger`

### 2. Rodando o Frontend (Web)

Abra outro terminal (mantenha o terminal do backend rodando), navegue até a pasta do frontend e execute os comandos:

```bash
cd front
npm install
npm run dev
```

O Frontend iniciará (geralmente na porta 5173). Acesse no seu navegador: `http://localhost:5173`.

---

## 📂 Estrutura do Projeto

Para facilitar o entendimento da arquitetura, o projeto foi estruturado seguindo conceitos de camadas limpas e separação de responsabilidades, visando manutenibilidade:

```text
/
├── backend/
│   ├── ControleGastos.Application/    # Regras de orquestração, Services e DTOs
│   ├── ControleGastos.Domain/         # Entidades centrais, Enums e Interfaces de Repositório
│   └── ControleGastos.Infrastructure/ # Implementação do EF Core, Mapeamentos Fluent API
│
└── frontend/
    ├── src/
    │   ├── pages/                     # Páginas principais da aplicação
    │   ├── services/                  # Configurações do Axios e chamadas à API
    │   ├── types/                     # Definições estáticas de tipagem do TypeScript
```

---

## 💡 Próximos Passos (Evolução da Arquitetura)

Pensando em escalar este produto futuramente para um modelo SaaS multitenancy e em um ambiente Cloud robusto, as seguintes evoluções arquiteturais seriam os próximos passos:

- [ ] **Autenticação e Multi-tenant:** Implementar autenticação via JWT para isolar os dados de diferentes lares ou famílias.
- [ ] **Migração de Banco de Dados:** Substituir o SQLite por um banco relacional gerenciado, como PostgreSQL rodando em um serviço como AWS RDS.
- [ ] **Testes Automatizados:** Adicionar uma suíte de testes unitários com xUnit/NSubstitute no backend e Jest/React Testing Library no frontend, garantindo a integridade das regras de negócio a cada commit.
- [ ] **Conteinerização e CI/CD:** Criar Dockerfiles para a API e para o Frontend (Nginx), e orquestrar o deploy automatizado utilizando GitHub Actions.
