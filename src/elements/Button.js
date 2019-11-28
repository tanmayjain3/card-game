var Button = cc.Sprite.extend({

ctor:function(imagePath, name){
    this._super(imagePath);
    this.init(name);
},

init:function(name){
    this.setAnchorPoint(0.5,0);
    var buttonText = new cc.LabelTTF(name.toUpperCase(), GameConstants.FONT_PATH, 40);
    this.addChild(buttonText, 100);
    buttonText.setAnchorPoint(0.5,0);
    buttonText.setPosition(100,40);
}

})