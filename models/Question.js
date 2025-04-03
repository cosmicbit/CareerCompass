const { json } = require('body-parser');
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    category: {type: String, required: true},
    question: { type: String, required: true },
    options: {
        A: { type: String, required: true },
        B: { type: String, required: true },
        C: { type: String, required: true },
        D: { type: String, required: true }
    },
    answer: { 
        type: String, 
        required: true, 
        enum: ['A', 'B', 'C', 'D']  // Ensuring the answer is one of these values
    }
});

module.exports = mongoose.model('Question', QuestionSchema);
