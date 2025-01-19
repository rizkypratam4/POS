import { Router } from "express"
import { createCategory, deleteCategory, getAllCategory, getCategoryById, updateCategory } from "../controllers/category.controller.js"
import { authenticate } from "../controllers/error.controller.js"

const categoryRoute = Router()

categoryRoute.get("/categories", authenticate, getAllCategory)
categoryRoute.get("/categories/:id", authenticate, getCategoryById)
categoryRoute.post("/categories", authenticate, createCategory)
categoryRoute.put("/categories/:id", authenticate, updateCategory)
categoryRoute.delete("/categories/:id", authenticate, deleteCategory)

export default categoryRoute