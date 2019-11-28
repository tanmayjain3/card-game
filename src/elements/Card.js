const ICardType = {
    "s":"Spades",
    "d":"Diamonds",
    "h":"Hearts",
    "c":"Clubs"
};

const ICardNumber = {
    "1" :"A",
    "2":"2",
    "3":"3",
    "4":"4",
    "5":"5",
    "6":"6",
    "7":"7",
    "8":"8",
    "9":"9",
    "10":"10",
    "11":"J",
    "12":"Q",
    "13":"K"
}

var Card = cc.Sprite.extend({

    ctor: function (cardName) {
        let cardType = cardName.substr(cardName.length-1,cardName.length);
        let cardNumber = cardName.substr(0,cardName.length-1);
        let card = `../../res/graphics/cards/card${ICardType[cardType]}${ICardNumber[cardNumber]}.png`
        this._super(card);
        this.setAnchorPoint(0.5,0.5);
        return true;
    },

    flickAnimation:function(random=false){
        let deltaY = random?3+Math.floor(Math.random()*10):10;
        let moveUp = cc.moveBy(.3,0,deltaY);
        let moveDown = cc.moveBy(.3,0,-deltaY);
        this.runAction(cc.sequence([moveUp,moveDown]).repeatForever());
    }

})
