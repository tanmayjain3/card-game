 
var GameScene = cc.Scene.extend({

    _ui: null,
    cardArry:null,
    initialPos:null,
    group:null,
    reset:null,
    selectedArray:null,
    cardSelected:null,
    selectedCard :null,
    delatX:null,
    _eventHelper:null,


    ctor: function (data) {
      this._super();
        Sound.playGameBgMusic();
        this.cardArray = [];
        this.selectedArray = [];
        this.cardSelected = false;
        this._ui = new GameSceneUI();
        this._eventHelper = new EventHelper();
        this.addChild(this._ui);
                let cards = data.value.cards;
                for(let i=0;i<cards.length;i++){
                    var cardMc = new Card(cards[i])
                    cardMc.setAnchorPoint(0.5,0.5);
                    cardMc.setContentSize(cc.size(GameConstants.CARD_WIDTH,GameConstants.CARD_HEIGHT));
                    this._ui.addChild(cardMc,i);
                    this.cardArray.push(cardMc,);
                }
                this.addButton("group")
                this.addButton("reset")
                this.setPositionOfCards();
                this.addListenersOnCards();
        return true;
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
                  if(this.cardArray.indexOf(this.selectedCard)>=0){
                    this.cardArray.splice(this.cardArray.indexOf(this.selectedCard),1);
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
                      this.cardArray.push(this.selectedCard);
                      this.setPositionOfCards(true);
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

    addListenersOnCards(){
        for(let i =0;i<this.cardArray.length;i++){
            this._eventHelper.addMouseTouchEvent(this.handleTouch.bind(this),this.cardArray[i], false);
        }
    },

      removeListenerFromallCards(){
        for(let i =0;i<this.cardArray.length;i++){
            if(!this.cardArray[i].isSelected){
                this._eventHelper.removeEventListenerFromNode(this.cardArray[i])
            }
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
            if(this.selectedArray.length){
              let target = touch._currentTarget;
              target.setScale(1);
                this.selectedArray.forEach((card,i) => {
                    card.x = cc.winSize.width - GameConstants.CARD_WIDTH -i*GameConstants.CARD_WIDTH/4;
                    card.y -=card.height/2;
                });
                this.cardArray.forEach((card,i)=>{
                  card.x = GameConstants.CARD_WIDTH +i*GameConstants.CARD_WIDTH/4;
                })
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
        if(this.cardArray.indexOf(card)>=0){
          card.y +=card.height/2;
          this.cardArray.splice(this.cardArray.indexOf(card),1);
          this.selectedArray.push(card);
        } else {
          card.y -=card.height/2;
          this.selectedArray.splice(this.selectedArray.indexOf(card),1);
          this.cardArray.push(card);
        }
        if(this.selectedArray.length>0){
          this.addListenersAndMakeButtonsVisible();
        } else{
          this.removeListenersAndHideButtons();
        }
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
            this.cardArray=this.cardArray.concat(this.selectedArray);
            this.selectedArray = [];
            this.setPositionOfCards(true);
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

      setPositionOfCards(sort=false){
        if(sort){
          this.cardArray.sort(function(a,b){
            return a.zIndex - b.zIndex})
        }
        this.cardArray.forEach((card,i)=>{
          card.x = 2*GameConstants.CARD_WIDTH + i*(GameConstants.CARD_WIDTH/4) 
          card.y = cc.winSize.height/2
          card.zIndex = i;
        })
      }
});
