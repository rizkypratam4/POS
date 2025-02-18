import "dotenv/config"
import { productValidation } from "../validations/product.validation.js"
import prisma from "../utils/client.js"
import { setCode } from "../utils/documentPattern.js"
import { logger } from "../utils/winston.js"
import path from "path"

export const createProduct = async (req, res) => {
    const fileMaxSize = process.env.FILE_MAX_SIZE
    const allowFileExt = process.env.FILE_EXTENSION
    const msgFileSize = process.env.FILE_MAX_MESSAGE

    const { error, value } = productValidation(req.body)
    if (error != null) {
        return res.status(400).json({
            message: error.details[0].message,
            result: null
        })
    }
    if (req.files === null || req.files.file === undefined){
        return res.status(400).json({
            message: "Image cannot be empty",
            result: null
        })
    }
    const file = req.files.file
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`
    const allowedType = allowFileExt

    if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({
            message: "invalid file type",
            result: null
        })

    if (fileSize > fileMaxSize)
        return res.status(422).json({
            message: msgFileSize,
            result: null
        })

    try {
        file.mv(`./public/images/${fileName}`, async (err) => {
            if (err)
                return res.status(500).json({
                    message: err.message,
                    result: null
                })
                const result = await prisma.products.create({
                    data: {
                        code: setCode("PRD-"),
                        barcode: value.barcode ? value.barcode : null,
                        name: value.name,
                        image: fileName,
                        url: url,
                        qty: value.qty,
                        price: value.price,
                        categoryId: value.categoryId,
                        supplierId: value.supplierId
                    }
                })
                return res.status(200).json({
                    message: "success",
                    result
                })
        })
    } catch (error) {
        logger.error(
            "controllers/product.controller.js:createProduct - " + error.message
        )

        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
}

export const getAllProduct = async (req, res) => {
    const last_id = parseInt(req.query.lastId) || 0
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search_query || ""

    let result = []

    try {
        if (last_id < 1) {
            result = await prisma.$queryRaw`
            SELECT id, code, barcode, name, image, url, qty, price, categoryId, supplierId, createdAt, updatedAt
            FROM Products
            WHERE 
                (
                    code LIKE ${`%${search}%`}
                    OR name LIKE ${`%${search}%`}
                    OR barcode LIKE ${`%${search}%`}
                    OR qty LIKE ${`%${search}%`}
                    OR price LIKE ${`%${search}%`}
                )
            ORDER BY 
                id DESC
            LIMIT ${limit};
            `
        } else {
            result = await prisma.$queryRaw`
            SELECT id, code, barcode, name, image, url, qty, price, categoryId, supplierId, createdAt, updatedAt
            FROM Products
            WHERE 
            {
                code LIKE ${`%${search}%`}
                OR name LIKE ${`%${search}%`}
                OR barcode LIKE ${`%${search}`}
                OR CAST(qty AS CHAR) LIKE ${`%${search}%`}
                OR CAST(price AS CHAR) LIKE ${`%${search}%`}
            }
            AND id < ${last_id}
            ORDER BY
            id DESC
            LIMIT ${limit}
            `
        }
        return res.status(200).json({
            message: "success",
            result,
            lastId: result.length > 0 ? result[result.length - 1].id : 0,
            hasMore: result.length >= limit ? true : false
        })
    } catch (error) {
        logger.error(
            "controllers/product.controller.js:getAllProduct - " + error.message
        )
        return res.status(500).json({
            message: error.message,
            result: null,
            lastId: result.length > 0 ? result[result.length - 1].id : 0,
            hasMore: result.length >= limit ? true : false
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const result = await prisma.products.findUnique({
            include: {
                category: true,
                supplier: true
            },
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
            "controllers/product.controller.js:getProductById - " + error.message
        )
        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
}

export const getProductByCategory = async (req, res) => {
    try {
        const { id } = req.params
        const result = await prisma.products.findMany({
            where: {
                categoryId: Number(id),
            }
        })
        return res.status(200).json({
            message: "success",
            result
        })
    } catch (error) {
        logger.error(
            "controllers/product.controller.js:getProductByCategory - " + error.message
        )
        return res.status(500).json({
            message: error.message,
            result: null
        })
    }
    
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await prisma.products.findUnique({
            where: { id: Number(id) }
        })

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                result: null
            })
        }
        
        const { error, value } = productValidation(req.body)

        if (error != null) {
            return res.status(400).json({
                message: error.details[0].message,
                result: null
            })
        }

        let fileName = ""
        let url = ""

        if (!req.files || req.files === null || req.files.file === undefined || !req.files.file) {
            fileName = product.image
            url = product.url
        } else {
            const fileMaxSize = process.env.FILE_MAX_SIZE
            const allowFileExt = process.env.FILE_EXTENSION
            const msgFileSize = process.env.FILE_MAX_MESSAGE
            const file = req.files.file
            const fileSize = file.data.length
            const ext = path.extname(file.name)
            fileName = file.md5 + ext
            url = `${req.protocol}://${req.get("host")}/images/${fileName}`
            const allowedType = allowFileExt

            if (!allowedType.includes(ext.toLowerCase()))
                return res.status(422).json({message: "Invalid image type", result: null})
            if (fileSize > fileMaxSize)
                return res.status(422).json({
                    message: msgFileSize,
                    result: null
                })
                
                file.mv(`./public/images/${fileName}`, async (err) => {
                    if (err)
                        return res.status(500).json({message: err.message, result: null})
                })
        }



    } catch (error) {
        
    }
}