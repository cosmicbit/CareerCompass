const mongoose = require('mongoose');

const CounselorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  field: { type: String, required: true },
  contact: { type: String },
  experience: { type: String },
  specialization: { type: String },
  languages: { type: [String] },  // Change to array for filtering/searching
  timezone: { type: String, default: 'Asia/Kolkata' }, // For slot display logic

  bio: { type: String },

  // Reference to slots (1 counselor -> many slots)
  slots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Slot' }]
});

module.exports = mongoose.model('Counselor', CounselorSchema);
