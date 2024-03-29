socket = io()
function scrollToBottom(){
  var messages = $('#messages')
  var newMessage = messages.children('li:last-child')
  var clientHeight = messages.prop('clientHeight')
  var scrollTop = messages.prop('scrollTop')
  var scrollHeight = messages.prop('scrollHeight')
  var newMessageHeight = newMessage.innerHeight()
  var lastMessageHeight = newMessage.prev().innerHeight()
  if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight){
    messages.scrollTop(scrollHeight)
  }
}
socket.on('connect',()=>{
  var params = jQuery.deparam(window.location.search)
  socket.emit('join',params,function(err){
    if(err){
      alert(err)
      window.location.href = "/"
    }
    else{
      console.log('nice joined ');
    }

  })
  console.log('Connected to server ')
})
socket.on('updateUserList',function(users){
  console.log(users);
  var ol = $('<ol></ol>')
  users.forEach(function(user){
    ol.append($('<li></li>').text(user))
  })
  $('#users').html(ol)
})
socket.on('newMessage',(message)=>{
  var formattedTime = moment(message.createdAt).format('h:mm a')
  var template = $('#message-template').html()
  var html = Mustache.render(template,{
    from:message.from,
    text : message.text,
    createdAt : formattedTime
  })
  $('#messages').append(html)
  scrollToBottom()
})
socket.on('newLocationMessage',(message)=>{
  var formattedTime = moment(message.createdAt).format('h:mm a')
  var template = $('#location-message-template').html()
  var html = Mustache.render(template,{
    from:message.from,
    url : message.url,
    createdAt : formattedTime
  })
  $('#messages').append(html)
  scrollToBottom()
})
socket.on('disconnect',()=>{
  console.log('Disconnected from server ')
})
$('#message-form').on('submit', function(e){
  e.preventDefault()
  var messageTextbox = $('[name=message]')
  socket.emit('createMessage',{
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
    },function(err){
      if(err){
        alert(err)
      }
    })
  },function(){
    locationButton.removeAttr('disabled').text('Send location')
    alert('Unable to fetch location.')
  })
})
