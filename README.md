# Customer Manager

A React + TypeScript customer CRUD app powered by Vite, with a JSON Server backend and a localStorage fallback mode.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Running the Services](#running-the-services)
- [Available Scripts](#available-scripts)
- [How Data Works](#how-data-works)
- [Validation Rules](#validation-rules)
- [Testing](#testing)
- [Build and Preview](#build-and-preview)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

Customer Manager supports:

- Viewing customers in a paginated list
- Adding, editing, and deleting customers
- Client-side form validation
- Error fallback UI with `ErrorBoundary`
- Unit/component tests with Vitest + Testing Library

## Tech Stack

- **Frontend:** React 19, TypeScript, React Router
- **Build tool:** Vite
- **Mock backend:** JSON Server (`db.json`)
- **Testing:** Vitest, Testing Library, jsdom

## Prerequisites

Install:

- **Node.js** (recommended: 20+)
- **npm** (comes with Node.js)
- **Git**

Check versions:

```bash
node -v
npm -v
git --version
```

## Quick Start

```bash
# 1) Clone
git clone <your-repo-url>

# 2) Enter project folder
cd Customer-Manager/Customer-Manager

# 3) Install dependencies
npm install

# 4) Start backend (terminal 1)
npm run api

# 5) Start frontend (terminal 2)
npm run dev
```

Open the app at the local URL shown by Vite (typically `http://localhost:5173`).

## Running the Services

### Frontend (Vite)

```bash
npm run dev
```

- Starts the React app in development mode.
- Uses Vite proxy settings from `vite.config.ts`.

### Backend (JSON Server)

```bash
npm run api
```

- Serves `db.json` at `http://localhost:3001`.
- Vite proxy maps app calls from `/api/*` to JSON Server.

### Stop services

Press `Ctrl + C` in each terminal.

## Available Scripts

From the project root:

- `npm run dev` — start frontend dev server
- `npm run api` — start JSON Server on port 3001
- `npm run test` — run tests in watch mode
- `npm run test:run` — run tests once (CI-style)
- `npm run build` — type-check and build production assets
- `npm run preview` — preview production build locally

## How Data Works

The app attempts to use the API first:

- API base in app code: `/api/customers`
- Vite proxy forwards `/api` to `http://localhost:3001`

If the API is unavailable, the app automatically falls back to localStorage (`customer-manager-customers`) with seeded customers.

## Validation Rules

Current form behavior:

- `name`: required
- `email`: required + must match basic email format
- `phone`: required + must contain exactly 7 digits (formatted as `XXX-XXXX`)
- `city`: cannot contain numbers
- `state`: cannot contain numbers

## Testing

Run all tests once:

```bash
npm run test:run
```

Run a single test file:

```bash
npm run test:run -- src/customer-app/src/components/CustomerList.test.tsx
```

## Build and Preview

Create production build:

```bash
npm run build
```

Preview build output locally:

```bash
npm run preview
```

## Project Structure

```text
Customer-Manager/
├─ db.json
├─ package.json
├─ vite.config.ts
├─ ARCHITECTURE.md
└─ src/
   ├─ customer-app/
   │  └─ src/
   │     ├─ components/
   │     ├─ context/
   │     ├─ hooks/
   │     ├─ pages/
   │     ├─ types/
   │     ├─ App.tsx
   │     ├─ main.tsx
   │     └─ styles.css
   └─ test/
```

For architecture details and onboarding flow, see `ARCHITECTURE.md`.

## Troubleshooting

### `npm run api` fails (port already in use)

A previous JSON Server process may still be running.

```bash
pkill -f "json-server --watch db.json --port 3001" || true
npm run api
```

### Frontend cannot reach API

- Make sure `npm run api` is running.
- Confirm JSON Server is on port `3001`.
- Confirm Vite is running with `npm run dev`.

### Blank page or runtime error

- Check browser console and terminal logs.
- The app is wrapped with `ErrorBoundary`, which shows fallback UI for render-time component errors.

### Tests fail unexpectedly

- Reinstall deps: `npm install`
- Run tests once for clean output: `npm run test:run`

## Contributing

1. Create a feature branch.
2. Make focused changes.
3. Run tests: `npm run test:run`
4. Build check: `npm run build`
5. Open a pull request with a clear summary.

## License

Licensed under the terms in `LICENSE`.
