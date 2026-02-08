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

    // DEBUG: Mostrar a URL completa
    const urlCompleta = `${GEOCODING_API}?${params}`;
    console.log("URL enviada (Geocoding):", urlCompleta);

    // Fazer a requisição HTTP para a API
    const response = await fetch(urlCompleta);

    // Verificar se funcionou (status 200-299)
    if (!response.ok) {
      console.error("Erro na API Geocoding. Status:", response.status);
      throw new Error(`Erro da API: ${response.status}`);
    }

    // Converter a resposta de texto para objeto JavaScript
    const data = await response.json();

    // DEBUG: Ver os dados recebidos
    console.log("Dados de geocoding recebidos:", data);

    // Verificar se encontrou alguma cidade
    if (!data.results || data.results.length === 0) {
      console.warn("Nenhuma cidade encontrada para:", cityName);
      return null; // Não encontrou
    }

    // Pegar o primeiro resultado (melhor correspondência)
    const result = data.results[0];

    // DEBUG: Mostrar as coordenadas encontradas
    console.log("Coordenadas encontradas:", {
      latitude: result.latitude,
      longitude: result.longitude,
      nome: result.name,
      pais: result.country,
    });

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
    // PASSO 1: Preparar os parâmetros para a requisição
    // Os dados que a API precisa receber
    const params = new URLSearchParams();

    // Adicionar cada parâmetro individualmente
    params.append("latitude", latitude); // Latitude do local
    params.append("longitude", longitude); // Longitude do local
    // IMPORTANTE: Usar apenas os campos que a API garante funcionar
    // Removemos "pressure" e "uv_index" pois podem causar erro 400
    params.append(
      "current",
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    );
    params.append("timezone", "auto"); // Timezone automático

    // Construir a URL completa
    const urlCompleta = `${WEATHER_API}?${params}`;

    // DEBUG: Mostrar a URL que está sendo enviada
    console.log("URL enviada para API de clima:", urlCompleta);

    // PASSO 2: Fazer a requisição HTTP para a API de clima
    const response = await fetch(urlCompleta);

    // PASSO 3: Verificar se funcionou
    if (!response.ok) {
      // Se deu erro, mostrar detalhes no console
      const erro = await response.text();
      console.error("Resposta da API (erro):", erro);
      throw new Error(
        `Erro da API: ${response.status} - ${response.statusText}`,
      );
    }

    // PASSO 4: Converter a resposta para objeto JavaScript
    const data = await response.json();

    // PASSO 5: Debug - Mostrar os dados recebidos
    console.log("Dados de clima recebidos:", data);

    // PASSO 6: Retornar todos os dados do clima
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados de clima:", error);
    throw error;
  }
}
