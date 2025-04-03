const { json } = require('body-parser');
const mongoose = require('mongoose');


// Define a Candidate schema and model
const candidateSchema = new mongoose.Schema({
    name: String,
    scores: {
      verbal: Number,
      logical: Number,
      quantitative: Number,
      technical: Number
    },
    recommendedCareer: String,
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
  