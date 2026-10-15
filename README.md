# 🍔 AbdiDelivery — Food Delivery Platform

> A modern, full-stack food delivery web application featuring real-time order tracking, secure authentication, restaurant management, and a powerful admin dashboard.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-19.x-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/database-MySQL-4479A1?logo=mysql)
![Vite](https://img.shields.io/badge/build-Vite-646CFF?logo=vite)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#-api-reference)
- [Pages & Components](#-pages--components)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**AbdiDelivery** is a full-stack food delivery platform built with React and Node.js. It provides a seamless experience for customers to browse menus, place orders, and track deliveries in real time — while giving administrators full control over food listings, order management, and user activity through a dedicated dashboard.

---

## ✨ Features

### 👤 Customer
- 🔐 Secure login & registration with JWT authentication
- 🍕 Browse food menu with category filtering
- 🛒 Add to cart and checkout with order summary
- 📦 Real-time order status tracking
- 🕐 View full order history
- 📞 Contact support page

### 🛠️ Admin
- 📊 Admin dashboard with analytics overview
- ➕ Add, edit, and delete food items (with image upload)
- 📋 Manage and update order statuses
- 👥 View and manage registered users
- 🔒 Protected admin routes

### ⚙️ System
- JWT-based stateless authentication
- Protected routes on both client & server
- Input validation with `express-validator`
- File upload support via `multer`
- CORS-configured REST API

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19.x | UI Library |
| [Vite](https://vitejs.dev/) | 8.x | Build Tool & Dev Server |
| [React Router DOM](https://reactrouter.com/) | 7.x | Client-side Routing |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first Styling |
| [Lucide React](https://lucide.dev/) | 0.475+ | Icon Library |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | ≥18.0 | Runtime Environment |
| [Express](https://expressjs.com/) | 4.x | Web Framework |
| [MySQL2](https://github.com/sidorares/node-mysql2) | 3.x | Database Driver |
| [JWT](https://jwt.io/) | 9.x | Authentication Tokens |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 2.x | Password Hashing |
| [Multer](https://github.com/expressjs/multer) | 1.x | File Uploads |
| [express-validator](https://express-validator.github.io/) | 6.x | Input Validation |
| [dotenv](https://github.com/motdotla/dotenv) | 16.x | Environment Config |
| [Nodemon](https://nodemon.io/) | 2.x | Dev Auto-restart |

---

## 📁 Project Structure

```
Food-delivery-app/
├── client/                      # React frontend (Vite)
│   ├── public/                  # Static assets
│   └── src/
│       ├── components/          # Reusable UI components
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
│       │   └── AuthContext.jsx  # Global auth state
│       ├── pages/               # Application pages
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Checkout.jsx
│       │   ├── Order.jsx
│       │   ├── OrderHistory.jsx
│       │   ├── TrackOrder.jsx
│       │   ├── Admin.jsx
│       │   └── Contact.jsx
│       ├── services/
│       │   └── api.js           # Centralized API service layer
│       ├── App.jsx              # Root component & routing
│       └── main.jsx             # Entry point
│
├── server/                      # Node.js/Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # MySQL connection pool
│   │   ├── controllers/         # Route handler logic
│   │   ├── middleware/          # Auth & validation middleware
│   │   ├── routes/              # API route definitions
│   │   │   ├── auth.js
│   │   │   ├── foods.js
│   │   │   ├── orders.js
│   │   │   └── admin.js
│   │   └── utils/               # Helper utilities
│   ├── server.js                # Express app entry point
│   ├── .env.example             # Environment variable template
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) `>= 18.0.0`
- [npm](https://www.npmjs.com/) `>= 9.0.0`
- [MySQL](https://www.mysql.com/) `>= 8.0`
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Abeenaa/Food-delivery-app.git
cd Food-delivery-app
```

**2. Install server dependencies**

```bash
cd server
npm install
```

**3. Install client dependencies**

```bash
cd ../client
npm install
```

### Environment Variables

**Server** — copy the example file and fill in your values:

```bash
cd server
cp .env.example .env
```

Then edit `server/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=food_delivery_db

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
```

**Client** — create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Running the App

**Start the backend server:**

```bash
cd server
npm run dev       # Development (with nodemon auto-restart)
# or
npm start         # Production
```

The API will be available at: `http://localhost:5000`

**Start the frontend dev server:**

```bash
cd client
npm run dev
```

The app will be available at: `http://localhost:5173`

> 💡 **Tip:** Open two terminal windows — one for the server, one for the client.

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

### 🔐 Auth — `/api/auth`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/login` | Customer login | ❌ |
| `POST` | `/auth/register` | Customer registration | ❌ |
| `POST` | `/auth/admin/login` | Admin login | ❌ |
| `GET` | `/auth/me` | Get current user profile | ✅ |

### 🍕 Foods — `/api/foods`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/foods` | Get all food items | ❌ |
| `GET` | `/foods/:id` | Get single food item | ❌ |
| `POST` | `/foods` | Create food item | ✅ Admin |
| `PUT` | `/foods/:id` | Update food item | ✅ Admin |
| `DELETE` | `/foods/:id` | Delete food item | ✅ Admin |

### 📦 Orders — `/api/orders`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/orders` | Place a new order | ✅ |
| `GET` | `/orders/my-orders` | Get user's order history | ✅ |
| `GET` | `/orders/:id` | Get order details & status | ✅ |

### 🛠️ Admin — `/api/admin`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/admin/orders` | Get all orders | ✅ Admin |
| `PUT` | `/admin/orders/:id` | Update order status | ✅ Admin |
| `GET` | `/admin/users` | Get all users | ✅ Admin |

---

## 🖥 Pages & Components

### Pages
| Page | Route | Description |
|---|---|---|
| `Home` | `/` | Landing page with food categories & menu |
| `Login` | `/login` | Customer & admin authentication |
| `Checkout` | `/checkout` | Cart review & order placement |
| `Order` | `/order/:id` | Order confirmation & details |
| `OrderHistory` | `/orders` | Past orders list |
| `TrackOrder` | `/track/:id` | Real-time order status tracking |
| `Admin` | `/admin` | Admin dashboard (protected) |
| `Contact` | `/contact` | Contact & support page |

### Key Components
| Component | Description |
|---|---|
| `Navbar` | Responsive navigation with cart count & auth state |
| `Footer` | Site footer with links |
| `ProtectedRoute` | HOC that guards routes requiring authentication |
| `AuthContext` | React context providing global auth state & actions |
| `Toast` | Notification system for success/error messages |
| `ConfirmDialog` | Reusable confirmation modal |
| `LoadingSpinner` | Global loading indicator |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and **commit**: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request**

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) standard for commit messages.

---

## 📄 License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [Abeenaa](https://github.com/Abeenaa)

⭐ **Star this repo** if you found it helpful!

</div>
