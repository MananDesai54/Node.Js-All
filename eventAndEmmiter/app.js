const Emmiter = require('./ourEmmiter');

const fileEvent = new Emmiter();
fileEvent.on('save',()=>{
    console.log('Saved');
})

fileEvent.emit('save');