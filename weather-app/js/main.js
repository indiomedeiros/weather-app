// ============================================
// ARQUIVO: main.js
// FUNÇÃO: Lógica principal do aplicativo
// ============================================

// PASSO 1: Buscar elementos do HTML
// document.getElementById() encontra elementos pelo ID no HTML

// Elementos do formulário de busca (aceita uma ou múltiplas cidades separadas por vírgula)
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const searchSuggestions = document.getElementById("searchSuggestions");
const searchBtn = document.getElementById("searchBtn");

// Elementos das seções da página
const weatherSection = document.getElementById("weatherSection");
const errorSection = document.getElementById("errorSection");
const loadingSection = document.getElementById("loadingSection");
const comparisonSection = document.getElementById("comparisonSection");
const comparisonResults = document.getElementById("comparisonResults");
const forecastSection = document.getElementById("forecastSection");
const forecastContainer = document.getElementById("forecastContainer");

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
  const raw = cityInput.value.trim();

  if (!raw) {
    showError(
      "Por favor, digite o nome de uma cidade ou várias separadas por vírgula.",
    );
    return;
  }

  // Verificar se o usuário enviou múltiplas cidades (separadas por vírgula)
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length === 1) {
    // Única cidade: comportamento original
    await fetchWeather(parts[0]);
  } else {
    // Múltiplas cidades: buscar comparação
    await fetchWeatherComparison(parts);
  }

  // Limpar o campo de entrada
  cityInput.value = "";
});

// Clear button
if (clearSearchBtn) {
  clearSearchBtn.addEventListener("click", function () {
    cityInput.value = "";
    cityInput.focus();
    hideSuggestions();
  });
}

// Recent searches (localStorage)
function getRecentCities() {
  try {
    return JSON.parse(localStorage.getItem("recentCities") || "[]");
  } catch (e) {
    return [];
  }
}

function saveRecentCity(city) {
  if (!city) return;
  const normalized = city.trim();
  const list = getRecentCities().filter(
    (c) => c.toLowerCase() !== normalized.toLowerCase(),
  );
  list.unshift(normalized);
  localStorage.setItem("recentCities", JSON.stringify(list.slice(0, 10)));
}

// Suggestions render/hide
function renderSuggestions(query) {
  if (!searchSuggestions) return;
  const recent = getRecentCities();
  const q = (query || "").trim().toLowerCase();
  if (!q) {
    searchSuggestions.classList.add("hidden");
    searchSuggestions.innerHTML = "";
    return;
  }
  const matches = recent.filter((c) => c.toLowerCase().includes(q));
  if (matches.length === 0) {
    searchSuggestions.classList.add("hidden");
    searchSuggestions.innerHTML = "";
    return;
  }
  searchSuggestions.innerHTML = matches
    .map(
      (m) => `<li class="suggestion-item" tabindex="0">${escapeHtml(m)}</li>`,
    )
    .join("");
  searchSuggestions.classList.remove("hidden");
}

function hideSuggestions() {
  if (!searchSuggestions) return;
  searchSuggestions.classList.add("hidden");
  searchSuggestions.innerHTML = "";
}

function escapeHtml(text) {
  return String(text).replace(/[&"'<>]/g, function (m) {
    return {
      "&": "&amp;",
      '"': "&quot;",
      "'": "&#39;",
      "<": "&lt;",
      ">": "&gt;",
    }[m];
  });
}

// Input events for suggestions
if (cityInput) {
  cityInput.addEventListener("input", function () {
    renderSuggestions(cityInput.value);
  });
}

// Click on suggestion
document.addEventListener("click", function (e) {
  if (
    e.target &&
    e.target.classList &&
    e.target.classList.contains("suggestion-item")
  ) {
    cityInput.value = e.target.textContent;
    hideSuggestions();
    cityInput.focus();
  } else if (!e.target.closest || !e.target.closest(".input-group")) {
    hideSuggestions();
  }
});

