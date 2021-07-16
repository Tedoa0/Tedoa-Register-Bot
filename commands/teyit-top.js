const { MessageEmbed } = require('discord.js')
const Database = require('quick.db')
const kdb = new Database.table("kayıtlar")
const config = require('../config.json')
const ayarlar = require('../ayarlar.json')
const emoji = require('../emoji')

exports.run = async(client, message, args) => {

let embed = new MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true })).setColor("RANDOM").setFooter(config.bots.footer)
    
if (!config.roles.register.some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
return message.channel.send(embed.setDescription(`${message.author} Bu komutu kullanabilmek için yeterli yetkin yok!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))

let top =  message.guild.members.cache.filter(uye => kdb.get(`teyit.${uye.id}.${message.guild.id}`)).array().sort((uye1, uye2) => Number(kdb.get(`teyit.${uye2.id}.${message.guild.id}`))-Number(kdb.get(`teyit.${uye1.id}.${message.guild.id}`)))
.slice(0, 15).map((uye, index) => ` \`${index+1}.\` ${uye} - **${kdb.get(`teyit.${uye.id}.${message.guild.id}`)}** kayıt (**${kdb.get(`erkek.${uye.id}.${message.guild.id}`) || "0"}** erkek **${kdb.get(`kadın.${uye.id}.${message.guild.id}`) || "0"}** kadın) `).join('\n')
message.channel.send(embed.setTimestamp().setFooter(message.author.tag+" tarafından istendi!", message.author.avatarURL)
.setDescription(`
Tedoa teyit sıralaması;

${top || "Kimse bir kayıt yapmamış!"}`))

message.react(emoji.onayemoji)

return;




}

    
    exports.conf = {
        enabled : true,
        guildOnly : false,
        aliases : ["top","sıralama","kayıt-sıralama"], 
         }
    
    exports.help = {
        name : 'teyit-top',
        help: "teyit-top",
        cooldown: 0
     }
    
