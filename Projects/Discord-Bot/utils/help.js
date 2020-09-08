const help = (PREFIX) => [
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
        value:`${PREFIX} sticker/stk topicOfSticker`
    },
    {
        name:'gif',
        value:`${PREFIX} gif topicOfSticker`
    },
    {
        name:'meme',
        value:`${PREFIX} meme [valid subreddit for meme(Optional)]`
    },
    {
        name:'music',
        value:`${PREFIX} help music`
    }
];

const musicHelp = (PREFIX) => [
    {
        name:'play',
        value:`${PREFIX} play/pl youtubeLink/nameOfSong/spotifyLink(currently not available)`
    },
    {
        name:'stop/disconnect',
        value:`${PREFIX} stop/st/disconnect/dc`
    },
    {
        name:'pause',
        value:`${PREFIX} pause/pas`
    },
    {
        name:'resume',
        value:`${PREFIX} resume/res`
    },
    {
        name:'next/skip',
        value:`${PREFIX} next/nxt/skip/skp`
    },
    {
        name:'reset/clear',
        value:`${PREFIX} reset/rst/clear/clr`
    },
    {
        name:'goto',
        value:`${PREFIX} goto/gt songNumberInQueue`
    },
    {
        name:'seek',
        value:`${PREFIX} seek timeToSeek`
    },
    {
        name:'queue',
        value:`${PREFIX} queue/qu`
    },
    {
        name:'now-playing',
        value:`${PREFIX} now-playing/np`
    },
    {
        name:'playList',
        value:`${PREFIX} help playlist`
    },
    {
        name:'lyrics',
        value:`${PREFIX} lyrics`
    }
];

const playlistHelp = (PREFIX) => [
    {
        name:'create/make',
        value:`${PREFIX} create/make playlistName`
    },
    {
        name:'add',
        value:`${PREFIX} add videoId`
    },
    {
        name:'show all playlists',
        value:`${PREFIX} playlists`
    },
    {
        name:'show one playlists',
        value:`${PREFIX} playlists show playlistName`
    },
    {
        name:'play one playlists',
        value:`${PREFIX} playlists play playlistName`
    },
]

module.exports = {
    help,
    musicHelp,
    playlistHelp
}