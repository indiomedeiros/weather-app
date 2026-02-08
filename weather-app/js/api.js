// ============================================
// ARQUIVO: api.js
// FUNÇÃO: Comunicação com as APIs externas
// ============================================

// URLs das APIs que vamos usar
const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

// ============================================
// FUNÇÃO: Buscar coordenadas de uma cidade
// ============================================
// Recebe: nome da cidade (texto)
// Retorna: {latitude, longitude} ou null se não encontrada
// Exemplo: const coords = await getCoordinates('São Paulo');
//
async function getCoordinates(cityName) {
  try {
    // Preparar os parâmetros para a requisição
    const params = new URLSearchParams({
      name: cityName, // Nome da cidade para buscar
      count: 1, // Retornar apenas 1 resultado
      language: "pt", // Idioma português
      format: "json", // Formato JSON
    });

    // Fazer a requisição HTTP para a API
    const response = await fetch(`${GEOCODING_API}?${params}`);

    // Verificar se funcionou (status 200-299)
    if (!response.ok) {
      throw new Error(`Erro da API: ${response.status}`);
    }

    // Converter a resposta de texto para objeto JavaScript
    const data = await response.json();

    // Verificar se encontrou alguma cidade
    if (!data.results || data.results.length === 0) {
      return null; // Não encontrou
    }

    // Pegar o primeiro resultado (melhor correspondência)
    const result = data.results[0];

    // Retornar as informações importantes
    return {
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.name,
      country: result.country,
    };
  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error);
    throw error;
  }
}

// ============================================
// FUNÇÃO: Buscar dados de clima
// ============================================
// Recebe: latitude e longitude (números)
// Retorna: objeto com dados meteorológicos
// Exemplo: const weather = await getWeatherData(-23.55, -46.63);
//
async function getWeatherData(latitude, longitude) {
  try {
    // Preparar os parâmetros para a requisição
    const params = new URLSearchParams({
      latitude: latitude, // Latitude do local
      longitude: longitude, // Longitude do local
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure,uv_index",
      timezone: "auto", // Timezone automático
      language: "pt", // Idioma português
    });

    // Fazer a requisição HTTP para a API de clima
    const response = await fetch(`${WEATHER_API}?${params}`);

    // Verificar se funcionou
    if (!response.ok) {
      throw new Error(`Erro da API: ${response.status}`);
    }

    // Converter a resposta para objeto JavaScript
    const data = await response.json();

    // Retornar todos os dados do clima
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados de clima:", error);
    throw error;
  }
}