// Save recent city on successful single-city load
const originalDisplayWeather = displayWeather;
displayWeather = function (data, cityFullName, coordinates) {
  try {
    if (cityFullName) saveRecentCity(cityFullName);
  } catch (e) {}
  return originalDisplayWeather(data, cityFullName, coordinates);
};

// note: compareForm removed; single input handles both single and multiple cities

// ============================================
// FUNÇÃO: Buscar e comparar clima de múltiplas cidades
// ============================================
async function fetchWeatherComparison(cityNames) {
  showLoading();
  hideError();

  try {
    // Chamar a função de comparação do api.js
    const comparisonData = await compareWeatherByCities(cityNames);

    // Verificar se obteve dados
    if (!comparisonData || comparisonData.length === 0) {
      showError(
        "Nenhuma das cidades foi encontrada. Verifique os nomes e tente novamente.",
      );
      return;
    }

    // Exibir os dados da comparação na tela
    displayWeatherComparison(comparisonData);
  } catch (error) {
    showError(
      "Erro ao buscar dados da comparação. Tente novamente mais tarde.",
    );
    console.error(error);
  }
}

// ============================================
// FUNÇÃO: Exibir a comparação de cidades na tela
// ============================================
function displayWeatherComparison(comparisonData) {
  hideLoading();

  // Limpar resultados anteriores
  comparisonResults.innerHTML = "";

  if (!comparisonData || comparisonData.length === 0) {
    showError("Nenhuma cidade foi encontrada para comparação.");
    return;
  }

  // Encontrar cidades com extremos
  const hottest = getHottestCity(comparisonData);
  const coldest = getColdestCity(comparisonData);
  const averageTemp = getAverageTemperature(comparisonData);
  const highestHumidity = getHighestHumidityCity(comparisonData);
  const highestWindSpeed = getHighestWindSpeedCity(comparisonData);

  // Criar HTML com as cidades
  let html = "<div class='cities-grid'>";

  for (const city of comparisonData) {
    const isBothHottest = hottest && city.city === hottest.city;
    const isBothColdest = coldest && city.city === coldest.city;
    const highlightClass = isBothHottest
      ? "hottest"
      : isBothColdest
        ? "coldest"
        : "";
    const htmlHighlight = isBothHottest ? " ☀️" : isBothColdest ? " ❄️" : "";

    html += `
      <div class="city-card ${highlightClass}">
        <h3>${city.city}${htmlHighlight}</h3>
        <p class="temp-main">${Math.round(city.temperature)}°C</p>
        <p class="feels-like">Sensação térmica: ${Math.round(city.feelsLike)}°C</p>
        <p class="humidity">💧 Umidade: ${city.humidity}%</p>
        <p class="wind">💨 Vento: ${Math.round(city.windSpeed)} km/h</p>
        <p class="coords">${city.latitude.toFixed(2)}°, ${city.longitude.toFixed(2)}°</p>
      </div>
    `;
  }

  html += "</div>";

  // Adicionar resumo estatístico
  html += `
    <div class="comparison-summary">
      <h3>Resumo Comparativo</h3>
      <div class="summary-grid">
        <div class="summary-item">
          <span class="label">Mais Quente:</span>
          <span class="value">${hottest?.city || "N/A"} - ${hottest ? Math.round(hottest.temperature) : "N/A"}°C</span>
        </div>
        <div class="summary-item">
          <span class="label">Mais Frio:</span>
          <span class="value">${coldest?.city || "N/A"} - ${coldest ? Math.round(coldest.temperature) : "N/A"}°C</span>
        </div>
        <div class="summary-item">
          <span class="label">Temperatura Média:</span>
          <span class="value">${Math.round(averageTemp)}°C</span>
        </div>
        <div class="summary-item">
          <span class="label">Maior Umidade:</span>
          <span class="value">${highestHumidity?.city || "N/A"} - ${highestHumidity?.humidity || "N/A"}%</span>
        </div>
        <div class="summary-item">
          <span class="label">Maior Velocidade do Vento:</span>
          <span class="value">${highestWindSpeed?.city || "N/A"} - ${highestWindSpeed ? Math.round(highestWindSpeed.windSpeed) : "N/A"} km/h</span>
        </div>
      </div>
    </div>
  `;

  comparisonResults.innerHTML = html;

  // Mostrar a seção de comparação e esconder outras
  comparisonSection.classList.remove("hidden");
  weatherSection.classList.add("hidden");
  errorSection.classList.add("hidden");
  loadingSection.classList.add("hidden");
}
// ============================================
// Funções utilitárias para comparação
// ============================================

