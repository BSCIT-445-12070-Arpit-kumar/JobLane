const app = require('./app')
const databaseConnection = require('./config/database')
const cloudinary  = require('cloudinary')
const envPath = require('./config/loadEnv')

const cloudName = process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET


cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
}) 

if (!cloudName || !apiKey || !apiSecret) {
    console.warn(`Cloudinary is not fully configured. Check ${envPath}`)
}

databaseConnection()

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})
