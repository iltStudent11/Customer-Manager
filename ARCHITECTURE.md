# Customer Manager Architecture

## Component Tree (Planned)

```text
App
  BrowserRouter
    Layout
      Header (nav links)
      Routes
        ListPage
          CustomerList
            CustomerRow (one per customer)
        AddPage
          CustomerForm (mode: "add")
        EditPage
          CustomerForm (mode: "edit", pre-filled)
```

## Architecture Decisions

### 1) Where customer state will live
Customer state will live in a **Context provider** (`CustomerProvider`) that wraps the app.

Why:
- Customer data is needed across multiple routes (`/`, `/add`, `/edit/:id`).
- It avoids prop drilling between unrelated pages.
- It gives one shared source of truth for list, add, update, and delete behaviors.

### 2) CRUD state management approach
Use **`useReducer` with typed actions** for customer state and async lifecycle flags.

Why:
- CRUD flows naturally map to actions (`fetch_start`, `fetch_success`, `add_success`, `update_success`, `delete_success`, `error`).
- Strong typing prevents invalid state transitions.
- Easier to scale than multiple scattered `useState` calls as features grow.

### 3) Custom hooks needed
Use two hooks with clear responsibility split:

- **`useCustomerApi`**
  - Low-level HTTP calls to JSON Server (`getCustomers`, `getCustomerById`, `createCustomer`, `updateCustomer`, `deleteCustomer`).
  - Handles API URL details and request/response typing.

- **`useCustomers`** (context consumer)
  - Exposes reducer state + high-level CRUD commands to components/pages.
  - Example outputs: `customers`, `loading`, `error`, `fetchCustomers`, `addCustomer`, `updateCustomer`, `removeCustomer`.

This separation keeps networking concerns independent from UI state orchestration.

### 4) Add/edit form strategy
Use **one reusable `CustomerForm` component** with mode-driven props.

Recommended props:
- `mode: 'add' | 'edit'`
- `initialValues?: CustomerFormData`
- `onSubmit: (data: CustomerFormData) => Promise<void> | void`
- `submitting?: boolean`

Why:
- Both pages share the same fields and validation rules.
- Add/edit differences are mostly behavior (title, submit label, initial values), not structure.
- Reduces duplicate code and keeps form UX consistent.

## Data Flow Summary
1. Pages call methods from `useCustomers`.
2. `useCustomers` dispatches reducer actions and delegates HTTP to `useCustomerApi`.
3. Reducer updates central customer state in context.
4. All route components re-render from the same source of truth.

## Near-Term File Plan
- `src/customer-app/src/context/CustomerContext.tsx`
- `src/customer-app/src/hooks/useCustomerApi.ts`
- `src/customer-app/src/hooks/useCustomers.ts`
- `src/customer-app/src/components/CustomerForm.tsx`
- `src/customer-app/src/components/CustomerList.tsx`

## New Developer Onboarding (Read This First)

If you are new to this codebase, read files in this order:

1. `src/customer-app/src/main.tsx`
  - App entry point.
  - Shows global wrappers (`CustomerProvider`, `BrowserRouter`).

2. `src/customer-app/src/App.tsx`
  - Route table (`/`, `/add`, `/edit/:id`).
  - Shows how `Layout` wraps all pages.

3. `src/customer-app/src/context/CustomerContext.tsx`
  - Global customer data access for pages/components.
  - Single place where the app exposes customer operations.

4. `src/customer-app/src/hooks/useCustomerApi.ts`
  - All server communication (`GET`, `POST`, `PUT`, `DELETE`).
  - Loading/error handling and automatic re-fetch behavior.

5. `src/customer-app/src/pages/*.tsx`
  - Route-level behavior:
    - `CustomerListPage`: list + delete
    - `AddCustomerPage`: create + navigate back
    - `EditCustomerPage`: edit + not-found handling

6. `src/customer-app/src/components/CustomerList.tsx` and `src/customer-app/src/components/CustomerForm.tsx`
  - Reusable UI building blocks used by pages.

### Quick Mental Model

- **Pages** handle route logic and navigation.
- **Context** exposes shared customer state + actions to pages.
- **useCustomerApi** performs all network requests.
- **Components** render reusable UI and call parent-provided handlers.

### Typical Feature Workflow

When adding a new customer feature:

1. Add/adjust API call in `useCustomerApi`.
2. Expose or consume it through `CustomerContext`.
3. Update the relevant page (`pages/`).
4. Keep reusable display/input logic in `components/`.
