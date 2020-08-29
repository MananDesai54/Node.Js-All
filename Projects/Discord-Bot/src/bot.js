require('dotenv').config();
const { Client } = require('discord.js');

const client = new Client();
const PREFIX = ':';

client.on('ready',()=>{
    console.log(`${client.user.username}(${client.user.tag}) has joined , verified = ${client.user.verified}.`);
});
client.on('message', message =>{

    if(message.author.bot) return;

    console.log(`${message.content} from ${message.author.tag} in ${message.channel.name} server.`);
    
    if(message.content.toLowerCase().includes('hello') || message.content.toLowerCase().includes('hi') || message.content.toLowerCase().includes('hey') || message.content.toLowerCase().includes('reply')) {
        // message.reply('Hey, There !')
        message.channel.send('Hey, There !!');
    }
})

client.login(process.env.DISCORDJS_BOT_TOKEN);