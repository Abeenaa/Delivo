# AbdiDelivery Backend API

Backend API for the AbdiDelivery food delivery application built with Node.js and MySQL.

## 🔒 Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` file with your values:**
   - Set your MySQL password in `DB_PASSWORD`
   - Generate a secure `JWT_SECRET` (use a random string generator)
   - Change admin credentials if needed

⚠️ **NEVER commit the `.env` file to version control!**

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- MySQL Workbench (recommended)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   - Copy `.env` file and update with your MySQL credentials
   - Update `DB_PASSWORD` with your MySQL root password
   - Update `JWT_SECRET` with a secure random string

3. **Setup Database**
   - Open MySQL Workbench
   - Create database: `CREATE DATABASE abdi_delivery;`
   - Run the SQL scripts in `/database` folder

4. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login

### Food Items
- `GET /api/foods` - Get all food items
- `POST /api/foods` - Create food item (Admin only)
- `PUT /api/foods/:id` - Update food item (Admin only)
- `DELETE /api/foods/:id` - Delete food item (Admin only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get specific order

### Admin
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status

## 🗄️ Database Schema

### Tables
- `users` - User accounts
- `food_items` - Food menu items
- `orders` - Customer orders
- `order_items` - Order line items

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT
- **File Upload:** Multer
- **Validation:** Express Validator