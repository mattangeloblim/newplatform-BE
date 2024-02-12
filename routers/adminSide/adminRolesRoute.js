const express = require("express")
const router = express.Router()
const Authentication = require("../../middlewares/AuthMiddleware")
const rolesController = require("../../controllers/adminController");

router.post("/edit/permissions", Authentication, rolesController.editRolePermissions);

module.exports = router

