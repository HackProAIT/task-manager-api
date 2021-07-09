// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = process.env.MONGODB_CONN
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client)=> {
    if(error){
        return console.log('Unable to Connect to database!')
    }

    const db = client.db(databaseName)
    
    // db.collection('users').insertMany([{
    //     name : 'john',
    //     age : 27
    // }, {
    //     name : 'jane',
    //     age : 22
    // }], (error, result) => {
    //     if(error) {
    //         return console.log('unable to inser user')
    //     }        
    //     console.log(result.ops)
    // } )

    // db.collection('tasks').insertMany([{
    //     description : "this is john",
    //     completed : true
    // }, {
    //     description : 'his is jane',
    //     completed : false
    // }], (error, result) => {
    //     if(error) {
    //         return console.log('unable to inser tasks')
    //     }        
    //     console.log(result.ops)
    // } )

    // db.collection('users').findOne({name:'john'}, (error, user)=>{
    //     if(error)
    //         return console.log('could not fetch user')
    //     console.log(user)
    // })
    // db.collection('users').find({name:'john'}).toArray((error, users)=>{
    //     if(error)
    //         return console.log('error getting users')
    //     console.log(users)
    // }) 

    // db.collection('users').find({name:'john'}).count((error, count)=>{
    //     if(error)
    //         return console.log('error getting users')
    //     console.log(count)
    // })
    
    // db.collection('users').updateOne({_id : new ObjectID("60ce29b76cb8c84ec0ab4e9f")},{
    //     $set : {
    //         name : 'mike'
    //     }
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log('error updating')
    // })

    db.collection('users').deleteOne(
        { name : 'mike'}
    ).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
})