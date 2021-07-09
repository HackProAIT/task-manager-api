const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.SECRET)
        const user = await User.findOne({_id : decoded._id, 'tokens.token' : token})
        //console.log(user)
        if(!user)
            throw new Error()
        req.user = user
        req.token = token
        next()
    }
    catch(e) {
        res.status(403).send('please authenticate')
    }
    //next()
}

module.exports = auth