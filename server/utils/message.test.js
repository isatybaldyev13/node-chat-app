var expect = require('expect')
var {generateMessage} = require('./message')
describe('generateMessage',()=>{
    it('it should generate correct message object ',()=>{
      var from = "Alex"
      var text  = "Hey mate ! Whazz up ?"
      var message = generateMessage(from,text)
      expect(message.createdAt).toBeA('number')
      expect(message).toInclude({from,text})
    })
})
