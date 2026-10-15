const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();

// Validation middleware
const foodValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().isLength({ min: 2 }).withMessage('Category is required'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5')
];

// GET /api/foods - Get all food items
router.get('/', async (req, res) => {
  try {
    const [foods] = await pool.execute(
      'SELECT * FROM food_items WHERE is_active = TRUE ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      message: 'Food items retrieved successfully',
      data: foods
    });

  } catch (error) {
    logger.error('Get foods error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/foods/:id - Get single food item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [foods] = await pool.execute(
      'SELECT * FROM food_items WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (foods.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    res.json({
      success: true,
      message: 'Food item retrieved successfully',
      data: foods[0]
    });

  } catch (error) {
    logger.error('Get food error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Import middleware
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// POST /api/foods - Create food item (Admin only)
router.post('/', verifyToken, verifyAdmin, foodValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, description, price, category, image_url, rating, stock_status } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO food_items (name, description, price, category, image_url, rating, stock_status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, category, image_url || null, rating || 4.5, stock_status || 'Available', req.user.id]
    );

    logger.success(`Food item created: ${name} by admin ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      data: {
        id: result.insertId,
        name,
        description,
        price,
        category,
        image_url,
        rating: rating || 4.5,
        stock_status: stock_status || 'Available'
      }
    });

  } catch (error) {
    logger.error('Create food error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/foods/:id - Update food item (Admin only)
router.put('/:id', verifyToken, verifyAdmin, foodValidation, async (req, res) => {
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
    const { name, description, price, category, image_url, rating, stock_status } = req.body;

    const [result] = await pool.execute(
      'UPDATE food_items SET name = ?, description = ?, price = ?, category = ?, image_url = ?, rating = ?, stock_status = ? WHERE id = ?',
      [name, description, price, category, image_url || null, rating || 4.5, stock_status || 'Available', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    logger.success(`Food item updated: ${name} by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'Food item updated successfully'
    });

  } catch (error) {
    logger.error('Update food error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/foods/:id - Delete food item (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'UPDATE food_items SET is_active = FALSE WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    logger.success(`Food item deleted: ID ${id} by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'Food item deleted successfully'
    });

  } catch (error) {
    logger.error('Delete food error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
