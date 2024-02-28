const express = require("express")
const router = express.Router()
const Token = require("../../middlewares/AuthMiddleware")
const RolesModel = require("../../models/RolesModel")

router.get("/admin/access", Token, async (req, res) => {
    try {
        const userRole = req.user.role

        const Permissions = await RolesModel.findOne({
            where: {
                role_name: userRole
            },
            attributes: ['permissions']
        })

        res.json(Permissions)

    } catch (error) {
        console.error(error)
    }
})

module.exports = router