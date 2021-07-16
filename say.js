const { MessageEmbed } = require('discord.js')
const config = require('../config.json')
exports.run = async(client, message, args) => {
let embed = new MessageEmbed().setColor("BLACK")
let tag = message.guild.members.cache.filter(member => member.user.username.includes(config.taglar.tag)).size
let ses = message.guild.members.cache.filter(x => x.voice.channel).size
let bot = message.guild.members.cache.filter(s => s.voice.channel && s.user.bot).size
let üyesayısı = message.guild.members.cache.size
let aktif = message.guild.members.cache.filter(m => m.presence.status !== "offline").size
let booster = message.guild.premiumSubscriptionCount
let boostLevel =  message.guild.premiumTier
message.channel.send(embed.setDescription(`
\`❯\` Şu anda toplam **${ses-bot || "0"}** (**+${bot || "0"} bot**) kişi seslide.
\`❯\` Sunucuda **${üyesayısı}** adet üye var (**${aktif || "0"}** Aktif)
\`❯\` Toplamda **${tag || "0"}** kişi tagımızı alarak bizi desteklemiş.
\`❯\` Toplamda **${booster}** adet boost basılmış! ve Sunucu **${boostLevel}** seviye`))
}
exports.conf = {
enabled : true,
guildOnly : false,
aliases : [], 
 }
exports.help = {
name : 'say',
help: "say",
cooldown: 0
}
    