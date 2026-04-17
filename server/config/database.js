const mongoose = require('mongoose')

const databaseConnection = () => {
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch((err)=>{
    })
}

module.exports = databaseConnection