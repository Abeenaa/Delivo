const axios = require('axios');

const CHAPA_BASE_URL = 'https://api.chapa.co/v1';
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

/**
 * Initialize a Chapa payment transaction.
 * Returns the Chapa checkout URL to redirect the user to.
 */
const initializePayment = async ({
  amount,
  currency = 'ETB',
  email,
  first_name,
  last_name,
  phone_number,
  tx_ref,
  callback_url,
  return_url,
  customization = {}
}) => {
  const response = await axios.post(
    `${CHAPA_BASE_URL}/transaction/initialize`,
    {
      amount: amount.toFixed(2),
      currency,
      email,
      first_name,
      last_name,
      phone_number,
      tx_ref,
      callback_url,
      return_url,
      customization: {
        title: customization.title || 'Delivo — Food Delivery',
        description: customization.description || 'Pay for your food order',
        logo: customization.logo || ''
      }
    },
    {
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
};

/**
 * Verify a completed Chapa transaction by tx_ref.
 * Returns the transaction data if successful.
 */
const verifyPayment = async (tx_ref) => {
  const response = await axios.get(
    `${CHAPA_BASE_URL}/transaction/verify/${tx_ref}`,
    {
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`
      }
    }
  );

  return response.data;
};

module.exports = { initializePayment, verifyPayment };
