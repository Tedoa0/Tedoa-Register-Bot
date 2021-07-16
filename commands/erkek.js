const { MessageEmbed } = require('discord.js')
const Database = require('quick.db')
const kdb = new Database.table("kayıtlar")
const tdb = new Database.table("taglılar")
const config = require('../config.json')
const ayarlar = require('../ayarlar.json')
const emoji = require('../emoji')

exports.run = async(client, message, args) => {

let embed = new MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true })).setColor("RANDOM").setFooter(config.bots.footer)
    
if (!config.roles.register.some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
return message.channel.send(embed.setDescription(`${message.author} Bu komutu kullanabilmek için yeterli yetkin yok!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) return message.channel.send(embed.setDescription(`${message.author} Lütfen bir kullanıcı belirtin @Tedoa/İD gibi.`)).then(tedoa => tedoa.delete({timeout : 8000})).then(message.react(emoji.redemoj))

let isim = args[1]
if(!isim) return message.channel.send(embed.setDescription(`${message.author} bir isim girmelisin!`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))   

let yaş = Number (args[2])
if(!yaş) return message.channel.send(embed.setDescription(`${message.author} bir yaş girmelisin ve bu bir sayı olmalı!`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))   


if (member.user.bot) return message.channel.send(embed.setDescription(`${message.author} Botları kayıt edemezsin!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.author} Kendini kayıt edemezsin!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu Kullanıcı Senden Üst/Aynı Pozisyonda.`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))   

let taglıalım = await tdb.fetch(`taglıalım.${message.guild.id}`)
if(taglıalım === true){
    if(!member.user.username.includes(config.taglar.tag) && !member.roles.cache.has(config.roles.vip) && !member.roles.cache.has(config.roles.booster)) return message.channel.send(embed.setDescription(`Sunucumuzda taglı alım modu açıktır kayıt olmak için isminize \`${config.taglar.tag}\` sembolünü alabilir veya \`Boost\` basarak giriş yapabilirsiniz.`)).then(x => x.delete({timeout: 5000})).then(message.react(emoji.redemoj));
}


let taglı = config.taglar.taglı
let tagsız = config.taglar.tagsız 

kdb.add(`erkek.${message.author.id}.${message.guild.id}`, +1)
kdb.add(`teyit.${message.author.id}.${message.guild.id}`, +1)
kdb.push(`isimler.${member.id}`, `\`${isim} | ${yaş}\` (<@&${config.roles.erkek1}>)`)
let isimler = kdb.get(`isimler.${member.user.id}`);
let isimleri = `${isimler.map((data) => `${data}`).join("\n")}`

await message.guild.members.cache.get(member.id).roles.remove(config.roles.unregisteres)
await message.guild.members.cache.get(member.id).roles.add(config.roles.maleRoles)

if (member.user.username.includes(taglı)) {
await message.guild.members.cache.get(member.id).setNickname(`${taglı} ${isim} | ${yaş}`)
const tedoa = new MessageEmbed()
.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
.setColor('BLACK')
.setDescription(`${member} üyesi Başarıyla <@&${config.roles.erkek1}> Olarak  Kayıt Edildi ${emoji.tedoa}

${isimleri}
Tüm isim geçmişine ${ayarlar.prefix}isimler \`@${member.user.username}/ID\`  ile bakmanız önerilir. `)
message.channel.send(tedoa).then(tedoa => tedoa.delete({ timeout : 10000 }))
message.react(emoji.onayemoji)
} else {

await message.guild.members.cache.get(member.id).setNickname(`${tagsız} ${isim} | ${yaş}`)
const tedoa = new MessageEmbed()
.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
.setColor('BLACK')
.setDescription(`${member} üyesi Başarıyla <@&${config.roles.erkek1}> Olarak  Kayıt Edildi ${emoji.tedoa}

${isimleri}
Tüm isim geçmişine ${ayarlar.prefix}isimler \`@${member.user.username}/ID\`  ile bakmanız önerilir. `)
message.channel.send(tedoa).then(tedoa => tedoa.delete({ timeout : 10000 }))
message.react(emoji.onayemoji)



}

    }
    exports.conf = {
        enabled : true,
        guildOnly : false,
        aliases : ["e","man","male"], 
         }
    
    exports.help = {
        name : 'erkek',
        help: "erkek [tedoa/ID] [isim] [yaş]",
        cooldown: 0
     }
    
