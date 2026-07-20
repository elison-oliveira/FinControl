using ControleGastos.Api.Application.DTOs;
using ControleGastos.Api.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly TransacaoService _transacaoService;

    public TransacoesController(TransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CreateTransacaoDto dto)
    {
        try
        {
            var result = await _transacaoService.CriarAsync(dto);
            return Created("", result);
        }
        catch (ArgumentException ex) // Captura a regra do menor de 18 anos
        {
            return BadRequest(new { erro = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { erro = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var result = await _transacaoService.ListarAsync();
        return Ok(result);
    }
}