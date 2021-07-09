require('./src/db/mongoose')
const User = require('./src/models/user')

// User.findByIdAndUpdate('60d22ad9bf379554dc2c1392', {age : 1}).then((user)=>{
//     return user
// }).then((user)=>{
//     console.log(user)
// }).catch()

const user = async (id, age) => {
    const u = await User.findByIdAndUpdate(id, {age})
    return u
}

user('60d22ad9bf379554dc2c1392',1).then((u)=>{
    console.log(u)
})