# 🌦️ Projeto Clima — Aplicativo de Previsão do Tempo  
 
<br />
 
<div align="center">
<img src="https://i.imgur.com/F2ltcVl.png" title="source: imgur.com" alt="Banner do Projeto Clima" />  
</div>
 
<br />
 
<div align="center">

<img src="https://img.shields.io/github/languages/top/jessicatinguely/projeto_clima?style=flat-square" />
<img src="https://img.shields.io/github/repo-size/jessicatinguely/projeto_clima?style=flat-square" />
<img src="https://img.shields.io/github/languages/count/jessicatinguely/projeto_clima?style=flat-square" />
<img src="https://img.shields.io/github/last-commit/jessicatinguely/projeto_clima?style=flat-square" />
<img src="https://img.shields.io/github/issues/jessicatinguely/projeto_clima?style=flat-square" />
<img src="https://img.shields.io/github/issues-pr/jessicatinguely/projeto_clima?style=flat-square" />
<img src="https://img.shields.io/badge/status-em%20construção-yellow" alt="Status: Em Construção">

</div>
 
<br />

---

## ☀️ 1. Descrição

O **Projeto Clima** é um aplicativo simples de **previsão do tempo**, desenvolvido com **HTML, CSS e JavaScript puro**.  
Ele consome dados da **API Open-Meteo** para exibir a temperatura atual, descrição do clima e ícone correspondente.  

A aplicação foi criada com fins **educacionais**, explorando **requisições com Fetch API**, **tratamento de erros**, **modo claro/escuro automático** e **testes automatizados com Jest**.

<br />

---

## 🌎 2. Funcionalidades

1. Buscar o clima atual de qualquer cidade do mundo  
2. Exibir **temperatura**, **descrição**, **ícone** e **nome do país**  
3. Mudar o **tema da página automaticamente** (dia/noite)  
4. Exibir mensagens de erro claras quando:
   - A cidade não é encontrada  
   - Ocorre erro de rede  
   - A API retorna falha  

<br />

---

## 🧠 3. Estrutura do Projeto

```bash
projeto_clima/
│
├── assets/
│   ├── css/
│   │   └── style.css        # Estilos principais
│   └── js/
│       └── api.js           # Lógica de requisição e exibição
│
├── tests/
│   └── api.test.js          # Testes Jest com mocks de fetch
│
├── index.html               # Interface principal
├── README.md                # Documentação do projeto
└── package.json             # Configurações e dependências
```

<br />

---

## ⚙️ 4. Tecnologias Utilizadas

| Item | Descrição |
|------|------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Bibliotecas de ícones** | [Weather Icons](https://erikflowers.github.io/weather-icons/) |
| **Testes automatizados** | Jest |
| **APIs** | [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) e [Forecast](https://open-meteo.com/en/docs) |
| **Controle de versão** | Git / GitHub |

<br />

---

## 🧪 5. Testes Automatizados

Os testes utilizam o **Jest** para simular as requisições da API (mocks de `fetch`), validando o comportamento das funções principais:

### 📋 Testes Cobertos
- Cidade válida retorna dados meteorológicos  
- Cidade inexistente lança exceção  
- Entrada vazia retorna erro de validação  
- Falha de rede e erro 500 tratados corretamente  
- Casos extremos: limite da API, conexão lenta, formato de JSON alterado  

### ▶️ Executar os testes
```bash
npm install
npm test
```

Para exibir a **cobertura de código**:
```bash
# (adicione no package.json)
"scripts": { "test": "jest --coverage" }

npm test
```

Depois, abra no navegador:
```
coverage/lcov-report/index.html
```

<br />

---

## ☁️ 6. APIs Utilizadas

### 🔹 Geocoding (busca da cidade)
```
https://geocoding-api.open-meteo.com/v1/search?name=<CIDADE>&count=1&language=pt&format=json
```

### 🔹 Forecast (clima atual)
```
https://api.open-meteo.com/v1/forecast?latitude=<LAT>&longitude=<LON>&current_weather=true&timezone=auto
```

Exemplo de resposta:
```json
{
  "latitude": -23.55,
  "longitude": -46.63,
  "current_weather": {
    "temperature": 25.3,
    "weathercode": 1,
    "is_day": 1
  }
}
```

<br />

---

## 💡 7. Como Executar o Projeto Localmente

### 🪄 Passos:
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/jessicatinguely/projeto_clima.git
   cd projeto_clima
   ```

2. **Abra o arquivo `index.html`** diretamente no navegador  
   ou use a extensão **Live Server** do VS Code.

3. **Digite o nome de uma cidade** no campo de busca e veja o resultado.

<br />

---

## 📘 8. Documentação do Código

O arquivo `api.js` utiliza **JSDoc** para descrever cada função, parâmetros e retornos.  
Essas anotações permitem gerar documentação automática no futuro.

Exemplo:

```js
/**
 * Busca coordenadas (latitude/longitude) de uma cidade
 * usando a API de Geocodificação Open-Meteo.
 *
 * @param {string} cityName - Nome da cidade (ex.: "São Paulo").
 * @returns {Promise<{name: string, latitude: number, longitude: number}>}
 * @throws {Error} Se a cidade não for encontrada.
 */
async function getCityCoordinates(cityName) { ... }
```

<br />

---

## 💻 9. Como Contribuir

Contribuições são bem-vindas!  
Se quiser sugerir melhorias ou reportar erros:

- Abra uma **Issue**  
- Faça um **Fork** e envie um **Pull Request**  
- Compartilhe o projeto com colegas que também estão aprendendo programação!

<br />

---

## 👩‍💻 10. Autora

Desenvolvido com ☕ e curiosidade por  
**[Jessica Ghirardelli](https://github.com/jessicatinguely)**

> Projeto desenvolvido como parte das atividades do programa **Generation Brasil (Java Full Stack)**.

<br />

---

## 🪪 Licença

Este projeto está licenciado sob a licença **ISC** – Uso educacional e livre.

---
