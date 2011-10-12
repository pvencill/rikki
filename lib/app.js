
/**
 * Module dependencies.
 */

var express = require('express'),
    inflector = require('inflector'),
    util = require('./utils'),
    getType = util.Object.getType,
    Array = util.Array,
    Resource = require('./resource');

function configureRoutes(options){
    var defaults = {'index':[], 'show':[],'new':[],'create':[],'edit':[],'update':[],'delete':[]};
    var routes = {};
    options = options || {};
    
    if(arguments.length == 0)
        return defaults;

    var routesType = getType(options.routes).toLowerCase();

    switch(routesType){
        case 'object':
            routes = options.routes;
            break;
        case 'array':
            for(var i=0;i<options.routes.length;i++)
                routes[options.routes[i]] = [];
            break;
        case 'string':
            routes[options.routes]=[];
            break;
        default:
            routes = defaults;
            break;
    }
    return routes;
};

function configureResources(mongoose, options){
    var models = mongoose.models;
    options = options || {};
    
    // TODO: make this more flexible
    var resources = options.resources;
    if(resources == null || getType(resources).toLowerCase() !== 'array')
        return models;

    return Array.intersect(resources, models);
};

function configureDefaults(options){
    var o = options || {};
    o.routes= configureRoutes(options);
    return o;
};

var rikki = module.exports = function(mongoose, options){
    // TODO: throw if missing mongoose
  this.mongoose = mongoose;
  this.options = configureDefaults(options);
  this.resources = configureResources(this.mongoose, options);
  this.init();
};

rikki.prototype.init = function init(){
  var models = this.resources; // TODO: this might work better if a resource were an object that had its handler(s) and such mapped?
  for(var n in models){
    var Model = this.mongoose.model(n);
    var routes = this.buildPaths(n);

    var resource = new Resource(this.mongoose, {modelName:n, routes:this.options.routes})
    this.services.get('/'+n,resource.index);
      // TODO: this feels clunky.
    /*if(this.options.routes.index){
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
    }
    // show
    this.services.get(routes.show)*/
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



