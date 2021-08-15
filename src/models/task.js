const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'user'
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    completed : {
        type : Boolean,
        default : false
    },
    images : [{
        image : {
            type : Buffer,
        }
    }]
},{
    timestamps : true
})
const Task = mongoose.model(('task'),taskSchema)

module.exports = Task