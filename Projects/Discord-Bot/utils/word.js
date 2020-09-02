const PERSONALITY = [
    'Fearless',
    'Brave',
    'Clever',
    'Awesome',
    'Hard working',
    'Crazy',
    'Friendly'
];
const ARRIVAL = [
    'hopped into the server',
    'just arrived',
    'beautifies the server',
    'crashes the server by arrival'
]
const BAD_WORDS = [
    'bc',
    'bhosdina',
    'madarchod',
    'mc',
    'lund',
    'land',
    'fuck',
    'chodu',
    'chutiyo',
    'pikino',
    'asshole',
    'penis',
    'vegina',
    'xxx',
    'boobs',
    'fucker'
]
module.exports = function selectRandom() {
    return {
        PERSONALITY : PERSONALITY[Math.floor(Math.random()*PERSONALITY.length)],
        ARRIVAL : ARRIVAL[Math.floor(Math.random()*ARRIVAL.length)],
        BAD_WORDS : BAD_WORDS
    }
}