const express = require('express')
const Task = require('../models/task')
const router = express.Router()
const auth = require('../middlewares/auth')
router.post('/tasks', auth, async (req,res)=>{
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
    // task.save().then(()=>{
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

//GET tasks?completed=true
//pagination : GET tasks?limit=1&skip=1
//sorting : GET tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req,res)=>{    
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }

    try {
        // const task = await Task.find({'owner':req.user._id})     // this also works fine
        // res.send(task)
        await req.user.populate({
            path: 'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        }).execPopulate()     
        res.send(req.user.tasks)
    } catch(e) {
        res.status(500).send(e)
    }

    // Task.find({}).then((task)=>{
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id
    
    try{
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id, 'owner': req.user._id})
        if(!task)
            return res.status(400).send() 
        res.send(task)   
    } catch(e) {
        res.status(500).send(e)
    }
    // Task.findById(_id).then((task) => {
    //     if(!task)
    //         return res.status(400).send()
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

router.patch('/task/:id', auth, async(req,res)=>{
    const _id = req.params.id
    const allowedUpdates = ["description", "completed"]
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation)
        return res.status(400).send('error : Invalid updates!')

    try{
        const task = await Task.findOneAndUpdate({_id,'owner': req.user._id}, req.body, {new : true, runValidators : true, useFindAndModify: false})
        if(!task)
            return res.status(404).send()
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/task/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id,{'owner':req.user._id})
        const task = await Task.findOneAndDelete({_id : req.params.id,'owner' : req.user._id})
        if(!task)
            return res.staus(404).send()
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router