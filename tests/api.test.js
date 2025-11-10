// ======================================================
// 🌦️ API.TEST.JS — Testes completos do Projeto Clima
// ======================================================

// Importa apenas as funções puras do seu api.js
const { getCityCoordinates, getWeatherData } = require('../assets/js/api.js');

// Simula (mocka) a função fetch global antes dos testes
global.fetch = jest.fn();

describe('🌤️ Aplicativo de Previsão do Tempo — Testes Automatizados', () => {

  // Limpa mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ======================================================
  // 🔹 3.6 — TESTES BÁSICOS
  // ======================================================

  describe('3.6 — Testes Básicos da API', () => {

    test('1️⃣ Cidade válida retorna dados meteorológicos', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ name: 'São Paulo', latitude: -23.55, longitude: -46.63, country: 'Brasil' }]
        })
      });

      const data = await getCityCoordinates('São Paulo');
      expect(data).toMatchObject({ name: 'São Paulo' });
    });

    test('2️⃣ Cidade inexistente lança exceção tratada', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] })
      });

      await expect(getCityCoordinates('CidadeInvalida'))
        .rejects.toThrow('Cidade não encontrada');
    });

    test('3️⃣ Entrada vazia retorna erro de validação', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] })
      });

      await expect(getCityCoordinates(''))
        .rejects.toThrow('Cidade não encontrada');
    });

    test('4️⃣ Falha de rede (fetch rejeitado) gera erro apropriado', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      await expect(getCityCoordinates('São Paulo')).rejects.toThrow('Network error');
    });

    test('5️⃣ Dados meteorológicos válidos retornam temperatura e código de tempo', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current_weather: { temperature: 25.5, weathercode: 1, is_day: 1 }
        })
      });

      const data = await getWeatherData(-23.55, -46.63);
      expect(data.current_weather.temperature).toBeDefined();
      expect(typeof data.current_weather.temperature).toBe('number');
    });

    test('6️⃣ API retorna erro 500 → deve lançar exceção', async () => {
      fetch.mockResolvedValueOnce({ ok: false });
      await expect(getWeatherData(-23.55, -46.63))
        .rejects.toThrow('Falha ao buscar meteorologia.');
    });
  });

  // ======================================================
  // 🔹 3.7 — CASOS EXTREMOS
  // ======================================================

  describe('3.7 — Casos Extremos e Edge Cases', () => {

    test('7️⃣ Limite de requisições da API excedido (HTTP 429)', async () => {
      fetch.mockResolvedValueOnce({ ok: false, status: 429 });
      await expect(getWeatherData(-23.55, -46.63))
        .rejects.toThrow('Falha ao buscar meteorologia.');
    });

    test('8️⃣ Conexão de rede lenta/instável (timeout)', async () => {
      fetch.mockRejectedValueOnce(new Error('Timeout'));
      await expect(getWeatherData(-23.55, -46.63))
        .rejects.toThrow('Timeout');
    });

    test('9️⃣ Mudança inesperada no formato do JSON (sem current_weather)', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ /* sem current_weather */ })
      });

      await expect(getWeatherData(-23.55, -46.63))
        .rejects.toThrow('Dados meteorológicos indisponíveis');
    });

    test('🔟 JSON inválido → deve lançar erro de parsing', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); }
      });

      await expect(getWeatherData(-23.55, -46.63))
        .rejects.toThrow('Invalid JSON');
    });
  });
});
