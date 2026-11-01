# Delivo — Modern Food Delivery Platform

Delivo is a production-grade, full-stack food delivery web application built with **React 19**, **Vite**, **Tailwind CSS 4**, and **Node.js / Express** backed by a relational **MySQL** database. It provides an end-to-end customer journey—from customizable cuisine exploration and instant checkout to live interactive GPS delivery tracking and a dedicated administrative dispatch portal.

[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (React 19 + Vite)                  │
│                                                                        │
│   Landing Page       Menu & Customizer       Cart Drawer & Checkout    │
│   (Home.jsx)         (FoodItemModal.jsx)     (Composite cart keys)     │
│        │                     │                         │               │
│        ▼                     ▼                         ▼               │
│   AuthContext           CartContext               ToastContext         │
│   (JWT Session)         (Web Audio Chimes)        (System Alerts)      │
│        │                                               │               │
│        └─────────────────────┬─────────────────────────┘               │
│                              │ Axios API Client                        │
└──────────────────────────────┼─────────────────────────────────────────┘
                               │ HTTPS / JSON (Bearer JWT)
┌──────────────────────────────┼─────────────────────────────────────────┐
│                              ▼                                         │
│                      API GATEWAY LAYER (Express 4)                     │
│                                                                        │
│   /api/auth       /api/foods        /api/orders       /api/admin       │
│   /api/payment    Auth Middleware   Multer Uploads    Input Validator  │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │ Connection Pool (mysql2/promise)
┌──────────────────────────────┴─────────────────────────────────────────┐
│                       PERSISTENCE LAYER (MySQL 8)                      │
│                                                                        │
│   users          food_items        orders           order_items        │
│   (Pass bcrypt)  (Catalog & stock) (Status & total) (Item snapshots)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Core System Capabilities

### 1. Consumer Experience
* **Custom Meal Modifier Engine ([FoodItemModal.jsx](client/src/components/FoodItemModal.jsx))**:
  * Real-time spice intensity selector: *Mild 🌿*, *Medium 🌶️*, or authentic *Mitmita Hot 🔥*.
  * Add-on selections (Extra Ayib, Extra Fresh Injera, Awaze Dip, Drink pairings) with reactive unit price recalculation.
  * Special preparation notes passed through to the kitchen.
* **Live GPS Radar & Courier Tracking ([DeliveryMap.jsx](client/src/components/DeliveryMap.jsx))**:
  * Interactive OpenStreetMap & Leaflet vector map with zero external API key requirements.
  * Real-time waypoint coordinate interpolation, moving motorbike courier marker, and arrival boundary pin.
  * Real-time telemetry: Distance remaining (`km`), dynamic ETA (`mins`), and courier dispatch contact card.
  * Interactive simulation mode (`Simulate Live Route`) for demonstrations and testing.
* **Low-Latency Audio Feedback ([sound.js](client/src/utils/sound.js))**:
  * Native Web Audio API synthesis delivering crisp micro-interaction chimes upon cart mutations and order progress without fetching heavy external audio assets.
* **Composite Cart Engine ([CartContext.jsx](client/src/context/CartContext.jsx))**:
  * Distinct items generated via composite hashing (`${id}-${spice}-${addons}-${note}`), allowing customers to order different variations of the same dish without state collisions.
* **Multi-Step Checkout & Coupon System ([Checkout.jsx](client/src/pages/Checkout.jsx))**:
  * Promo code discount engine (`DELIVO30`, `FREESHIP`, `WELCOME10`) with animated error-shake validation.
  * Multiple payment rails: Chapa Online Gateway, Cash on Delivery, Bank Transfer, and Card.

### 2. Operations & Administration ([Admin.jsx](client/src/pages/Admin.jsx))
* **Business Analytics**: Real-time KPI aggregation for gross revenue, completed orders, registered customer counts, and dish performance.
* **Order Dispatch Desk**: Granular status mutation engine (`pending` $\to$ `confirmed` $\to$ `preparing` $\to$ `out_for_delivery` $\to$ `delivered` $\to$ `cancelled`).
* **Menu Lifecycle CRUD**: Create, edit, and toggle food items with image uploads via Multer and active stock flags.
* **Role-Based Access Control**: Strict middleware guard (`verifyToken`, `verifyAdmin`) protecting sensitive routes.

### 3. Backend & Security Architecture
* **Server-Side Price Verification**: Orders enforce prices queried from MySQL; client-submitted totals are never blindly trusted.
* **Atomic Transactions**: Orders and order item rows are committed within `START TRANSACTION` / `COMMIT` blocks with automatic `ROLLBACK` on stock failure.
* **Stateless Authentication**: Passwords hashed using `bcryptjs` (salt rounds: 10), and authenticated routes secured via `jsonwebtoken`.
* **Database Migrations Engine ([migrations.js](server/src/config/migrations.js))**: Self-bootstrapping schema creation with seed defaults.

---

## Technology Stack

| Layer | Technology | Version | Architectural Responsibility |
|:---|:---|:---|:---|
| **Frontend UI** | React | 19.x | Component lifecycle & state management |
| **Build & Bundler** | Vite | 8.x | Dev HMR server and optimized production packaging |
| **Styling** | Tailwind CSS | 4.x | Design tokens, responsive layouts, micro-animations |
| **Mapping Engine** | Leaflet | 1.9.x | Interactive vector mapping and telemetry tracking |
| **Routing** | React Router DOM | 7.x | Declarative client-side routing & protected route gates |
| **Icons** | Lucide React | 0.475+ | Clean accessible UI iconography |
| **Backend Runtime** | Node.js | >= 18.0 | Asynchronous event-driven I/O execution |
| **HTTP Framework**| Express | 4.x | RESTful API routing, middleware chaining, CORS |
| **Database** | MySQL | 8.0+ | Relational data persistence, foreign keys, transactions |
| **Driver** | mysql2/promise | 3.x | Non-blocking async connection pooling |
| **Auth & Crypto** | jsonwebtoken, bcryptjs | 9.x, 2.x | Token verification and cryptographic hashing |
| **File Ingestion** | Multer | 1.4.x | Multipart/form-data food image storage |
| **Input Security** | express-validator | 6.14.x | Strict request payload sanitization and validation |

---

## Directory Structure

```
Food-delivery-app/
├── client/                              # Frontend application (Vite SPA)
│   ├── public/                          # Static assets and favicon
│   └── src/
│       ├── components/                  # Reusable UI component library
│       │   ├── BrandLogo.jsx            # Dynamic vector branding
│       │   ├── CartDrawer.jsx           # Animated slide-out cart drawer
│       │   ├── CategoryItem.jsx         # Interactive cuisine category navigator
│       │   ├── ConfirmDialog.jsx        # Accessible action confirmation modal
│       │   ├── DeliveryMap.jsx          # Leaflet GPS radar & simulated courier
│       │   ├── FoodImage.jsx            # Resilient food image with fallback
│       │   ├── FoodItemModal.jsx        # Customizer modal (Spice & add-ons)
│       │   ├── Footer.jsx               # Platform footer & social navigation
│       │   ├── LoadingSpinner.jsx       # Standardized loading state indicator
│       │   ├── Navbar.jsx               # Navigation bar with auth & search
│       │   ├── ProtectedRoute.jsx       # Route-level authentication gate
│       │   └── Toast.jsx                # System notification toast component
│       ├── context/                     # Global React state providers
│       │   ├── AuthContext.jsx          # JWT session, profile, and logout logic
│       │   ├── CartContext.jsx          # Composite items, quantities & chimes
│       │   └── ToastContext.jsx         # Application-wide alert dispatcher
│       ├── pages/                       # Application route views
│       │   ├── Admin.jsx                # Dispatch & metrics dashboard
│       │   ├── Checkout.jsx             # 3-step checkout & coupon discounts
│       │   ├── Contact.jsx              # Customer support inquiry page
│       │   ├── Home.jsx                 # Conversion-focused landing page
│       │   ├── Login.jsx                # Dual-tab Sign In & Sign Up flow
│       │   ├── Order.jsx                # Menu catalog, search, and category filters
│       │   ├── OrderHistory.jsx         # Historical orders and reorder action
│       │   ├── PaymentVerify.jsx        # Payment gateway webhook callback
│       │   └── TrackOrder.jsx           # Progress timeline & GPS delivery map
│       ├── services/
│       │   └── api.js                   # Centralized Axios client & endpoints
│       ├── utils/
│       │   └── sound.js                 # Web Audio API procedural synthesis
│       ├── App.jsx                      # Root application layout & routing
│       ├── index.css                    # Tailwind tokens & scroll architecture
│       └── main.jsx                     # Client entry point
│
├── server/                              # Backend application (REST API)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js              # MySQL connection pool configuration
│   │   │   └── migrations.js            # Auto-schema migrations & seeding
│   │   ├── middleware/
│   │   │   └── auth.js                  # Token and role authorization filters
│   │   ├── routes/
│   │   │   ├── admin.js                 # Admin metrics & status mutations
│   │   │   ├── auth.js                  # Authentication & credential endpoints
│   │   │   ├── foods.js                 # Menu catalog & item CRUD
│   │   │   ├── orders.js                # Order placement, history & tracking
│   │   │   └── payment.js               # Payment gateway orchestration
│   │   └── utils/
│   │       ├── chapa.js                 # Chapa gateway integration helper
│   │       └── logger.js                # Structured console logging utility
│   ├── uploads/                         # Dish image uploads storage
│   ├── server.js                        # Express server entry point
│   ├── package.json
│   └── .env.example
│
├── .gitignore                           # Workspace git exclusion rules
├── package.json                         # Root monorepo workspace runner
└── README.md                            # Technical architecture & runbook
```

---

## Getting Started

### Prerequisites
* **Node.js**: `>= 18.0.0`
* **npm**: `>= 9.0.0`
* **MySQL Server**: `>= 8.0`

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Abeenaa/Food-delivery-app.git
cd Food-delivery-app

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```bash
cd ../server
cp .env.example .env
```

Configure `server/.env`:

```env
PORT=5000
NODE_ENV=development

# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=delivo_db

# Security & Authentication
JWT_SECRET=replace_with_a_secure_random_hex_string
JWT_EXPIRES_IN=7d

# File Storage
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Default Super Admin Seed Credentials
ADMIN_EMAIL=admin@delivo.com
ADMIN_PASSWORD=AdminPassword123!
```

Create a `.env` file in the `client` directory:

```bash
cd ../client
```

Configure `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Initialization

Start your MySQL server. Delivo includes auto-migrations that construct all required tables (`users`, `food_items`, `orders`, `order_items`) and seed initial categories on server boot:

```bash
# In MySQL shell / client, ensure the database exists:
CREATE DATABASE IF NOT EXISTS delivo_db;
```

### 4. Running the Application

Open two terminal instances:

```bash
# Terminal 1: Launch Backend API Server (Port 5000)
cd server
npm run dev

# Terminal 2: Launch Frontend Client (Port 5173)
cd client
npm run dev
```

Or from the workspace root:
```bash
npm run dev:server
npm run dev:client
```

Access the client at: `http://localhost:5173`  
Access the API health at: `http://localhost:5000/api/foods`

---

## REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `POST` | `/api/auth/register` | Register customer account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT | No |
| `GET` | `/api/auth/me` | Fetch active user profile | Yes (Bearer) |

### Food Catalog (`/api/foods`)
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `GET` | `/api/foods` | List all active menu items | No |
| `GET` | `/api/foods/:id` | Fetch specific food details | No |
| `POST` | `/api/foods` | Add menu item (Multipart) | Admin |
| `PUT` | `/api/foods/:id` | Update menu item & stock status | Admin |
| `DELETE`| `/api/foods/:id` | Deactivate food item | Admin |

### Orders & Tracking (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `POST` | `/api/orders` | Place validated order with items | Optional |
| `GET` | `/api/orders/my-orders` | Fetch customer order history | Yes (Bearer) |
| `GET` | `/api/orders/:id/track` | Fetch tracking status & driver info | No |

### Administrative Portal (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `GET` | `/api/admin/stats` | Aggregate revenue & order metrics | Admin |
| `GET` | `/api/admin/orders` | List all system orders | Admin |
| `PUT` | `/api/admin/orders/:id`| Update order status lifecycle | Admin |
| `GET` | `/api/admin/users` | List registered user directory | Admin |

---

## Production Build Verification

To create optimized production bundles:

```bash
# Compile and bundle client application
cd client
npm run build
```

Production assets are compiled into `client/dist` with minification, tree-shaking, and CSS optimizations.

---

## License

This project is licensed under the [ISC License](LICENSE).
