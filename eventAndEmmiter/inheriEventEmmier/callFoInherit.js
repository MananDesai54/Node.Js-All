const EventEmmiter = require('events');
const utils = require('util');

function Person(name) {
    this.name = name
    this.age = 10
}

Person.prototype.greet = function() {
    console.log(`Hello ${this.name}`);
}

function Man(name) {
    Person.call(this,name);
    this.gender = 'Man';
}

utils.inherits(Man,Person);

const manan = new Man('Manan');
manan.greet();