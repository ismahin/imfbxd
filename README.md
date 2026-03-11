## IMF Frontend

Modern, responsive frontend for the IMF application, built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, **Redux Toolkit**, and **RTK Query**.

It includes:

- **Public site (landing)** – hero/intro, projects, about, gallery, board members, contact form, footer.
- **User dashboard** – members can log in and see their profile, deposit history, and people they referred.
- **Admin dashboard** – full back‑office for members, deposits, content (gallery, board), messages, and site settings.

---

## Tech stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, custom components
- **State**: Redux Toolkit, RTK Query, Redux Persist
- **UI & UX**:
  - MUI components in a few places
  - Sonner for toast notifications
  - Swiper-based gallery carousel
- **Auth**: JWT access token stored in Redux + cookie (`accessToken`), role‑based routing (Admin vs Member)

---

## Project structure (high level)

- `app/`
  - `page.tsx` – public landing page
  - `login/` – login page
  - `(protected)/dashboard/` – admin dashboard layout and pages
  - `(protected)/member/` – logged‑in member’s own dashboard
- `components/`
  - `layout/` – navbar, footer, shared layout
  - `sections/` – landing sections (gallery, board, contact, etc.)
  - `dashboard/` – reusable dashboard widgets (members, tables, modals)
- `store/`
  - `services/` – RTK Query API slices (`authApi`, `userApi`, `depositsApi`, `galleryApi`, `boardApi`, `messagesApi`, `settingsApi`)
  - `slices/` – `authSlice` and store setup
- `utils/` – helpers (e.g. login error parser)

---

## Prerequisites

- Node.js 18+
- A running **backend API** (see `imf_backend`):
  - Default base URL: `http://localhost:8000`

---

## Environment configuration

Create `imf_frontend-main/.env` (or `.env.local`) from `.env.example`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Development helper:
# true  → skip login and open dashboard as Dev Admin (no backend login)
# false → use real backend login
NEXT_PUBLIC_SKIP_AUTH=false
```

**Production / Vercel**:

- Set `NEXT_PUBLIC_API_BASE_URL` to your backend URL (e.g. `https://api.v2.imfbxd.com`).
- Set `NEXT_PUBLIC_SKIP_AUTH=false` (always use real login in production).
- In Vercel: **Project → Settings → Environment Variables** add both variables for Production (and Preview if needed).

**Deploy on Vercel**

1. Push this project to GitHub (e.g. `https://github.com/ismahin/imfbxd`).
2. In [Vercel](https://vercel.com), import the repo and deploy (default Next.js settings).
3. Add environment variables in the Vercel project:
   - `NEXT_PUBLIC_API_BASE_URL` = `https://api.v2.imfbxd.com`
   - `NEXT_PUBLIC_SKIP_AUTH` = `false`
4. Redeploy so the build uses these variables.

---

## Scripts

From `imf_frontend-main`:

- **Install dependencies**

  ```bash
  npm install
  ```

- **Development**

  ```bash
  npm run dev
  ```

  Frontend runs at `http://localhost:3000`.

- **Build**

  ```bash
  npm run build
  npm run start
  ```

- **Type check**

  ```bash
  npm run typecheck
  ```

- **Lint**

  ```bash
  npm run lint
  ```

---

## Connecting to the backend

The frontend expects the backend API described in `imf_backend`:

- Base URL: `NEXT_PUBLIC_API_BASE_URL` (e.g. `http://localhost:8000`)
- Routes used (all under that base):
  - `api/web/v1/authentication/login/`
  - `api/web/v1/users/...`
  - `api/web/v1/deposits/...`
  - `api/web/v1/gallery/...`
  - `api/web/v1/board/...`
  - `api/web/v1/messages/...`
  - `api/web/v1/settings/...`

RTK Query services in `src/store/services` are already wired to these endpoints.

---

## Features (end‑to‑end)

### Public site

- **Landing / Home**:
  - Hero + navigation
  - Sections for projects, about, contact
- **Gallery**:
  - Carousel displaying images from `GET /api/web/v1/gallery/list/`
- **Board Members**:
  - Cards from `GET /api/web/v1/board/list/`
- **Contact form**:
  - Sends messages to `POST /api/web/v1/messages/`
  - Uses contact details and footer info from `GET /api/web/v1/settings/`

### Auth & dashboards

- **Login** (`/login`):
  - Calls `POST /api/web/v1/authentication/login/`
  - Stores tokens in Redux and a short‑lived cookie
  - Fetches profile from `GET /api/web/v1/users/me/` and routes:
    - **Admin** → `/dashboard`
    - **Member** → `/member`

- **User dashboard** (`/member`):
  - Shows profile, addresses, nominee, financial info
  - Deposit history from `GET /api/web/v1/deposits/list/?member_uuid=...`
  - “Referred Members” table showing each person who used this member’s ID as **Beneficiary Ref. ID** (with ID, name, phone, email)

- **Admin dashboard** (`/dashboard/...`):
  - **Members Management**:
    - List, search, paginate members
    - Add / edit member (including profile picture and beneficiary ref id)
    - Activate / deactivate accounts
    - Per‑member profile page (same layout as user, plus referrals section)
  - **Deposits**:
    - Create / edit / delete deposits
    - Per‑member and global totals; dashboard stats
  - **Gallery Management**:
    - Upload/replace images (multipart)
    - Filter by category; synced with public gallery
  - **Board Management**:
    - Create/edit board members + profile photos
    - Order and display on public site
  - **Messages**:
    - Messenger‑style view of contact messages
  - **Settings**:
    - Organization info (name, registration, email, phone, address, website)
    - Contact & footer (Contact Us addresses/phones, footer email/phone, social links)
    - **Logo settings** (logo + favicon + logo text)
    - **Security (Admin account)** – change admin login email + password

---

## Running full stack locally

1. **Backend**

   - Follow `imf_backend/README.md`:

     ```bash
     cd imf_backend
     npm install
     npm run db:migrate
     npm run dev
     ```

   - Ensure `.env` is configured and backend runs on `http://localhost:8000`.

2. **Frontend**

   ```bash
   cd imf_frontend-main
   npm install
   # set NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   npm run dev
   ```

3. Open `http://localhost:3000` in the browser.

---

## Deployment notes

- **Environment variables** must be provided in your hosting platform for production (at least `NEXT_PUBLIC_API_BASE_URL`).
- Build with `npm run build` and serve with `npm run start` behind a reverse proxy (or use Vercel/Next hosting).
- Ensure CORS on the backend allows your frontend origin in `CORS_ORIGIN`.
