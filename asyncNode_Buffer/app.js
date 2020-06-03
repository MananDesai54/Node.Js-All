const buffer = new Buffer.from('Manan','utf8')

console.log(buffer);
console.log(buffer.toString());
console.log(buffer.toJSON());

console.log(buffer[2]);

buffer.write('Sj');
console.log(buffer.toString());