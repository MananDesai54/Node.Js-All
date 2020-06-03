function greet(callback) {
    console.log('Let us greet');
    const data = {
        name:'Manan'
    }
    callback(data);
}

greet(function(data) {
    console.log(`Hello ${data.name}`);
})