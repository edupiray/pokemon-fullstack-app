# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo with two independent apps:
- `backend-poke-api/` — Express 5 Node.js API that proxies PokéAPI
- `frontend-poke-api/` — Angular 20 SPA that displays Pokémon data

## Commands

### Backend
```bash
cd backend-poke-api
node server.js          # start server on port 3000
npm install             # install dependencies
```

### Frontend
```bash
cd frontend-poke-api
npm start               # ng serve on port 4200
npm run build           # production build
npm test                # karma/jasmine unit tests
```

Both must run simultaneously for the app to work. Frontend calls backend at `http://localhost:3000`.

## Architecture

### Backend (`backend-poke-api/server.js`)
Single-file Express app. No database — stateless proxy to `https://pokeapi.co/api/v2/pokemon`.

Endpoints:
- `GET /api/pokemons?limit=4` — fetches and enriches Pokémon data (id, name, image, types, weight, height, abilities)
- `GET /health` — health check

CORS is enabled globally with no origin restriction.

### Frontend (`frontend-poke-api/src/app/`)
Single standalone component (`app.ts`) contains all UI logic, inline template, and inline styles. Uses Angular signals for reactive state (`pokemons`, `loading`, `error`). No routing is used (`app.routes.ts` is empty).

The API URL is hardcoded in `app.ts`: `http://localhost:3000/api/pokemons?limit=4`. There are no environment files or proxy config.

TypeScript strict mode is fully enabled including `strictTemplates` and `strictInjectionParameters`.
