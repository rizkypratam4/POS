import express from "express"
import cors from "cors"
import router from "../routes/index.js"
import "../utils/winston.js"
import fileUpload from "express-fileupload"

const appMiddleware = express()

appMiddleware.use(
    cors({
        origin: true,
        credentials: true,
        preflightContinue: false,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
    })
)

appMiddleware.options("*", cors())
appMiddleware.use(express.json())
appMiddleware.use(fileUpload())
appMiddleware.use(express.static("public"))
appMiddleware.use(router)

export default appMiddleware