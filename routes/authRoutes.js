const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    console.log("Register endpoint hit");  // Debug log
    try {
        const { firstname, lastname, email, phonenumber, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "email and password required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username:email, firstname, lastname, phonenumber, password: hashedPassword, isadmin: false });
        await newUser.save();

        console.log("User created:", newUser);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    console.log("Login endpoint hit");  // Debug log
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }
        
        const user = await User.findOne({ username: email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isAdmin = user.isadmin;
        const token = jwt.sign({ userId: user._id, isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log("User logged in:", email, "Admin status:", isAdmin);

        // ✅ Include userId in the response
        res.json({ token, userId: user._id, isAdmin });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: 'Error logging in' });
    }
});


router.post('/registerAdmin', async (req, res) => {
    console.log("Admin Register endpoint hit");  // Debug log
    try {
        const { firstname, lastname, email, phonenumber, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "email and password required" });
        }
        const admin = await User.findOne({ email });
        if (admin) {
            return res.status(401).json({ error: 'Account already Exists!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new User({ username:email, firstname, lastname, phonenumber, password: hashedPassword, isadmin:true });
        await newAdmin.save();

        console.log("Admin created:", newAdmin);
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error("Error registering admin:", error);
        res.status(500).json({ error: 'Error registering admin' });
    }
});

module.exports = router;
