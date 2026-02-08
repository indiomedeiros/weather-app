# 📖 Exemplos de Uso - App de Clima

Este arquivo mostra exemplos práticos de como usar as funções do app.

---

## 🔧 Exemplos do arquivo `api.js`

### Exemplo 1: Buscar coordenadas de uma cidade

```javascript
// Buscar coordenadas de São Paulo
const coordenadas = await getCoordinates("São Paulo");

// Resultado esperado:
// {
//   latitude: -23.5505,
//   longitude: -46.6333,
//   name: "São Paulo",
//   country: "Brazil"
// }

// Usar os dados
console.log(`Latitude: ${coordenadas.latitude}`);
console.log(`Longitude: ${coordenadas.longitude}`);
```

### Exemplo 2: Buscar dados de clima

```javascript
// Buscar clima de São Paulo
const clima = await getWeatherData(-23.5505, -46.6333);

// Resultado esperado:
// {
//   current: {
//     temperature_2m: 25.5,
//     relative_humidity_2m: 65,
//     weather_code: 0,
//     wind_speed_10m: 8.2,
//     pressure: 1013
//   },
//   timezone: "America/Sao_Paulo"
// }

// Usar os dados
const temp = clima.current.temperature_2m;
const umidade = clima.current.relative_humidity_2m;
console.log(`Temperatura: ${temp}°C`);
console.log(`Umidade: ${umidade}%`);
```

### Exemplo 3: Busca completa (API + Clima)

```javascript
// Buscar tudo para uma cidade
async function buscarClimaCompleto(nomeDaCidade) {
  // Etapa 1: Obter coordenadas
  const coords = await getCoordinates(nomeDaCidade);

  if (!coords) {
    console.log("Cidade não encontrada!");
    return;
  }

  // Etapa 2: Obter clima
  const clima = await getWeatherData(coords.latitude, coords.longitude);

  // Etapa 3: Usar os dados
  console.log(`Cidade: ${coords.name}`);
  console.log(`Temperatura: ${clima.current.temperature_2m}°C`);
  console.log(`Humidade: ${clima.current.relative_humidity_2m}%`);
}

// Chamar a função
await buscarClimaCompleto("Rio de Janeiro");
```

---

## 🔧 Exemplos do arquivo `main.js`

### Exemplo 1: Mostrar a seção de clima

```javascript
// Quando o usuário busca uma cidade com sucesso
showWeatherSection();

// Resultado:
// - A seção de clima fica visível
// - A seção de erro fica escondida
// - A seção de carregamento fica escondida
```

### Exemplo 2: Mostrar mensagem de erro

```javascript
// Se a cidade não for encontrada
showError("Cidade não encontrada!");

// Resultado:
// - A seção de erro fica visível
// - A mensagem aparece na tela
// - Outras seções ficam escondidas
```

### Exemplo 3: Exibir dados na página

```javascript
// Exemplo de como os dados são colocados na página
function exibirClimaNaTela(datos, cidade, coords) {
  // Preencher o nome da cidade
  cityName.textContent = cidade; // "São Paulo"

  // Preencher a temperatura
  temp.textContent = `${Math.round(dados.current.temperature_2m)}°C`; // "25°C"

  // Preencher a umidade
  humidity.textContent = `${dados.current.relative_humidity_2m}%`; // "65%"

  // Preencher o vento
  windSpeed.textContent = `${Math.round(dados.current.wind_speed_10m)} km/h`; // "8 km/h"
}
```

---

## 🔧 Exemplos do arquivo `utils.js`

### Exemplo 1: Formatar temperatura

```javascript
// Entrada: 25.7
// Saída: "26°C"
const tempFormatada = formatTemperature(25.7);
console.log(tempFormatada); // "26°C"
```

### Exemplo 2: Formatar velocidade do vento

```javascript
// Entrada: 8.24
// Saída: "8 km/h"
const ventoFormatado = formatWindSpeed(8.24);
console.log(ventoFormatado); // "8 km/h"
```

### Exemplo 3: Formatar data

```javascript
// Entrada: new Date()
// Saída: "segunda-feira, 8 de fevereiro de 2026"
const dataFormatada = formatDate(new Date());
console.log(dataFormatada);
// "segunda-feira, 8 de fevereiro de 2026"
```

