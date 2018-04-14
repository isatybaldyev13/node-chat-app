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
socket.on('newLocationMessage',(message)=>{
  console.log('New Message ',message)
  var li = $('<li></li>')
  var a = $('<a>My current location</a>')
  li.text(message.from+' :')
  a.attr('href',message.url)
  li.append(a)
  $('#messages').append(li)
})
socket.on('disconnect',()=>{
  console.log('Disconnected from server ')
})
$('#message-form').on('submit', function(e){
  e.preventDefault()
  socket.emit('createMessage',{
    from : 'User',
    text : $('[name=message]').val()
  },function(){
    console.log('got it')
  })
})
var locationButton = $('#send-location')
locationButton.on('click',function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser !')
  }
  locationButton.attr('disabled','disabled').text('Sending location...')
  navigator.geolocation.getCurrentPosition(function(position){
    locationButton.removeAttr('disabled').text('Send location')
    socket.emit('createLocationMessage',{
      latitude : position.coords.latitude,
      longitude : position.coords.longitude,
    })
  },function(){
    locationButton.removeAttr('disabled').text('Send location')
    alert('Unable to fetch location.')
  })
})
