const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGODB_CONN, {
    useNewUrlParser:true,
    useCreateIndex:true
})