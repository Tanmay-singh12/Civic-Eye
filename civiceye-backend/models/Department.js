const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Health & Sanitation"
  categories: [{ type: String }],
  officers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  averageResolutionTime: { type: Number, default: 0 },
  activeComplaints: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);

