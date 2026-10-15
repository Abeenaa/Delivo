# Delivo

A full-stack food delivery platform built with React and Node.js. Customers can browse menus, place orders, and track deliveries in real time. Administrators manage food listings, orders, and users through a dedicated dashboard.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-19.x-61DAFB?logo=react&logoColor=white)
![MySQL](https://img.shields.io/badge/database-MySQL-4479A1?logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/build-Vite-646CFF?logo=vite&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [Pages & Components](#pages--components)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Delivo is a full-stack food delivery web application. It provides customers with a smooth end-to-end ordering experience — from browsing the menu to tracking delivery status. On the backend, a RESTful API handles authentication, order processing, and food management, all secured with JWT and backed by a MySQL database.

---

## Features

**Customer**
- Secure login and registration with JWT authentication
- Browse food menu with category filtering
- Add to cart and proceed to checkout
- Real-time order status tracking
- Full order history

**Admin**
- Dashboard with order and user overview
- Create, update, and delete food items with image upload
- Update and manage order statuses
- View and manage registered users
- Protected admin-only routes

**System**
- Stateless JWT-based authentication
- Server-side input validation via `express-validator`
- File upload handling via `multer`
- CORS-configured REST API

---

## Tech Stack

**Frontend**

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI library |
| Vite | 8.x | Build tool and dev server |
| React Router DOM | 7.x | Client-side routing |
| Tailwind CSS | 4.x | Utility-first styling |
| Lucide React | 0.475+ | Icon set |

**Backend**

| Technology | Version | Purpose |
|---|---|---|
| Node.js | >= 18.0 | Runtime environment |
| Express | 4.x | Web framework |
| MySQL2 | 3.x | Database driver |
| jsonwebtoken | 9.x | JWT authentication |
| bcryptjs | 2.x | Password hashing |
| Multer | 1.x | File upload handling |
| express-validator | 6.x | Input validation |
| dotenv | 16.x | Environment config |
| Nodemon | 2.x | Dev auto-restart |

---

## Project Structure

```
delivo/
├── client/                        # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── components/            # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── Toast.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── LoadingSpinner.jsx
│       │   ├── ConfirmDialog.jsx
│       │   ├── BrandLogo.jsx
│       │   ├── CategoryItem.jsx
│       │   └── FoodImage.jsx
│       ├── context/
│       │   └── AuthContext.jsx    # Global authentication state
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Checkout.jsx
│       │   ├── Order.jsx
│       │   ├── OrderHistory.jsx
│       │   ├── TrackOrder.jsx
│       │   ├── Admin.jsx
│       │   └── Contact.jsx
│       ├── services/
│       │   └── api.js             # Centralized API service layer
│       ├── App.jsx                # Root component and routing
│       └── main.jsx
│
├── server/                        # Node.js / Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # MySQL connection pool
│   │   ├── controllers/           # Route handler logic
│   │   ├── middleware/            # Auth and validation middleware
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── foods.js
│   │   │   ├── orders.js
│   │   │   └── admin.js
│   │   └── utils/
│   ├── server.js                  # Express entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 18.0.0`
- [npm](https://www.npmjs.com/) `>= 9.0.0`
- [MySQL](https://www.mysql.com/) `>= 8.0`
- [Git](https://git-scm.com/)

### Installation

Clone the repository:

```bash
git clone https://github.com/Abeenaa/Food-delivery-app.git
cd Food-delivery-app
```

Install dependencies for both client and server:

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### Environment Variables

Copy the example env file and configure it:

```bash
cd server
cp .env.example .env
```

`server/.env`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=delivo_db

JWT_SECRET=your_secure_random_secret
JWT_EXPIRES_IN=7d

MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

ADMIN_EMAIL=admin@delivo.com
ADMIN_PASSWORD=your_admin_password
```

`client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Running the App

Start the backend:

```bash
cd server
npm run dev      # development (nodemon)
npm start        # production
```

Start the frontend:

```bash
cd client
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## API Reference

All endpoints are prefixed with `/api`.

### Authentication — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/login` | Customer login | — |
| POST | `/auth/register` | Customer registration | — |
| POST | `/auth/admin/login` | Admin login | — |
| GET | `/auth/me` | Get current user profile | JWT |

### Foods — `/api/foods`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/foods` | List all food items | — |
| GET | `/foods/:id` | Get single food item | — |
| POST | `/foods` | Create food item | Admin |
| PUT | `/foods/:id` | Update food item | Admin |
| DELETE | `/foods/:id` | Delete food item | Admin |

### Orders — `/api/orders`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/orders` | Place a new order | JWT |
| GET | `/orders/my-orders` | Get user order history | JWT |
| GET | `/orders/:id` | Get order details and status | JWT |

### Admin — `/api/admin`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/admin/orders` | List all orders | Admin |
| PUT | `/admin/orders/:id` | Update order status | Admin |
| GET | `/admin/users` | List all users | Admin |

---

## Pages & Components

### Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Menu browsing with category filter |
| Login | `/login` | Customer and admin authentication |
| Checkout | `/checkout` | Cart review and order placement |
| Order | `/order/:id` | Order confirmation and details |
| OrderHistory | `/orders` | User's past orders |
| TrackOrder | `/track/:id` | Live order status tracking |
| Admin | `/admin` | Admin dashboard (protected) |
| Contact | `/contact` | Support and contact page |

### Key Components

| Component | Description |
|---|---|
| `Navbar` | Responsive nav with cart count and auth state |
| `ProtectedRoute` | Wraps routes requiring authentication |
| `AuthContext` | Global auth state via React Context API |
| `Toast` | App-wide notification system |
| `ConfirmDialog` | Generic confirmation modal |
| `LoadingSpinner` | Global loading indicator |

---

## Contributing

1. Fork the repository
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: description"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## License

ISC — see [LICENSE](LICENSE) for details.
