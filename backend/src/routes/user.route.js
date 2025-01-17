import { Router } from "express"
import { createUser, deleteUser, getAllUser, getUserById, loginUser, setRefreshToken, updateUser } from "../controllers/user.controller.js"
import { authenticate } from "../controllers/error.controller.js"
const userRouter = Router()

userRouter.post("/users", createUser)
userRouter.put("/users/:id", authenticate, updateUser)
userRouter.post("/users/login", loginUser)
userRouter.delete("/users/:id", authenticate, deleteUser)
userRouter.get("/users", authenticate, getAllUser)
userRouter.get("/users/refresh", authenticate, setRefreshToken)
userRouter.get("/users/:id", authenticate, getUserById)

export default userRouter