### Exemplo 4: Capitalizar primeira letra

```javascript
// Entrada: "são paulo"
// Saída: "São paulo"
const resultado = capitalizeFirstLetter("são paulo");
console.log(resultado); // "São paulo"
```

### Exemplo 5: Limpar espaços

```javascript
// Entrada: "  São Paulo  "
// Saída: "São Paulo"
const limpo = trimWhitespace("  São Paulo  ");
console.log(limpo); // "São Paulo"
```

### Exemplo 6: Validar nome da cidade

```javascript
// Válido
isValidCityName("São Paulo"); // true
isValidCityName("Rio"); // true

// Inválido
isValidCityName(""); // false (vazio)
isValidCityName("   "); // false (só espaços)
isValidCityName("a".repeat(101)); // false (muito longo)
```

### Exemplo 7: Converter Celsius para Fahrenheit

```javascript
// Entrada: 0°C
// Saída: 32°F
celsiusToFahrenheit(0); // 32

// Entrada: 25°C
// Saída: 77°F
celsiusToFahrenheit(25); // 77

// Entrada: 100°C
// Saída: 212°F
celsiusToFahrenheit(100); // 212
```

### Exemplo 8: Calcular sensação térmica

```javascript
// Sem vento
calculateWindChill(10, 0); // 10 (sem mudança)

// Com vento (faz mais frio)
calculateWindChill(10, 20); // Aproximadamente 1-2°C (muito mais frio!)
calculateWindChill(0, 40); // Muito mais frio ainda!
```

### Exemplo 9: Qualidade do ar

```javascript
getAirQualityDescription(30); // "Excelente"
getAirQualityDescription(75); // "Bom"
getAirQualityDescription(125); // "Moderado"
getAirQualityDescription(175); // "Pobre"
getAirQualityDescription(250); // "Muito Pobre"
getAirQualityDescription(400); // "Perigoso"
```

### Exemplo 10: Salvar dados no navegador

```javascript
// Salvar dados
const minhasCidades = ["São Paulo", "Rio de Janeiro", "Brasília"];
saveToLocalStorage("cidades", minhasCidades);

// Recuperar dados
const cidades = getFromLocalStorage("cidades");
console.log(cidades); // ['São Paulo', 'Rio de Janeiro', 'Brasília']

// Remover dados
removeFromLocalStorage("cidades");
```

---

## 🎯 Fluxo Completo: Do Usuário até a Tela

### Passo 1: Usuário digita "São Paulo" e clica em "Buscar"

```javascript
// HTML (o que o usuário vê)
<input id="cityInput" value="São Paulo">
<button>Buscar</button>
```

### Passo 2: JavaScript detecta o clique

```javascript
// main.js
searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const city = cityInput.value.trim(); // "São Paulo"
  await fetchWeather(city);
});
```

### Passo 3: Buscar coordenadas

```javascript
// api.js
const coordinates = await getCoordinates("São Paulo");
// Resultado: { latitude: -23.55, longitude: -46.63, name: "São Paulo" }
```

### Passo 4: Buscar dados de clima

```javascript
// api.js
const weatherData = await getWeatherData(-23.55, -46.63);
// Resultado: { current: { temperature_2m: 25, humidity: 65, ... } }
```

### Passo 5: Atualizar a página

```javascript
// main.js
displayWeather(weatherData, "São Paulo", coordinates);

// Isto faz:
cityName.textContent = "São Paulo"; // HTML atualizado
temp.textContent = "25°C"; // HTML atualizado
humidity.textContent = "65%"; // HTML atualizado
// ... e assim por diante
```

### Passo 6: Usuário vê o resultado na tela!

```
São Paulo
-23.55°N, -46.63°E

25°C

Céu limpo
Sensação térmica: 24°C

Umidade: 65%
Vento: 8 km/h
Pressão: 1013 hPa
Índice UV: 7.5
```

---

## 🐛 Debugging: Como Entender o Código

### 1. Abrir o Console (F12)

```
Windows/Linux: F12
Mac: Cmd + Option + I
```

### 2. Colocar `console.log()` no código

