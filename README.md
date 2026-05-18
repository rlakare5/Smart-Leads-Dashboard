# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the **MERN stack** and **TypeScript**. Manage sales leads with authentication, advanced filtering, pagination, CSV export, and role-based access control.

![Stack](https://img.shields.io/badge/React-TypeScript-61DAFB)
![Stack](https://img.shields.io/badge/Node.js-Express-339933)
![Stack](https://img.shields.io/badge/MongoDB-Mongoose-47A248)

---

## Features

- **JWT Authentication** — Register, login, protected routes, bcrypt password hashing
- **Leads CRUD** — Create, read, update, delete leads
- **Advanced Filtering** — Filter by status, source; search by name/email; sort latest/oldest
- **Backend Pagination** — 10 records per page with metadata
- **Debounced Search** — 400ms debounce on frontend
- **CSV Export** — Export filtered leads
- **RBAC** — Admin (full access + delete) | Sales (CRUD except delete)
- **Dark Mode** — Toggle light/dark theme
- **Docker** — Full stack via Docker Compose
- **Responsive UI** — Mobile-friendly dashboard with loading, empty, and error states

---

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 18, TypeScript, TailwindCSS, Vite, Axios |
| Backend | Node.js, Express, TypeScript, Mongoose |
| Database | MongoDB |
| Auth | JWT, bcryptjs |
| DevOps | Docker, Docker Compose, Nginx |

---

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/       # Database connection
│       ├── controllers/  # Route handlers
│       ├── middleware/   # Auth, validation, errors
│       ├── models/       # Mongoose schemas
│       ├── routes/       # API routes
│       ├── services/     # Query builders
│       ├── types/        # TypeScript interfaces
│       ├── validators/   # express-validator rules
│       └── utils/        # Helpers
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI & feature components
│       ├── context/      # Auth & theme state
│       ├── hooks/        # useDebounce, etc.
│       ├── pages/        # Route pages
│       ├── services/     # API clients
│       └── types/        # TypeScript interfaces
├── docker-compose.yml
├── API_DOCUMENTATION.md
├── MONGODB_ATLAS_SETUP.md
└── MONGODB_SETUP.md
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (recommended) or local MongoDB 7+
- npm

### 1. Clone & install

```bash
cd Internship_Task

# Backend
cd backend
cp .env.example .env
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Configure environment

**backend/.env** (use your Atlas connection string)

```env
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/smart_leads_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> Full Atlas setup: **[MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)**

**frontend/.env**

```env
VITE_API_URL=http://localhost:5000/api
```
```bash
docker run -d --name smart-leads-mongo -p 27017:27017 mongo:7
```

### 4. Run development servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- **Frontend:** http://localhost:5173
- **API:** http://localhost:5000/api

### 5. First use

1. Open http://localhost:5173/register
2. Create an account (first user becomes **admin**)
3. Add leads from the dashboard

---

## Docker (Full Stack)

```bash
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| API | http://localhost:5000/api |
| MongoDB | localhost:27017 |

---

## API Documentation

Full API reference: **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

---

## MongoDB

| Guide | Use case |
|-------|----------|
| **[MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)** | Cloud Atlas, collections, entities, seed data |
| **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** | Local MongoDB / Docker |

Seed sample data (after Atlas is connected):

```bash
cd backend
npm run seed
```

---

## Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

---

## Default Roles

| Role | Permissions |
|------|-------------|
| **admin** | Full CRUD + delete leads |
| **sales** | Create, view, update leads; export CSV |

The first registered user is automatically assigned the **admin** role.

---

## License

MIT — Built for internship evaluation purposes.
