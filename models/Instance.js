const mongoose = require('mongoose');

const InstanceSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  incusId: {
    type: String,
    required: true,
    unique: true,
  },
  cpu: {
    type: Number,
    required: true,
  },
  memory: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  ssh_port: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['running', 'stopped', 'pending', 'error'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Instance', InstanceSchema);
