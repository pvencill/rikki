
/**
 * Module dependencies.
 */

var express = require('express'),
    inflector = require('inflector');

var rikki = module.exports = function(mongoose, options){
  this.mongoose = mongoose;
  this.options = options || {};
  this.init();
};

rikki.prototype.init = function init(){
  var models = this.mongoose.models;
  for(var n in models){
    var Model = this.mongoose.model(n);
    var routeName = n.plural();
    this.services.get('/'+routeName, function(req,res){
      Model.find({},function(err,docs){
        if(err){ this.handleErr(err);
          return;
        }
        res.send(docs);
      });
    });
  };
}

rikki.prototype.handleErr= function(err){
  console.log(err); // todo: what else?
};

var app = rikki.prototype.services = express.createServer();

// Configuration
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.send('success');
});



