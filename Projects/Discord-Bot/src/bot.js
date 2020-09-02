require('dotenv').config();
const { Client,WebhookClient, MessageEmbed, MessageAttachment } = require('discord.js');
const { ARRIVAL,PERSONALITY,BAD_WORDS } = require('../utils/word')();
const axios = require('axios');

const client = new Client({
    partials:['MESSAGE','REACTION']
});
const webHookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN
);
let PREFIX = '=>';

//gif and sticker
const giphyURL = 'https://api.giphy.com/v1';

//meme
const { memeAsync, meme } = require('memejs');
// const getMeme = require('random-puppy');

//song
const spotifyURL = 'https://api.spotify.com/v1/';


//speech
// const speech = require('@google-cloud/speech');
// const speechClient = new speech.SpeechClient();

// speechClient.recognize

client.on('ready',()=>{
    console.log(`${client.user.username}(${client.user.tag}) has joined , verified = ${client.user.verified}.`);
});

client.on('guildMemberAdd',async (member)=>{
    const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    if(!welcomeChannel) return;
    welcomeChannel.send(`A ${PERSONALITY} person, ${ARRIVAL}`);
    welcomeChannel.send(`Hey ${member.user}, Welcome To The Bug!`);
    const res = await axios.get(`${giphyURL}/stickers/search?api_key=${process.env.GIPHY_API_KEY}&q=welcome&limit=1`);
    const gif = res.data?.data[Math.floor(Math.random()*(res.data.data.length))]?.images?.original?.url;
    const messageEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Welcome')
            .setImage(gif);
    welcomeChannel.send(messageEmbed);
    if(!member.user.bot) {
        member.send(messageEmbed);
        member.send(member.user.username + ' Welcome To the Server..!!');
    }
})

