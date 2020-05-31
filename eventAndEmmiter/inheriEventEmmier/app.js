const Events = require('events');
const utils = require('util');

function Greet() {
    this.greeting = 'Hello Node';
}

utils.inherits(Greet,Events);

Greet.prototype.greet = function(data) {
    console.log(this.greeting);
    this.emit('greet',data);
}

const greetr = new Greet();
greetr.on('greet',(data)=>{
    console.log('Greeted...!!',data);
}); 

greetr.greet('Hello');