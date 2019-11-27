

var Game = {
    gameState:null,

    start:function(data){
        cc.director.runScene(new GameScene(data));
    }
};


var jslog = function() {
    cc.log(Array.prototype.join.call(arguments, ", "));
};