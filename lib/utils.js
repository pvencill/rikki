var Object = {
    getType : function(a){if(a) {return(function(){return a&&a!==this}).call(a)?typeof a:({}).toString.call(a).match(/\s([a-z|A-Z]+)/)[1]} else{ return 'undefined';}}
}

var Array = {
    intersect : function intersection(x,y){
                             x.sort();y.sort();
                             var i=j=0;ret=[];
                             while(i<x.length && j<y.length){
                              if(x[i]<y[j])i++;
                              else if(y[j]<x[i])j++;
                              else {
                               ret.push(x[i]);
                               i++,j++;
                              }
                             }
                             return ret;
                            }
}


module.exports = { Array : Array, Object:Object};
