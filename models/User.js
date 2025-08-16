const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    enum: ['Free', 'Basic', 'Pro', 'Business'],
    default: 'Free',
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'past_due'],
    default: 'active',
  },
  paymongoCustomerId: {
    type: String,
  },
  paymongoSubscriptionId: {
    type: String,
  },
  subscriptionRenewalDate: {
    type: Date,
  },
  instances: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instance'
  }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
