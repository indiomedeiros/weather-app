// ============================================
// ARQUIVO: main.js
// FUNÇÃO: Lógica principal do aplicativo
// ============================================

// PASSO 1: Buscar elementos do HTML
// document.getElementById() encontra elementos pelo ID no HTML

// Elementos do formulário de busca
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");

// Elementos das seções da página
const weatherSection = document.getElementById("weatherSection");
const errorSection = document.getElementById("errorSection");
const loadingSection = document.getElementById("loadingSection");

// Elementos para exibir os dados do clima
const cityName = document.getElementById("cityName");
const dateInfo = document.getElementById("dateInfo");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const errorMessage = document.getElementById("errorMessage");

// ============================================
// PASSO 2: Configurar o evento do formulário
// ============================================
// addEventListener() escuta quando o usuário faz algo
// 'submit' = quando pressiona Enter ou clica no botão

searchForm.addEventListener("submit", async function (e) {
  // e.preventDefault() evita que a página recarregue
  e.preventDefault();

  // Pegar o texto que o usuário digitou
  // .trim() remove espaços em branco
  const city = cityInput.value.trim();

  // Verificar se digitou algo
  if (!city) {
    showError("Por favor, digite o nome de uma cidade.");
    return; // Parar aqui
  }

  // Buscar o clima da cidade digitada
  await fetchWeather(city);

  // Limpar o campo de entrada
  cityInput.value = "";
});

// ============================================
// FUNÇÃO: Buscar o clima de uma cidade
// ============================================
// Esta função:
// 1) Mostra a seção de carregamento
// 2) Busca as coordenadas da cidade
// 3) Busca os dados do clima
// 4) Exibe os dados na tela
//
async function fetchWeather(cityName) {
  // Mostrar o spinner de carregamento
  showLoading();

  // Esconder qualquer mensagem de erro anterior
  hideError();

  try {
    // ETAPA 1: Obter as coordenadas (latitude e longitude)
    const coordinates = await getCoordinates(cityName);

    // Verificar se encontrou a cidade
    if (!coordinates) {
      showError(`Cidade "${cityName}" não encontrada. Tente novamente.`);
      return; // Parar aqui
    }

    // ETAPA 2: Obter os dados do clima usando as coordenadas
    const weatherData = await getWeatherData(
      coordinates.latitude,
      coordinates.longitude,
    );

    // ETAPA 3: Exibir os dados na tela
    displayWeather(weatherData, cityName, coordinates);
  } catch (error) {
    // Se algo der errado, mostrar mensagem de erro
    showError("Erro ao buscar dados. Tente novamente mais tarde.");

    // Mostrar o erro no console (para debug)
    console.error(error);
  }
}

// ============================================
// FUNÇÃO: Exibir os dados de clima na tela
// ============================================
// Esta função recebe os dados do clima e coloca na página
//
function displayWeather(data, cityFullName, coordinates) {
  // Esconder o carregamento
  hideLoading();

  // Extrair os dados ATUAIS do objeto
  // data.current contém temperatura, umidade, vento, etc
  const current = data.current;

  // Obter a data e hora atual
  const now = new Date();

  // ========== COLOCAR OS DADOS NA PÁGINA ==========

  // Mostrar o nome da cidade
  cityName.textContent = cityFullName ? cityFullName : "Cidade desconhecida";

  // Mostrar coordenadas e data formatada
  // .toFixed(2) = mostrar apenas 2 casas decimais
  // .toLocaleDateString() = converter para formato brasileiro
  const latitude = coordinates.latitude.toFixed(2);
  const longitude = coordinates.longitude.toFixed(2);
  const dataFormatada = now.toLocaleDateString("pt-BR", {
    weekday: "long", // Nome do dia (segunda, terça, etc)
    year: "numeric", // Ano (2026)
    month: "long", // Nome do mês (janeiro, fevereiro, etc)
    day: "numeric", // Dia do mês
  });
  dateInfo.textContent = `${latitude}°N, ${longitude}°E | ${dataFormatada}`;

  // Mostrar temperatura (arredondar para número inteiro)
  const temperaturaAtual = current.temperature_2m;
  temp.textContent = `${Math.round(temperaturaAtual)}°C`;

  // Mostrar descrição do clima
  const weatherCode = current.weather_code;
  const weatherDesc = getWeatherDescription(weatherCode);
  description.textContent = weatherDesc;

  // Mostrar sensação térmica
  const sensacaoTermica = current.apparent_temperature;
  feelsLike.textContent = `Sensação térmica: ${Math.round(sensacaoTermica)}°C`;

  // Mostrar umidade (%)
  const umidadeNivel = current.relative_humidity_2m;
  humidity.textContent = `${umidadeNivel}%`;

  // Mostrar velocidade do vento (km/h)
  const velocidade = current.wind_speed_10m;
  windSpeed.textContent = `${Math.round(velocidade)} km/h`;

  // Mostrar a seção de clima
  showWeatherSection();
}

