const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleWebhook } = require('../controllers/billingController');
const authMiddleware = require('../middleware/authMiddleware');


// Create checkout session (protected)
router.post('/create-checkout-session', authMiddleware, createCheckoutSession);

// Webhook for PayMongo (public)
// Use express.raw() to get the raw body needed for signature verification
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

module.exports = router;
