import { userValidation } from "../validations/user.validation.js"
import { encrypt } from "../utils/bcrypt.js"
import prisma from "../utils/client.js"
import { logger } from "../utils/winston.js"

export const createUser = async (req, res) => { 
    const {error, value} = userValidation(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            result: null
        })
    }
    try {
        const result = await prisma.users.create({
            data: {
                name: value.name,
                username: value.username,
                password: encrypt(value.password),
                role: value.role
            }
        })
        result.password = "xxxxxxxxxxxxxxxxxx"
        return res.status(200).json({
            message: "success",
            result
        })
    } catch (error) {
        logger.error(
            "controllers/user.controller.js:createUser -" + error.message
        )
        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
}