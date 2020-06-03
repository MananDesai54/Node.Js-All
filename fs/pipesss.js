const fs = require('fs');
const zlib = require('zlib');

const readS = fs.createReadStream(__dirname+'/text.txt',{encoding:'utf8'});
const writeS = fs.createWriteStream(__dirname+'/copypipe.txt');
const gz = zlib.createGzip();
const compressed = fs.createWriteStream(__dirname+'/copy.txt.gz');

readS.pipe(writeS);
readS.pipe(gz).pipe(compressed);