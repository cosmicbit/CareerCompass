const express = require("express");
const Booking = require("../models/Booking");
const Slot = require("../models/Slot");

const router = express.Router();

// 📌 Book a session (prevent duplicate bookings)
router.post("/book", async (req, res) => {
    console.log("Book endpoint Hit");
    try {
        const { userId, counselorId, slotId, notes } = req.body;

        // Check if the slot is already booked
        const slot = await Slot.findById(slotId);
        if (!slot || slot.isBooked) {
            return res.status(400).json({ message: "Slot not available" });
        }

        // Prevent user from booking the same slot again
        const existingBooking = await Booking.findOne({ user: userId, slot: slotId });
        if (existingBooking) {
            return res.status(400).json({ message: "You have already booked this slot" });
        }

        // Create booking
        const booking = new Booking({
            user: userId,
            counselor: counselorId,
            slot: slotId,
            notes
        });

        await booking.save();

        // Mark slot as booked
        slot.isBooked = true;
        await slot.save();

        res.status(201).json({ message: "Booking confirmed", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


// 📌 Get all bookings for a user
router.get("/user/:userId", async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .populate("counselor slot");

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings" });
    }
});

// 📌 Get all bookings for a counselor
router.get("/counselor/:counselorId", async (req, res) => {
    try {
        const bookings = await Booking.find({ counselor: req.params.counselorId })
            .populate("user slot");

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings" });
    }
});

// 📌 Cancel a booking
router.put("/cancel/:bookingId", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = "cancelled";
        await booking.save();

        // Free up the slot
        await Slot.findByIdAndUpdate(booking.slot, { isBooked: false });

        res.json({ message: "Booking cancelled, slot is now available", booking });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling booking" });
    }
});

// 📌 Get all bookings (Admin)
router.get("/all", async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user counselor slot");

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings" });
    }
});

// 📌 Cancel a booking (Admin)
router.put("/admin/cancel/:bookingId", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = "cancelled";
        await booking.save();

        // Free up the slot
        await Slot.findByIdAndUpdate(booking.slot, { isBooked: false });

        res.json({ message: "Booking cancelled by admin", booking });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling booking" });
    }
});
// 📌 Update booking status (Admin)
router.put("/admin/update/:bookingId", async (req, res) => {
    try {
        const { status } = req.body;
        if (!["confirmed", "cancelled", "completed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.bookingId,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json({ message: `Booking marked as ${status}`, booking });
    } catch (error) {
        res.status(500).json({ message: "Error updating booking status" });
    }
});


module.exports = router;
