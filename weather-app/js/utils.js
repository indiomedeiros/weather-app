// ============================================
// ARQUIVO: utils.js
// FUNÇÃO: Funções auxiliares reutilizáveis
// ============================================
// Este arquivo contém funções úteis que podem
// ser usadas em várias partes do projeto

// ============================================
// FUNÇÕES DE FORMATAÇÃO
// ============================================
// Estas funções transformam dados em texto legível

/**
 * Formata um número de temperatura com símbolo °C
 * @param {number} temp - Temperatura em número
 * @returns {string} Temperatura formatada (ex: "25°C")
 */
function formatTemperature(temp) {
  // Math.round() = arredondar para número inteiro
  return `${Math.round(temp)}°C`;
}

/**
 * Formata velocidade do vento
 * @param {number} speed - Velocidade em km/h
 * @returns {string} Velocidade formatada (ex: "10 km/h")
 */
function formatWindSpeed(speed) {
  return `${Math.round(speed)} km/h`;
}

/**
 * Formata uma data para português brasileiro
 * @param {Date} date - Objeto Data do JavaScript
 * @param {string} locale - Localidade (padrão: 'pt-BR')
 * @returns {string} Data formatada (ex: "segunda-feira, 8 de fevereiro de 2026")
 */
function formatDate(date, locale = "pt-BR") {
  // toLocaleDateString() converte a data para formato legível
  return date.toLocaleDateString(locale, {
    weekday: "long", // Mostra o dia da semana
    year: "numeric", // Mostra o ano
    month: "long", // Mostra o mês por extenso
    day: "numeric", // Mostra o dia do mês
  });
}

/**
 * Coloca primeira letra em maiúscula
 * @param {string} str - Texto com primeira letra minúscula
 * @returns {string} Texto com primeira letra maiúscula
 */
function capitalizeFirstLetter(str) {
  // str.charAt(0) = primeira letra
  // .toUpperCase() = converter para maiúscula
  // str.slice(1) = resto da palavra
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Remove espaços em branco no início e fim
 * @param {string} str - Texto com espaços
 * @returns {string} Texto sem espaços
 */
function trimWhitespace(str) {
  // .trim() remove espaços antes e depois
  return str.trim();
}

// ============================================
// FUNÇÕES DE VALIDAÇÃO
// ============================================
// Estas funções verificam se dados estão corretos

/**
 * Verifica se um nome de cidade é válido
 * @param {string} cityName - Nome da cidade
 * @returns {boolean} true = válido | false = inválido
 */
function isValidCityName(cityName) {
  // Remover espaços em branco
  const trimmed = cityName.trim();

  // Verificar:
  // - Se tem pelo menos 1 caractere
  // - Se tem no máximo 100 caracteres
  return trimmed.length > 0 && trimmed.length <= 100;
}

// ============================================
// FUNÇÕES DE CONVERSÃO
// ============================================
// Estas funções transformam valores de uma unidade para outra

/**
 * Converte temperatura de Celsius para Fahrenheit
 * @param {number} celsius - Temperatura em Celsius
 * @returns {number} Temperatura em Fahrenheit
 *
 * Fórmula: F = (C × 9/5) + 32
 */
function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

/**
 * Calcula a "sensação térmica" do frio com vento
 * @param {number} temp - Temperatura em Celsius
 * @param {number} windSpeed - Velocidade do vento em km/h
 * @returns {number} Temperatura de sensação (com wind chill)
 */
function calculateWindChill(temp, windSpeed) {
  // Fórmula do Wind Chill em unidades métricas
  // Se não tem vento, retornar a temperatura normal
  if (windSpeed > 0) {
    return (
      13.12 +
      0.6215 * temp -
      11.37 * Math.pow(windSpeed, 0.16) +
      0.3965 * temp * Math.pow(windSpeed, 0.16)
    );
  }
  return temp;
}

/**
 * Determina a qualidade do ar
 * @param {number} indicator - Número entre 0-500
 * @returns {string} Descrição da qualidade do ar
 */
function getAirQualityDescription(indicator) {
  // Quanto MENOR o número, MELHOR a qualidade
  if (indicator <= 50) return "Excelente";
  if (indicator <= 100) return "Bom";
  if (indicator <= 150) return "Moderado";
  if (indicator <= 200) return "Pobre";
  if (indicator <= 300) return "Muito Pobre";
  return "Perigoso"; // > 300
}

// ============================================
// FUNÇÕES DE ARMAZENAMENTO (localStorage)
// ============================================
// localStorage = memória do navegador que persiste
// Você pode salvar dados que não desaparecem ao fechar a página

/**
 * Salva dados no localStorage do navegador
 * @param {string} key - Nome da chave (ex: "cidade")
 * @param {any} value - Valor a salvar (pode ser qualquer coisa)
 *
 * Exemplo: saveToLocalStorage('climaAtual', {temp: 25});
 */
function saveToLocalStorage(key, value) {
  try {
    // Converter o valor para texto (JSON)
    // JSON é um formato de texto que o navegador entende
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Se algo der errado, mostrar erro no console
    console.error("Erro ao salvar no localStorage:", error);
  }
}

/**
 * Obtém dados do localStorage
 * @param {string} key - Nome da chave a buscar
 * @returns {any|null} Valor armazenado ou null se não existir
 *
 * Exemplo: const clima = getFromLocalStorage('climaAtual');
 */
function getFromLocalStorage(key) {
  try {
    // Buscar o valor no localStorage
    const value = localStorage.getItem(key);

    // Se tem valor, converter de texto para objeto
    // Se não tem valor, retornar null
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Erro ao ler do localStorage:", error);
    return null;
  }
}

/**
 * Remove dados do localStorage
 * @param {string} key - Nome da chave a remover
 *
 * Exemplo: removeFromLocalStorage('climaAtual');
 */
function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Erro ao remover do localStorage:", error);
  }
}
