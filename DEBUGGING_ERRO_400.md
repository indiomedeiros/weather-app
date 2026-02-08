# 🐛 Guia de Debugging - Erro 400 da API

Se você está vendo um erro como este, este guia vai ajudar a resolver:

```
Error: Erro da API: 400
    at getWeatherData (api.js:83:13)
```

---

## 🔍 O que é Erro 400?

**400 = Bad Request (Requisição Inválida)**

Significa que os parâmetros enviados para a API não estão corretos ou formatos inválidos.

---

## 🛠️ Como Debugar (Passo a Passo)

### Etapa 1: Abrir o Console

Pressione **F12** no navegador → Aba **Console**

Você verá mensagens como:

```
URL enviada (Geocoding): https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o+Paulo&count=1&language=pt&format=json
URL enviada para API de clima: https://api.open-meteo.com/v1/forecast?latitude=-23...
```

### Etapa 2: Copiar a URL

Copie a URL que aparece no console (geralmente a que está depois de `URL enviada para API de clima:`).

**Exemplo:**

```
https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current=temperature_2m...
```

### Etapa 3: Testar a URL

Paste a URL na barra de endereço do navegador e pressione Enter.

- ✅ **Se funcionar**: Você verá dados JSON na tela
- ❌ **Se der erro 400**: A URL tem algum problema

---

## ⚠️ Causas Comuns do Erro 400

### 1. **Parâmetros Escondidos**

O `current` tem que estar tudo em uma linha, sem quebras.

❌ **Errado:**

```javascript
current: "temperature_2m,
          relative_humidity_2m..."
```

✅ **Correto:** (seu código já está assim)

```javascript
current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure,uv_index";
```

### 2. **Caracteres Especiais**

Acentos e espaços precisam ser convertidos pela `URLSearchParams`.

Exemplo:

- `São Paulo` → `S%C3%A3o+Paulo` (URL encoded)

O seu código já faz isso automaticamente, então não é problema.

### 3. **Falta de Parâmetros Obrigatórios**

A API Open-Meteo precisa de:

- `latitude` ✅
- `longitude` ✅
- `current` ou `daily` ou `hourly` ✅
- Rest dos parâmetros são opcionais

### 4. **API Temporariamente Indisponível**

Às vezes a API fica fora do ar. Teste em outro horário.

---

## ✅ Como Verificar Se Está Funcionando

### Teste 1: Verificar Geocoding

No console, digite:

```javascript
const coords = await getCoordinates("São Paulo");
console.log(coords);
```

Você deve ver algo assim:

```
Coordenadas encontradas: {
  latitude: -23.5505,
  longitude: -46.6333,
  name: "São Paulo",
  country: "Brazil"
}
```

Se isso funcionar, o problema está em `getWeatherData()`.

### Teste 2: Verificar Clima

No console, digite:

```javascript
const clima = await getWeatherData(-23.5505, -46.6333);
console.log(clima);
```

Se der erro 400, procure por `URL enviada para API de clima:` no console.

---

## 🔧 Solução Rápida

O código foi atualizado com melhor debugging. Agora você vai ver:

```
URL enviada (Geocoding): https://...
Dados de geocoding recebidos: {...}
Coordenadas encontradas: {...}
URL enviada para API de clima: https://...
Dados de clima recebidos: {...}
```

Procure por mensagens de erro em **vermelho**.

---

## 📋 Passo a Passo Para Resolver

1. **Abra o console (F12)**

2. **Teste a busca** (digite "São Paulo" e clique "Buscar")

3. **Procure por mensagens de erro** (em vermelho)

4. **Verifique as URLs:**
   - Estão bem formatadas?
   - Têm os parâmetros obrigatórios?

5. **Teste manualmente:**
   - Copie a URL do console
   - Cole na barra de endereço
   - Se der erro, o problema é na URL

6. **Compare com a documentação:**
   - Acesse: https://open-meteo.com/en/docs
   - Veja qual parâmetro está errado

---

## 🆘 Se Ainda Não Funcionar

### Possibilidade 1: Sem Internet

```javascript
// No console, teste:
fetch("https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0")
  .then(() => console.log("Internet OK"))
  .catch(() => console.log("Sem Internet!"));
```

### Possibilidade 2: API Fora do Ar

Acesse https://open-meteo.com/ direto no navegador.

- Se carregar → API está OK
- Se não carregar → API pode estar offline

### Possibilidade 3: Bloqueio por CORS

Às vezes o navegador bloqueia requisições entre domínios.

Você vai ver no console algo tipo:

```
Access to fetch at 'https://api.open-meteo.com/...'
from origin 'file://...' has been blocked by CORS policy
```

**Solução:** Use um servidor local em vez de abrir direto o arquivo HTML.

```bash
# Na pasta do projeto, use Python:
python -m http.server 8000

# Depois acesse: http://localhost:8000
```

---

## 📚 Código Melhorado

O `api.js` agora tem `console.log()` em cada etapa:

```javascript
// Em getCoordinates():
console.log("URL enviada (Geocoding):", urlCompleta);
console.log("Dados de geocoding recebidos:", data);
console.log("Coordenadas encontradas:", {...});

// Em getWeatherData():
console.log("URL enviada para API de clima:", urlCompleta);
console.log("Dados de clima recebidos:", data);
```

Procure por estes logs no console para entender onde está o problema.

---

## 💡 Dicas de Debugging

### Use console.log() sabiamente

```javascript
// Bom: Mostra o nome e o valor
console.log("Temperatura:", temperatura);

// Melhor: Usa % para formatar
console.log("Temperatura: %d°C", temperatura);

// Avançado: Mostra objeto expansível
console.log("Dados completos:", dados);
```

### Verifique cada passo

```javascript
// Antes de chamar a API
console.log("1. Iniciando busca para:", cityName);

// Depois de buscar coordenadas
console.log("2. Coordenadas:", coordinates);

// Depois de buscar clima
console.log("3. Clima:", weatherData);

// No final
console.log("4. Pronto!");
```

### Use console.table() para tabelas

```javascript
console.table({
  latitude: -23.55,
  longitude: -46.63,
  temperatura: 25,
  umidade: 65,
});
```

---

## 🎯 Próximos Passos

1. ✅ Atualizei `api.js` com melhor debugging
2. 🔍 Abra o console (F12)
3. 🧪 Teste outra vez
4. 📋 Procure pelas mensagens de debug
5. 🐛 Verifique as URLs

Se ainda tiver dúvidas, procure pelas URLs no console e teste-as manualmente!

---

**Boa sorte! 🚀**
