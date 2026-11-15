# Levure - API Backend (Gestão de Fermentação Natural)

API RESTful desenvolvida para o gerenciamento, cálculo de ciclos e monitoramento biológico de fermentos naturais (_Levain / Sourdough_). Projeto desenvolvido como parte da matéria Projeto de Software em Análise e Desenvolvimento de Sistemas (ADS).

---

## Tecnologias Utilizadas

- **Runtime & Framework:** Node.js (v24) & NestJS
- **ORM & Banco de Dados:** Prisma ORM & PostgreSQL
- **Validação & Tipagem:** `class-validator`, `class-transformer` & TypeScript
- **Documentação de API:** OpenAPI / Swagger UI
- **Containerização:** Docker & Docker Compose

---

## Arquitetura do Projeto

O backend segue a arquitetura modular do NestJS com separação estrita de responsabilidades:

- `src/starters/`: Módulo de gestão de fermentos (CRUD, busca reativa e métricas analíticas agregadas).
- `src/feedings/`: Módulo de alimentações e rastreamento de pico (cálculo de proporções, histórico transacional e algoritmo adaptativo com correção térmica).
- `src/ai/`: Módulo de diagnóstico inteligente integrado ao Google GenAI SDK (Gemini):
  - `src/ai/ai.service.ts`: Consolidação de histórico, engenharia de prompt com resposta estruturada em JSON Schema e persistência de laudos.
  - `src/ai/interfaces/`: Tipagem estrita da resposta da IA (score, observações biológicas, prontidão de fornada e prescrição de manejo).
- `src/prisma/`: Camada de persistência e cliente global de banco de dados.
- `prisma/schema.prisma`: Modelagem relacional (`Starter`, `Feeding` e `HealthAnalysis`).
- `prisma/seed.ts`: Povoamento demonstrativo com histórico calibrado (Vó Amália com score 95) e caso de alerta de acidez (Centeio Selvagem com score 65).

---

## Como Executar com Docker (Recomendado para Avaliação)

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/) instalados na máquina.
- Chave do Gemini API gerada no [Google Studio](https://aistudio.google.com/welcome)

### Passo a Passo

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Edu-Fortes/impacta-projeto-software-levure-backend.git
   cd impacta-projeto-software-levure-backend
   ```

2. **Crie o arquivo `.env` na raiz do projeto. Copie e cole as variáveis de ambiente:**

   ```env
   DATABASE_URL="postgresql://postgres:postgrespassword@postgres:5432/levure_db?schema=public"
   PORT=3001
   GEMINI_API_KEY="SUA_CHAVE_API_GOOGLE_AI_STUDIO"
   ```

3. **Suba os containers (PostgreSQL e NestJS):**

   ```bash
   docker compose up -d --build
   ```

4. **Execute as migrations**:
   ```bash
   docker compose exec backend npx prisma migrate deploy
   ```
5. **Opcionalmente Popule o banco (Seed):**
   ```bash
   docker compose exec backend npx prisma db seed
   ```
6. **Acesse os serviços:**
   - API Base: `http://localhost:3001`
   - Documentação Swagger Interativa: `http://localhost:3001/api/docs`

## Como Executar Localmente (Sem Docker para a API)

Caso prefira rodar apenas o banco no Docker e o NestJS nativamente:

1. **Suba apenas o container do PostgreSQL:**
   ```bash
   docker compose up -d postgres
   ```
2. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz:
   ```env
   DATABASE_URL="postgresql://postgres:postgrespassword@postgres:5432/levure_db?schema=public"
   PORT=3001
   GEMINI_API_KEY="SUA_CHAVE_API_GOOGLE_AI_STUDIO"
   ```
3. **Instale as dependências e gere o Prisma Client:**

   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed # Opcional
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run start:dev
   ```
