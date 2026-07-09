# Customer Manager Architecture

This document describes the **current implementation** in the repository.

## High-Level Component Tree

```text
main.tsx
  CustomerProvider
    BrowserRouter
      App
        Routes
          Layout
            ErrorBoundary
              /          -> CustomerListPage
                            CustomerList
                              PaginationControls
              /add       -> AddCustomerPage
                            CustomerForm
              /edit/:id  -> EditCustomerPage
                            CustomerForm
```

## Core Architecture Decisions

### 1) Shared customer state via Context
Customer data and CRUD operations are provided through `CustomerContext`.

- Provider: `src/customer-app/src/context/CustomerContext.tsx`
- Consumer hook: `useCustomerContext()`

Why this works well here:
- List/add/edit pages all need access to the same data source.
- Avoids prop drilling between route-level components.
- Keeps the public app data API centralized.

### 2) Data access handled by `useCustomerApi`
All fetch/mutation logic lives in `src/customer-app/src/hooks/useCustomerApi.ts`.

Responsibilities:
- Fetch customer list
- Add/update/delete customer records
- Track `loading` and `error`
- Fallback to localStorage when API is unavailable

Local fallback behavior:
- API base: `/api/customers`
- If fetch fails, the hook switches to local mode (`customer-manager-customers` localStorage key)
- CRUD actions continue to work in local mode

### 3) Route-level pages own flow, components stay reusable
Pages orchestrate navigation and operation handlers:

- `CustomerListPage`: delete flow + status UI
- `AddCustomerPage`: create flow + redirect to `/`
- `EditCustomerPage`: lookup by route param + update flow + not-found UI

Reusable components:
- `CustomerForm`: shared add/edit form and validation
- `CustomerList`: tabular display for customer records
- `PaginationControls`: pagination UI controls only
- `ErrorBoundary`: catches render-time UI errors for routed content

### 4) Pagination split into hook + presentational component
Pagination behavior is decomposed into:

- `usePagination` (`src/customer-app/src/hooks/usePagination.ts`)
  - tracks `currentPage` and `rowsPerPage`
  - computes `totalPages` and `paginatedItems`
  - clamps page bounds and resets to page 1 on page-size change
- `PaginationControls` (`src/customer-app/src/components/PaginationControls.tsx`)
  - renders rows-per-page select
  - renders Previous/Next buttons and page indicator

This keeps pagination logic reusable and testable while keeping the UI component simple.

## Data Flow (Current)

1. A page/component calls methods from `useCustomerContext()`.
2. `CustomerContext` delegates to `useCustomerApi()`.
3. `useCustomerApi` performs API/localStorage action and updates internal state.
4. Updated context value re-renders subscribed pages/components.

## Routing and Error Handling

- Routes are declared in `src/customer-app/src/App.tsx`.
- `Layout` wraps all pages.
- Routed content is wrapped by `ErrorBoundary`, so render errors show a fallback UI with details and a retry option.

## Theme Handling

`Layout` manages light/dark mode with localStorage persistence:

- key: `theme`
- applies theme via `document.documentElement.dataset.theme`

## Testing Strategy

Current test coverage focuses on component and hook behavior:

- `CustomerForm.test.tsx`
- `CustomerList.test.tsx`
- `CustomerList.hook-integration.test.tsx`
- `ErrorBoundary.test.tsx`
- `usePagination.test.ts`

Tests use Vitest + Testing Library with jsdom.

## New Developer Onboarding Order

Read files in this order:

1. `src/customer-app/src/main.tsx`
2. `src/customer-app/src/App.tsx`
3. `src/customer-app/src/context/CustomerContext.tsx`
4. `src/customer-app/src/hooks/useCustomerApi.ts`
5. `src/customer-app/src/pages/*.tsx`
6. `src/customer-app/src/components/CustomerForm.tsx`
7. `src/customer-app/src/components/CustomerList.tsx`
8. `src/customer-app/src/components/PaginationControls.tsx`
9. `src/customer-app/src/hooks/usePagination.ts`
