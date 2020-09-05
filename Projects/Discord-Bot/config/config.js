const mongoose = require('mongoose');

module.exports = function() {
    mongoose.connect(process.env.MONGODB_URL,{
        useUnifiedTopology:true,
        useNewUrlParser:true
    },err=>{
        if(err) return console.log(err);
        console.log('Connected to Database');
    })
}