// ============================================
// FUNÇÃO: Converter código de clima em descrição
// ============================================
// As APIs retornam números para o tipo de clima
// Esta função converte para uma descrição legível
// Exemplo: 0 = "☀️ Céu limpo"
//
function getWeatherDescription(code) {
  // Um objeto (dicionário) com a tradução dos códigos
  // Números do lado esquerdo = código da API
  // Texto com emoji do lado direito = descrição legível
  const descriptions = {
    // Códigos 0-3: Sem chuva
    0: "☀️ Céu limpo",
    1: "🌤️ Principalmente ensolarado",
    2: "⛅ Parcialmente nublado",
    3: "☁️ Nublado",

    // Códigos 45-48: Névoa
    45: "🌫️ Névoa",
    48: "🌫️ Névoa com geada",

    // Códigos 50-59: Garoa (chuva leve)
    51: "🌦️ Garoa leve",
    53: "🌧️ Garoa moderada",
    55: "🌧️ Garoa densa",

    // Códigos 60-69: Chuva
    61: "🌧️ Chuva fraca",
    63: "🌧️ Chuva moderada",
    65: "⛈️ Chuva forte",

    // Códigos 70-79: Neve
    71: "❄️ Neve fraca",
    73: "❄️ Neve moderada",
    75: "❄️ Neve forte",
    77: "❄️ Grãos de neve",

    // Códigos 80-82: Pancadas de chuva
    80: "🌧️ Pancadas de chuva fracas",
    81: "🌧️ Pancadas de chuva moderadas",
    82: "⛈️ Pancadas de chuva violentas",

    // Códigos 85-86: Pancadas de neve
    85: "❄️ Pancadas de neve fracas",
    86: "❄️ Pancadas de neve fortes",

    // Códigos 95-99: Tempestades
    95: "⛈️ Tempestade com chuva fraca",
    96: "⛈️ Tempestade com granizo fraco",
    99: "⛈️ Tempestade com granizo forte",
  };

  // Retornar a descrição do código
  // || significa "se não encontrar, usar este valor padrão"
  return descriptions[code] || "Condição desconhecida";
}

// ============================================
// FUNÇÕES PARA CONTROLAR AS SEÇÕES DA PÁGINA
// ============================================
// classList.add('hidden') = esconde um elemento
// classList.remove('hidden') = mostra um elemento
// Apenas uma seção pode ser mostrada por vez

/**
 * Mostrar a seção de clima
 * Esconde as seções de erro e carregamento
 */
function showWeatherSection() {
  // Mostrar a seção de clima
  weatherSection.classList.remove("hidden");

  // Esconder a seção de erro
  errorSection.classList.add("hidden");

  // Esconder a seção de carregamento
  loadingSection.classList.add("hidden");
}

/**
 * Mostrar mensagem de erro
 * @param {string} message - O texto da mensagem de erro
 */
function showError(message) {
  // Atualizar o texto da mensagem de erro
  errorMessage.textContent = message;

  // Mostrar a seção de erro
  errorSection.classList.remove("hidden");

  // Esconder a seção de clima
  weatherSection.classList.add("hidden");

  // Esconder a seção de carregamento
  loadingSection.classList.add("hidden");
}

/**
 * Esconder a seção de erro
 */
function hideError() {
  errorSection.classList.add("hidden");
}

/**
 * Mostrar a seção de carregamento
 * Mostra o spinner (aquele círculo girando)
 */
function showLoading() {
  // Mostrar a seção de carregamento
  loadingSection.classList.remove("hidden");

  // Esconder a seção de clima
  weatherSection.classList.add("hidden");

  // Esconder a seção de erro
  errorSection.classList.add("hidden");
}

/**
 * Esconder a seção de carregamento
 */
function hideLoading() {
  loadingSection.classList.add("hidden");
}
