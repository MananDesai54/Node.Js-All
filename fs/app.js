const fs = require('fs');

const greet = fs.readFileSync(__dirname+'/hello.txt','utf8'); //syncronous approch
console.log(greet);

const greet2 = fs.readFile(__dirname+'/hello.txt',(err,data)=>{
    if(err) console.log(err);
    else console.log(data.toString());
})
const greet3 = fs.readFile(__dirname+'/hello.txt','utf8',(err,data)=>{
    if(err) console.log(err);
    else console.log(data);
})

console.log('Hello');
// fs.close(2,(err,data)=>{
//     console.log('closed')
// });