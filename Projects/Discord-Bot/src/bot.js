require('dotenv').config();
const { Client,WebhookClient } = require('discord.js');

const client = new Client({
    partials:['MESSAGE','REACTION']
});
const webHookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN
);
const PREFIX = '=>';

client.on('ready',()=>{
    console.log(`${client.user.username}(${client.user.tag}) has joined , verified = ${client.user.verified}.`);
});

client.on('guildMemberAdd',(member)=>{
    member.send(member.user.username + ' Welcome To the Server..!!');
    // console.log(member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID));
    // member.guild.channels.client.emit('message',{
    //     content:`${member.user.username}, Welcome to the Server.`
    // });
    // const welcomeChannel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
    // welcomeChannel
})

client.on('message', async message =>{

    if(message.author?.bot) return;

    // console.log(`${message.content} from ${message.author.tag} in ${message.channel.name} server.`);
    
    // if(message.content.toLowerCase().includes('hello') || message.content.toLowerCase().includes('hi') || message.content.toLowerCase().includes('hey') || message.content.toLowerCase().includes('reply')) {
    //     // message.reply('Hey, There !')
    //     message.channel.send('Hey, There !!');
    // }

    if(message.content.startsWith(PREFIX)) {
        const [CMD_NAME,...args] = message.content
                        .trim()
                        .substring(PREFIX.length)
                        .split(/\s+/);
        const TASK = args;
        // console.log(CMD_NAME,task);
        if(CMD_NAME === "kick") {

            if (TASK.length===0) return message.reply('Please Provide an ID.')

            const member = message.guild.members.cache.get(TASK[0]);
            // console.log(member);
            if(member) {
                
                if(!message.member.hasPermission('KICK_MEMBERS')) {
                    return message.reply('You do not have permission to kick users.');
                }

                member
                    .kick()
                    .then(res => {
                        message.react('👍');
                        message.channel.send(`${member} was kicked`);
                    })
                    .catch(err=>{
                        message.react('👎');                        
                        message.reply('I cannot remove that member :(',{
                            type:'code'
                        });
                    });
            } else {
                message.react('👎');
                message.reply('Member not found',{
                    type:'rich'
                });
            }
        } else if(CMD_NAME === 'ban') {
            if(!message.member.hasPermission('BAN_MEMBERS')) {
                return message.reply('You do not have permission to ban a member.');
            }
            if (TASK.length===0) return message.reply('Please Provide an ID.');

            try {
                const member = await message.guild.members.ban(TASK[0]);
                return console.log(member);
            } catch (error) {
                message.reply('I am not able to ban');
                return message.react('☹');
            }
        } else if(CMD_NAME === 'announce') {
            const msg = TASK.join(' ');
            webHookClient.send(msg);
        }
    }
});

client.on('messageReactionAdd',(reaction,user)=> {
    console.log('Hello');
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id)

    if(reaction.message.id === '749295738923515994') {
        switch (name) {
            case '🐶':
                member.roles.add('749291588722622575');
                break;
            case '🦁':
                member.roles.add('749291660378374285');
                break;
            case '🐯':
                member.roles.add('749291723720491088');
                break;
            case '🐴':
                member.roles.add('749291825390420089');
                break;
            case '🐘':
                member.roles.add('749292191045910762')
                break;
            case '🦊':
                member.roles.add('749291960166252664')
                break;
        
            default:
                break;
        }
    }
})

client.on('messageReactionRemove',(reaction,user)=> {
    console.log('Hello');
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id)

    if(reaction.message.id === '749295738923515994') {
        switch (name) {
            case '🐶':
                member.roles.remove('749291588722622575');
                break;
            case '🦁':
                member.roles.remove('749291660378374285');
                break;
            case '🐯':
                member.roles.remove('749291723720491088');
                break;
            case '🐴':
                member.roles.remove('749291825390420089');
                break;
            case '🐘':
                member.roles.remove('749292191045910762')
                break;
            case '🦊':
                member.roles.remove('749291960166252664')
                break;
        
            default:
                break;
        }
    }
})

client.login(process.env.DISCORDJS_BOT_TOKEN);