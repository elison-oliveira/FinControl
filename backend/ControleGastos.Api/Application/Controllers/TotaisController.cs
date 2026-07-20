using ControleGastos.Api.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TotaisController : ControllerBase
{
    private readonly TotaisService _totaisService;

    public TotaisController(TotaisService totaisService)
    {
        _totaisService = totaisService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTotais([FromQuery] DateTime? dataInicio, [FromQuery] DateTime? dataFim)
    {
        var totais = await _totaisService.CalcularTotaisAsync(dataInicio, dataFim);
        return Ok(totais);
    }
}