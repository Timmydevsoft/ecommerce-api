import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import errorHandler from "./middleware/errorHandler.js"
import { dbConnect } from "./config/db.connect.js"
import userRouter from "./routes/user.route.js"
import {createRequire} from 'module'
import productRouter from "./routes/product.route.js"
import cartRouter from "./routes/cart.route.js"
import adminRouter from "./routes/admin.route.js"
import orderRouter from "./routes/order.route.js"
import categoryRouter from "./routes/category.route.js"

dotenv.config()
const require = createRequire(import.meta.url)
const cookiePaser = require("cookie-parser")


const app = express()
app.use(express.json())
app.use(cookiePaser())
app.use(express.urlencoded({extended: true}))
const port = process.env.PORT || 5000

dbConnect()

const  coreOptions= {
    origin: ["http://localhost:5173"],
    credentials: true,
    methods:['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders:[
        'Authorization',
        'Content-Type'
    ]
}
app.use(cors(coreOptions))
app.use(express.json())


app.use("/api", authRouter)
app.use("/api", userRouter)
app.use("/api", productRouter)
app.use("/api", cartRouter)
app.use("/api", orderRouter)
app.use("/api", adminRouter)
app.use("/api", categoryRouter)


app.use(errorHandler)

app.listen(port, ()=>{
    console.log('app is running on port ', port)
} )