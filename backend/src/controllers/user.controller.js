import { userUpdateValidation, userValidation } from "../validations/user.validation.js"
import { encrypt } from "../utils/bcrypt.js"
import prisma from "../utils/client.js"
import { logger } from "../utils/winston.js"
import { compare } from "bcrypt"
import { generateAccessToken, generateRefreshToken, parseJwt, verifyRefreshToken } from "../utils/jwt.js"

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

export const updateUser = async (req, res) => {
    const user = await prisma.users.findUnique({
        where:{id: Number(req.params.id)}
    })

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            result: null
        })
    }

    const {error, value} = userUpdateValidation(req.body)

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            result: null
        })
    }

    let pass = user.password
    if (value.password && value.password.length > 0) {
        pass = encrypt(value.password)
    }

    try {
        const result = await prisma.users.update({
            where: {
                id: Number(req.params.id)
            },

            data: {
                name: value.name,         
                username: value.username,
                password: pass,
                role: value.role
            }
        })

        result.password = "xxxxxxxxxxxxxxxxxxxx"
        return res.status(200).json({
            message: "success",
            result
        })
    } catch (error) {
        logger.error(
            "controllers/user.controller.js:updateUser - " + error.message
        )
        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const result = await prisma.users.findUnique({
            where: {
                username: req.body.username,
            }
        })
        if (result) {
            if (compare(req.body.password, result.password)) {
                result.password = "xxxxxxxxxxxxxxxxxxxx"
                const accessToken = generateAccessToken(result)
                const refreshToken = generateRefreshToken(result)
                return res.status(200).json({
                    message: "Login success",
                    result,
                    accessToken,
                    refreshToken
                })
            } else {
                return res.status(500).json({
                    message: "Password not match",
                    result: null
                })
            }
        } else {
            return res.status(500).json({
                message: "User not found",
                result: null
            })
        }
    } catch (error) {
        logger.error("controllers/user.controller.js:loginUser - " + error.message)
        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const result = await prisma.users.delete({
            where: {
                id: Number(req.params.id)
            }
        })
        result.password = "xxxxxxxxxxxxxxxxxx"
        return res.status(200).json({
            message: "success",
            result
        })
    } catch (error) {
        logger.error("controllers/user.controller.js:deleteUser - " + error.message)
        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
}

export const getAllUser = async (req, res) => {
    try {
        const result = await prisma.users.findMany({})
        return res.status(200).json({
            message: "success",
            result
        })
    } catch (error) {
        logger.error("controllers/user.controller.js - " + error.message)
        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const result = await prisma.users.findUnique({
            where: {
                id: Number(req.params.id)
            }
        })
        result.password = "xxxxxxxxxxxxxxxxxx"
        return res.status(200).json({
            message: "success",
            result
        })
    } catch (error) {
        logger.error(
            "controllers/user.controller.js:getUserById - " + error.message
        )
        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
}

export const setRefreshToken = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"]
        const token = authHeader && authHeader.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                message: "Verify token failed",
                result: null
            })
        }
        const verify = verifyRefreshToken(token)

        if (!verify) {
            return res.status(401).json({
                message: "Verify token failed",
                result: null
            })
        }

        let data = await parseJwt(token)
        const user = await prisma.users.findUnique({
            where: {
                username: data.username,
            }
        })

        if (!user) {
            return res.status(401).json({
                message: "User not found",
                result: null
            })
        } else {
            user.password = "xxxxxxxxxxxxxxxxx"
            const accessToken = generateAccessToken(user)
            const refreshToken = generateRefreshToken(user)
            return res.status(200).json({
                message: "Refresh success",
                result: user,
                accessToken,
                refreshToken
            })
        }
    } catch (error) {
        logger.error("controllers/user.controller.js:setRefreshToken - " + error.message)
        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
}