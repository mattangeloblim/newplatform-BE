// adminService.js

const AdminModel = require("../models/AdminModel")
const Roles = require("../models/RolesModel");
const bcrypt = require('bcrypt');

async function authenticateAdmin(username, password) {
    const admin = await AdminModel.findOne({ where: { username } });

    if (!admin) {
        throw new Error("Invalid Username");
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
        throw new Error("Invalid Password");
    }

    return { username: admin.username, role: admin.role };
}

async function editRolePermissions(roleName, newPermissions) {
    const role = await Roles.findOne({ where: { role_name: roleName } });

    if (!role) {
        throw new Error("Role not found");
    }

    if (!role.permissions || !Array.isArray(role.permissions)) {
        role.permissions = [];
    }

    role.permissions = role.permissions.concat(newPermissions);

    await role.save();

    return role;
}


module.exports = {
    authenticateAdmin,
    editRolePermissions
};
