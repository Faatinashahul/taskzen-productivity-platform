# TaskZen — Docker Deployment Guide

## Project structure after adding Docker files

```
taskzen/
├── client/
│   ├── Dockerfile          ← NEW
│   ├── nginx.conf          ← NEW
│   └── src/services/api.js ← UPDATED (removed hardcoded localhost)
├── Server/
│   └── Dockerfile          ← NEW
├── database_schema.sql
├── docker-compose.yml      ← NEW
└── .env                    ← NEW (never commit this)
```

---

## Run locally with Docker

```bash
# 1. Clone the repo
git clone https://github.com/Faatinashahul/taskzen-productivity-platform
cd taskzen

# 2. Copy and edit the env file
cp .env .env.local   # edit passwords & JWT secret

# 3. Build and start all containers
docker-compose up --build

# 4. Open the app
#    Frontend  →  http://localhost
#    Backend   →  http://localhost:5000
#    MySQL     →  localhost:3306
```

To stop:
```bash
docker-compose down
# To also delete the database volume:
docker-compose down -v
```

---

## Deploy to Render (free tier)

1. Push your code to GitHub (do NOT commit `.env`)
2. Go to https://render.com → New → Web Service
3. **Backend service:**
   - Root directory: `Server`
   - Build command: `npm install`
   - Start command: `node server.js`
   - Add env vars: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
4. **Frontend service:**
   - Root directory: `client`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Add env var: `VITE_API_URL=https://your-backend.onrender.com/api`
5. **Database:** Add a MySQL (PlanetScale or Render's MySQL) and copy the connection details into backend env vars

---

## Deploy to Railway (easiest one-click)

1. Push code to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Railway detects `docker-compose.yml` and deploys all 3 services automatically
4. Set the same env vars in Railway's dashboard

---

## Environment variables reference

| Variable        | Where used | Description                        |
|-----------------|------------|------------------------------------|
| DB_HOST         | Backend    | `db` in Docker, host URL in cloud  |
| DB_USER         | Backend    | MySQL username                     |
| DB_PASSWORD     | Backend    | MySQL password                     |
| DB_NAME         | Backend    | `task_db`                          |
| JWT_SECRET      | Backend    | Long random string for JWT signing |
| VITE_API_URL    | Frontend   | Backend API URL (build-time)       |
