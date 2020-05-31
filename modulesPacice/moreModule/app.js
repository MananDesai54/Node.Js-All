//check all module pattern in perticular module file...

//pattern1
const greet = require('./greet1');
greet.greet1();

const greet1 = require('./greet1').greet1;
greet1();



//pattern2
const greet2 = require('./greet');
greet2();

//patern3
//When we require any module it caches in memeory so then if we require the same module again it will return the previously required so here we require greet3 twise and it return object and they are passed by reference.... so when we require 2nd time it wiil not retrun new module.exports but return the prevoisly cached require so here we changed greet3 object and that change reflectd in greet3_1.....(so in this case due to we return object in module.exports 1st time everytimet he same object will return due to caching...)
const greet3 = require('./greet3');
greet3.greet3();
greet3.greet = 'Hello again Nodejs';

const greet3_1 = require('./greet3');
greet3_1.greet3();



//pattern4
//use this if we need caching but not retrun same object every time...
const Greet4 = require('./greet4');
const g4 = new Greet4();
g4.greet4();
g4.greet = 'Hello NOdejs again';

const Greet4_1 = require('./greet4');
const g4_1 = new Greet4_1();
g4_1.greet4();
g4_1.greet = 'Hello NOdejs again';



//pattern5
//only reveal functions or objects or any other propety that any other need , oher things remain private or hidden..
//also called Revealing module pattern... => returning only property and methods you want via returned object... moe common and clean.. 
const greet5 = require('./greet5');
greet5.greet();