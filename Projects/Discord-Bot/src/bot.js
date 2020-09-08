require('dotenv').config();
const { Client,WebhookClient, MessageEmbed, MessageAttachment } = require('discord.js');
const { BAD_WORDS } = require('../utils/word')();
const axios = require('axios');
const ytdl = require('ytdl-core');
const Playlist = require('../models/model');
const connect = require('../config/config');
const getYoutubeId = require('get-youtube-id');
const { checkVoiceConnected,toggleRole } = require('../utils/utils');
const { help,musicHelp,playlistHelp } = require('../utils/help');
const welcomeGreet = require('./welcomeGreet');

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
// const spotifyURL = 'https://api.spotify.com/v1/';
const servers = {};
let nowPlaying = 0;
const urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

//playlist
connect();

//speech
// const speech = require('@google-cloud/speech');
// const speechClient = new speech.SpeechClient();

client.on('ready',()=>{
    console.log(`${client.user.username}(${client.user.tag}) has joined , verified = ${client.user.verified}.`);
});

client.on('guildMemberSpeaking',(member,speaking) => {
    console.log(member.user.tag,speaking);
})

client.on('guildMemberAdd',welcomeGreet);

client.on('messageReactionAdd',(reaction,user)=> {
    toggleRole(reaction,user,'add');
    //roles comment
})

client.on('messageReactionRemove',(reaction,user)=> {
    toggleRole(reaction,user,'remove');
    //roles comment
})

