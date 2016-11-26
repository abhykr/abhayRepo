var express = require('express');
var bp = require('body-parser');
var _ = require('underscore');

var MongoClient = require('mongodb').MongoClient;

var app = express();
app.use(bp.json());
var db;
var mytasks=[];
var taskid=1;

MongoClient.connect('mongodb://admin:admin@ds111188.mlab.com:11188/abhdb',
	(err,database)=>{
		if(err) return console.log(err);
		db =database;
		console.log(db);
	}
);

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


app.post('/postmytask', (req,res)=>
{	

	db.collection('userdb').save(req.body,(err,result)=>{
		if(err) return console.log(err);
		console.log('saved to database');
	})
	res.json("saving...");
});


app.delete('/deletedata',function(req,res)
{
	db.collection('userdb').findOneAndDelete({description:req.body.description},(err,result)=>{
		if(err) return res.send(500,err);
		res.send('record deleted');
	})
})

app.put('/updatedata',(req,res)=>{
	db.collection('userdb')
	.findOneAndUpdate({description:req.body.description},{
		$set:{
			description: req.body.description,
			completed: req.body.completed
		}
	},{
		sort:{_id: -1},
		upsert: true
	},(err,result)=>{
		if(err) return res.send(err);
		res.send(result);
	})
})

