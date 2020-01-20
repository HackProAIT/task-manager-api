const express = require('express')
const User = require('../models/user')
const sharp = require('sharp')
const router = new express.Router()
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')
const multer = require('multer')

router.post('/users', async(req, res)=> {
    const user = new User(req.body)
    const token = await user.generateAuthToken()

    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        console.log('yes email sent')
        res.status(201).send({user, token})
    }
    catch(e){
        res.status(400).send()
    }    

    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

router.post('/user/login', async(req, res)=>{

    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }
    catch(e){
        res.status(400).send('auth failedd')
    }
})

router.post('/user/logout', auth, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token)=> {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

router.post('/user/logoutAll', auth, async(req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()

        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

router.get('/users/me', auth, async(req, res) =>{

    res.send(req.user)
    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{

    // })
})

const upload = multer({
    //dest : 'avatar',

    limits : {
        fileSize : 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        return cb(new Error('please upload an image '))
    
        cb(undefined, true)
    }

})
router.post('/users/me/avatar', auth, upload.single('avatar'), async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width : 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()    
}, (error, req, res, next)=>{
    res.status(400).send({error : error.message })
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    if(!req.user.avatar)
    res.send('no profile found')

    req.user.avatar = undefined
    await req.user.save()
    res.send()    
})

router.get('/users/:id/avatar', async(req, res)=>{
    
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar)
        throw new Error('profile not found')

        res.set('Content-type', 'image/png')
        res.send(user.avatar)
    }
    catch(e){
        res.status(404).send(e)
    }
})
    

router.patch('/users/me',auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValid){
        return res.status(404).send({error : 'invalid updates!'})   
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update]) 
        
        await req.user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators: true})
        res.send(req.user)
    }

    catch(e){
        res.status(400).send(e)
    }
    
})

router.delete('/users/me', auth, async(req, res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id)

        // if(!user){
        //     res.status(404).send({error : 'user not found!'})
        // }
        sendCancelEmail(req.user.email, req.user.name)
        console.log('yes email sent')
        await req.user.remove()
        res.send(req.user)
    }
    catch(e){
        res.send(500).send(e)
    }
})




module.exports = router