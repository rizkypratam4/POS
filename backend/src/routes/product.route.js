import { Router } from "express"
import { authenticate } from "../controllers/error.controller.js"
import { createProduct, getAllProduct, getProductByCategory, getProductById } from "../controllers/product.controller.js"
const productRouter = Router()

productRouter.post('/products', authenticate, createProduct)
productRouter.get('/products', authenticate, getAllProduct)
productRouter.get('/products/:id', authenticate, getProductById)
productRouter.get('/products/category/:id', authenticate, getProductByCategory)

export default productRouter