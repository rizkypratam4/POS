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