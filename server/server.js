const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const publicPath = path.join(__dirname,'../public')
const port = process.env.PORT || 3000
const {generateMessage,generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users')
var app = express()
var server = http.createServer(app)
var io = socketIO(server)
var users = new Users()
app.use(express.static(publicPath))
io.on('connection',(socket)=>{
  socket.on('join',(params,callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Rooms and name are required !')
    }
    socket.join(params.room)
    users.removeUser(socket.id)
    users.addUser(socket.id,params.name,params.room)
    io.to(params.room).emit('updateUserList',users.getUserList(params.room))
    socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'))
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',params.name+' joined'))
    callback()
  })
  socket.on('createMessage',(message,callback)=>{
    var user  = users.getUser(socket.id)
    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage',generateMessage(user.name,message.text))
    }
    callback();
  })
  socket.on('createLocationMessage',(coords,callback)=>{
    var user  = users.getUser(socket.id)
    if(user){
      io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude))
    }
    callback();
  })
  socket.on('disconnect',()=>{
    console.log('Disconnected')
    var user = users.removeUser(socket.id)
    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room))
      io.to(user.room).emit('newMessage',generateMessage('Admin',user.name+" has left"))
    }
  })

})
app.post('/image',(req,res)=>{

})


server.listen(port,()=>{
  console.log('App is running on port '+port)
})
