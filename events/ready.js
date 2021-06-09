const config = require('../config.json')
const db = require('quick.db')
module.exports = {
    name: 'ready',
    execute(client,member) {
  
    client.user.setPresence({ activity: {
       name: config.bots.status ,type: "PLAYING"}, status: "online"})
    client.channels.cache.get(config.bots.VoiceChannel).join(config.bots.voicechannel)


  }
  }
  