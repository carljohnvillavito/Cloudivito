const Paymongo = require('paymongo');
const User = require('../models/User');
require('dotenv').config();

const paymongo = new Paymongo(process.env.PAYMONGO_SECRET_KEY);

const plans = {
    'Basic': { amount: 7500, name: 'Basic Plan' }, // Amount in centavos
    'Pro': { amount: 17500, name: 'Pro Plan' },
    'Business': { amount: 25000, name: 'Business Plan' },
};

// @desc    Create a PayMongo checkout session
// @route   POST /api/billing/create-checkout-session
// @access  Private
exports.createCheckoutSession = async (req, res) => {
    const { planId } = req.body; // e.g., 'Basic', 'Pro'
    const user = await User.findById(req.user.id);

    if (!plans[planId]) {
        return res.status(400).json({ msg: 'Invalid plan selected.' });
    }

    try {
        const session = await paymongo.checkoutSessions.create({
            data: {
                attributes: {
                    billing: {
                        name: user.username,
                        email: user.email,
                    },
                    line_items: [{
                        currency: 'PHP',
                        amount: plans[planId].amount,
                        name: plans[planId].name,
                        quantity: 1,
                    }],
                    payment_method_types: ['gcash'],
                    success_url: `${process.env.CLIENT_URL}/dashboard?status=success`,
                    cancel_url: `${process.env.CLIENT_URL}/plans?status=cancelled`,
                    // We link the payment to our user for the webhook
                    metadata: {
                        userId: user.id,
                        plan: planId
                    }
                }
            }
        });

        res.json({ checkout_url: session.data.attributes.checkout_url });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error creating checkout session.');
    }
};


// @desc    Handle PayMongo webhook events
// @route   POST /api/billing/webhook
// @access  Public
exports.handleWebhook = async (req, res) => {
    // 1. Verify the signature
    const sig = req.headers['paymongo-signature-v1'];
    const payload = JSON.stringify(req.body);
    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;

    try {
        paymongo.webhooks.constructEvent(payload, sig, webhookSecret);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
    }
    
    // 2. Handle the event
    const event = req.body.data;
    const eventType = event.attributes.type;
    
    // We are interested in successful payments
    if (eventType === 'payment.succeeded') {
        const paymentData = event.attributes.data;
        // Metadata contains the user info we passed earlier
        const metadata = paymentData.attributes.metadata;

        if (metadata && metadata.userId) {
            console.log(`Payment succeeded for user: ${metadata.userId}`);
            
            // 3. Update user's plan in the database
            const newRenewalDate = new Date();
            newRenewalDate.setMonth(newRenewalDate.getMonth() + 1); // Set renewal to 1 month from now

            await User.findByIdAndUpdate(metadata.userId, {
                plan: metadata.plan,
                subscriptionStatus: 'active',
                subscriptionRenewalDate: newRenewalDate,
                // You can store more IDs here if needed
            });
        }
    }

    res.sendStatus(200);
};
