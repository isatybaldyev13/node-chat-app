socket = io()
socket.on('connect',()=>{
  console.log('Connected to server ')
  socket.emit('createMessage',{
    to: "isatybaldyev@gmail.com",
    text: "Hey Whats up ?",
    createAt: "12:12"
  })
})
socket.on('newMessage',(message)=>{
  console.log('New Message ',message)
})
socket.on('disconnect',()=>{
  console.log('Disconnected from server ')
})
