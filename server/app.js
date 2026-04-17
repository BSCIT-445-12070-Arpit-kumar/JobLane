const express = require('express')
const app = express()
const cors = require('cors')
const fileUpload = require('express-fileupload')
require('./config/loadEnv')

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(fileUpload())


const User = require('./routes/UserRoutes')
const Job = require('./routes/JobRoutes')
const Application = require('./routes/ApplicationRoutes')
const Admin = require('./routes/AdminRoutes')
const { errorMiddleware } = require('./middlewares/error')

app.use("/api/v1",User)
app.use("/api/v1",Job)
app.use("/api/v1",Application)
app.use("/api/v1",Admin)

app.get("/",(req,res)=>{
    res.json("I am working")
})

app.use(errorMiddleware);

module.exports = app ;
