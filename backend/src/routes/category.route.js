import { Router } from "express"
import { createCategory, deleteCategory, getAllCategory, getCategoryById } from "../controllers/category.controller.js"

const categoryRoute = Router()

categoryRoute.get("/categories", getAllCategory)
categoryRoute.get("/categories/:id", getCategoryById)
categoryRoute.post("/categories", createCategory)
categoryRoute.put("/categories/:id", updateCategory)
categoryRoute.delete("/categories/:id", deleteCategory)

export default categoryRoute