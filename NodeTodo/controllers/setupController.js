const Todos = require('../models/todoModel');

module.exports = function(app) {

    app.get('/api/setupTodos',(req,res)=>{

        //seed database
        const startupTodos = [
            {
                username:'test',
                todo:'MERN',
                isDone:false,
                hasAttachment:false
            },
            {
                username:'test',
                todo:'Firebase',
                isDone:false,
                hasAttachment:false
            },
            {
                username:'test',
                todo:'Mean/Mevn',
                isDone:false,
                hasAttachment:false
            },
        ];

        Todos.create(startupTodos,(err,results)=>{
            if(err) throw err;
            res.send(results);
        })

    })

}