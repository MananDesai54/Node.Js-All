const typed = new ArrayBuffer(8);
console.log(typed);

const view = new Int32Array(typed);  //we can store 2 nums in it bcaz types has 64 bits (8*8) and view is of 32 bit so...
view[0]=1
view[1]=2;

console.log(view);