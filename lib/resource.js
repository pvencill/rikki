
function buildRoutes(routes){
    return routes; // TODO: decide if I'm going to handle this inside the resource or in the main init.
}


Resource = function(mongoose, options){
    this.routes = buildRoutes(options.routes);
    var Model = this.Model = mongoose.model(options.modelName);

    this.index = this.getIndex();
}

Resource.prototype.getIndex = function(){
    var Model = this.Model;
    return function(req,res,next){
                    Model.find({},function(err,docs){
                        if(err){
                          next(err);
                          return;
                        }
                        res.send(docs);
                      });
                };
}
module.exports = Resource;

