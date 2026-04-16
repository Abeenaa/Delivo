# AbdiDelivery — Food Delivery System (Mini Version)

A full-stack food delivery web application built with React + Node.js + MySQL, featuring Ethiopian cuisine.

---

## Tech Stack

**Frontend:** React 19, React Router, Tailwind CSS 4, Vite  
**Backend:** Node.js, Express.js, MySQL2, JWT, bcryptjs  
**Database:** MySQL 8

---

## Features

- Browse and order Ethiopian food items
- Shopping cart with persistent storage
- Customer authentication (register / login)
- Protected checkout — login required to place orders
- Order history per user (fetched from backend, not shared)
- Admin dashboard with:
  - Real-time order management with delivery details (name, phone, address)
  - Food item management (add / edit / delete with image upload)
  - Order status updates
  - Dashboard stats

---

## Project Structure

```
Food-delivery-system/
├── frontend/          # React app (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── public/assets/ # Food images
│   ├── .env.example   # Frontend env template
│   └── package.json
│
├── backend/           # Node.js API
│   ├── src/
│   │   ├── config/    # DB + migrations
│   │   ├── middleware/ # JWT auth
│   │   └── routes/    # API endpoints
│   ├── .env.example   # Backend env template
│   └── package.json
│
└── README.md
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/abiratu6-hub/Food-delivery-system-mini-version-.git
cd Food-delivery-system-mini-version-
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=abdi_delivery
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@abdidelivery.com
ADMIN_PASSWORD=your_admin_password
PORT=5000
```

Create the database in MySQL Workbench:
```sql
CREATE DATABASE abdi_delivery;
```

Start the backend (migrations run automatically on startup):
```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Open `http://localhost:5173`

---

## Default Admin Credentials

Set in `backend/.env`:
```
ADMIN_EMAIL=admin@abdidelivery.com
ADMIN_PASSWORD=admin123
```

> Change these before deploying to production.

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register customer | — |
| POST | `/api/auth/login` | Customer login | — |
| POST | `/api/auth/admin-login` | Admin login | — |
| GET | `/api/foods` | Get all food items | — |
| POST | `/api/foods` | Add food item | Admin |
| PUT | `/api/foods/:id` | Update food item | Admin |
| DELETE | `/api/foods/:id` | Delete food item | Admin |
| POST | `/api/orders` | Place order | Customer |
| GET | `/api/orders` | Get my orders | Customer |
| GET | `/api/admin/orders` | Get all orders | Admin |
| PUT | `/api/admin/orders/:id` | Update order status | Admin |
| GET | `/api/admin/stats` | Dashboard stats | Admin |

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL |

---

## License

MIT
