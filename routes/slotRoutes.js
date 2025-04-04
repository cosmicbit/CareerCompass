const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");
const Counselor = require("../models/Counselor");
const Booking = require("../models/Booking"); // Import Booking model

router.post("/addSlots", async (req, res) => {
    console.log("Add Slot Endpoint Hit");
    try {
        const { counselorId, startTime, endTime, sessionType } = req.body;

        if (!counselorId || !startTime || !endTime || !sessionType) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newSlot = new Slot({ counselor: counselorId, startTime, endTime, sessionType });
        await newSlot.save();

        await Counselor.findByIdAndUpdate(counselorId, { $push: { slots: newSlot._id } });

        res.status(201).json({ message: "Slot added successfully", slot: newSlot });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

  
// GET /api/counselors/:id/slots?date=YYYY-MM-DD
router.get('/counselors/:id/slots', async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: "Date query parameter is required" });
        }

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Fetch all slots for the counselor on the given date
        const allSlots = await Slot.find({
            counselor: id,
            startTime: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ startTime: 1 });

        // Fetch booked slot IDs
        const bookedSlots = await Booking.find({ counselor: id })
            .distinct("slot"); // Get array of booked slot IDs

        // Filter out booked slots
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot._id.toString()));

        res.json(availableSlots);
    } catch (error) {
        console.error("Error fetching slots:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/getAvailable/:counselorId", async (req, res) => {
    console.log("Get Available Slots for counselor endpoint hit");
    try {
        const { counselorId } = req.params;
        const date = new Date(); // Get current date

        // Get the start and end of the day for proper filtering
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const availableSlots = await Slot.find({
            counselor: counselorId,
            isBooked: false
        }).sort({ startTime: 1 });

        res.json(availableSlots);
    } catch (error) {
        console.error("Error fetching available slots:", error);
        res.status(500).json({ error: "Server error" });
    }
});


router.get("/getAll/:counselorId", async (req, res) => {
    console.log("Get Slot for counselor endpoint hit");
    try {
        const { counselorId } = req.params;

        const slots = await Slot.find({ counselor: counselorId })
            .sort({ startTime: 1 })
            .populate("counselor", "name field"); // Optional: Include counselor details

        res.status(200).json({ slots });
    } catch (error) {
        console.error("Error fetching slots:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;