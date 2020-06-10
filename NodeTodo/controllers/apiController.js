const Todos = require('../models/todoModel');
const bodyParser = require('body-parser');

module.exports = function(app){

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));

    app.get('/api/todos/:uname',(req,res)=>{
        Todos.find({username:req.params.uname},(err,results)=>{
            if(err) throw err;
            res.send(results);
        })
    })

    app.get('/api/todo/:id',(req,res)=>{
        console.log(req.params.id);
        Todos.findById({_id:req.params.id},(err,results)=>{
            if(err) throw err;
            res.send(results);
        })
    })

    app.post('/api/todo',(req,res)=>{
        // console.log(req.body);
        if(req.body.id) {
            //update
            Todos.findByIdAndUpdate(req.body.id,{
                todo:req.body.todo,
                isDone:req.body.isDone,
                hasAttachment:req.body.hasAttachment
            },(err,result)=>{
                if(err) throw err;
                res.send('Success');
            })
        }else {
            //add
            const newTodo = Todos({
                username:'test',
                todo:req.body.todo,
                isDone:req.body.isDone,
                hasAttachment:req.body.hasAttachment
            })
            newTodo.save((err)=>{
                res.send('Success')
            });
        }
    })

    app.delete('/api/todo/',(req,res)=>{
        Todos.findByIdAndDelete(req.body.id,(err)=>{
            if(err) throw err;
            res.send('Deleted');
        })
    })

}