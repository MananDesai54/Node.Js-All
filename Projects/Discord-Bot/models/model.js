const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    discordId : {
        type:String,
        required:true
    },
    playlist : [
        {
            name:{
                type:String,
                required:true
            },
            songs : []
        }
    ]
});

module.exports = mongoose.model('Playlist',Schema);