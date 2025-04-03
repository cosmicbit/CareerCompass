const mongoose = require('mongoose');

const CounselorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    field: {type: String, required: true},
    contact: { type: String},
    experience: { type: String},
    specialization: {type: String},
    languages: {type: String}
});

module.exports = mongoose.model('Counselor', CounselorSchema);
