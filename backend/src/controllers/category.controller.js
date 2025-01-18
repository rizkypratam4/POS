import prisma from "../utils/client.js"
import { logger } from "../utils/winston.js"
import { categoryValidation } from "../validations/category.validation"

export const getAllCategory = async (req, res) => {
    try {
        const result = await prisma.categories.findMany({
            orderBy: {
                id: "asc"
            }
        })
        return res.status(200).json({
            message: "success",
            result
        })
    } catch (error) {
        logger.error(
            "controllers/category.controller.js:getAllCategory - " + error.message 
        )
        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const result = await prisma.categories.findUnique({
            where: {
                id: Number(req.params.id),
            }
        })
        return res.status(200).json({
            message: "success",
            result
        })
    } catch (error) {
        logger.error(
            "controllers/category.controller.js:getCategoryById - " + error.message
        )
        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
}

export const createCategory = async (req, res) => {
    const { error, value } = categoryValidation(req.body)

    if(error != null) {
        return res.status(400).json({
            message: error.details[0].message,
            result: null
        })
    }
    try {
        const result = await prisma.categories.create({
            data: {
                name: value.name
            }
        })
        return res.status(200).json({
            message: "success",
            result
        })
    } catch (error) {
        logger.error(
            "controllers/category.controller.js:createCategory - " + error.message
        )
        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
}

export const updateCategory = async (req, res) => {
    const {error, value} = categoryValidation(req.body)

    if(error != null){
        return res.status(400).json({
            message: error.details[0].message,
            result: null
        })
    }

    try {
        const result = await prisma.categories.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name: value.name
            }
        })
        return res.status(200).json({
            message: "success",
            result
        })
    } catch (error) {
        logger.error(
            "controllers/category.controller.js:updateCategory - " + error.message
        )
        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const result = await prisma.categories.delete({
            where: {
                id: Number(req.params.id)
            }
        })
        return res.status(200).json({
            message: "success",
            result
        })
    } catch (error) {
        logger.error(
            "controllers/category.controller.js:deleteCategory - " + error.message
        )
        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
}