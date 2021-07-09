const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

//code for maintainance
// app.use((req,res) => {
//         res.status(503).send('site under maintanance')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('server running on port ',port)
})

// const bcrypt = require('bcryptjs')

// const fun = async() => {
//     const pass = 'afdsaf#22'
//     const hash = await bcrypt.hash(pass,8)
//     console.log(hash)
//     console.log(await bcrypt.compare('asdf',hash))
// }
// fun()

const Task = require('./models/task')
const User = require('./models/user')
const main = async() => {
    // const task = await Task.findById('60ddeb8414f81e4b74ed0cb2')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    // const user = await User.findById('60dca138c4eba32b44ec8a5e')
    // await user.populate('tasks').execPopulate()
    // console.log(user.tasks)

}
main()