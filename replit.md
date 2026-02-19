# Replit.md

## Overview

This is a **Telegram Automation Bot Manager** — a full-stack web application with a dashboard for controlling a Telegram bot that automates commenting across joined channels and groups. The system has two main parts:

1. **Web Dashboard** (React + Express): A sleek, dark-themed UI for managing comments, viewing bot status, adjusting settings, and triggering the bot manually.
2. **Telegram Bot** (Python): A userbot powered by Telethon that logs into a real Telegram account, picks random saved comments, translates them to match the post language (English/Spanish), and posts them with a 5-second anti-spam delay. It only runs when manually triggered — no automatic background monitoring.

The bot requires password authentication (`/admin14758`) and uses a Telegram session string for persistent login.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (React SPA)
- **Location**: `client/src/`
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: `wouter` (lightweight client-side router)
- **State/Data**: `@tanstack/react-query` for server state management
- **UI Library**: shadcn/ui components (Radix primitives + Tailwind CSS)
- **Styling**: Tailwind CSS with CSS variables for theming (dark cyber/tech palette)
- **Animations**: `framer-motion` for transitions and status indicators
- **Icons**: `lucide-react`
- **Pages**:
  - `/` — Dashboard: Shows bot status (locked/unlocked, authenticated, running) and a "Send Messages" trigger button
  - `/comments` — Comment Library: CRUD interface for managing the pool of comments
  - `/settings` — System Configuration: Displays environment variables and settings
- **Key Custom Hooks** (`client/src/hooks/use-bot.ts`): `useBotStatus`, `useTriggerBot`, `useComments`, `useCreateComment`, `useDeleteComment`, `useSettings`
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend (Express + Node.js)
- **Location**: `server/`
- **Framework**: Express.js with TypeScript (run via `tsx`)
- **Entry point**: `server/index.ts`
- **Dev server**: Vite dev middleware served through Express in development
- **Production**: Static files served from `dist/public`
- **API Routes** (`server/routes.ts`):
  - `GET /api/comments` — List all saved comments
  - `POST /api/comments` — Create a new comment
  - `DELETE /api/comments/:id` — Delete a comment
  - `GET /api/settings` — List all settings
  - `POST /api/settings` — Update a setting
  - `GET /api/bot/status` — Get bot status (unlocked, authenticated, running)
  - `POST /api/bot/trigger` — Manually trigger the bot to send messages
- **API contract** defined in `shared/routes.ts` using Zod schemas
- **Python bot process**: The Express server spawns `main.py` as a child process via `child_process.spawn`

### Telegram Integration (`server/telegram.ts` + `main.py`)
- **Node-side** (`server/telegram.ts`): Uses `telegram` (GramJS) and `telegraf` packages. Manages bot state (unlocked, authenticated, running) and exposes `triggerBot()` function to the REST API.
- **Python-side** (`main.py`): Uses `telethon` library with `StringSession` for userbot functionality. Handles password protection, comment management via bot commands, and the actual automation.
- **Login flow** (`login.py`): One-time script to generate a Telegram session string that gets stored as `TELEGRAM_SESSION` secret.
- **Translation**: `@vitalets/google-translate-api` (Node) and `googletrans` (Python) for auto-translating comments to match post language.

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema** (`shared/schema.ts`):
  - `comments` table: `id` (serial PK), `text` (text, not null)
  - `settings` table: `id` (serial PK), `key` (text, unique, not null), `value` (text, not null)
- **Connection**: `server/db.ts` uses `pg.Pool` with `DATABASE_URL` environment variable
- **Migrations**: Drizzle Kit with `drizzle-kit push` command (`npm run db:push`)
- **Storage layer**: `server/storage.ts` implements `IStorage` interface with `DatabaseStorage` class

### Build System
- **Dev**: `npm run dev` — runs `tsx server/index.ts` with Vite HMR
- **Build**: `npm run build` — Vite builds client to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Production**: `npm start` — runs `node dist/index.cjs`

## External Dependencies

### Required Environment Variables (Secrets)
- `DATABASE_URL` — PostgreSQL connection string (provisioned by Replit)
- `API_ID` — Telegram API ID (from my.telegram.org)
- `API_HASH` — Telegram API Hash (from my.telegram.org)
- `BOT_TOKEN` — Telegram Bot Token (from @BotFather)
- `TELEGRAM_SESSION` — Telethon session string (generated via `python login.py`)

### Third-Party Services
- **Telegram API**: Both Bot API (via Telegraf/Telegraf) and MTProto (via Telethon/GramJS) for userbot functionality
- **Google Translate**: For auto-translating comments to match channel post language
- **PostgreSQL**: Primary data store for comments and settings

### Key NPM Packages
- `telegraf` — Telegram Bot API framework (Node.js)
- `telegram` (GramJS) — Telegram MTProto client (Node.js)
- `@vitalets/google-translate-api` — Translation service
- `drizzle-orm` + `drizzle-kit` — Database ORM and migration tooling
- `express` — HTTP server
- `@tanstack/react-query` — Client-side data fetching
- `wouter` — Client-side routing
- `framer-motion` — Animations
- `zod` — Schema validation (shared between client and server)

### Key Python Packages
- `telethon` — Telegram MTProto client
- `googletrans` — Google Translate wrapper