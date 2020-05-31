function Greet() {
    this.greet = 'Hello Nodejs';
    this.greet4 = function() {
        console.log(this.greet);
    }
}

module.exports = Greet;