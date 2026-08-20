# Levure - API Backend (Gestão de Fermentação Natural)

API RESTful desenvolvida para o gerenciamento, cálculo de ciclos e monitoramento biológico de fermentos naturais (_Levain / Sourdough_). Projeto desenvolvido como parte da matéria Projeto de Software em Análise e Desenvolvimento de Sistemas (ADS).

---

## Tecnologias Utilizadas

- **Runtime & Framework:** Node.js (v20) & NestJS
- **ORM & Banco de Dados:** Prisma ORM & PostgreSQL
- **Validação & Tipagem:** `class-validator`, `class-transformer` & TypeScript
- **Documentação de API:** OpenAPI / Swagger UI
- **Containerização:** Docker & Docker Compose

---

## Arquitetura do Projeto (Sprint 1)

O backend segue a arquitetura modular do NestJS com separação estrita de responsabilidades:

- `src/starters/`: Módulo de gerenciamento de fermentos (CRUD completo, listagem com busca e sumário analítico).
- `src/prisma/`: Camada de persistência e cliente global de banco de dados.
- `prisma/schema.prisma`: Modelagem relacional do banco.
- `prisma/seed.ts`: Povoamento de dados iniciais para demonstração.

---

## Como Executar com Docker (Recomendado para Avaliação)

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/) instalados na máquina.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO_BACKEND>
   cd levain-backend
   ```
2. **Suba os containers (PostgreSQL e NestJS):**
   ```bash
   docker compose up -d --build
   ```
3. **Execute as migrations**:
   ```bash
   docker compose exec backend npx prisma migrate deploy
   ```
4. **Opcionalmente Popule o banco (Seed):**
   ```bash
   docker compose exec backend npx prisma db seed
   ```
5. **Acesse os serviços:**
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
   ```code snippet
   DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/levure_db?schema=public"
   PORT=3001
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
