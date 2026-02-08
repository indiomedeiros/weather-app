# 📚 Guia para Iniciantes em Programação

Bem-vindo! Este guia explica os conceitos básicos usados neste projeto de clima.

---

## 🎯 O que é este Projeto?

Um **aplicativo de clima** que:

1. Recebe o nome de uma cidade do usuário
2. Busca dados meteorológicos de uma API (servidor na internet)
3. Mostra temperatura, umidade, vento e outras informações

---

## 💻 Linguagens Usadas

### 1. **HTML** (estrutura)

- Define **o quê** aparecer na página
- Tags como `<button>`, `<input>`, `<div>`
- Exemplo: `<h1>Meu Título</h1>`

### 2. **CSS** (aparência)

- Define **como** as coisas parecem
- Cores, tamanhos, posições
- Exemplo: `color: blue;` (texto azul)

### 3. **JavaScript** (interatividade)

- Define **o que fazer** quando o usuário interage
- Buscar dados, processar, atualizar página
- Exemplo: `alert('Olá!');` (mostra uma caixa com mensagem)

---

## 📁 Estrutura de Arquivos

```
weather-app/
├── index.html           ⭐ Estrutura da página
├── css/
│   └── styles.css       🎨 Aparência da página
├── js/
│   ├── main.js          ⚙️ Lógica principal
│   ├── api.js           🌐 Buscar dados da internet
│   └── utils.js         🛠️ Funções auxiliares
└── README.md            📖 Documentação
```

**Como funciona:**

1. Browser abre `index.html`
2. HTML carrega o CSS (estilos)
3. HTML carrega o JavaScript (códigos)
4. JavaScript espera o usuário digitar algo

---

## 🔑 Conceitos Importantes

### 1. **Variáveis** (guardar dados)

```javascript
// Declarar uma variável
const nomeDaCidade = "São Paulo";

// Use const quando não vai mudar
// Use let quando pode mudar
let temperatura = 25;
temperatura = 26; // Pode mudar
```

**Tipos de dados:**

- `"texto"` - entre aspas duplas ou simples
- `123` - números
- `true` / `false` - verdadeiro ou falso
- `{ idade: 25 }` - objeto (estrutura com propriedades)

### 2. **Funções** (blocos de código reutilizáveis)

```javascript
// Definir uma função
function mostrarTemperatura(temp) {
  console.log("A temperatura é: " + temp);
}

// Usar (chamar) a função
mostrarTemperatura(25); // Mostra: "A temperatura é: 25"
```

**Funções async (para a internet):**

```javascript
async function buscarDados() {
  const resposta = await fetch("http://..."); // Espera a resposta
  return resposta;
}
```

### 3. **DOM** (manipular a página)

DOM = Document Object Model (estrutura da página em JavaScript)

```javascript
// Encontrar um elemento no HTML
const botao = document.getElementById("meuBotao");

// Mudar o texto
botao.textContent = "Novo texto";

// Adicionar uma classe CSS
botao.classList.add("vermelho");

// Remover uma classe CSS
botao.classList.remove("vermelho");
```

### 4. **Event Listeners** (escutar ações do usuário)

```javascript
// Clicar em um botão
botao.addEventListener("click", function () {
  console.log("Clicou!");
});

// Enviar um formulário
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // Evita recarregar a página
  console.log("Formulário enviado!");
});
```

### 5. **Promises e Async/Await** (para operações lentas)

```javascript
// Esperar algo terminar
async function buscarClima() {
  console.log("Iniciando...");

  // await = espere isto terminar
  const resposta = await fetch("http://...");

  console.log("Acabou!");
}
```

### 6. **Try/Catch** (tratar erros)

```javascript
try {
  // Tentar executar isto
  const resposta = await fetch("http://...");
} catch (erro) {
  // Se der erro, executar isto
  console.error("Deu erro:", erro);
}
```

---

## 🔍 Como o App Funciona (Passo a Passo)

