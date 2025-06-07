const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  message: String,
  isRead: { type: Boolean, default: false },
  timestamp: Date,
});

export const Notification = mongoose.model('Notification', notificationSchema);