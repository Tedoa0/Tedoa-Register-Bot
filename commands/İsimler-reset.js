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

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) return message.channel.send(embed.setDescription(`${message.author} Lütfen bir kullanıcı belirtin @Tedoa/İD gibi.`)).then(tedoa => tedoa.delete({timeout : 8000})).then(message.react(emoji.redemoj))
if (member.user.bot) return message.channel.send(embed.setDescription(`${message.author} Botların isim geçmişi olmaz !`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.author} Kendini isim geçmişini temizleyemzsin!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu Kullanıcı Senden Üst/Aynı Pozisyonda.`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))   

let isimler = kdb.get(`isimler.${member.id}`);
if (!isimler) return message.channel.send(embed.setDescription(`Bu kullanıcının data'sında isim bulunamadı`)).then(message.react('❤')).then(tedoa => tedoa.delete({timeout:10000}))
  

kdb.delete(`isimler.${member.id}`)
message.channel.send(embed.setDescription(`${member} adlı kullanıcının isim geçmişi başarıyla temizlendi !`)).then(tedoa => tedoa.delete({ timeout : 10000 })).then(message.react(emoji.onayemoji))
message.react(emoji.onayemoji)

}

    
    exports.conf = {
        enabled : true,
        guildOnly : false,
        aliases : [], 
         }
    
    exports.help = {
        name : 'isimler-reset',
        help: "isimler-reset [tedoa/ID]",
        cooldown: 0
     }
    