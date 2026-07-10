# Customer Manager

React + TypeScript customer CRUD app using Vite, JSON Server, and a localStorage fallback mode when the API is unavailable.

## Overview

Current app capabilities:

- Customer list with client-side search (name, email, phone, city)
- Sortable columns (name, email, phone, city; asc/desc)
- Client-side pagination with rows-per-page options (10, 25, 50)
- Add, edit, and delete customer records
- Form validation and phone formatting (`XXX-XXXX` for 7-digit numbers)
- Light/dark mode toggle persisted in localStorage
- Route-level error fallback via `ErrorBoundary`
- Unit/component tests with Vitest + Testing Library

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Routing:** React Router DOM 7
- **Build/dev:** Vite
- **Mock API:** JSON Server (`db.json`)
- **Testing:** Vitest, Testing Library, jsdom

## Prerequisites

- Node.js 20+
- npm

## Quick Start

```bash
# from repo root
npm install

# terminal 1
npm run api

# terminal 2
npm run dev
```

Open the URL shown by Vite (commonly `http://localhost:5173`).
The app is configured with a base path of `/customer-manager/` in `vite.config.ts`; the dev server includes middleware that redirects `/` to `/customer-manager/`.

## Scripts

- `npm run dev` — start Vite dev server
- `npm run api` — start JSON Server (`db.json`) on port 3001
- `npm run build` — TypeScript build + Vite production build
- `npm run preview` — preview built app
- `npm run test` — run Vitest in watch mode
- `npm run test:run` — run Vitest once

## Data and State Flow

- API requests are sent to `/api/customers`
- Vite proxy forwards `/api/*` to `http://localhost:3001/*`
- Global state and CRUD methods are exposed by `CustomerProvider` (`CustomerContext`)
- `useCustomerApi` handles fetch/mutations, loading/error state, and fallback logic
- If API fetch fails, the app switches to localStorage mode using key `customer-manager-customers` and continues CRUD locally

## Form Validation Rules

- `name`: required
- `email`: required and must match basic email pattern
- `phone`: required and must contain exactly 7 digits
- `city`: cannot include numbers
- `state`: cannot include numbers

## Routes

- `/` — customer list
- `/add` — add customer
- `/edit/:id` — edit customer

All routed content renders inside `Layout`; inner route content is wrapped by `ErrorBoundary`.

## Testing

```bash
npm run test:run
```

Example single-file run:

```bash
npm run test:run -- src/customer-app/src/components/CustomerList.test.tsx
```

## Project Structure

```text
Customer-Manager/
├─ db.json
├─ package.json
├─ vite.config.ts
├─ README.md
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

## Troubleshooting

### API port already in use

```bash
pkill -f "json-server --watch db.json --port 3001" || true
npm run api
```

### Frontend cannot reach backend

- Ensure `npm run api` is running on port 3001
- Ensure `npm run dev` is running
- Confirm requests are targeting `/api/customers`

### Tests fail unexpectedly

```bash
npm install
npm run test:run
```

## License

See `LICENSE`.