function getHottestCity(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list.reduce((best, cur) => {
    if (!best) return cur;
    return cur.temperature > best.temperature ? cur : best;
  }, null);
}

function getColdestCity(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list.reduce((best, cur) => {
    if (!best) return cur;
    return cur.temperature < best.temperature ? cur : best;
  }, null);
}

function getAverageTemperature(list) {
  if (!Array.isArray(list) || list.length === 0) return 0;
  const sum = list.reduce((s, c) => s + Number(c.temperature || 0), 0);
  return sum / list.length;
}

function getHighestHumidityCity(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list.reduce((best, cur) => {
    if (!best) return cur;
    return (cur.humidity || 0) > (best.humidity || 0) ? cur : best;
  }, null);
}

function getHighestWindSpeedCity(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list.reduce((best, cur) => {
    if (!best) return cur;
    return (cur.windSpeed || 0) > (best.windSpeed || 0) ? cur : best;
  }, null);
}

// ============================================
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
    // ETAPA 4: Obter e exibir previsão para múltiplos dias (default 5 dias)
    try {
      const forecast = await getWeatherForecast(
        coordinates.latitude,
        coordinates.longitude,
        5,
      );
      displayForecast(forecast);
    } catch (err) {
      console.warn("Não foi possível carregar a previsão multi-dia:", err);
      // Não interrompe a exibição do clima atual
    }
  } catch (error) {
    // Se algo der errado, mostrar mensagem de erro
    showError("Erro ao buscar dados. Tente novamente mais tarde.");

    // Mostrar o erro no console (para debug)
    console.error(error);
  }
}

// ============================================
// FUNÇÃO: Exibir previsão multi-dia
// Espera objeto retornado por getWeatherForecast()
// ============================================
function displayForecast(forecastData) {
  if (!forecastSection || !forecastContainer) return;

  try {
    const daily = forecastData && forecastData.daily;
    if (!daily || !daily.time || daily.time.length === 0) {
      forecastSection.classList.add("hidden");
      return;
    }

    // Construir HTML dos cards de previsão
    const days = daily.time.length;
    const times = daily.time;
    const tMax = daily.temperature_2m_max || [];
    const tMin = daily.temperature_2m_min || [];
    const weatherCodes = daily.weathercode || [];

    let html = "";
    for (let i = 0; i < days; i++) {
      const date = new Date(times[i]);
      const dateStr = date.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });
      const max = typeof tMax[i] !== "undefined" ? Math.round(tMax[i]) : "N/A";
      const min = typeof tMin[i] !== "undefined" ? Math.round(tMin[i]) : "N/A";
      const code =
        typeof weatherCodes[i] !== "undefined" ? weatherCodes[i] : null;
      const desc = getWeatherDescription(code);

      html += `
        <div class="forecast-card">
          <div class="forecast-date">${dateStr}</div>
          <div class="forecast-desc">${desc}</div>
          <div class="forecast-temps">${max}° / ${min}°</div>
        </div>
      `;
    }

    forecastContainer.innerHTML = html;
    forecastSection.classList.remove("hidden");
  } catch (err) {
    console.error("Erro ao renderizar previsão:", err);
    forecastSection.classList.add("hidden");
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
  // Esconder a seção de comparação quando mostramos uma cidade única
  if (comparisonSection) comparisonSection.classList.add("hidden");
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