```
1. Usuário abre index.html no navegador
                        ↓
2. JavaScript main.js aguarda o usuário digitar
                        ↓
3. Usuário digita "São Paulo" e clica em "Buscar"
                        ↓
4. JavaScript chama a função buscarClimaDaCidade()
                        ↓
5. getCoordinates() busca a latitude/longitude
   (usando a Internet - API Open-Meteo)
                        ↓
6. getWeatherData() busca os dados do clima
   (usando a Internet - API Open-Meteo)
                        ↓
7. displayWeather() mostra tudo na página
                        ↓
8. O usuário vê: temperatura, umidade, vento, etc
```

---

## 🌐 O que é uma API?

**API** = interface para comunicação entre programas

```javascript
// Você envia uma requisição
fetch('https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63')

// A API responde com dados em JSON
{
  "current": {
    "temperature_2m": 25,
    "relative_humidity_2m": 60,
    "weather_code": 0
  }
}

// JavaScript processa esses dados
// e mostra na tela
```

---

## 📝 Explicação dos Arquivos

### **index.html** - Estrutura

```html
<form id="searchForm">
  ← Formulário <input id="cityInput" placeholder="..." /> ← Campo para digitar
  <button type="submit">Buscar</button> ← Botão para enviar
</form>

<section id="weatherSection">
  ← Seção para mostrar clima <span id="temp"></span> ← Onde coloca a temperatura
  <span id="humidity"></span> ← Onde coloca umidade
</section>
```

### **css/styles.css** - Aparência

```css
/* Estilizar o formulário */
#searchForm {
  background: white; /* Fundo branco */
  padding: 20px; /* Espaço interno */
  border-radius: 8px; /* Cantos arredondados */
}

/* Estilizar o botão */
#searchForm button {
  background: blue; /* Cor azul */
  color: white; /* Texto branco */
  padding: 10px 20px; /* Espaço interno */
  cursor: pointer; /* Ícone de clique */
}
```

### **js/api.js** - Buscar da Internet

```javascript
// Função 1: Converter nome da cidade em lat/long
async function getCoordinates(cityName) {
  // Montar a URL
  const params = new URLSearchParams({
    name: cityName,
    format: "json",
  });

  // Fazer requisição
  const response = await fetch(`https://...?${params}`);
  const data = await response.json();

  // Retornar latitude e longitude
  return {
    latitude: data.results[0].latitude,
    longitude: data.results[0].longitude,
  };
}

// Função 2: Buscar dados de clima
async function getWeatherData(latitude, longitude) {
  // Fazer requisição com lat/long
  const response = await fetch(
    `https://...?latitude=${latitude}&longitude=${longitude}`,
  );
  const data = await response.json();

  // Retornar dados
  return data;
}
```

### **js/main.js** - Lógica Principal

```javascript
// Passo 1: Encontrar elementos do HTML
const formulario = document.getElementById("searchForm");
const input = document.getElementById("cityInput");

// Passo 2: Escutar quando o usuário envia
formulario.addEventListener("submit", async function (e) {
  e.preventDefault();
  const cidade = input.value;

  // Passo 3: Buscar clima
  await buscarClimaDaCidade(cidade);
});

// Passo 4: Função que coordena tudo
async function buscarClimaDaCidade(nomeDaCidade) {
  // Mostrar loading
  // Buscar coordenadas
  // Buscar clima
  // Atualizar a página
}

// Passo 5: Função para atualizar HTML
function exibirClimaNaTela(dados, nomeDaCidade, coordenadas) {
  // Colocar temperatura na página
  // Colocar umidade na página
  // Colocar vento na página
  // etc
}
```

### **js/utils.js** - Funções Auxiliares

```javascript
// Formatadores
function formatTemperature(temp) {
  return `${Math.round(temp)}°C`;
}

// Conversores
function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

// LocalStorage (salvar dados)
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
```

---

## 🐛 Debugging (encontrar erros)

### Abrir o Console do Navegador

1. Clique em **F12** no teclado
2. Vá para a aba **Console**
3. Veja as mensagens do seu código

### Ver Erros

```javascript
// Mostra uma mensagem
console.log("Teste aqui!");

// Mostra um erro
console.error("Algo deu errado!");

