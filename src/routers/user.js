const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middlewares/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')

// router.post('/users', async (req,res) => {
//     const user = new User(req.body)

//     try {
//         await user.save()
//         res.send(user)
//     }catch(e) {
//         res.status(400).send(e)
//     }
//     // user.save().then(()=>{
//     //     res.send(user)
//     // }).catch((e)=>{
//     //     res.status(400).send(e)
//     // })
//     //console.log(user)
// })

router.post('/user/login', async(req,res)=> {
    try{
        const user = await User.findByCreds(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        
        res.send({user,token})
    } catch(e){
        res.status(400).send(e)
    }
    
})

router.post('/user/signup', async(req,res)=> {
    const user = new User(req.body)
    sendWelcomeEmail(user.email, user.name)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e) {
        res.status(400).send(e)
    }    
})

router.post('/user/logout', auth, async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.forEach((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})

router.post('/user/logoutAll', auth, async(req,res)=>{
    try {
        req.user.tokens = [];
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req,res) => {
    res.send(req.user)

    // try {
    //     const users = await User.find({})
    //     res.send(users)
    // } catch(e) {
    //     res.status(500).send(e)
    // }
    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

// router.get('/users/:id', async (req,res)=>{
//     const _id = req.params.id

//     try{
//         const user = await User.findById(_id)
//         if(!user)
//             return res.status(400).send()
//         res.send(user)
//     } catch(e) {
//         res.send(500).send(e)
//     }
//     // User.findById(_id).then((user) => {
//     //     if(!user)
//     //         res.status(400).send()
//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send(e)
//     // })
// })

router.patch('/user/me', auth, async(req,res)=>{
    //const _id = req.user._id
    const allowedUpdates = ["name", "email", "age", "password"]
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation)
        return res.status(400).send('error : Invalid updates!')

    try{
        //const user = await User.findByIdAndUpdate(_id, req.body, {new : true, runValidators : true, useFindAndModify: false})
        const user = req.user//await User.findById(_id)
        updates.forEach((update) => user[update]=req.body[update])
        await user.save()
        // if(!user)
        //     return res.status(404).send()
        res.send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/user/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user)
        //     return res.staus(404).send()
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
})

const upload = multer({
    //dest : './avatars',
    limits : {
        fileSize : 1000000
    },
    fileFilter(req,file,cb){          //cb is a callback function
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('please upload an image'))
        }
        cb(undefined,true)
    }
})

router.post('/user/me/avatar', auth, upload.single('avatar'), async(req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width : 250, height : 250}).png().toBuffer()
    req.user.avatar = buffer //req.file.buffer
    await req.user.save()
    res.send('avatar uploaded successfully')
}, (error, req, res, next) => {
    res.status(400).send({error : error.message})
})

router.delete('/user/me/avatar', auth, async(req, res) => {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
})

router.get('/user/:id/avatar', async(req,res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch(e){
        res.status(400).send()
    }
})

module.exports = router