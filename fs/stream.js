const fs = require('fs');

const readStream = fs.createReadStream(`${__dirname}/text.txt`,{encoding:'utf8',highWaterMark:8*1024});
const writeSteram = fs.createWriteStream(`${__dirname}/textcopy.txt`);

readStream.on('data',(chunk)=>{
    // console.log(chunk);
    console.log(chunk.length);
    writeSteram.write(chunk);
})