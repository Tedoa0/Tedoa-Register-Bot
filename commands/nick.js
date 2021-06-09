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
if (member.user.bot) return message.channel.send(embed.setDescription(`${message.author} Botların isimini değiştiremezsin!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.author} Kendi ismini değiştiremezsin!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu Kullanıcı Senden Üst/Aynı Pozisyonda.`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))   

let isim = args[1]
if(!isim) return message.channel.send(embed.setDescription(`${message.author} bir isim girmelisin!`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))   

let yaş = Number (args[2])
if(!yaş) return message.channel.send(embed.setDescription(`${message.author} bir yaş girmelisin ve bu bir sayı olmalı!`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))   



let taglı = config.taglar.taglı
let tagsız = config.taglar.tagsız 

kdb.push(`isimler.${member.id}`, `\`${isim} | ${yaş}\` (İsim Değiştirme)`)

if (member.user.username.includes(taglı)) {
    await message.guild.members.cache.get(member.id).setNickname(`${taglı} ${isim} | ${yaş}`)
    const tedoa = new MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
    .setColor('BLACK')
    .setDescription(`${member} adlı kullanıcın ismi başarıyla \`${taglı} ${isim} | ${yaş}\` olarak değiştirildi ${emoji.tedoa} `)
    .setFooter(config.bots.footer)
    message.channel.send(tedoa)
    message.react(emoji.onayemoji)
    } else {
    
    await message.guild.members.cache.get(member.id).setNickname(`${tagsız} ${isim} | ${yaş}`)
    const tedoa = new MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
    .setColor('BLACK')
    .setDescription(`${member} adlı kullanıcın ismi başarıyla \`${tagsız} ${isim} | ${yaş}\` olarak değiştirildi ${emoji.tedoa} `)
    .setFooter(config.bots.footer)
    message.channel.send(tedoa)
    message.react(emoji.onayemoji)
    
 }    


}

    
    exports.conf = {
        enabled : true,
        guildOnly : false,
        aliases : ["i","isim","n"], 
         }
    
    exports.help = {
        name : 'nick',
        help: "nick [tedoa/ID] [isim] [yaş]",
        cooldown: 0
     }
    