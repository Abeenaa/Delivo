const { pool } = require('./database');
const logger = require('../utils/logger');

const createTables = async () => {
  try {
    logger.info('Starting database migrations...');

    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role ENUM('customer', 'admin') DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    // Create food_items table
    const createFoodItemsTable = `
      CREATE TABLE IF NOT EXISTS food_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        image_url LONGTEXT,
        rating DECIMAL(2, 1) DEFAULT 4.5,
        stock_status ENUM('Available', 'Low Stock', 'Out of Stock') DEFAULT 'Available',
        is_active BOOLEAN DEFAULT TRUE,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `;

    // Create orders table
    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        delivery_fee DECIMAL(10, 2) DEFAULT 45.00,
        status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
        delivery_address TEXT NOT NULL,
        delivery_phone VARCHAR(20) NOT NULL,
        delivery_name VARCHAR(100) NOT NULL,
        payment_method ENUM('cash', 'card', 'mobile') DEFAULT 'cash',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `;

    // Create order_items table
    const createOrderItemsTable = `
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        food_item_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE
      )
    `;

    // Execute table creation
    await pool.execute(createUsersTable);
    logger.success('Users table created/verified');

    await pool.execute(createFoodItemsTable);
    logger.success('Food items table created/verified');

    await pool.execute(createOrdersTable);
    logger.success('Orders table created/verified');

    await pool.execute(createOrderItemsTable);
    logger.success('Order items table created/verified');

    // Update orders table to allow NULL user_id for guest orders
    try {
      await pool.execute('ALTER TABLE orders MODIFY COLUMN user_id INT NULL');
      logger.success('Orders table updated to allow guest orders');
    } catch (error) {
      // Table might already be updated or doesn't exist yet
      logger.info('Orders table user_id column update skipped');
    }

    // Upgrade image_url column to LONGTEXT to support large base64 images
    try {
      await pool.execute('ALTER TABLE food_items MODIFY COLUMN image_url LONGTEXT');
      logger.success('food_items image_url upgraded to LONGTEXT');
    } catch (error) {
      logger.info('image_url column upgrade skipped');
    }

    // Create default admin user (after tables are created)
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    try {
      const bcrypt = require('bcryptjs');
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
      
      await pool.execute(
        'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', adminEmail, hashedAdminPassword, 'admin']
      );
      
      logger.success(`Admin user ready: ${adminEmail}`);
    } catch (error) {
      logger.info('Admin user creation skipped');
    }

    // Insert default food items
    const defaultFoodItems = [
      {
        id: 1001,
        name: 'Spiced Kitfo Platter',
        description: 'Finely chopped prime beef, seasoned with mitmita and niter kibbeh.',
        price: 185,
        category: 'Main Dishes',
        image_url: '/assets/spiceed kitifo.jpg',
        rating: 4.9
      },
      {
        id: 1002,
        name: 'Bayenetu Platter',
        description: 'Our signature vegetarian combination: 8 unique vegetable wats.',
        price: 150,
        category: 'Main Dishes',
        image_url: '/assets/bayanetu.jpg',
        rating: 4.8
      },
      {
        id: 1003,
        name: 'Classic Doro Wat',
        description: 'The king of Ethiopian stews. Slow-simmered chicken and egg.',
        price: 210,
        category: 'Main Dishes',
        image_url: '/assets/doro wat.jpg',
        rating: 4.9
      },
      {
        id: 1004,
        name: 'Gourmet Burger',
        description: 'Juicy beef patty with fresh vegetables and special sauce.',
        price: 95,
        category: 'Main Dishes',
        image_url: '/assets/burger.jpg',
        rating: 4.6
      },
      {
        id: 1005,
        name: 'Margherita Pizza',
        description: 'Classic Italian pizza with fresh mozzarella and basil.',
        price: 140,
        category: 'Main Dishes',
        image_url: '/assets/pizza.jpg',
        rating: 4.7
      },
      {
        id: 1006,
        name: 'Fresh Beverages',
        description: 'Refreshing drinks including fresh juices and traditional beverages.',
        price: 40,
        category: 'Drinks',
        image_url: '/assets/Drinks.jpg',
        rating: 4.5
      }
    ];

    try {
      for (const item of defaultFoodItems) {
        await pool.execute(
          'INSERT INTO food_items (id, name, description, price, category, image_url, rating, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE image_url = VALUES(image_url), name = VALUES(name), description = VALUES(description), price = VALUES(price), category = VALUES(category), rating = VALUES(rating)',
          [item.id, item.name, item.description, item.price, item.category, item.image_url, item.rating, 1]
        );
      }
      logger.success('Default food items created/updated with images');
    } catch (error) {
      logger.info('Default food items creation skipped');
    }

    logger.success('All database migrations completed successfully!');

  } catch (error) {
    logger.error('Database migration failed:', error);
    throw error;
  }
};

module.exports = { createTables };
