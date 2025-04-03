const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    helpfulFeatures: {
        type: [String], // Array of selected features
        enum: ["careerInfo", "counselorProfiles", "aptitudeTest", "scheduling"],
        default: []
    },
    heardFrom: {
        type: String,
        enum: ["search", "social", "friend", "school", "other"],
        required: true
    },
    feedback: {
        type: String,
        required: true,
        trim: true
    },
    useful: {
        type: String,
        enum: ["yes", "somewhat", "no"],
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("Feedback", feedbackSchema);
