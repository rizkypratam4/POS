import { Router } from "express"
import { createUser, loginUser, updateUser } from "../controllers/user.controller.js"
import { authenticate } from "../controllers/error.controller.js"
const userRouter = Router()

userRouter.post("/users", createUser)
userRouter.put("/users/:id", authenticate, updateUser)
userRouter.post("/users/login", loginUser)

export default userRouter