const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links to the User who made it
  title: { type: String },
  description: { type: String },
  category: { type: String },
  subCategory: { type: String },
  imageUrl: { type: String, required: true }, // Store the Cloudinary URL here, NOT the binary image data
  
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String },
    ward: { type: String }
  },
  
  aiAnalysis: {
    detectedIssue: { type: String },
    confidence: { type: Number },
    severity: { type: String },
    suggestedDepartment: { type: String },
    reasoning: { type: String }
  },
  
  priorityScore: { type: Number },
  status: { 
    type: String, 
    enum: ['Submitted', 'AI Classified', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Reopened'],
    default: 'Submitted'
  },
  
  assignedDepartment: { type: String },
  assignedOfficial: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Duplicate tracking
  duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
  duplicateCount: { type: Number, default: 0 },
  
  sla: {
    deadline: { type: Date },
    breached: { type: Boolean, default: false }
  },
  
  resolution: {
    imageUrl: { type: String }, // "After" photo Cloudinary URL
    comment: { type: String },
    verified: { type: Boolean },
    aiConfidence: { type: Number }
  },
  
  citizenRating: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);