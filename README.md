# 🌦️ Projeto Clima — Aplicativo de Previsão do Tempo

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

## 🧭 1. Descrição

O **Projeto Clima** é um aplicativo educacional de **previsão do tempo**, desenvolvido em **JavaScript puro**, que consome a API pública **Open-Meteo** para exibir informações meteorológicas em tempo real.

A aplicação foi criada com fins didáticos, integrando conceitos de:
- Consumo de APIs REST
- Manipulação do DOM
- Tratamento de erros e validação
- Testes automatizados com **Jest**
- Boas práticas de documentação com **JSDoc**

---

## ⚙️ 2. Funcionalidades Principais

1. Busca de cidade e exibição de temperatura atual  
2. Exibição de condições meteorológicas e ícones visuais (Weather Icons)  
3. Alteração de tema (dia/noite) conforme o horário da consulta  
4. Tratamento de erros (cidade inválida, falha de rede, etc.)  
5. Testes automatizados de API e interface (Jest + jsdom)

---

## 🧪 3. Testes Automatizados

Os testes foram desenvolvidos com o **Jest**, abrangendo:
- Funções puras (`getCityCoordinates`, `getWeatherData`, `getWeatherIconClass`)  
- Tratamento de exceções  
- Simulação de rede (`fetch mock`)  
- Interação com DOM via **jsdom**

**Comando para executar:**
```bash
npm test
```

**Cobertura atual:**
```
Statements   : 63%
Branches     : 65%
Functions    : 61%
Lines        : 64%
```

---

## 🧾 4. Estrutura do Projeto

```
projeto_clima/
│
├── assets/
│   ├── css/
│   ├── js/
│   │   └── api.js          # Funções principais e integração com DOM
│
├── tests/
│   ├── api.test.js         # Testes de API e edge cases
│   └── ui.test.js          # Testes de interface (jsdom)
│
├── package.json
├── README.md
└── index.html
```

---

## 🧠 5. Tecnologias Utilizadas

| Categoria | Tecnologia |
|------------|-------------|
| Linguagem | JavaScript (ES6+) |
| Ambiente | Node.js |
| Testes | Jest + jsdom |
| API Pública | Open-Meteo |
| Ícones | Weather Icons |
| Documentação | JSDoc |

---

## 🚀 6. Como Executar o Projeto

1. Clone o repositório:
```bash
git clone https://github.com/jessicatinguely/projeto_clima.git
```

2. Instale as dependências:
```bash
npm install
```

3. Abra o arquivo `index.html` no navegador.

4. Para executar os testes:
```bash
npm test
```

---

## ✨ 7. Status do Projeto
🟡 **Em construção** — melhorias contínuas nas funções, testes e interface.

---

## 💡 8. Desenvolvido por
**Jessica Ghirardelli Tinguely**  
📍 [GitHub](https://github.com/jessicatinguely)
