var express = require('express');
var bp = require('body-parser');
var _ = require('underscore');

var app = express();
app.use(bp.json());

var mytasks=[];
var taskid=1;

app.use(express.static('public'));

app.get('/getmytasks/:id',function(req,res){
	var todoId = parseInt(req.params.id,10);
	var matchedTodo;
	//mytasks.forEach(function(todo){
	//	if(todoId ===todo.id)
	//	{
	//		matchedTodo = todo;
	//	}
	//});
	
	matchedTodo = _.findWhere(mytasks,{id:todoId});
	if(matchedTodo)
	{
		res.json(matchedTodo)
	}else{
		res.status(404).send();
	}
	res.json(mytasks);
});

app.listen(3000,function(){
	console.log('app is running on port 3000');
});

app.post('/postmytask', function(req,res)
{	
	var data = req.body;
	mytasks.push(data);
	data.id = taskid++;
	res.json(data);
});


app.delete('/deletedata/:id',function(req,res)
{
	var todoId = parseInt(req.params.id,10);
	var matchedTodo = _.findWhere(mytasks,{id:todoId});
	if(!matchedTodo)
	{
		res.status(404).json({"error":"id not found!"});
	}else{
		mytasks = _.without(mytasks,matchedTodo);
		res.json(matchedTodo);
	}
})

