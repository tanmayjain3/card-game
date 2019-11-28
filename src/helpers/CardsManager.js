var CardManager = cc.Class.extend({

    _cardContainer:null,
    cardArray:null,
    _eventHelper:null,
    selectedArray:null,
    ctor:function(gamescene){
        this.cardArray = [];
        this.selectedArray=[];
        this._cardContainer =gamescene;
        this._eventHelper = new EventHelper();
    },

    init:function(cards){
        for(let i=0;i<cards.length;i++){
            var cardMc = new Card(cards[i])
            cardMc.setAnchorPoint(0.5,0.5);
            cardMc.setContentSize(cc.size(GameConstants.CARD_WIDTH,GameConstants.CARD_HEIGHT));
            this._cardContainer.addChild(cardMc,i);
            this.cardArray.push(cardMc,);
        }
        return this.cardArray;
    },

    addListenersOnCards:function(){
        for(let i =0;i<this.cardArray.length;i++){
            this._eventHelper.addMouseTouchEvent(this._cardContainer.handleTouch.bind(this._cardContainer),this.cardArray[i], false);
        }
    },

    removeListenerFromAllCards(){
        for(let i =0;i<this.cardArray.length;i++){
            if(!this.cardArray[i].isSelected){
                this._eventHelper.removeEventListenerFromNode(this.cardArray[i])
            }
        }
      },


    setPositionOfCards(){
        this.cardArray.sort(function(a,b){
          return a.zIndex - b.zIndex})
      this.cardArray.forEach((card,i)=>{
        card.x = 2*GameConstants.CARD_WIDTH + i*(GameConstants.CARD_WIDTH/4) 
        card.y = cc.winSize.height/2
        card.zIndex = i;
      })
    },
    playSelectedCardAnimation:function(){
        if(this.selectedArray.length){
            this.selectedArray.forEach((card)=>{
                card.flickAnimation();
            })
        }
    }
})