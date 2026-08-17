const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  type: { type: String, required: true }, // e.g., 'Status Update', 'New Assignment'
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true }); // timestamps automatically adds the required 'createdAt' field

module.exports = mongoose.model('Notification', notificationSchema);