```javascript
// Adicionar isto no main.js
async function fetchWeather(cityName) {
  console.log("1. Buscando coordenadas para:", cityName);

  const coordinates = await getCoordinates(cityName);
  console.log("2. Coordenadas encontradas:", coordinates);

  const weatherData = await getWeatherData(
    coordinates.latitude,
    coordinates.longitude,
  );
  console.log("3. Dados de clima encontrados:", weatherData);

  displayWeather(weatherData, cityName, coordinates);
  console.log("4. Tudo pronto!");
}
```

### 3. Ver o resultado no Console

```
1. Buscando coordenadas para: São Paulo
2. Coordenadas encontradas: {latitude: -23.5505, longitude: -46.6333, ...}
3. Dados de clima encontrados: {current: {temperature_2m: 25, ...}, ...}
4. Tudo pronto!
```

### 4. Se tiver erro, verá algo assim

```
Erro ao buscar coordenadas: TypeError: Cannot read property 'results' of undefined
```

---

## 💾 Salvando Dados no Navegador

### Exemplo: Salvar última cidade pesquisada

```javascript
// No final de fetchWeather()
async function fetchWeather(cityName) {
  // ... todo código ...

  // Salvar a cidade
  saveToLocalStorage("ultimaCidade", cityName);
}

// Quando a página abre
window.addEventListener("load", function () {
  const ultimaCidade = getFromLocalStorage("ultimaCidade");
  if (ultimaCidade) {
    console.log("Última cidade pesquisada: " + ultimaCidade);
  }
});
```

### Exemplo: Salvar histórico de cidades

```javascript
function adicionarAoHistorico(cidade) {
  // Obter histórico anterior
  let historico = getFromLocalStorage("historico") || [];

  // Adicionar nova cidade (se não estiver)
  if (!historico.includes(cidade)) {
    historico.push(cidade);
  }

  // Salvar
  saveToLocalStorage("historico", historico);
}

// Ver histórico
function mostrarHistorico() {
  const historico = getFromLocalStorage("historico");
  console.log("Cidades pesquisadas:", historico);
}
```

---

## 🔗 Como Fazer Requisições Diferentes

### Buscar informações extras

```javascript
// No api.js, modificar getWeatherData()
async function getWeatherData(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude,
    longitude: longitude,
    current: "temperature_2m,relative_humidity_2m,weather_code,...",
    // Adicionar mais dados:
    daily: "temperature_2m_max,temperature_2m_min", // Máx e mín
    hourly: "temperature_2m", // Hora por hora
    timezone: "auto",
    language: "pt",
  });

  const response = await fetch(`${WEATHER_API}?${params}`);
  const data = await response.json();
  return data;
}
```

### Usar os dados extras

```javascript
// Após buscar:
const diasSeguintes = data.daily; // Dados dos próximos dias
const porHora = data.hourly; // Dados hora por hora

// Mostrar máxima do dia
console.log("Temperatura máxima: " + diasSeguintes.temperature_2m_max[0]);
```

---

## ✅ Checklist: Entendi o Projeto?

- [ ] Entendo o que é HTML, CSS e JavaScript
- [ ] Consigo ver o Console (F12)
- [ ] Entendo o que `async/await` faz
- [ ] Sei como as APIs funcionam
- [ ] Consigo ler JSON
- [ ] Entendo como manipular o DOM
- [ ] Consigo acompanhar o fluxo: Usuário → Busca → API → Tela
- [ ] Consigo adicionar `console.log()` para debugar
- [ ] Entendo como salvar dados no localStorage

Se respondeu "sim" para todas, você já tem uma boa compreensão! 🎉

---

## 🚀 Próximos Passos

1. **Modifique o projeto:**
   - Mude as cores do CSS
   - Adicione novos dados (pressão, UV, etc)
   - Mude os textos das mensagens

2. **Adicione novas funções:**
   - Histórico de buscas
   - Favoritos
   - Conversão de unidades

3. **Aprenda novos conceitos:**
   - Frameworks (React, Vue)
   - Banco de dados (Firebase)
   - Deploy (colocar online)

---

**Parabéns por ter chegado até aqui! Agora você já entende JavaScript, APIs e como criar aplicações web!** 🎊
