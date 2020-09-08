module.exports =  async function play(connection,message,numberOfSong) {
    let server = servers[message.guild.id];
    console.log(server.queue[numberOfSong],numberOfSong);
    server.dispatcher = connection.play(
        ytdl(server.queue[numberOfSong],{
            filter:'audioonly'
        })
    );
    const id = getYoutubeId(server.queue[numberOfSong]);
    console.log(id);
    
    const videoDetails = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=${id}&key=AIzaSyDNhtqfdYgOAM8tTiNSAcUWv3cFAkrN5u8`);
    const title = await videoDetails.data.items[0]?.snippet?.localized?.title;
    console.log(title);

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