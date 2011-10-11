
/**
 * Module dependencies.
 */

var express = require('express'),
    inflector = require('inflector');

function configureDefaults(options){
    var o = options || {};
    o.methods= o.methods || ['get','post','put','delete'];
    return o;
};

var rikki = module.exports = function(mongoose, options){
  this.mongoose = mongoose;
  this.options = configureDefaults(options);
  this.init();
};

rikki.prototype.init = function init(){
  var models = this.mongoose.models;
  for(var n in models){
    var Model = this.mongoose.model(n);
    var routes = this.buildPaths(n);
    //index
    this.services.get(routes.index, function(req,res, next){
      Model.find({},function(err,docs){
        if(err){
          next(err);
          return;
        }
        res.send(docs);
      });
    });
    // show
    this.services.get(routes.show)
  };
}

rikki.prototype.buildPaths = function $buildPaths(name){

}

// TODO: is 'services' the right name here, or should we go w/ 'app'?
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



