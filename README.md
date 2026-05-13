# Auth App (Vite + React + TypeScript)

A minimal authentication demo app built with **Vite**, **React**, **TypeScript**, **Material UI**, and **Redux Toolkit**, using **json-server** as a mock backend.

This project demonstrates a simple but practical authentication flow with protected routes, role-based UI, theme persistence, and Redux-powered state management.

---

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **UI Library:** Material UI (MUI)
- **State Management & Data Fetching:** Redux Toolkit & RTK Query
- **Form Handling:** React Hook Form
- **Routing:** React Router DOM
- **Mock Backend:** json-server
- **Storage:** localStorage (for persisted demo session + theme)

---

## Features

- **Mock authentication:** Email/password login against a `json-server` dataset
- **Mock JWT generation:** Fake JWT token created in `src/utils/mockJwt.ts`
- **Persistent session:** User session stored in Redux + `localStorage`
- **Protected routes:** Route guarding with optional role checks
- **Role-based UI:** Admin-only user table in the dashboard
- **Theme switching:** Light/Dark mode using Redux + persisted theme preference
- **Redux architecture:** Separate `auth`, `theme`, and `api` slices
- **Data Fetching:** Handled cleanly using RTK Query auto-generated hooks
- **Form Validation:** Performant and declarative forms using `react-hook-form`
- **Mock API integration:** Powered by `json-server`
- **Type-safe codebase:** Built with TypeScript

---

## Quick Start

### 1) Install dependencies
```bash
npm install
```

### 2) Start the mock backend
This starts `json-server` and watches `db.json` on **port 3001**.

```bash
npm run mock
```

### 3) Start the development server
```bash
npm run dev
```

### 4) Build for production
```bash
npm run build
npm run preview
```

---

## Demo Credentials

These users are available in `db.json` for testing:

- **Admin**
  - Email: `admin@test.com`
  - Password: `admin123`

- **User**
  - Email: `vivek@test.com`
  - Password: `user123`

---

## Authentication Flow

1. The login form sends a request like:

   ```txt
   GET http://localhost:3001/users?email=<email>&password=<password>
   ```

   See: `src/auth/Login.tsx`

2. On successful match:
   - a mock JWT is generated using `generateMockToken(sessionUser)`
   - `loginSuccess({ user, token })` is dispatched

3. The auth slice stores:
   - user data in Redux
   - token in Redux
   - session data in `localStorage`

4. On app load:
   - stored session is checked
   - token expiration is validated using `isTokenExpired`

5. Protected pages are guarded by `ProtectedRoute`, which:
   - redirects unauthenticated users to `/`
   - optionally checks roles via `requiredRole`

---

## Project Structure

```txt
src/
├── app/
│   ├── hooks.ts
│   └── store.ts
├── auth/
│   ├── Login.tsx
│   └── Register.tsx
├── components/
│   └── ProtectedRoute.tsx
├── features/
│   ├── api/
│   │   └── apiSlice.ts
│   ├── auth/
│   │   └── authSlice.ts
│   └── theme/
│       └── themeSlice.ts
├── pages/
│   └── Dashboard.tsx
├── theme/
│   └── theme.ts
├── types/
│   └── users.tsx
├── utils/
│   └── mockJwt.ts
├── main.tsx
└── router.tsx
```

---

## Key Files

- **App entry:** [`src/main.tsx`](src/main.tsx) & [`src/App.tsx`](src/App.tsx)
- **Router config:** [`src/router.tsx`](src/router.tsx)
- **Redux store:** [`src/app/store.ts`](src/app/store.ts)
- **API slice (RTK Query):** [`src/features/api/apiSlice.ts`](src/features/api/apiSlice.ts)
- **Auth slice:** [`src/features/auth/authSlice.ts`](src/features/auth/authSlice.ts)
- **Theme slice:** [`src/features/theme/themeSlice.ts`](src/features/theme/themeSlice.ts)
- **Protected route:** [`src/components/ProtectedRoute.tsx`](src/components/ProtectedRoute.tsx)
- **Mock JWT utils:** [`src/utils/mockJwt.ts`](src/utils/mockJwt.ts)
- **Types:** [`src/types/users.tsx`](src/types/users.tsx)
- **Mock database:** [`db.json`](db.json)
- **Project config:** [`package.json`](package.json), [`vite.config.ts`](vite.config.ts)

---

## Available Scripts

From `package.json`:

- `npm run dev` — start Vite dev server
- `npm run mock` — start `json-server` on port `3001`
- `npm run build` — build project for production
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

---

## Theme Management

The application supports **light** and **dark** modes.

- Theme mode is stored in Redux
- Theme preference is persisted to `localStorage`
- Theme generation is handled in:
  - `src/features/theme/themeSlice.ts`
  - `src/theme/theme.ts`

---

## Role-Based Access

The app includes a simple role-based UI pattern:

- Standard users can access the normal dashboard
- Admin users can see additional admin-only UI
- `ProtectedRoute` supports optional role checking

Example:
- Admin-only content is displayed when:

```ts
currentUser.role === "ADMIN"
```

---

## Notes / Caveats

- This project is for **demo / learning purposes only**
- Tokens are **mock tokens**, not real JWTs
- Passwords in `db.json` are stored in **plain text** for simplicity
- Do **not** use this setup as-is in production

---

## Security Notice

This project intentionally uses a simplified authentication flow for learning and demonstration.

In a real production app, you should:

- use a real backend
- hash passwords securely
- store tokens safely
- implement refresh token flow
- validate authentication server-side
- protect sensitive routes and APIs properly

---

## How to Push to GitHub

### Option 1: Standard Git

```bash
git init
git add README.md
git commit -m "chore: replace README.md"
git branch -M main
git remote add origin git@github.com:<your-username>/<your-repo>.git
git push -u origin main
```

### Option 2: GitHub CLI

```bash
gh repo create <your-repo> --public --source=. --remote=origin --push
```

---

## Contributing

Contributions are welcome.

If you would like to improve the project:

- open an issue
- submit a pull request
- keep changes focused and consistent with the current code style
#
