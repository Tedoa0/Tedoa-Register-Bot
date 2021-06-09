const { MessageEmbed } = require("discord.js");
const config = require('../config.json')
const ayarlar = require('../ayarlar.json')
const emoji = require('../emoji.js')
var prefix = ayarlar.prefix
exports.run = async(client, message, args) => {


let embed = new MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true })).setColor('RANDOM').setFooter(config.bots.footer).setTimestamp()

let list = client.commands
.filter((x) => x.help.help)
.sort((a, b) => b.help.help - a.help.help)
.map((x) => `\`${prefix}${x.help.help}\``)
.join("\n");


message.channel.send(embed.setDescription(list));
 }
 exports.conf = {
    enabled : true,
    guildOnly : false,
    aliases : ["help"], 
    permLevel : 0
}

exports.help = {
    name : 'yardım',
    description : '',
    cooldown: 10
}
