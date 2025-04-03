const express = require('express');
const Counselor = require('../models/Counselor');

const router = express.Router();

router.post('/addCounselor', async (req, res) => {
    console.log("Add Counselor endpoint hit");  // Debug log
    try {
        const { name, field, contact, experience, specialization, languages} = req.body;
        if (!name || !field ) {
            return res.status(400).json({ error: "name and field required" });
        }
        const newCounselor = new Counselor({ name, field, contact, experience, specialization, languages })
        
        await newCounselor.save();

        console.log("Counselor added:", newCounselor);
        res.status(201).json({ message: 'Counselor added successfully' });
    } catch (error) {
        console.error("Error addding Counselor:", error);
        res.status(500).json({ error: 'Error adding Counselor' });
    }
});

router.get('/getCounselors', async (req, res) => {
    console.log("Get Counselors endpoint hit");
    try {
        const counselors = await Counselor.find(); // Fetch all records
        res.status(200).json(counselors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/deleteCounselors/:id', async (req, res) => {
    console.log("Delete Counselor endpoint hit");
    try {
        const { id } = req.params;
        const deletedCounselor = await Counselor.findByIdAndDelete(id);

        if (!deletedCounselor) {
            return res.status(404).json({ message: "Counselor not found" });
        }

        res.status(200).json({ message: "Counselor deleted successfully", deletedCounselor });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error.message);
    }
});

module.exports = router;