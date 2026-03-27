# MediBuddy — Production-ready Healthcare Platform

Full-stack, scalable healthcare platform:

- **Frontend**: React (Vite) + Tailwind CSS + React Router
- **Backend**: Node.js + Express
- **DB**: MongoDB (Mongoose)
- **Auth**: JWT + bcrypt
- **Deploy**: Render (no code changes required)

## Folder structure

```
/client
  /src
    /components
    /pages
    /state
    /utils
/server
  /src
    /config
    /controllers
    /middleware
    /models
    /routes
    /services
    /utils
```

## Local development

### 1) Backend

```bash
cd server
copy .env.example .env
npm install
npm run dev
```

Set `MONGO_URI` and `JWT_SECRET` in `server/.env`.

Backend runs on `http://localhost:5000` and exposes APIs under `/api`.

### 2) Frontend

```bash
cd client
copy .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Render deployment

You’ll create **two** Render services:

### A) Backend (Web Service)

- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment variables**:
  - `MONGO_URI`: your Mongo connection string
  - `JWT_SECRET`: strong secret
  - `JWT_EXPIRES_IN`: optional (default `7d`)
  - `CORS_ORIGIN`: your frontend Render URL (comma-separated if multiple), e.g. `https://medibuddy-web.onrender.com`

> Backend uses `process.env.PORT` automatically.

### B) Frontend (Static Site)

- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment variables**:
  - `VITE_API_URL`: your backend Render URL + `/api`, e.g. `https://medibuddy-api.onrender.com/api`

## Core API endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/me`
- `GET /api/me/analytics`
- `PUT /api/me/patient`
- `PUT /api/me/doctor`
- `GET /api/doctors` (search + pagination)
- `POST /api/recommendations` (mock AI engine)
- `GET /api/recommendations/me`
- `POST /api/appointments` (patients)
- `GET /api/appointments/me` (patients/doctors)
- `PATCH /api/appointments/:id/status` (doctors)

## Notes

- This platform provides **informational guidance only** and is **not medical advice**.

