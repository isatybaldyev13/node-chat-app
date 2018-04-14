socket = io()
socket.on('connect',()=>{
  console.log('Connected to server ')
})
socket.on('newMessage',(message)=>{
  var formattedTime = moment(message.createdAt).format('h:mm a')
  var li = $('<li></li>')
  li.text(message.from+' '+formattedTime+' : '+message.text)
  $('#messages').append(li)
})
socket.on('newLocationMessage',(message)=>{
  var formattedTime = moment(message.createdAt).format('h:mm a')
  var li = $('<li></li>')
  var a = $('<a>My current location</a>')
  li.text(message.from+' '+formattedTime+' :')
  a.attr('href',message.url)
  li.append(a)
  $('#messages').append(li)
})
socket.on('disconnect',()=>{
  console.log('Disconnected from server ')
})
$('#message-form').on('submit', function(e){
  e.preventDefault()
  var messageTextbox = $('[name=message]')
  socket.emit('createMessage',{
    from : 'User',
    text : messageTextbox.val()
  },function(){
    messageTextbox.val('')
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