client.on('message', async message =>{

    if(message.author?.bot) return;

    // console.log(`${message.content} from ${message.author.tag} in ${message.channel.name} server.`);
    
    // if(message.content.toLowerCase().includes('hello') || message.content.toLowerCase().includes('hi') || message.content.toLowerCase().includes('hey') || message.content.toLowerCase().includes('reply')) {
    //     // message.reply('Hey, There !')
    //     message.channel.send('Hey, There !!');
    // }
    // if(message.author.id === '731812740426891266') {
    //     console.log('Hello');
    //     message.delete();
    // }
    if(message.content.startsWith(PREFIX)) {
        if(message.content[PREFIX.length] === ' ') {
            message.content = message.content.slice(0,PREFIX.length).concat(message.content.slice(PREFIX.length+1,message.content.length));
            console.log(message.content);
            // return
        }
        
        let [CMD_NAME,...args] = message.content
                        .trim()
                        .substring(PREFIX.length)
                        .split(/\s+/);
        const TASK = args;
        CMD_NAME = CMD_NAME.trim();
        console.log(CMD_NAME,TASK);
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
        } else if(CMD_NAME === 'prefix') {
            PREFIX = TASK.join(' ');
            message.react('👍');
            message.reply(`Prefix set to ${PREFIX}`);
        } else if(CMD_NAME === 'help') {
            const messageEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Buggy Help')
                        .setURL('https://twitter.com/developtheweb_')
                        .setAuthor('The Buggy','https://cdn3.vectorstock.com/i/1000x1000/68/52/bug-in-code-vector-11976852.jpg','https://twitter.com/developtheweb_')
                        .setDescription('Bot to make your life bugs free.(Prefix =>)')
                        .setThumbnail('https://cdn3.vectorstock.com/i/1000x1000/68/52/bug-in-code-vector-11976852.jpg')
                        .addFields(
                            {
                                name:'kick',
                                value:`${PREFIX} kick userID`
                            },
                            {
                                name:'ban',
                                value:`${PREFIX} ban userID`
                            },
                            {
                                name:'help',
                                value:`${PREFIX} help`
                            },
                            {
                                name:'sticker',
                                value:`${PREFIX} sticker topicOfSticker`
                            },
                            {
                                name:'gif',
                                value:`${PREFIX} gif topicOfSticker`
                            },
                            {
                                name:'meme',
                                value:`${PREFIX} meme [valid subreddit for meme(Optional)]`
                            },
                        )
                        .addField('To select role','Go in role channel and react with particular emoji')
                        .setTimestamp('For more')
                        .setFooter('For more Visit https://twitter.com/developtheweb_');
            message.channel.send(messageEmbed);
        } else if(CMD_NAME === 'sticker') {
            const url = `${giphyURL}/stickers/search?api_key=${process.env.GIPHY_API_KEY}`;
            const type = TASK.join(' ');
            const res = await axios.get(`${url}&q=${type}`);
            const data = await res.data?.data[Math.floor(Math.random()*(res.data.data.length))]?.images?.original?.url;
            console.log(data,res.data.data.length);
            const messageEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(type.toUpperCase())
                    .setImage(data);
            message.channel.send(messageEmbed);
        } else if(CMD_NAME === 'gif') {
            const url = `${giphyURL}/gifs/search?api_key=${process.env.GIPHY_API_KEY}`;
            const type = TASK.join(' ');
            const res = await axios.get(`${url}&q=${type}`);
            const data = await res.data?.data[Math.floor(Math.random()*(res.data.data.length))]?.images?.original?.url;
            console.log(data,res.data.data.length);
            const messageEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(type.toUpperCase())
                    .setImage(data);
            message.channel.send(messageEmbed);
        } 
        else if(CMD_NAME === 'meme') {
            let messageEmbed;
            message.reply('Coming just a second');
                memeAsync()
                    .then(meme => {
                        messageEmbed = new MessageEmbed()
                                .setURL(meme.url)
                                .setColor('ff00ff')
                                .setTitle(`r\\${meme.subreddit}`)
                                .setImage(meme.url);

                        message.channel.send(messageEmbed);
                    })
                    .catch(err => {
                        message.reply("Network error or i don't know")
                    })
            // if(TASK.length === 0) {
            //     message.reply('Coming just a second');
            //     memeAsync()
            //         .then(meme => {
            //             messageEmbed = new MessageEmbed()
            //                     .setURL(meme.url)
            //                     .setColor('ff00ff')
            //                     .setTitle(`r\\${meme.subreddit}`)
            //                     .setImage(meme.url);

            //             message.channel.send(messageEmbed);
            //         })
            //         .catch(err => {
            //             message.reply("Network error or i don't know")
            //         })
            // } else {
            //     memeAsync(TASK.join(' '))
            //         .then(meme => {
            //             message.reply('Coming just a second');
            //             messageEmbed = new MessageEmbed()
            //                     .setURL(meme.url)
            //                     .setColor('ff00ff')
            //                     .setTitle(`r\\${meme.subreddit}`)
            //                     .setDescription(TASK.join(' '))
            //                     .setImage(meme.url);

            //             message.channel.send(messageEmbed);
            //         })
            //         .catch(err => {
            //             message.reply('Invalid subreddit');
            //         })
            // }
        } else if(CMD_NAME === 'play') {
            axios('https://api.spotify.com/v1/search?q=closer&type=track',{
                headers:{
                    Authorization:process.env.SPOTIFY_API_KEY
                }
            }).then(res => console.log(res));
        }
    } else {
        let badUsed = false;
        BAD_WORDS.forEach(word => {
            message.content.split(' ').forEach(msg => {
                if(word.toLowerCase() === msg.toLowerCase()) {
                    badUsed = true;
                    return
                }
            })
        })
        if(badUsed) {
            const messageEmbed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setTitle(`Warned ${message.author.tag}`)
                        .addFields(
                            {
                                name:'Reason',
                                value:'Bad word usage'
                            },
                            {
                                name:'Message',
                                value:message.content
                            },
                            {
                                name:'Channel',
                                value:message.channel.name
                            },
                        );
            const general = message.guild.channels.cache.find(ch => ch.name ==='general');
            general.send(messageEmbed);
            message.author.send(`${message.author} that word not allowed here 😒.`);
            message.reply(` that word not allowed here 😒.`)
        }
    }
});

client.on('messageReactionAdd',(reaction,user)=> {
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