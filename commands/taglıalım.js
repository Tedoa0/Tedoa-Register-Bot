const { MessageEmbed } = require('discord.js')
const Database = require('quick.db')
const kdb = new Database.table("kayıtlar")
const config = require('../config.json')
const ayarlar = require('../ayarlar.json')
const emoji = require('../emoji')
const tdb = new Database.table("taglılar")

exports.run = async(client, message, args) => {

let embed = new MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true })).setColor("RANDOM").setFooter(config.bots.footer)
    

if(!args[0]) {
    message.channel.send(embed.setDescription(`[Hata] Yalnış kullanım! ${ayarlar.prefix}taglıalım aç/kapat`)).then(tedoa => tedoa.delete({ timeout : 10000 })).then(message.react(emoji.redemoj))
    return;    
    }

    
    if (args[0] == 'aç') {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(embed.setDescription(`${message.author} bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)).then(tedoa => tedoa.delete({ timeout : 5000 })).then(message.react(emoji.redemoj))

        let açıkmı =  tdb.fetch(`taglıalım.${message.guild.id}`)
        if(açıkmı === true) return message.channel.send(embed.setDescription(`Sunucu durumu zaten taglı alım durumunda!`)).then(tedoa => tedoa.delete({ timeout : 5000 })).then(message.react(emoji.redemoj))
        await tdb.set(`taglıalım.${message.guild.id}`, true)
        message.channel.send(embed.setDescription(`Başarıyla taglı alım moduna geçildi.`)).then(tedoa => tedoa.delete({ timeout : 5000 })).then(message.react(emoji.onayemoji))
     }

     if (args[0] == 'kapat') { 
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(embed.setDescription(`${message.author} bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)).then(tedoa => tedoa.delete({ timeout : 5000 })).then(message.react(emoji.redemoj))
        let kapalımı = tdb.fetch(`taglıalım.${message.guild.id}`)
        if(kapalımı === false) return message.channel.send(embed.setDescription(`Sunucu durumu zaten taglı alım durumuna kapalı!`)).then(tedoa => tedoa.delete({ timeout : 5000 })).then(message.react(emoji.redemoj))
        await tdb.set(`taglıalım.${message.guild.id}`, false)
        message.channel.send(embed.setDescription(`Başarıyla taglı alım modundan çıkıldı.`)).then(tedoa => tedoa.delete({ timeout : 5000 })).then(message.react(emoji.onayemoji))
    }



}

    exports.conf = {
        enabled : true,
        guildOnly : false,
        aliases : ["taglıalım"], 
         }
    
    exports.help = {
        name : 'taglı-alım',
        help: "taglıalım [aç/kapat]",
        cooldown: 0
     }
    
