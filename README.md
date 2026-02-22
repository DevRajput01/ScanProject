# ScanMyQr

QR-based business card: create a profile, get a QR code, share the link. Built with React (Vite), Express, and NeonDB.

## Project structure

```
scanmyqr/
├── frontend/     # React + Vite + Tailwind
├── backend/      # Express + NeonDB
├── database/     # schema.sql for NeonDB
└── README.md
```

## 1. Setup database

Run the schema once in the **NeonDB SQL Editor**:

```sql
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Or run the file: `database/schema.sql`

## 2. Setup backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your **NeonDB connection string** and optional `PORT`:

```
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
PORT=5000
```

Start the API:

```bash
npm run dev
```

Backend runs at **http://localhost:5000**. Health check: `GET /api/health`

## 3. Setup frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**. The Vite dev server proxies `/api` to the backend.

## 4. Run the flow

1. Open **http://localhost:5173**
2. Fill the form and submit
3. You get a QR code and profile link
4. Open the link or scan the QR to view the profile

## Optional: frontend env

Create `frontend/.env` if you want to point to a different API URL:

```
VITE_API_URL=http://localhost:5000/api
```

If unset, the app uses the Vite proxy (`/api` → backend).

## What you need

1. **NeonDB connection string** in `backend/.env`
2. **Table created** in Neon (run `database/schema.sql` once)

## Scripts

| Location  | Command      | Description        |
|----------|--------------|--------------------|
| backend  | `npm run dev`| Start API (nodemon)|
| backend  | `npm start`  | Start API (node)   |
| frontend | `npm run dev`| Start Vite dev     |
| frontend | `npm run build` | Production build |

## API

| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | `/api/health`      | Health + DB check  |
| POST   | `/api/profiles`   | Create profile → `{ id }` |
| GET    | `/api/profiles/:id` | Get profile by ID  |
| GET    | `/api/profiles`   | List all profiles  |
