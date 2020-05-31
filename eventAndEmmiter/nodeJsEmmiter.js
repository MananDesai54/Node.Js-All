const Emmitter = require('events');
const events = require('./confing').events;

const speak = new Emmitter();

speak.on(events.GOOGLE,()=>{
    console.log('Open your favourite browser..');
})

speak.emit(events.GOOGLE); 