const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const logger = require('../utils/logger');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.food_item_id').isInt({ min: 1 }).withMessage('Invalid food item ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('delivery_name').trim().isLength({ min: 2 }).withMessage('Delivery name is required'),
  body('delivery_phone').trim().isLength({ min: 8 }).withMessage('Delivery phone is required'),
  body('delivery_address').trim().isLength({ min: 5 }).withMessage('Delivery address is required'),
  body('payment_method').isIn(['cash', 'card', 'mobile']).withMessage('Invalid payment method')
];

// POST /api/orders - Create new order (Guest or Customer)
router.post('/', orderValidation, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    console.log('Received order data:', JSON.stringify(req.body, null, 2));
    
    await connection.beginTransaction();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      items,
      delivery_name,
      delivery_phone,
      delivery_address,
      payment_method,
      notes
    } = req.body;

    const itemIds = items.map((item) => item.food_item_id);
    const placeholders = itemIds.map(() => '?').join(', ');
    const [foodRows] = await connection.execute(
      `SELECT id, price, stock_status, is_active FROM food_items WHERE id IN (${placeholders})`,
      itemIds
    );
    const foodById = new Map(foodRows.map((food) => [food.id, food]));

    for (const item of items) {
      const food = foodById.get(item.food_item_id);
      if (!food || !food.is_active) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Food item ${item.food_item_id} is not available`
        });
      }

      if (food.stock_status === 'Out of Stock') {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Food item ${item.food_item_id} is out of stock`
        });
      }
    }

    // Calculate total amount from trusted database prices
    let totalAmount = 0;
    for (const item of items) {
      const food = foodById.get(item.food_item_id);
      totalAmount += parseFloat(food.price) * item.quantity;
    }

    const deliveryFee = 45.00;
    const finalTotal = totalAmount + deliveryFee;

    // Get user ID if authenticated, otherwise null for guest orders
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (error) {
        // Invalid token, continue as guest
        console.log('Invalid token, processing as guest order');
      }
    }

    // Create order
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, delivery_fee, delivery_name, delivery_phone, delivery_address, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, finalTotal, deliveryFee, delivery_name, delivery_phone, delivery_address, payment_method, notes || null]
    );

    const orderId = orderResult.insertId;

    // Add order items
    for (const item of items) {
      const food = foodById.get(item.food_item_id);
      await connection.execute(
        'INSERT INTO order_items (order_id, food_item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.food_item_id, item.quantity, food.price]
      );
    }

    await connection.commit();

    const logMessage = userId 
      ? `Order created: #${orderId} by user ID ${userId}`
      : `Guest order created: #${orderId} for ${delivery_name}`;
    logger.success(logMessage);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        id: orderId,
        total_amount: finalTotal,
        delivery_fee: deliveryFee,
        status: 'pending'
      }
    });

  } catch (error) {
    await connection.rollback();
    logger.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    connection.release();
  }
});

// GET /api/orders/track/:id - Track an order by ID for logged-in customers
router.get('/track/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await pool.execute(
      `SELECT 
        o.*,
        GROUP_CONCAT(
          JSON_OBJECT(
            'food_item_id', oi.food_item_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'name', f.name,
            'image_url', f.image_url
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN food_items f ON oi.food_item_id = f.id
      WHERE o.id = ? AND o.user_id = ?
      GROUP BY o.id`,
      [id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = {
      ...orders[0],
      items: orders[0].items ? JSON.parse(`[${orders[0].items}]`) : []
    };

    res.json({
      success: true,
      message: 'Order tracking retrieved successfully',
      data: order
    });

  } catch (error) {
    logger.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/orders - Get user's orders (Customer only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT 
        o.*,
        GROUP_CONCAT(
          JSON_OBJECT(
            'food_item_id', oi.food_item_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'name', f.name
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN food_items f ON oi.food_item_id = f.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    // Parse the items JSON
    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.items ? JSON.parse(`[${order.items}]`) : []
    }));

    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: formattedOrders
    });

  } catch (error) {
    logger.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/orders/:id - Get specific order (Customer only)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await pool.execute(
      `SELECT 
        o.*,
        GROUP_CONCAT(
          JSON_OBJECT(
            'food_item_id', oi.food_item_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'name', f.name
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN food_items f ON oi.food_item_id = f.id
      WHERE o.id = ? AND o.user_id = ?
      GROUP BY o.id`,
      [id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = {
      ...orders[0],
      items: orders[0].items ? JSON.parse(`[${orders[0].items}]`) : []
    };

    res.json({
      success: true,
      message: 'Order retrieved successfully',
      data: order
    });

  } catch (error) {
    logger.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
