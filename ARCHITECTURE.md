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
