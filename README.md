# Banking App Frontend

A Vue 3 frontend for a banking application. The app provides customer and employee portals for account management, transactions, authentication, and basic banking workflows.

## Features

- Customer login, registration, and protected customer routes
- Employee portal with user, account, and transaction management
- Customer account overview, deposits, withdrawals, transfers, and account requests
- Role-based navigation using Vue Router guards
- API communication through Axios with JWT refresh handling
- Component-driven UI structure with Storybook support

## Tech Stack

- Vue 3
- Vite
- Pinia
- Vue Router
- Axios
- Tailwind CSS
- Storybook

## Project Structure

```text
src/
  assets/          Global styles and static assets
  components/      Reusable UI components and page views
  composables/     Reusable Vue composition logic
  router/          Application routes and route guards
  stores/          Pinia stores for auth, users, accounts, transactions, and UI state
  utils/           Axios client and shared utility functions
  config.js        Application configuration
  main.js          App entry point
.storybook/        Storybook configuration
public/            Public static files
```

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm
- Running backend API for authentication, accounts, users, transactions, and articles

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Set the backend API domain in `.env`:

```env
VITE_API_DOMAIN=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the app for production.

```bash
npm run preview
```

Serves the production build locally.

```bash
npm run storybook
```

Starts Storybook on port `6006`.

```bash
npm run build-storybook
```

Builds the Storybook static site.

## Environment Variables

| Variable          | Description                        | Default            |
| ----------------- | ---------------------------------- | ------------------ |
| `VITE_API_DOMAIN` | Backend API base URL used by Axios | `http://localhost` |

## Routing

The app uses Vue Router with hash-based routing. Customer and employee pages are protected by route guards and require the correct authenticated role.

The Vite base path is configured as `/BankingAppVue/` in `vite.config.js`.

## API Integration

API requests are handled through `src/utils/axios.js`. The client automatically attaches JWT access tokens and attempts token refresh when protected requests return `401`.

Expected backend areas include:

- Authentication: `/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/logout`
- Current user: `/users/me`
- Users: `/users`
- Accounts: `/accounts`
- Transactions: `/transactions`
- Articles: `/articles`

## Notes

- Keep environment-specific values in `.env`; do not commit secrets.
- Run the backend API before using protected frontend flows.
