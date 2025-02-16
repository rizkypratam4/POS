import { Router } from "express"
import { authenticate } from "../controllers/error.controller.js"
import { createProduct } from "../controllers/product.controller.js"
const productRouter = Router()

productRouter.post('/products', authenticate, createProduct)

export default productRouter