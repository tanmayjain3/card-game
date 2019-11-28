 
var GameScene = cc.Scene.extend({

    initialPos:null,
    group:null,
    reset:null,
    cardSelected:null,
    selectedCard :null,
    delatX:null,
    _eventHelper:null,
    _cardManager:null,


    ctor: function (data) {
      this._super();
        Sound.playGameBgMusic();
        this.cardSelected = false;
        this.addBackground();
        this._eventHelper = new EventHelper();
        this._cardManager = new CardManager(this);
        let cards = data.value.cards;
        this._cardManager.init(cards);
        this.addButton("group")
        this.addButton("reset")
        this._cardManager.setPositionOfCards();
        this._cardManager.addListenersOnCards();
        return true;
    },

    addBackground:function(){
        let background = new cc.Sprite("../../res/graphics/background.png");
        background.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        background.setAnchorPoint(0.5,0.5);
        this.addChild(background);
    },

    handleTouch:function(event , touch ,type){
        switch(type){
            case EventHelperStates.ON_MOUSE_BEGAN:{
              if(!this.cardSelected){
                let target = event.getCurrentTarget();
                this.initialPos = target.getPosition();
                target["isSelected"] = true;
                this.cardSelected = true; 
                this.selectedCard = target;
              }
                break;
            }
            case EventHelperStates.ON_MOUSE_MOVE:{
                let target =event.getCurrentTarget();
                if(target.isSelected){
                  this.delatX = touch.getLocation().x - target.getPosition().x
                  target.setPosition(touch.getLocation());
                  if(this._cardManager.cardArray.indexOf(this.selectedCard)>=0){
                    this._cardManager.cardArray.splice(this._cardManager.cardArray.indexOf(this.selectedCard),1);
                  }
                }

                break;
            }
            case EventHelperStates.ON_MOUSE_END:{
                let target = event.getCurrentTarget();
                  if(target.getPosition().x==this.initialPos.x &&target.getPosition().y==this.initialPos.y){
                    Sound.playCardClick();
                    this.handleSelectedCard(target);
                  } else{
                    if(this.selectedCard){
                      this._cardManager.cardArray.push(this.selectedCard);
                      this._cardManager.setPositionOfCards();
                    }
                  }
                this.cardSelected = false; 
                this.selectedCard = null;
                target["isSelected"] = false;
                break;
            }
            case EventHelperStates.ON_MOUSE_OVER:{
              let target = event._currentTarget;
              if(target && this.selectedCard){
                if(this.delatX<0){
                  target.x +=20;
                  this.selectedCard.zIndex = target.zIndex +1;
                } else{
                  this.selectedCard.zIndex = target.zIndex
                  target.x -=20;
                }
              }
              break;
            }
            default:break;
        }
    },

      addButton(name){
        this[name] =  new cc.Sprite("../../res/graphics/button.png");
        this[name].setAnchorPoint(0.5,0);
        this[name].setPosition(name=="group"?
        cc.winSize.width/2 - cc.winSize.width/4:cc.winSize.width/2 + cc.winSize.width/4,0);
        var fnt = "res/fonts/font.fnt";
        var buttonText = new cc.LabelTTF(name.toUpperCase(), fnt, 40);
        this[name].addChild(buttonText, 100);
        buttonText.setAnchorPoint(0.5,0);
        buttonText.setPosition(100,40);
        this.addChild(this[name], 50);
        this[name].visible = false;
      },

      handleGroupButtonClick(touch ,event ,type){
        switch(type){
          case EventHelperStates.ON_CLICK:{
            Sound.playGroup();
            if(this._cardManager.selectedArray.length){
              let target = touch._currentTarget;
              target.setScale(1);
                this._cardManager.selectedArray.forEach((card,i) => {
                  card.stopAllActions();
                    card.x = cc.winSize.width - GameConstants.CARD_WIDTH -i*GameConstants.CARD_WIDTH/4;
                    card.y =cc.winSize.height/2;
                });
                this._cardManager.setPositionOfCards();
                this._eventHelper.removeEventListenerFromNode(this.group);
            }
            break;
          }
          case EventHelperStates.ON_MOUSE_OVER:{
            let target = touch._currentTarget;
            target.setScale(1.1);
            break;
          }
          case EventHelperStates.ON_MOUSE_OUT:{
            let target = touch._currentTarget;
            target.setScale(1);
            break;
          }
        }
      },

      handleSelectedCard(card){
        if(this._cardManager.cardArray.indexOf(card)>=0){
          card.y +=card.height/2;
          this._cardManager.cardArray.splice(this._cardManager.cardArray.indexOf(card),1);
          this._cardManager.selectedArray.push(card);
        } else {
          card.stopAllActions();
          card.y =cc.winSize.height/2;
          this._cardManager.selectedArray.splice(this._cardManager.selectedArray.indexOf(card),1);
          this._cardManager.cardArray.push(card);
        }
        if(this._cardManager.selectedArray.length>0){
          this.addListenersAndMakeButtonsVisible();
        } else{
          this.removeListenersAndHideButtons();
        }
        this._cardManager.playSelectedCardAnimation();
      },

      addListenersAndMakeButtonsVisible(){
        this.reset.visible = true;
        this.group.visible = true;
        this._eventHelper.addMouseTouchEvent(this.handleResetButtonClick.bind(this),this.reset);
        this._eventHelper.addMouseTouchEvent(this.handleGroupButtonClick.bind(this),this.group);
      },

      removeListenersAndHideButtons(){
        this.reset.visible = false;
        this.group.visible = false;
        this._eventHelper.removeEventListenerFromNode(this.reset);
        this._eventHelper.removeEventListenerFromNode(this.group);        
      },

      handleResetButtonClick(touch, event, type){
        switch(type){
          case EventHelperStates.ON_CLICK:{
            Sound.playReset()
            let target = touch._currentTarget;
            target.setScale(1);
            this._cardManager.cardArray=this._cardManager.cardArray.concat(this._cardManager.selectedArray);
            this._cardManager.selectedArray = [];
            this._cardManager.setPositionOfCards();
            this.removeListenersAndHideButtons();
            break;
          }
          case EventHelperStates.ON_MOUSE_OVER:{
            let target = touch._currentTarget;
            target.setScale(1.1);
            break;
          }
          case EventHelperStates.ON_MOUSE_OUT:{
            let target = touch._currentTarget;
            target.setScale(1);
            break;
          }
        }
      },
});