// Mostra um aviso
console.warn("Cuidado com isto!");
```

### Exemplo de Debugging

```javascript
async function buscarDados() {
  console.log("1. Iniciando busca...");

  const coords = await getCoordinates("São Paulo");
  console.log("2. Coordenadas:", coords);

  const clima = await getWeatherData(coords.latitude, coords.longitude);
  console.log("3. Clima:", clima);

  console.log("4. Tudo pronto!");
}
```

---

## 🚀 Próximas Melhorias

Você pode adicionar:

1. **Histórico de Buscas**

   ```javascript
   // Salvar cidades no localStorage
   const historico = [];
   historico.push("São Paulo");
   saveToLocalStorage("historico", historico);
   ```

2. **Converter para Fahrenheit**

   ```javascript
   const tempF = celsiusToFahrenheit(25);
   console.log(tempF); // 77
   ```

3. **Previsão de 7 dias**
   - Pedir à API: `hourly` ou `daily`

4. **Localização atual**
   - Usar: `navigator.geolocation.getCurrentPosition()`

5. **Pesquisa com Sugestões**
   - Autocomplete enquanto digita

---

## 📚 Recursos Para Aprender Mais

### HTML & CSS

- [MDN Web Docs](https://developer.mozilla.org/) - Documentação oficial
- [W3Schools](https://www.w3schools.com/) - Tutoriais interativos

### JavaScript

- [JavaScript.info](https://javascript.info/) - Tutorial completo
- [Eloquent JavaScript](https://eloquentjavascript.net/) - Livro gratuito

### APIs

- [Open-Meteo](https://open-meteo.com/) - A API deste projeto
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - API de teste

---

## ❓ Dúvidas Comuns

### 1. O que é `async` e `await`?

```javascript
// Sem async/await (complicado)
fetch("http://...")
  .then((response) => response.json())
  .then((data) => console.log(data));

// Com async/await (fácil)
async function buscar() {
  const response = await fetch("http://...");
  const data = await response.json();
  console.log(data);
}
```

### 2. O que é JSON?

```javascript
// JSON = JavaScript Object Notation
// É um formato de texto para dados

// Texto (JSON)
'{"nome": "João", "idade": 25}'

// Objeto (JavaScript)
{ nome: "João", idade: 25 }

// Converter texto para objeto
const texto = '{"nome": "João"}';
const objeto = JSON.parse(texto);
console.log(objeto.nome); // "João"

// Converter objeto para texto
const obj = { nome: "João" };
const texto2 = JSON.stringify(obj);
console.log(texto2); // '{"nome":"João"}'
```

### 3. O que é `classList`?

```javascript
// Seus elementos têm uma lista de classes CSS

// Ver as classes
console.log(elemento.classList);

// Adicionar uma classe
elemento.classList.add("ativa");

// Remover uma classe
elemento.classList.remove("ativa");

// Alternar (add se não tem, remove se tem)
elemento.classList.toggle("ativa");

// Verificar se tem uma classe
if (elemento.classList.contains("ativa")) {
  console.log("Tem a classe ativa");
}
```

### 4. Como mudo a cor de um elemento?

```javascript
// Usando JavaScript
const elemento = document.getElementById("meuDiv");
elemento.style.color = "blue"; // Texto azul
elemento.style.backgroundColor = "yellow"; // Fundo amarelo

// É melhor usar CSS (mais organizado)
// Criar uma classe no CSS
// e usar classList.add()
```

---

## 💡 Dicas de Aprendizado

1. **Estude o código linha por linha**
   - Abra cada arquivo e leia os comentários

2. **Teste no console do navegador (F12)**
   - Execute comandos JavaScript para entender

3. **Faça modificações pequenas**
   - Mude cores, textos, mensagens

4. **Acompanhe com o debugger**
   - Use `console.log()` para ver o que está acontecendo

5. **Pratique recriando o projeto**
   - Depois de entender, tente criar um novo do zero

---

## 🎓 Conclusão

Parabéns! Agora você entende:

- ✅ Como HTML, CSS e JavaScript trabalham juntos
- ✅ Como buscar dados de uma API
- ✅ Como atualizar a página dinamicamente
- ✅ Como tratar erros

**Próximo passo:** Continue praticando criando novos projetos!

---

**Dúvidas?** Consulte os comentários dentro do código! Cada função está bem documentada. 🚀
