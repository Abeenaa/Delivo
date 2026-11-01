const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { initializePayment, verifyPayment } = require('../utils/chapa');
const { verifyToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

router.post('/initialize', verifyToken, async (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
    return res.status(400).json({ success: false, message: 'order_id is required' });
  }

  try {
    const [orders] = await pool.execute(
      'SELECT o.*, u.email, u.name FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = ? AND o.user_id = ?',
      [order_id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];

    if (order.payment_status === 'paid') {
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    const tx_ref = `delivo-${order_id}-${uuidv4().slice(0, 8)}`;

    await pool.execute('UPDATE orders SET tx_ref = ? WHERE id = ?', [tx_ref, order_id]);

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
      callback_url: `${SERVER_URL}/api/payment/webhook`,
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

router.get('/verify', verifyToken, async (req, res) => {
  const { tx_ref, order_id } = req.query;

  if (!tx_ref || !order_id) {
    return res.status(400).json({ success: false, message: 'tx_ref and order_id are required' });
  }

  try {
    const chapaRes = await verifyPayment(tx_ref);

    if (chapaRes.status !== 'success' || chapaRes.data?.status !== 'success') {
      logger.error('Chapa verification failed:', chapaRes);
      return res.json({
        success: false,
        payment_status: 'failed',
        message: chapaRes.message || 'Payment not completed'
      });
    }

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

router.post('/webhook', async (req, res) => {
  try {
    const { tx_ref, status } = req.body;

    logger.info(`Webhook received: tx_ref=${tx_ref} status=${status}`);

    if (status === 'success' && tx_ref) {
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

    return res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    logger.error('Webhook error:', error.message);
    return res.status(200).json({ message: 'Webhook received with errors' });
  }
});

module.exports = router;
