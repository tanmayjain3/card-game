var CardManager = cc.Class.extend({

    _cardContainer:null,
    cardArray:[],
    _eventHelper:null,
    selectedArray:[],
    _animationStarted:false,

    ctor:function(gamescene){
        this._cardContainer =gamescene;
        this._eventHelper = new EventHelper();
    },

    // Adding cards on screen 
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

    // adding and removing listeners on cards
    addListenersOnCards:function(){
        for(let i =0;i<this.cardArray.length;i++){
            this._eventHelper.addMouseTouchEvent(this._cardContainer.handleTouch.bind(this._cardContainer),this.cardArray[i], cc.sys.isMobile?true:false);
        }
    },

    removeListenerFromAllCards(){
        for(let i =0;i<this.cardArray.length;i++){
                this._eventHelper.removeEventListenerFromNode(this.cardArray[i])
        }
      },

      // Setting position of cards on screen
    setPositionOfCards(setZIndex=false){
        this._animationStarted = false;
        this.cardArray.sort(function(a,b){
          return a.zIndex - b.zIndex})
      this.cardArray.forEach((card,i)=>{
        card.x = 2*GameConstants.CARD_WIDTH + i*(GameConstants.CARD_WIDTH/4) 
        card.y = cc.winSize.height/2
        card.stopAllActions();
        if(setZIndex){
            card.zIndex = i;
        }
      })
    },

    // Card animations
    playSelectedCardAnimation:function(){
        if(this.selectedArray.length){
            this.selectedArray.forEach((card)=>{
                card.flickAnimation();
            })
        }
    },

    playCardAnimation:function(){
        if(this.cardArray.length && !this._animationStarted){
            this._animationStarted = true;
            this.cardArray.forEach((card)=>{
                card.flickAnimation(true);
            })
        }
    },

    // Handling reset screen after grouping of cards
    reset:function(){
        this.cardArray = this.cardArray.concat(this._cardContainer.allSelectedCards);
        this.removeListenerFromAllCards();
        this.addListenersOnCards();
        this.selectedArray = [];
        this.setPositionOfCards(true);
    }
})