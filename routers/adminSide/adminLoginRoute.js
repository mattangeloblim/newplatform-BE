const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const AdminModel = require("../../models/AdminModel")

router.post("/admin/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await AdminModel.findOne({ where: { username } });

        // Check if admin exists
        if (!admin) {
            return res.status(401).json({ message: "Invalid Username" });
        }

        // Compare the entered password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const role = admin.role;

        // Generate a JWT token with the user's ID and role
        const token = jwt.sign({ username: admin.username, role }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router