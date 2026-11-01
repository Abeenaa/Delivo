const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { initializePayment, verifyPayment } = require('../utils/chapa');
const { verifyToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payment/initialize
// Called after the order is created (with payment_method = 'chapa').
// Creates a Chapa checkout session and returns the hosted URL.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/initialize', verifyToken, async (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
    return res.status(400).json({ success: false, message: 'order_id is required' });
  }

  try {
    // Fetch the order and the user from DB
    const [orders] = await pool.execute(
      'SELECT o.*, u.email, u.name FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = ? AND o.user_id = ?',
      [order_id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];

    // Don't allow double payment
    if (order.payment_status === 'paid') {
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    // Build a unique transaction reference
    const tx_ref = `delivo-${order_id}-${uuidv4().slice(0, 8)}`;

    // Persist the tx_ref on the order so we can match it in the webhook
    await pool.execute(
      'UPDATE orders SET tx_ref = ? WHERE id = ?',
      [tx_ref, order_id]
    );

    // Split delivery_name into first / last for Chapa
    const nameParts = (order.delivery_name || 'Guest User').trim().split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ') || 'Customer';

    const chapaRes = await initializePayment({
      amount: parseFloat(order.total_amount),
      currency: 'ETB',
      email: order.email || `guest-${order_id}@delivo.com`,
      first_name,
      last_name,
      phone_number: order.delivery_phone,
      tx_ref,
      // Chapa calls this URL (server-side) when payment completes
      callback_url: `${SERVER_URL}/api/payment/webhook`,
      // Chapa redirects the user here after the hosted page
      return_url: `${CLIENT_URL}/payment/verify?tx_ref=${tx_ref}&order_id=${order_id}`,
      customization: {
        title: 'Delivo Food Delivery',
        description: `Order #${order_id} — ETB ${parseFloat(order.total_amount).toFixed(2)}`
      }
    });

    if (chapaRes.status !== 'success') {
      logger.error('Chapa initialization failed:', chapaRes);
      return res.status(502).json({ success: false, message: 'Payment gateway error', detail: chapaRes.message });
    }

    logger.success(`Chapa session created for order #${order_id}: ${tx_ref}`);

    return res.json({
      success: true,
      data: {
        checkout_url: chapaRes.data.checkout_url,
        tx_ref
      }
    });

  } catch (error) {
    logger.error('Payment initialize error:', error.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payment/verify?tx_ref=...&order_id=...
// Called by the FRONTEND after Chapa redirects back.
// We verify with Chapa and update the order.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/verify', verifyToken, async (req, res) => {
  const { tx_ref, order_id } = req.query;

  if (!tx_ref || !order_id) {
    return res.status(400).json({ success: false, message: 'tx_ref and order_id are required' });
  }

  try {
    // Verify with Chapa
    const chapaRes = await verifyPayment(tx_ref);

    if (chapaRes.status !== 'success' || chapaRes.data?.status !== 'success') {
      logger.error('Chapa verification failed:', chapaRes);
      return res.json({
        success: false,
        payment_status: 'failed',
        message: chapaRes.message || 'Payment not completed'
      });
    }

    // Mark the order as paid and confirmed
    await pool.execute(
      `UPDATE orders 
       SET payment_status = 'paid', status = 'confirmed', tx_ref = ?
       WHERE id = ? AND user_id = ?`,
      [tx_ref, order_id, req.user.id]
    );

    logger.success(`Payment verified for order #${order_id} (${tx_ref})`);

    return res.json({
      success: true,
      payment_status: 'paid',
      message: 'Payment successful',
      data: { order_id: parseInt(order_id), tx_ref }
    });

  } catch (error) {
    logger.error('Payment verify error:', error.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payment/webhook
// Chapa calls this when payment completes (server-to-server).
// This is the reliable backup in case the redirect return_url fails.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/webhook', async (req, res) => {
  try {
    const { tx_ref, status } = req.body;

    logger.info(`Webhook received: tx_ref=${tx_ref} status=${status}`);

    if (status === 'success' && tx_ref) {
      // Verify with Chapa before trusting
      const chapaRes = await verifyPayment(tx_ref);

      if (chapaRes.status === 'success' && chapaRes.data?.status === 'success') {
        await pool.execute(
          `UPDATE orders 
           SET payment_status = 'paid', status = 'confirmed'
           WHERE tx_ref = ? AND payment_status != 'paid'`,
          [tx_ref]
        );
        logger.success(`Webhook: Order marked as paid for tx_ref=${tx_ref}`);
      }
    }

    // Always return 200 to Chapa so it stops retrying
    return res.status(200).json({ message: 'Webhook received' });

  } catch (error) {
    logger.error('Webhook error:', error.message);
    return res.status(200).json({ message: 'Webhook received with errors' });
  }
});

module.exports = router;
