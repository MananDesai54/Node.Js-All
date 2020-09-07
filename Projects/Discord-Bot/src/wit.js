const { Wit,log } = require('node-wit');

const client = new Wit({
    accessToken:process.env.WIT_API_KEY,
    logger:new log.Logger(log.DEBUG)
})

console.log(client.message('set alarm tomorrow at 7pm.'));