 
var GameScene = cc.Scene.extend({

    initialPos:null,
    group:null,
    reset:null,
    selectedCard :null,
    delatX:null,
    _eventHelper:null,
    _cardManager:null,
    _move:false,
    _groupButtonClicked:0,


    ctor: function (data) {
      this._super();
        Sound.playGameBgMusic();
        this.init(data);
        return true;
    },

    init:function(data){
      this.addBackground();
      this._eventHelper = new EventHelper();
      this._cardManager = new CardManager(this);
      this._cardManager.init(data.value.cards);
      this.addButton(GameConstants.GROUP)
      this.addButton(GameConstants.RESET)
      this._cardManager.setPositionOfCards();
      this._cardManager.addListenersOnCards();
    },

    addBackground:function(){
        let background = new cc.Sprite(GameConstants.BACKGROUND_PATH);
        background.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        background.setAnchorPoint(0.5,0.5);
        this.addChild(background,-2);
    },

    handleTouch:function(event , touch ,type){
      switch(type){
        case EventHelperStates.ON_MOUSE_BEGAN:{
              if(!this.selectedCard && !cc.sys.isMobile){
                let target = event.getCurrentTarget();
                this.initialPos = target.getPosition();
                this.selectedCard = target;
              }
                break;
            }
            case EventHelperStates.ON_MOUSE_MOVE:{
                this._move = true;
                let target =event.getCurrentTarget();
                if(target ==this.selectedCard ||cc.sys.isMobile){
                  this.delatX = touch.getLocation().x - target.getPosition().x
                  target.setPosition(touch.getLocation());
                  if(this._cardManager.cardArray.indexOf(this.selectedCard)>=0){
                    this._cardManager.cardArray.splice(this._cardManager.cardArray.indexOf(this.selectedCard),1);
                  }
                  this._cardManager.playCardAnimation();
                }
                break;
              }
              case EventHelperStates.ON_MOUSE_END:{
                if(!cc.sys.isMobile){
                  let target = event.getCurrentTarget();
                  if(target.getPosition().x==this.initialPos.x && this._groupButtonClicked<6){
                    Sound.playCardClick();
                    this.handleSelectedCard(target);
                  }
                  if(this.selectedCard && this._move){
                      this._cardManager.cardArray.push(this.selectedCard);
                      this._cardManager.setPositionOfCards(true);
                  }
                this.selectedCard = null;
                break;
              }
            }
            case EventHelperStates.ON_MOUSE_OVER:{
              let target = event._currentTarget;
              if(target && this.selectedCard){
                if(this.delatX<0){
                  this.selectedCard.zIndex = target.zIndex==0?target.zIndex-1:target.zIndex +1;
                } else{
                  this.selectedCard.zIndex = target.zIndex
                }
              }
              break;
            }
            case EventHelperStates.ON_CLICK:{
              if(cc.sys.isMobile && this._groupButtonClicked<6){
                let target = event.getCurrentTarget();
                Sound.playCardClick();
                this.handleSelectedCard(target);
              }
              break;
            }
            default:break;
        }
    },

    addButton:function(name){
      this[name] =  new Button(GameConstants.BUTTON_PATH,name);
      this[name].setPosition(name==GameConstants.GROUP?
      cc.winSize.width/2 - cc.winSize.width/4:cc.winSize.width/2 + cc.winSize.width/4,0);
      this.addChild(this[name], 50);
      this[name].visible = false;
    },

    handleGroupButtonClick:function(touch ,event ,type){
      switch(type){
        case EventHelperStates.ON_CLICK:{
              this._groupButtonClicked++;
              Sound.playGroup();
              if(this._cardManager.selectedArray.length){
                let target = touch._currentTarget;
                target.setScale(1);
                  this._cardManager.selectedArray.forEach((card,i) => {
                      card.stopAllActions();
                      this._eventHelper.removeEventListenerFromNode(card);
                      card.x = this._groupButtonClicked<=3 ? 
                      cc.winSize.width - GameConstants.CARD_WIDTH -i*GameConstants.CARD_WIDTH/4:
                      GameConstants.CARD_WIDTH/2 +i*GameConstants.CARD_WIDTH/4;
                      card.y =cc.winSize.height- GameConstants.CARD_HEIGHT/2 -((this._groupButtonClicked%3))*cc.winSize.height/4;
                  });
                  this._cardManager._allTimeSelectedArray =this._cardManager._allTimeSelectedArray.concat(this._cardManager.selectedArray);
                  this._cardManager.selectedArray = [];
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
        default:break;
      }
    },

    handleSelectedCard:function (card){
      if(this._cardManager.cardArray.indexOf(card)>=0){
        card.y +=card.height/2;
        debugger
        this._cardManager.cardArray.splice(this._cardManager.cardArray.indexOf(card),1);
        this._cardManager.selectedArray.push(card);
      } else if(this._cardManager.selectedArray.indexOf(card)>=0){
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
      console.log(this._cardManager.selectedArray,this._cardManager.cardArray);
      this._cardManager.playSelectedCardAnimation();
    },

    addListenersAndMakeButtonsVisible:function(){
      this.reset.visible = true;
      this.group.visible = true;
      this._eventHelper.addMouseTouchEvent(this.handleResetButtonClick.bind(this),this.reset);
      this._eventHelper.addMouseTouchEvent(this.handleGroupButtonClick.bind(this),this.group);
    },

    removeListenersAndHideButtons:function(){
      this.reset.visible = false;
      this.group.visible = false;
      this._eventHelper.removeEventListenerFromNode(this.reset);
      this._eventHelper.removeEventListenerFromNode(this.group);        
    },

    handleResetButtonClick:function(touch, event, type){
      switch(type){
        case EventHelperStates.ON_CLICK:{
          this._groupButtonClicked = 0;
          Sound.playReset()
          let target = touch._currentTarget;
          target.setScale(1);
          this._cardManager.reset();
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
    }
});
