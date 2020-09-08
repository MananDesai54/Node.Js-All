const { ARRIVAL,PERSONALITY } = require('../utils/word')();
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const giphyURL = 'https://api.giphy.com/v1';

module.exports = async function(member) {
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
}