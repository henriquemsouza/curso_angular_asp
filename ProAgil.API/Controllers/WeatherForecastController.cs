using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProAgil.API.Data;
using ProAgil.API.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace ProAgil.API.Controllers
{
  [ApiController]
  [Route("Api/[controller]")]
  public class WeatherForecastController : ControllerBase
  {
    public DataContext _context { get; }

    public WeatherForecastController(DataContext context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {

      try
      {
        var results = await _context.Eventos.ToListAsync();
        System.Console.WriteLine("results");
        return Ok(results);
      }
      catch (System.Exception)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError, "Errorou");
      }

    }

  //   [HttpGet("{id}")]

  //   public async Task<IActionResult> Get(int id)
  //   {
  //     try
  //     {
  //       var results = await _context.Eventos.FirstOrDefaultAsync(x => x.EventoId == id);
  //       return Ok(results);
  //     }
  //     catch (System.Exception)
  //     {
  //       return this.StatusCode(StatusCodes.Status500InternalServerError, "Errorou");
  //     }
  //   }
  }
}