client.on('message', async message =>{

    if(message.author?.bot) return;

    if(message.content.startsWith(PREFIX)) {
        if(message.content[PREFIX.length] === ' ') {
            message.content = message.content.slice(0,PREFIX.length).concat(message.content.slice(PREFIX.length+1,message.content.length));
            console.log(message.content);
        }
        
        let [CMD_NAME,...args] = message.content
                        .trim()
                        .substring(PREFIX.length)
                        .split(/\s+/);
        const TASK = args;
        CMD_NAME = CMD_NAME.trim().toLowerCase();
        console.log(CMD_NAME,TASK);
        if(CMD_NAME === "kick") {

            if (TASK.length===0) return message.reply('Please Provide an ID.')

            const member = message.guild.members.cache.get(TASK[0]);
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
            let messageEmbed;
            if(TASK.length === 0) {
                messageEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Buggy Help')
                        .setURL('https://twitter.com/developtheweb_')
                        .setAuthor('The Buggy','https://cdn3.vectorstock.com/i/1000x1000/68/52/bug-in-code-vector-11976852.jpg','https://twitter.com/developtheweb_')
                        .setDescription('Bot to make your life bugs free.(Prefix =>)')
                        .setThumbnail('https://cdn3.vectorstock.com/i/1000x1000/68/52/bug-in-code-vector-11976852.jpg')
                        .addFields(
                            ...help(PREFIX)
                        )
                        .addField('To select role','Go in role channel and react with particular emoji')
                        .setTimestamp('For more')
                        .setFooter('For more Visit https://twitter.com/developtheweb_');
            } else if(TASK.join(' ').toLowerCase().includes('music')) {
                messageEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Music Help')
                        .setURL('https://twitter.com/developtheweb_')
                        .setAuthor('The Buggy','https://cdn3.vectorstock.com/i/1000x1000/68/52/bug-in-code-vector-11976852.jpg','https://twitter.com/developtheweb_')
                        .setDescription('How to play and handle musics.')
                        .setThumbnail('https://cdn3.vectorstock.com/i/1000x1000/68/52/bug-in-code-vector-11976852.jpg')
                        .addFields(
                            ...musicHelp(PREFIX)
                        )
            } else if(TASK.join(' ').toLowerCase().includes('playlist')) {
                messageEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Playlist Help')
                        .setURL('https://twitter.com/developtheweb_')
                        .setAuthor('The Buggy','https://cdn3.vectorstock.com/i/1000x1000/68/52/bug-in-code-vector-11976852.jpg','https://twitter.com/developtheweb_')
                        .setDescription('How to create and use.')
                        .setThumbnail('https://cdn3.vectorstock.com/i/1000x1000/68/52/bug-in-code-vector-11976852.jpg')
                        .addFields(
                            ...playlistHelp(PREFIX)
                        )
            }
            message.channel.send(messageEmbed);
        } else if(CMD_NAME === 'sticker' || CMD_NAME === 'stk') {
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
            //meme comment in comment txt
        } else if(CMD_NAME === 'join'){

            if(!message.guild.voice?.connection) {
                message.member.voice.channel.join()
                        .then(connection => {
                            message.reply('Join to the voice channel '+message.guild.voice.channel.name);
                        })
            } else {
                message.reply('ALready inside the voice channel :'+message.guild.voice.channel.name);
            }

        } else if(CMD_NAME === 'tts'){

            if(!checkVoiceConnected(message)) {
                message.reply('Please connect to any voice channel.')
                return
            }
            const text = TASK.join(' ');
            if(!message.guild.voice?.connection) {
                message.member.voice.channel.join()
                        .then(connection => {
                            message.channel.send(text,{
                                tts:true
                            })
                        })
            } else {
                message.channel.send(text,{
                    tts:true,
                })
            }

        }else if(CMD_NAME === 'play' || CMD_NAME === 'pl') {
            //play comment in comment txt
            if(!checkVoiceConnected(message)) {
                message.reply('Please connect to any voice channel.')
                return
            } else {
                if(TASK.length === 0) {
                    message.reply('Please Provide a link or keyword.');
                    return;
                }
                // } else if(!urlPattern.test(TASK.join(' '))) {
                    
                //     message.reply('Provided argument is either not a link or not a valid link.');
                //     return;
                // } 
                else {
                    if(!servers[message.guild.id]) {
                        servers[message.guild.id] = {
                            queue:[]
                        }
                    }
                    let server = servers[message.guild.id];
                    
                    if(!urlPattern.test(TASK.join(' '))) {
                        const videos = await axios.get('https://www.googleapis.com/youtube/v3/search?part=id&type=video&q='+TASK.join(' ')+'&key=AIzaSyDNhtqfdYgOAM8tTiNSAcUWv3cFAkrN5u8')
                        
                        server.queue.push('https://www.youtube.com/watch?v='+videos.data.items[0].id.videoId);
                    } else {
                        server.queue.push(TASK.join(''));
                    }
                    console.log(server.queue);
                    const messageEmbed = new MessageEmbed()
                            .setColor('#ADFF2F')
                            .setTitle('Added to queue at '+ server.queue.length)
                            message.channel.send(messageEmbed);
                    if(!message.guild.voice?.connection) {
                        message.member.voice.channel.join()
                                .then(connection => {
                                    play(connection,message,0);
                                })
                    }

                }
            }
        } else if(CMD_NAME === 'stop' || CMD_NAME === 'disconnect' || CMD_NAME === 'st' || CMD_NAME === 'dc') {
            const server = servers[message.guild.id];
            if(!checkVoiceConnected(message)) {
                message.reply('Please connect to any voice channel.')
                return
            } else {
                if(!message.guild.voice.connection) {
                    message.reply('Please add me to the voice channel.')
                } else {
                    if(server) {
                        for(let i=0;i<server.queue.length;i++) {
                            server.queue.splice(i,1);
                        }
                        const messageEmbed = new MessageEmbed()
                                    .setColor('#ff0000')
                                    .setTitle('Stopped playing')
                                    message.channel.send(messageEmbed);
                    }
                }
                message.guild.voice.connection.disconnect();
            }
        } else if(CMD_NAME === 'pause' || CMD_NAME === 'pas') {

            if(!checkVoiceConnected(message)) {
                message.reply('Please connect to any voice channel.')
                return
            } 
            const server = servers[message.guild.id];
            if(server.dispatcher) {
                const messageEmbed = new MessageEmbed()
                            .setColor('#ff00ff')
                            .setTitle('Paused')
                            message.channel.send(messageEmbed);
                server.dispatcher.pause();
            } else {
                message.reply('No song is playing.')
            }
        } else if(CMD_NAME === 'resume' || CMD_NAME === 'res') {
            if(!checkVoiceConnected(message)) {
                message.reply('Please connect to any voice channel.')
                return
            } 

            const server = servers[message.guild.id];
            if(server.dispatcher) {
                const messageEmbed = new MessageEmbed()
                            .setColor('#ff00ff')
                            .setTitle('Resumed')
                            message.channel.send(messageEmbed);
                server.dispatcher.resume(); 
            } else {
                message.reply('No song is playing.')
            }
        } else if(CMD_NAME === 'next' || CMD_NAME === 'skip' || CMD_NAME === 'nxt' || CMD_NAME === 'skp') {

            if(!checkVoiceConnected(message)) {
                message.reply('Please connect to any voice channel.')
                return
            } 

            const server = servers[message.guild.id];
            if(server.dispatcher) {
                const messageEmbed = new MessageEmbed()
                            .setColor('#ff00ff')
                            .setTitle('Playing next song')
                            message.channel.send(messageEmbed);
                server.dispatcher.end(); 
            } else {
                message.reply('No song is playing.')
            }
        } else if(CMD_NAME === 'clear' || CMD_NAME === 'reset' || CMD_NAME === 'clr' || CMD_NAME === 'rst') {

            if(!checkVoiceConnected(message)) {
                message.reply('Please connect to any voice channel.')
                return
            } 

            const server = servers[message.guild.id];
            if(server.dispatcher) {
                for(let i=0;i<server.queue.length;i++) {
                    server.queue.splice(i,1);
                }
                const messageEmbed = new MessageEmbed()
                            .setColor('#999999')
                            .setTitle('Cleared current queue')
                            message.channel.send(messageEmbed);
                server.dispatcher.end();
                message.channel.send('queue cleared');      
            } else {
                message.reply('Please connected to voice channel.')
            }
        } else if(CMD_NAME === 'goto' || CMD_NAME === 'gt') {

            if(!checkVoiceConnected(message)) {
                message.reply('Please connect to any voice channel.')
                return
            } 

            const server = servers[message.guild.id];
            if(TASK.length === 0) {
                message.react('😒')
                message.reply('I cannot read your mind, provide a number')
                return
            }
            const number = TASK[0];
            if(isNaN(number)) {
                if(number === 'first' || number === 'last') {
                    console.log('Hello');
                    if(number === 'first') {
                        play(message.guild.voice.connection,message,0);
                    } else {
                        play(message.guild.voice.connection,message,server.queue.length-1);
                    }
                    return;
                } else {
                    message.react('😒')
                    message.reply( `You do not know that ${number} is not a valid number.`)
                    return;
                }
            } else if(+number < 1 || +number > server.queue.length) {
                message.reply('No song available at that number.');
                return;
            }
            play(message.guild.voice.connection,message,+number-1);
            const messageEmbed = new MessageEmbed()
                    .setColor('#ffff00')
                    .setTitle(`Playing ${number} number song in queue.`)
            message.channel.send(messageEmbed);
        } else if(CMD_NAME === 'queue' || CMD_NAME === 'qu') {

            if(!checkVoiceConnected(message)) {
                message.reply('Please connect to any voice channel.')
                return
            } 

            const server = servers[message.guild.id];
            const queueSongs = []
            server.queue.forEach((song,index) => {
                queueSongs.push({
                    name:`Song ${index+1}`,
                    value:song
                })
            });

            const messageEmbed = new MessageEmbed()
                        .setColor('#e76f51')
                        .addFields(...queueSongs);
            
            message.channel.send(messageEmbed);

        } else if(CMD_NAME === 'np' || CMD_NAME === 'now-playing') {

            if(!checkVoiceConnected(message)) {
                message.reply('Please connect to any voice channel.')
                return
            } 
            message.reply(`Now Playing ${nowPlaying-1} - ${servers[message.guild.id].queue[nowPlaying]}`);

        } else if(CMD_NAME === 'create' || CMD_NAME === 'make') {
            let user = await Playlist.findOne({
                discordId:message.author.id
            });
            if(!user) {
                user = new Playlist();
                user.discordId = message.author.id;

            }            
            const playlist = await user.playlist.find(plist => plist.name === TASK.join(' ').toLowerCase());
            if(playlist) {
                message.reply(`Playlist with name ${TASK.join(' ')} already exist.`);
                return;
            }
            user.playlist.push({
                name:TASK.join(' ').toLowerCase(),
                songs:[]
            })
            await user.save();
            message.channel.send('Playlist created to see all playlists type `'+PREFIX+' playlists`');
            const messageEmbed = new MessageEmbed()
                        .setColor('#e76f51')
                        .setTitle(TASK.join(' ')+' created');
            
            message.channel.send(messageEmbed);
            return console.log(user);
        } else if(CMD_NAME === 'add') {
            let user = await Playlist.findOne({
                discordId:message.author.id
            });
            console.log(user);
            
            if(!user) {
                message.reply('Please create at least one playlist.');
                return
            }
            const playlistIndex = await user.playlist.findIndex(plist => plist.name === TASK[0].toLowerCase());
            console.log(playlistIndex);
            if(playlistIndex === -1) {
                message.reply(`Playlist with name ${TASK[0]} does not exist.`);
                return;
            }
            let id;
            if(urlPattern.test(TASK[1])) {
                id = TASK[1];
            } else {
                const keyword = TASK.slice(1).join(' ');
                const videos = await axios.get('https://www.googleapis.com/youtube/v3/search?part=id&type=video&q='+keyword+'&key=AIzaSyDNhtqfdYgOAM8tTiNSAcUWv3cFAkrN5u8')
                id = 'https://www.youtube.com/watch?v='+videos.data.items[0].id.videoId;
            }

            await user.playlist[playlistIndex].songs.push(id);
            message.channel.send('Successfully added to show playlist type `'+PREFIX+' playlists show PLAYLIST_NAME`');
            await user.save();
        } else if(CMD_NAME === 'playlists') {
            const user = await Playlist.findOne({
                discordId : message.author.id
            });
            if(!user) {
                message.reply('Please create at-least one playlist by `create'+PREFIX+'playlist`');
                return;
            }
            if(TASK.length === 0) {
                const playlists = await user.playlist.map(plist => ({
                    name:plist.name,
                    value:`Total song/s are ${plist.songs.length}`
                }))
                const messageEmbed = new MessageEmbed()
                        .setColor('#457b9d')
                        .setTitle('Playlists')
                        .addFields(...playlists)
                        .setFooter(`To see more descriptive type, ${PREFIX+` playlists show PLAYLIST_NAME`}`);
                
                message.channel.send(messageEmbed);
                        
            } else if(TASK[0] === 'show') {
                const playlistName = TASK[1];
                const playlistIndex = await user.playlist.findIndex(plist => plist.name === playlistName);
                if(playlistIndex === -1) {
                    message.reply('No playlist with name '+ playlistName);
                    return;
                }
                const songs = await user.playlist[playlistIndex].songs.map((song,index) => ({
                    name:index+1,
                    value:song
                }));

                const messageEmbed = new MessageEmbed()
                        .setColor('#457b9d')
                        .setTitle(user.playlist[playlistIndex].name)
                        .addFields(...songs)
                        .setFooter(`To play any playlist type, ${PREFIX+` playlists play PLAYLIST_NAME`}`);
                
                message.channel.send(messageEmbed);
            } else if(TASK[0] === 'play') {
                const playlistName = TASK[1];
                const playlistIndex = await user.playlist.findIndex(plist => plist.name === playlistName);
                if(playlistIndex === -1) {
                    message.reply('No playlist with name '+ playlistName);
                    return;
                }
                if(!servers[message.guild.id]) {
                    servers[message.guild.id] = {
                        queue:[]
                    }
                }
                const server = servers[message.guild.id];
                server.queue = [...user.playlist[playlistIndex].songs];
                message.channel.send(`Playing playlist ${playlistName}`);
                if(!message.guild.voice?.connection) {
                    message.member.voice.channel.join()
                            .then(connection => {
                                play(connection,message,0);
                            })
                } else {
                    play(message.guild.voice.channel,message,0);
                }
            }
        } else if(CMD_NAME === 'listen' || CMD_NAME === 'hear') {
            if(!message.member.voice.channel) {
                message.reply('Please connect to any voice channel.')
                return
            } 
        }
        else if(CMD_NAME === 'any') {
            //seek ,playlist , lyrics ,speech to text 
            //spotify music api , search by keyword
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

async function play(connection,message,numberOfSong) {
    let server = servers[message.guild.id];
    console.log(server.queue[numberOfSong],numberOfSong);
    server.dispatcher = connection.play(
        ytdl(server.queue[numberOfSong],{
            filter:'audioonly'
        })
    );
    const id = getYoutubeId(server.queue[numberOfSong]);
    console.log(id);
    
    let title;
    try {
        const videoDetails = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=${id}&key=AIzaSyDNhtqfdYgOAM8tTiNSAcUWv3cFAkrN5u8`);
        title = await videoDetails.data.items[0]?.snippet?.localized?.title;
        console.log(title);
    } catch (error) {
        title = 'Playing next song';
    }
    

    nowPlaying = numberOfSong;
    const messageEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setTitle('Playing - '+title)
    message.channel.send(messageEmbed);

    server.dispatcher.on("finish",()=>{
        server.queue.splice(numberOfSong,1);
        console.log(server.queue);
        if(server.queue[numberOfSong+1]) {
            play(connection,message,numberOfSong+1);
        } else {
            if(server.queue.length === 0) {
                connection.disconnect();
            } else {
                play(connection,message,0)
            }
        }
    })
}

client.login(process.env.DISCORDJS_BOT_TOKEN);