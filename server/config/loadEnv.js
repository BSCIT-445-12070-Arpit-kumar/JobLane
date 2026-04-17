const path = require('path')
const dotenv = require('dotenv')

const envPath = path.resolve(__dirname, 'config.env')

dotenv.config({ path: envPath })

module.exports = envPath
