const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
// const port = process.env.PORT

//code for maintainance
// app.use((req,res) => {
//         res.status(503).send('site under maintanance')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


module.exports = app