const express = require('express');
const Feedback = require('../models/Feedback'); // Ensure the correct model is used

const router = express.Router();

router.post('/addFeedback', async (req, res) => {
    console.log("Add Feedback endpoint hit");

    try {
        const { rating, helpfulFeatures, heardFrom, feedback, useful } = req.body;

        // Validate required fields
        if (!rating || !feedback || !heardFrom || !useful) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newFeedback = new Feedback({ rating, helpfulFeatures, heardFrom, feedback, useful });
        await newFeedback.save();
        
        console.log("Feedback added:", newFeedback);
        res.status(201).json({ message: 'Feedback added successfully', feedback: newFeedback });

    } catch (error) {
        console.error("Error adding feedback:", error);

        // Send a valid JSON error response
        res.status(500).json({ error: "Internal server error" });
    }
});


// Get All Feedbacks
router.get('/getFeedbacks', async (req, res) => {
    console.log("Get Feedbacks endpoint hit");

    try {
        const feedbacks = await Feedback.find().sort({ submittedAt: -1 }); // Fetch all records, sorted by latest
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete Feedback
router.delete('/deleteFeedback/:id', async (req, res) => {
    console.log("Delete Feedback endpoint hit");

    try {
        const { id } = req.params;
        const deletedFeedback = await Feedback.findByIdAndDelete(id);

        if (!deletedFeedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        console.log("Deleted Feedback:", deletedFeedback);
        res.status(200).json({ message: "Feedback deleted successfully", deletedFeedback });

    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
