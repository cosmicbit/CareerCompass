const mongoose = require('mongoose')
const SlotSchema = new mongoose.Schema({
    counselor: { type: mongoose.Schema.Types.ObjectId, ref: 'Counselor', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    sessionType: { type: String, enum: ['virtual', 'in_person'], default: 'virtual' },
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional
  });
  
module.exports = mongoose.model('Slot', SlotSchema);
  