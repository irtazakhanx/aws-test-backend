const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  businessDetails: { type: String, required: true },
  monthlyRevenue: { type: String, required: true },
  marketingSpend: { type: String, required: true },
  averageLTV: { type: String, required: true },
  startTimeline: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  appointmentDate: { type: String },
  appointmentTime: { type: String },
  appointmentTimezone: { type: String }
});

module.exports = mongoose.model('Lead', leadSchema);
