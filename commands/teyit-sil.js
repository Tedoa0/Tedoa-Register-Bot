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
if (member.user.bot) return message.channel.send(embed.setDescription(`${message.author} Botların kayıt datası olmaz !`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.author} Kendi kayıt datanı silemezsin!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu Kullanıcı Senden Üst/Aynı Pozisyonda.`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))   

if(!args[1]) {
    return message.channel.send(new MessageEmbed()
    .setTitle(`Yanlış Kullanım`)
    .setDescription(`Bir parametre girmelisin;
    
    .teyitsil @Tedoa/ID erkek <miktar>
    .teyitsil @Tedoa/ID kadın <miktar>`)
    .setFooter(config.bots.footer)
    .setTimestamp()
    ).then(tedoa => tedoa.delete({ timeout : 10000 })).then(message.react(emoji.redemoj))
}

if(args[1] === 'erkek') {
let miktar = args[2]
if(!miktar) return message.channel.send(embed.setDescription(`silmek istediğinz kadar sayı girin!`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj)) 
    kdb.add(`erkek.${member.user.id}.${message.guild.id}`, -miktar)
    kdb.add(`teyit.${member.user.id}.${message.guild.id}`, -miktar)
    let erkek = kdb.fetch(`erkek.${member.user.id}.${message.guild.id}`)
    let toplam = kdb.fetch(`teyit.${member.user.id}.${message.guild.id}`)
     message.channel.send(embed.setDescription(`${member} adlı kullanıcıdan başarıyla \`${miktar}\` kadar erkek teyit silindi !`))
    .then(tedoa => {
    setTimeout(() => {
    tedoa.edit(embed.setTimestamp().setDescription(`${member} adlı kullanıcının yeni kayıt datası:
    Erkek Kayıt \`${erkek}\`
    Toplam Kayıt\`${toplam}\`

   Kayıt eklemek için ${ayarlar.prefix}kayıt-ekle \`@${member.user.username}\` <erkek/kadın> <miktar>`))
}, 15000)
}) 
}

if(args[1] === 'kadın') {
    let miktar = args[2]
    if(!miktar) return message.channel.send(embed.setDescription(`silmek istediğinz kadar sayı girin!`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj)) 
        kdb.add(`kadın.${member.user.id}.${message.guild.id}`, -miktar)
        kdb.add(`teyit.${member.user.id}.${message.guild.id}`, -miktar)
        let kadın = kdb.fetch(`kadın.${member.user.id}.${message.guild.id}`)
        let toplam = kdb.fetch(`teyit.${member.user.id}.${message.guild.id}`)
         message.channel.send(embed.setDescription(`${member} adlı kullanıcıdan başarıyla \`${miktar}\` kadar kadın teyit silindi !`))
        .then(tedoa => {
        setTimeout(() => {
        tedoa.edit(embed.setTimestamp().setDescription(`${member} adlı kullanıcının yeni kayıt datası:
        Kadın Kayıt \`${kadın}\`
        Toplam Kayıt\`${toplam}\`
    
       Kayıt eklemek için ${ayarlar.prefix}kayıt-ekle \`@${member.user.username}\` <erkek/kadın> <miktar>`))
    }, 15000)
    }) 
    
}
}
    exports.conf = {
        enabled : true,
        guildOnly : false,
        aliases : [], 
         }
    
    exports.help = {
        name : 'kayıt-sil',
        help: "kayıt-sil [tedoa/ID] [erkek/kız] [miktar]",
        cooldown: 0
     }
    