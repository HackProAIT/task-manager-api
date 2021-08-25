const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        unique : true,
        required : true,
        trim : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('invalid email address')
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 7,
        trim : true
    },
    age : {
        type : Number,
        default : 0,
        validate(value) {
            if(value<0)
                throw new Error('negative age not allowed')
        }
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
},{
    timestamps : true
})

userSchema.virtual('tasks',{
    ref : 'task',
    localField : '_id',
    foreignField : 'owner'
})

//userSchema.methods.getPublicProfile = function() {
userSchema.methods.toJSON = function() {  
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    //console.log(userObject)
    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    //console.log(user)
    const token = jwt.sign({_id: user._id.toString()},process.env.SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCreds = async(email,password) => {
    const user = await User.findOne({email})
    if(!user)
        throw Error('unable to login')
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch)
        throw Error('unable to login')
    return user
}

//hash the passwords
userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({'owner' : user._id})
    next()
})

const User = mongoose.model(('user'), userSchema)

module.exports = User