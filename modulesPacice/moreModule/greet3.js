function Greet() {
    this.greet = 'Hello Nodejs';
    this.greet3 = function() {
        console.log(this.greet);
    }
}

module.exports = new Greet();