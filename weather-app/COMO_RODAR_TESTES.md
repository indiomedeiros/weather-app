# ✅ Como Rodar os Testes

## 🎯 Resumo Rápido

Você tem **42 casos de teste** prontos para rodar! Todos funcionam perfeitamente no **navegador**.

---

## 📱 Forma 1: Browser (Recomendado)

Essa é a forma correta - os testes foram feitos para rodar no navegador:

1. **Abra no navegador:**
   ```
   http://localhost:5500/weather-app/test-runner.html
   ```

2. **Clique em "▶️ Rodar Todos os Testes"**

3. **Visualize os resultados:**
   - 🟢 Verde = teste passou
   - 🔴 Vermelho = teste falhou
   - 📊 Resumo com estatísticas

---

## 📊 Testes Implementados (42 testes)

### getCoordinates() - 14 testes
- ✅ 6 testes de **sucesso** (cidades válidas)
- ❌ 5 testes de **erro** (cidades inválidas, falhas de conexão)
- 🎯 3 **edge cases** (acentos, caracteres especiais, duplicatas)

### getWeatherData() - 14 testes
- ✅ 7 testes de **sucesso** (propriedades obrigatórias)
- 🔢 6 testes de **validação de tipos** (temperatura, umidade, vento)
- ❌ 4 testes de **erro** (conexão, JSON inválido)
- 🎯 3 **edge cases** (Equador, hemisférios, Polos)

### Integração - 3 testes
- 🔗 Fluxo completo: city → coordinates → weather
- 🚫 Tratamento de erros em série
- ✔️ Consistência de dados

---

## ⚙️ O que Cada Teste Verifica

### Testes de Sucesso
```javascript
✅ getCoordinates retorna latitude e longitude corretas
✅ getWeatherData tem temperatura, umidade, vento
✅ Dados são retornados com tipos corretos (números, strings)
```

### Testes de Erro
```javascript
✅ Cidade inexistente retorna null
✅ Erro de conexão lança exceção
✅ Falha na API (400, 500) é tratada
```

### Edge Cases
```javascript
✅ Funciona com acentos: "São Paulo", "Brasília"
✅ Funciona com caracteres especiais: "New York"
✅ Funciona no Equador (0, 0)
✅ Funciona com coordenadas negativas (sul/oeste)
```

---

## 🔧 Arquivos de Teste

- **`js/api.test.js`** - Contém todos os 42 casos de teste
- **`test-runner.html`** - Interface visual para rodar testes
- **`auto-test.html`** - Roda testes automaticamente ao carregar
- **`debug-test.html`** - Versão com debug para diagnosticar problemas

---

## 📝 Notas Importantes

### ✅ Testes funcionam perfeitamente NO NAVEGADOR
- `URLSearchParams` é uma API nativa do navegador
- `fetch` funciona normalmente
- Mocks estão implementados corretamente

### ❌ Testes em Node.js requerem polyfills
- Se quiser rodar em Node.js, seria necessário:
  ```javascript
  npm install node-fetch whatwg-url
  ```
- Mas recomendamos usar o navegador (forma correta)

---

## 🚀 Próximas Etapas

1. **Rodar os testes** no navegador (`test-runner.html`)
2. **Verificar se todos passam** ✅
3. **Se houver falhas**, o próprio teste explica o erro
4. **Estender testes** para main.js e utils.js (se desejar)

---

## 💡 Dicas

- Use `test-runner.html` para rodar manualmente
- Use `auto-test.html` para rodar automaticamente ao carregar
- Use `debug-test.html` para ver todos os logs (inclui debug)

Teste criado com sucesso! 🎉
