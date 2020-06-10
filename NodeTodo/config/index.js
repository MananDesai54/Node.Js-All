const config = require('./config.json');

module.exports = {
    getDbConnectionString: function(){
        return `mongodb+srv://${config.uname}:${config.pwd}@nodetodo-z76eq.mongodb.net/${config.dbname}?retryWrites=true&w=majority`;
    }
}