# 📦 LogiTrack

> **Controle de estoque inteligente, simples e conectado.**

O **LogiTrack** é um sistema desenvolvido para facilitar o **controle, organização e acompanhamento de estoques**, utilizando tecnologia para tornar a gestão de produtos mais rápida, prática e eficiente.

A proposta surgiu a partir de um problema comum: **ter produtos armazenados, mas não saber exatamente onde estão, quanto ainda existe em estoque ou quando é necessário realizar uma reposição.**

Com o LogiTrack, essas informações ficam centralizadas em um único sistema.

---

## 🚀 Sobre o projeto

O **LogiTrack** foi desenvolvido como um projeto de inovação em logística, unindo **programação, banco de dados e QR Codes** para criar uma solução voltada ao gerenciamento de estoque.

A ideia é permitir que cada produto seja identificado de forma rápida, facilitando o acesso às suas informações e tornando o controle do estoque mais organizado.

### 🎯 Objetivo

Criar uma solução tecnológica capaz de:

* 📦 Cadastrar produtos
* 🔢 Controlar quantidades
* 📍 Identificar a localização dos produtos
* 🔎 Localizar itens rapidamente
* 📱 Utilizar QR Codes para identificação
* ⚠️ Identificar produtos com estoque baixo
* 📊 Visualizar informações do estoque
* 📝 Registrar movimentações

---

## ✨ Funcionalidades

### 📦 Cadastro de produtos

Permite cadastrar produtos com informações como:

* Código do produto
* Nome
* Quantidade
* Localização
* Estoque mínimo

### 🔳 QR Code

Cada produto pode possuir um **QR Code exclusivo**, permitindo sua identificação de forma rápida.

Ao realizar a leitura do código pelo celular, o usuário pode acessar as informações relacionadas ao produto.

### 📊 Dashboard

O sistema apresenta uma visão geral do estoque, permitindo acompanhar informações importantes como:

* Total de produtos
* Quantidade de itens
* Produtos com estoque baixo
* Movimentações realizadas

### 📥 Entrada e saída de estoque

O sistema permite registrar movimentações de produtos, mantendo o controle das alterações realizadas no estoque.

### ⚠️ Controle de estoque mínimo

Produtos podem possuir uma quantidade mínima definida.

Quando o estoque chega a um nível crítico, o sistema pode identificar o item como **estoque baixo**, facilitando a tomada de decisão para reposição.

### 🖨️ Impressão de QR Codes

Os QR Codes dos produtos podem ser preparados para impressão e utilização física no estoque.

---

## 🛠️ Tecnologias utilizadas

O projeto foi desenvolvido utilizando tecnologias modernas para aplicações web:

| Tecnologia    | Utilização                  |
| ------------- | --------------------------- |
| ⚛️ React      | Construção da interface     |
| 🔷 TypeScript | Tipagem e desenvolvimento   |
| ⚡ Vite        | Ambiente de desenvolvimento |
| 🟢 Supabase   | Banco de dados e serviços   |
| 🔳 QR Code    | Identificação dos produtos  |
| 🎨 CSS        | Interface e estilização     |

---

## 🏗️ Arquitetura

De forma simplificada, o funcionamento do LogiTrack segue o fluxo:

```text
                 ┌─────────────────┐
                 │     USUÁRIO     │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │    LOGITRACK    │
                 │   React + TS    │
                 └────────┬────────┘
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
      ┌──────────────┐         ┌──────────────┐
      │    QR Code   │         │   Dashboard  │
      └──────┬───────┘         └──────┬───────┘
             │                        │
             └───────────┬────────────┘
                         ▼
                 ┌─────────────────┐
                 │    SUPABASE     │
                 │     Database    │
                 └─────────────────┘
```

---

## 📱 Como funciona

### 1️⃣ Cadastro

O usuário cadastra um produto no sistema.

### 2️⃣ Identificação

O produto recebe um código e pode possuir um **QR Code exclusivo**.

### 3️⃣ Armazenamento

O produto é associado a uma localização dentro do estoque.

### 4️⃣ Consulta

O usuário pode consultar as informações do produto diretamente pelo sistema.

### 5️⃣ Movimentação

Entradas e saídas são registradas para manter o estoque atualizado.

### 6️⃣ Monitoramento

O dashboard apresenta uma visão geral do estoque e ajuda a identificar possíveis problemas.

---

## 🧪 Produto de demonstração

Para demonstração do sistema, foi utilizado o seguinte produto:

```text
Código: LT-00001
Produto: Caixa de Componentes
Quantidade: 20 unidades
Localização: Prateleira B3
Estoque mínimo: 5 unidades
```

---

## 📂 Estrutura do projeto

```text
logitrack/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   └── ...
│
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

> A estrutura pode variar conforme a evolução do projeto.

---

## ⚙️ Instalação

### Pré-requisitos

Antes de executar o projeto, tenha instalado:

* [Node.js](https://nodejs.org/)
* npm

### Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/logitrack.git
```

Entre na pasta:

```bash
cd logitrack
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

Depois, acesse o endereço exibido pelo Vite no terminal.

---

## 🔐 Configuração do Supabase

O projeto utiliza o **Supabase** para armazenamento dos dados.

Crie um arquivo `.env` na raiz do projeto e configure as variáveis necessárias:

```env
VITE_SUPABASE_URL=sua_url
VITE_SUPABASE_ANON_KEY=sua_chave
```

> ⚠️ Nunca publique chaves privadas ou informações sensíveis no repositório.

---

## 📈 Próximos passos

O LogiTrack ainda pode evoluir bastante.

Algumas possibilidades futuras:

* [ ] Sistema de autenticação
* [ ] Diferentes níveis de acesso
* [ ] Histórico completo de movimentações
* [ ] Relatórios de estoque
* [ ] Exportação de dados
* [ ] Notificações de estoque baixo
* [ ] Melhorias na leitura de QR Codes
* [ ] Aplicativo mobile
* [ ] Integração com leitores de código de barras
* [ ] Inteligência Artificial para análise do estoque
* [ ] Previsão de necessidade de reposição

---

## 🎥 Demonstração veja aqui no instagram!

https://www.instagram.com/matheus.macedev?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw%3D%3D

---

## 👨‍💻 Desenvolvedor

**Matheus Araujo**

Estudante de programação e tecnologia, interessado em desenvolvimento de sistemas, automação e soluções utilizando tecnologia.

📍 Três Lagoas — MS 🇧🇷

---

## 🤝 Projeto

O LogiTrack foi desenvolvido como um projeto de **inovação em logística**, buscando demonstrar como a tecnologia pode ser aplicada para resolver problemas reais de organização e controle de estoque.

---

## ⭐ Gostou do projeto?

Se o LogiTrack foi útil ou interessante para você, considere deixar uma **⭐ Star** no repositório!

---

<p align="center">
  Desenvolvido com 💻 por <strong>Matheus Araujo</strong>
</p>
