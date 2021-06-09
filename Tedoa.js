const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db");
const fs = require("fs");
const ms = require("ms");
const moment = require("moment");
const ayarlar = require("./ayarlar.json");
const chalk = require('chalk');
const config = require('./config.json')
const emoji = require('./emoji')
require("moment-duration-format");


var prefix = ayarlar.prefix;
client.cooldowns = new Discord.Collection();

const log = (message) => {
  console.log(chalk.blue`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  log(chalk.white`${files.length} komut yüklenecek.`);
  files.forEach((f) => {
    let props = require(`./commands/${f}`);
    log(chalk.red`Yüklenen komut | [${props.help.name}]`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach((alias) => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = (command) => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach((alias) => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = (command) => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./commands/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach((alias) => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = (command) => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  log(chalk.red`Yüklenen eventler | [${event.name}]`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}


client.elevation = (message) => {
  if (!message.guild) {
    let perm = 2;
    ayarlar.owner.forEach((a) => {
      if (a == message.author.id) perm = 5;
    });
    return perm;
  }
  let permlvl = 0;
  if (message.member.hasPermission("CREATE_INSTANT_INVITE")) permlvl = 2;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 3;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 4;
  if (message.author.id === ayarlar.owner) permlvl = 5;
  return permlvl;
};




client.tarihHesapla = (date) => {
  const startedAt = Date.parse(date);
  var msecs = Math.abs(new Date() - startedAt);
  const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
  msecs -= years * 1000 * 60 * 60 * 24 * 365;
  const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
  msecs -= months * 1000 * 60 * 60 * 24 * 30;
  const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
  msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
  const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
  msecs -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(msecs / (1000 * 60 * 60));
  msecs -= hours * 1000 * 60 * 60;
  const mins = Math.floor((msecs / (1000 * 60)));
  msecs -= mins * 1000 * 60;
  const secs = Math.floor(msecs / 1000);
  msecs -= secs * 1000;

  var string = "";
  if (years > 0) string += `${years} yıl ${months} ay`
  else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
  else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
  else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
  else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
  else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
  else if (secs > 0) string += `${secs} saniye`
  else string += `saniyeler`;

  string = string.trim();
  return `\`${string} önce\``;
};




const sayiEmojiler = {
  0: `${emoji.sıfır}`, 
  1: `${emoji.bir}`, 
  2: `${emoji.iki}`, 
  3: `${emoji.üç}`, 
  4: `${emoji.dört}`, 
  5: `${emoji.beş}`, 
  6: `${emoji.altı}`, 
  7: `${emoji.yedi}`, 
  8: `${emoji.sekiz}`, 
  9: `${emoji.dokuz}` 
};

ayarlar.emojiSayi = function(sayi) {
  var yeniMetin = "";
  var arr = Array.from(sayi)
  for(var x = 0; x < arr.length; x++) {
    yeniMetin += sayiEmojiler[arr[x]];
  };
  return yeniMetin;
};
ayarlar.rastgeleSayi = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


 
  client.on("guildMemberAdd", member => {
    var kanal = client.channels.cache.get(config.giriş.hoşgeldinKanal)
    member.roles.add(config.roles.unregisteres).catch()       
    member.setNickname(config.giriş.isim)
moment.locale('tr')
let olusturulmaTarihi = `${moment(member.user.createdAt).format('LLL')}`
let olusturulmaTarihiAy = `${client.tarihHesapla(member.user.createdAt)}`
let ses = member.guild.channels.cache.filter(channel => channel.type == "voice").map(channel => channel.members.size).reduce((a, b) => a + b) 
let üyesayısı = member.guild.memberCount
kanal.send(`
${emoji.tedoa} **${config.giriş.SunucuAdı} Sunucusuna Hoş geldin!**
${member} \`(${member.id}),\` hesabın __${olusturulmaTarihi}__ tarihinde \`${olusturulmaTarihiAy}\` oluşturulmuş! :tada:

Seninle birlikte ${ayarlar.emojiSayi(`${üyesayısı}`)} kişi olduk! Ses kanallarında ${ayarlar.emojiSayi(`${ses}`)} kişi bulunmakta. :tada:
Sunucu kurallarımız <#${config.giriş.kurallar}> kanalında belirtilmiştir. Unutma sunucu içerisinde ki \`ceza-i işlemler\` kuralları okuduğunu varsayarak gerçekleştirilecek.
Tagımıza ulaşmak için herhangi bir kanala \`${ayarlar.prefix}tag\` yazman yeterlidir. Şimdiden iyi eğlenceler! :tada: :tada:`)
  })

// 


client.on("message", message => {
 if (message.author.bot) return;
 let selamlar = ["sa", "selam", "selamın aleyküm", "selamın aleykum", "sea", "sA", "selamın aleykm", "selamün aleyküm", "selamun aleykum"]
        if (selamlar.some(s => message.content.toLowerCase() === s)) {
            message.channel.send(`${message.author}, Aleyküm selam hoş geldin.`)
        }
})

client.on("message", message => {
  if(message.author.bot) return;
  let taglar = ["tag", ".tag", "!tag", "-tag", "TAG", "Tag"]
      if (taglar.some(t => message.content.toLowerCase() === t)) {
              message.channel.send(`${config.taglar.tag}`)
    }
  })

client.login(ayarlar.token);