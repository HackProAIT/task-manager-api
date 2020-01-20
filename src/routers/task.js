const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async(req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        userId : req.user._id
    })

    try{
        await task.save()

        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }

    // task.save().then(() => {
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.patch('/tasks/:id', auth, async(req, res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']
    const isvalid = updates.every((update) =>{
        return allowedUpdates.includes(update)
    })

    if(!isvalid){
        return res.status(404).send({error : 'invalid update'})
    }

    try{
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({userId : req.user._id, _id : req.params.id })

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    }
    catch(e){
        res.status(404).send(e)
    }
})

router.delete('/tasks/:id', auth, async(req, res) => {
    try{
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({userId: req.user._id, _id : req.params.id})
         
        if(!task){
            res.status(404).send({error :'task not found!'})
        }
        
        res.send(task)
    }
    catch(e){
        res.send(500).send(e)
    }
})

// GET /tasks/completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc 
router.get('/tasks', auth, async(req, res) =>{

    const match = {}
    const sort = {}

    if(req.query.completed)
    {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy)
    {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try{
        //const tasks = await Task.find({userId : req.user._id})
        const user = await req.user.populate({
            path : 'tasks',
            match,
            // match : {
            //     completed : 'true'
           // }
           
           options : {
               limit : parseInt(req.query.limit),
               skip: parseInt(req.query.skip),
               sort 
           }
        }).execPopulate()
        res.send(user.tasks)
    }
    catch(e){
        res.status(500).send()
    }
    // Task.find({}).then((tasks)=> {
    //     res.send(tasks)

    // }).catch((e)=> {

    // })
})

router.get('/task/:id', auth , async(req, res) =>{
    const _id = req.params.id

    try{
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id , userId : req.user._id})

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(e){
        res.send(400).send(e)
    }

    // User.findById(_id).then((task) => {
    //     if(!task){
    //         return res.status(404).send()
    //     }

    //     res.send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

module.exports = router

