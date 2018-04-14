socket = io()
socket.on('connect',()=>{
  console.log('Connected to server ')
})
socket.on('newMessage',(message)=>{
  console.log('New Message ',message)
})
socket.on('disconnect',()=>{
  console.log('Disconnected from server ')
})
