const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const logger = require('../utils/logger');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/orders - Get all orders (Admin only)
router.get('/orders', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT 
        o.*,
        COALESCE(u.name, 'Guest Customer') as customer_name,
        u.email as customer_email,
        GROUP_CONCAT(
          JSON_OBJECT(
            'food_item_id', oi.food_item_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'name', f.name
          )
        ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN food_items f ON oi.food_item_id = f.id
      GROUP BY o.id
      ORDER BY o.created_at DESC`
    );

    // Parse the items JSON
    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.items ? JSON.parse(`[${order.items}]`) : []
    }));

    res.json({
      success: true,
      message: 'All orders retrieved successfully',
      data: formattedOrders
    });

  } catch (error) {
    logger.error('Admin get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/admin/orders/:id - Update order status (Admin only)
router.put('/orders/:id', verifyToken, verifyAdmin, [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const [result] = await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    logger.success(`Order #${id} status updated to ${status} by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    logger.error('Admin update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/admin/stats - Get dashboard statistics (Admin only)
router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Get total orders
    const [totalOrdersResult] = await pool.execute('SELECT COUNT(*) as total FROM orders');
    const totalOrders = totalOrdersResult[0].total;

    // Get total revenue
    const [totalRevenueResult] = await pool.execute('SELECT SUM(total_amount) as revenue FROM orders WHERE status != "cancelled"');
    const totalRevenue = totalRevenueResult[0].revenue || 0;

    // Get total customers
    const [totalCustomersResult] = await pool.execute('SELECT COUNT(*) as total FROM users WHERE role = "customer"');
    const totalCustomers = totalCustomersResult[0].total;

    // Get total food items
    const [totalFoodItemsResult] = await pool.execute('SELECT COUNT(*) as total FROM food_items WHERE is_active = TRUE');
    const totalFoodItems = totalFoodItemsResult[0].total;

    // Get orders by status
    const [ordersByStatus] = await pool.execute(
      'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
    );

    res.json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        totalOrders,
        totalRevenue: parseFloat(totalRevenue),
        totalCustomers,
        totalFoodItems,
        ordersByStatus
      }
    });

  } catch (error) {
    logger.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
