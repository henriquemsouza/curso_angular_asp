using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
  public interface IProAgilRepository
  {
    void Add<T>(T entity) where T : class;
    void Update<T>(T entity) where T : class;
    void Delete<T>(T entity) where T : class;
    void DeleteRange<T>(T[] entity) where T : class;
    Task<bool> SaveChangesAsync();

    Task<Evento[]> getAllEventosAsyncByTema(string tema, bool includePalestrantes);
    Task<Evento[]> getAllEventoAsync(bool includePalestrantes);
    Task<Evento> getAllEventosAsyncById(int EventoId, bool includePalestrantes);
    Task<Palestrante[]> GetAllPalestrantesAsyncByName(string name, bool includeEventos);
    Task<Palestrante> GetPalestranteAsync(int PalestranteId, bool includeEventos);

  }
}