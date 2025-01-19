import { Router } from "express"
import { authenticate } from "../controllers/error.controller.js"
import { getAllSupplier } from "../controllers/supplier.controller.js"
const supplierRouter = Router()

supplierRouter.get("/suppliers", authenticate, getAllSupplier)

export default supplierRouter