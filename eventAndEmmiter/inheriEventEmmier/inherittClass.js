class Person {
    constructor(name) {
        this.name = name;
        this.age = 19
    }

    greet() {
        console.log(`Hello ${this.name}`);
    }
}

class Manan extends Person {
    constructor(name) {
        super(name)
        this.hello = 'Hello'
    }
}

const manan = new Manan('Manan')
manan.greet();