const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  action: { type: String, required: true }, // e.g., "Created", "AI Classified", "Resolved"
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The admin/official who did it, or null if AI did it
  oldStatus: { type: String },
  newStatus: { type: String }
}, { timestamps: true }); // timestamps automatically acts as your 'timestamp' field

module.exports = mongoose.model('AuditLog', auditLogSchema);