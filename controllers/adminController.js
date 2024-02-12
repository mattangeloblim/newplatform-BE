const adminService = require('../services/adminServices');
const jwt = require('jsonwebtoken');

async function adminLogin(req, res) {
    try {
        const { username, password } = req.body;

        const userData = await adminService.authenticateAdmin(username, password);

        const token = jwt.sign(userData, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: error.message || "Authentication Failed" });
    }
}

async function editRolePermissions(req, res) {
    try {
        const { role_name, newPermissions } = req.body;
        const userRole = req.user.role;

        if (userRole !== "superadmin") {
            return res.status(400).json({ message: "Only superadmin can edit permissions" });
        }

        const role = await adminService.editRolePermissions(role_name, newPermissions);

        res.json({ message: "Permissions added successfully", role });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    adminLogin,
    editRolePermissions
};