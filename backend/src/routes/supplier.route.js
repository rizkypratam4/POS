import { Router } from "express"
import { authenticate } from "../controllers/error.controller.js"
import { createSupplier, getAllSupplier, getSupplierById, updateSupplier } from "../controllers/supplier.controller.js"
const supplierRouter = Router()

supplierRouter.get("/suppliers", authenticate, getAllSupplier)
supplierRouter.get("/suppliers/:id", authenticate, getSupplierById)
supplierRouter.post("/suppliers", authenticate, createSupplier)
supplierRouter.put("/suppliers/:id", authenticate, updateSupplier)

export default supplierRouter