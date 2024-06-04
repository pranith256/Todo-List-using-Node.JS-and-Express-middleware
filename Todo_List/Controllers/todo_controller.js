var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to database 
// mongoose.Promise = global.Promise;
// mongoose.connect("mongodb+srv://user1:123@todo.7jwtork.mongodb.net/?retryWrites=true&w=majority&appName=todo");

mongoose.connect("mongodb+srv://user1:123@todo.7jwtork.mongodb.net/todos?retryWrites=true&w=majority&appName=todo")
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

//create a schema - a blue print for the data
var todoSchema = new mongoose.Schema({
    item: String
});


var Todoitems = mongoose.model('Todoitems', todoSchema);
// var itemOne = Todoitems({item: 'Apply for jobs on Monster.com'}).save()
// .then(() => {
//     console.log('item saved');
// });

// var data = [{item:"get milk"},{item:"Walk dog"},{item :"Kick some ass"}];
var urlencodedParser = bodyParser.urlencoded({extended:false});
module.exports = function(app){

    app.get('/todo', function(req, res){
        //get data from mongo-db and pass it to view 
        Todoitems.find({},function(err, data){
            if(err) throw err;
            res.render('todo',{todos:data});
        })
        

    });
    app.post('/todo',urlencodedParser, function(req, res){
        //get data from view and add it to mongoDB
        var newTodo  = Todoitems(req.body).save(function(err, data){
            if(err) throw err;
            res.json(data);
        })
    });
    app.delete('/todo/:item', function(req, res){
        //delete the selected item from mongoDB
        Todoitems.find({item: req.params.item.replace(/\-/g," ")}).remove(function(err,data){
            if(err) throw err;
            res.json(data);
        })
    });

};