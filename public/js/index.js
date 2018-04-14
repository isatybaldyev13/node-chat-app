socket = io()
socket.on('connect',()=>{
  console.log('Connected to server ')
})
socket.on('newMessage',(message)=>{
  console.log('New Message ',message)
  var li = $('<li></li>')
  li.text(message.from+' : '+message.text)
  $('#messages').append(li)
})
socket.on('disconnect',()=>{
  console.log('Disconnected from server ')
})
$('#message-form').on('submit', function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from : 'User',
    text : $('[name=message]').val()
  },function(){
    console.log('got it');
  })
});
