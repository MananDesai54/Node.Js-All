const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/index');
const setUpController = require('./controllers/setupController');
const apiController = require('./controllers/apiController');

const app = express();
const port = process.env.PORT || 3000;

app.use('/',express.static(__dirname+'/public'));
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.send('TODO')
})

mongoose.connect(config.getDbConnectionString(),{
    useUnifiedTopology: true,
    useNewUrlParser: true
});
setUpController(app);

apiController(app);


app.listen(port);