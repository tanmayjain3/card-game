 

const CARD_WIDTH = 140;
const CARD_HEIGHT = 190;


var GameScene = cc.Scene.extend({

    _ui: null,
    cardsInfo:null,
    tempZIndex:null,
    cardArry:null,
    initialPos:null,
    split:null,
    reset:null,
    resetButton:null,
    selectedArray:null,
    buttonClicked:null,

    ctor: function (data) {
        this._super();
        this.cardArray = [];
        this.selectedArray = [];
        this.buttonClicked = 0;
        this._ui = new GameSceneUI();
        this.addChild(this._ui);
        this.cardsInfo=data;
                let cards = this.cardsInfo.value.cards;
                for(let i=0;i<cards.length;i++){
                    var cardMc = new Card(cards[i])
                    cardMc.setAnchorPoint(0.5,0.5);
                    cardMc.setContentSize(cc.size(CARD_WIDTH,CARD_HEIGHT));
                    this._ui.addChild(cardMc,i);
                    this.cardArray.push(cardMc);
                }
                this.setPositionOfCards();
                this.addButton("split");
                this.addButton("reset");
                this.addListenersOnCards();
        return true;
    },

    addMouseTouchEvent:function(
        callBack,
        target,
        swallowTouch = true,
        noCheck=null,
        eventFilter=false
      ) {
        noCheck = noCheck === null ? false : noCheck;
        let listener;
        let touchStarted = false;
        if (cc.sys.isMobile) {
          listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: swallowTouch,
            onTouchBegan(touch, event) {
              touchStarted = true;
              let target = event.getCurrentTarget();
              let locationInNode = target.convertToNodeSpace(
                touch.getLocation()
              );
              let s = target.getContentSize();
              let rect = cc.rect(0, 0, s.width, s.height);
    
              if (
                (!eventFilter && cc.rectContainsPoint(rect, locationInNode)) ||
                (eventFilter && eventFilter(event, locationInNode))
              ) {
                target.startX = touch.getLocation().x;
                target.startY = touch.getLocation().y;
                target.startTime = Date.now();
                let result = true;
                if (callBack) {
                  result = callBack(event, touch, EventHelper.ON_MOUSE_BEGAN);
                }
                return result || true;
              }
              return false;
            },
            onTouchMoved(touch, event) {
              let target = event.getCurrentTarget();
              let locationInNode = target.convertToNodeSpace(
                touch.getLocation()
              );
              let s = target.getContentSize();
              let rect = cc.rect(0, 0, s.width, s.height);
    
              if (
                (!eventFilter &&
                  (cc.rectContainsPoint(rect, locationInNode) || noCheck)) ||
                (eventFilter && eventFilter(event, locationInNode))
              ) {
                if (target.startX === null && target.startY === null) {
                  return false;
                }
                let result = true;
                if (callBack && touchStarted) {
                  result = callBack(event, touch, EventHelper.ON_MOUSE_MOVE);
                }
                return result || true;
              }
              if (
                (!eventFilter && !cc.rectContainsPoint(rect, locationInNode)) ||
                (eventFilter && !eventFilter(event, locationInNode))
              ) {
                let result = true;
                if (callBack) {
                  result = callBack(event, touch, EventHelper.ON_MOUSE_OUT);
                }
                return result || true;
              }
    
              return false;
            },
            onTouchEnded(touch, event) {
              touchStarted = false;
              let target = event.getCurrentTarget();
              let locationInNode = target.convertToNodeSpace(
                touch.getLocation()
              );
              let s = target.getContentSize();
              let rect = cc.rect(0, 0, s.width, s.height);
    
              if (
                (!eventFilter &&
                  (cc.rectContainsPoint(rect, locationInNode) || noCheck)) ||
                (eventFilter && eventFilter(event, locationInNode))
              ) {
                // sending callback for touch end
                let timeTaken = Date.now() - target.startTime;
                if (
                  Math.abs(target.startX - touch.getLocation().x) <
                  EventHelper.CLICK_OFFSET &&
                  Math.abs(target.startY - touch.getLocation().y) <
                  EventHelper.CLICK_OFFSET &&
                  timeTaken < EventHelper.TIME_OFFSET
                ) {
                  if (callBack) {
                    callBack(event, touch, EventHelper.ON_CLICK);
                  }
                }
    
                let currentSwipe = null;
                // // check the
                let leftSwipeDifference =
                  target.startX - touch.getLocation().x;
                let rightSwipeDifference =
                  touch.getLocation().x - target.startX;
                let upSwipeDifference =
                  touch.getLocation().y - target.startY;
                let downSwipeDifference =
                  target.startY - touch.getLocation().y;
    
                if (
                  leftSwipeDifference > rightSwipeDifference &&
                  leftSwipeDifference > upSwipeDifference &&
                  leftSwipeDifference > downSwipeDifference &&
                  leftSwipeDifference > EventHelper.SWIPE_OFFSET
                ) {
                  currentSwipe = EventHelper.ON_SWIPE_LEFT;
                } else if (
                  rightSwipeDifference > leftSwipeDifference &&
                  rightSwipeDifference > upSwipeDifference &&
                  rightSwipeDifference > downSwipeDifference &&
                  rightSwipeDifference > EventHelper.SWIPE_OFFSET
                ) {
                  currentSwipe = EventHelper.ON_SWIPE_RIGHT;
                } else if (
                  upSwipeDifference > leftSwipeDifference &&
                  upSwipeDifference > rightSwipeDifference &&
                  upSwipeDifference > downSwipeDifference &&
                  upSwipeDifference > EventHelper.SWIPE_OFFSET
                ) {
                  currentSwipe = EventHelper.ON_SWIPE_UP;
                } else if (
                  downSwipeDifference > leftSwipeDifference &&
                  downSwipeDifference > rightSwipeDifference &&
                  downSwipeDifference > upSwipeDifference &&
                  downSwipeDifference > EventHelper.SWIPE_OFFSET
                ) {
                  currentSwipe = EventHelper.ON_SWIPE_DOWN;
                }
    
                if (callBack) {
                  if (currentSwipe === EventHelper.ON_SWIPE_LEFT) {
                    callBack(event, touch, EventHelper.ON_SWIPE_LEFT);
                  } else if (currentSwipe === EventHelper.ON_SWIPE_RIGHT) {
                    callBack(event, touch, EventHelper.ON_SWIPE_RIGHT);
                  } else if (currentSwipe === EventHelper.ON_SWIPE_UP) {
                    callBack(event, touch, EventHelper.ON_SWIPE_UP);
                  } else if (currentSwipe === EventHelper.ON_SWIPE_DOWN) {
                    callBack(event, touch, EventHelper.ON_SWIPE_DOWN);
                  }
                }
    
                let result = true;
                if (callBack) {
                  result = callBack(event, touch, EventHelper.ON_MOUSE_END);
                }
                return result || true;
              }
              if (
                (!eventFilter && !cc.rectContainsPoint(rect, locationInNode)) ||
                (eventFilter && !eventFilter(event, locationInNode))
              ) {
                let result = true;
                if (callBack) {
                  result = callBack(event, touch, EventHelper.ON_MOUSE_OUT);
                }
                return result || true;
              }
    
              return false;
            },
            onTouchCancelled(touch, event) {
              touchStarted = false;
              let result = true;
              if (callBack) {
                result = callBack(event, touch, EventHelper.ON_MOUSE_CANCEL);
              }
              return result || true;
            }
          });
          cc.eventManager.addListener(listener, target);
        } else {
          listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            swallowTouches: swallowTouch,
    
            onMouseDown(event) {
              touchStarted = true;
              let currentTarget = event.getCurrentTarget();
              let touch = {
                getLocation: () => {
                  return event.getLocation();
                }
              };
    
              let locationInNode = currentTarget.convertToNodeSpace(
                touch.getLocation()
              );
              let s = currentTarget.getContentSize();
              let rect = cc.rect(0, 0, s.width, s.height);
              if (
                (!eventFilter && cc.rectContainsPoint(rect, locationInNode)) ||
                (eventFilter && eventFilter(event, locationInNode))
              ) {
                if (!(listener).swallowTouches ||
                  !event[EventHelper.ON_MOUSE_BEGAN] ||
                  event[EventHelper.ON_MOUSE_BEGAN] === currentTarget
                ) {
                  event[EventHelper.ON_MOUSE_BEGAN] = currentTarget;
                  currentTarget.startX = touch.getLocation().x;
                  currentTarget.startY = touch.getLocation().y;
                  currentTarget.startTime = Date.now();
                  let result = true;
                  if (callBack) {
                    result = callBack(event, touch, EventHelper.ON_MOUSE_BEGAN);
                  }
                  return result || true;
                }
              }
              return false;
            },
            onMouseMove(event) {
              let currentTarget = event.getCurrentTarget();
              let touch = {
                getLocation: () => {
                  return event.getLocation();
                }
              };
              EventHelper.lastMousePos = touch.getLocation();
              let locationInNode = currentTarget.convertToNodeSpace(
                touch.getLocation()
              );
              let s = currentTarget.getContentSize();
              let rect = cc.rect(0, 0, s.width, s.height);
    
              if (
                (!eventFilter &&
                  (cc.rectContainsPoint(rect, locationInNode) || noCheck)) ||
                ((eventFilter && eventFilter(event, locationInNode)) ||
                  (eventFilter && eventFilter(event, locationInNode)))
              ) {
                if (
                  !(listener).swallowTouches ||
                  !event[EventHelper.ON_MOUSE_MOVE] ||
                  event[EventHelper.ON_MOUSE_MOVE] === currentTarget
                ) {
                  event[EventHelper.ON_MOUSE_MOVE] = currentTarget;
                  if (!currentTarget.insideFlag || !currentTarget.insideFlag) {
                    currentTarget.insideFlag = true;
                    if (callBack && !cc.sys.isMobile) {
                      callBack(event, touch, EventHelper.ON_MOUSE_OVER);
                    }
                  }
                  let result = true;
                  if (callBack && touchStarted) {
                    result = callBack(event, touch, EventHelper.ON_MOUSE_MOVE);
                  }
                  return result || true;
                }
              }
              if (
                (!eventFilter && !cc.rectContainsPoint(rect, locationInNode)) ||
                (eventFilter && !eventFilter(event, locationInNode))
              ) {
                if (currentTarget.insideFlag) {
                  currentTarget.insideFlag = false;
                  let result = true;
                  if (callBack) {
                    result = callBack(event, touch, EventHelper.ON_MOUSE_OUT);
                  }
                  return result || true;
                }
              }
    
              return false;
            },
            onMouseUp(event) {
              touchStarted = false;
              let currentTarget = event.getCurrentTarget();
              let touch = {
                getLocation: () => {
                  return event.getLocation();
                }
              };
    
              let locationInNode = currentTarget.convertToNodeSpace(
                touch.getLocation()
              );
              let s = currentTarget.getContentSize();
              let rect = cc.rect(0, 0, s.width, s.height);
              if (
                (!eventFilter &&
                  (cc.rectContainsPoint(rect, locationInNode) || noCheck)) ||
                (eventFilter && eventFilter(event, locationInNode))
              ) {
                if (!(listener).swallowTouches ||
                  !event[EventHelper.ON_MOUSE_END] ||
                  event[EventHelper.ON_MOUSE_END] === currentTarget
                ) {
                  event[EventHelper.ON_MOUSE_END] = currentTarget;
                  // sending callback for touch end
                  let timeTaken = Date.now() - currentTarget.startTime;
                  if (
                    Math.abs(currentTarget.startX - touch.getLocation().x) <
                    EventHelper.CLICK_OFFSET &&
                    Math.abs(currentTarget.startY - touch.getLocation().y) <
                    EventHelper.CLICK_OFFSET &&
                    timeTaken < EventHelper.TIME_OFFSET
                  ) {
                    if (callBack) {
                      touchStarted = false;
                      callBack(event, touch, EventHelper.ON_CLICK);
                    }
                  }
    
                  let currentSwipe = null;
                  // // check the
                  let leftSwipeDifference =
                    currentTarget.startX - touch.getLocation().x;
                  let rightSwipeDifference =
                    touch.getLocation().x - currentTarget.startX;
                  let upSwipeDifference =
                    touch.getLocation().y - currentTarget.startY;
                  let downSwipeDifference =
                    currentTarget.startY - touch.getLocation().y;
    
                  if (
                    leftSwipeDifference > rightSwipeDifference &&
                    leftSwipeDifference > upSwipeDifference &&
                    leftSwipeDifference > downSwipeDifference &&
                    leftSwipeDifference > EventHelper.SWIPE_OFFSET
                  ) {
                    currentSwipe = EventHelper.ON_SWIPE_LEFT;
                  } else if (
                    rightSwipeDifference > leftSwipeDifference &&
                    rightSwipeDifference > upSwipeDifference &&
                    rightSwipeDifference > downSwipeDifference &&
                    rightSwipeDifference > EventHelper.SWIPE_OFFSET
                  ) {
                    currentSwipe = EventHelper.ON_SWIPE_RIGHT;
                  } else if (
                    upSwipeDifference > leftSwipeDifference &&
                    upSwipeDifference > rightSwipeDifference &&
                    upSwipeDifference > downSwipeDifference &&
                    upSwipeDifference > EventHelper.SWIPE_OFFSET
                  ) {
                    currentSwipe = EventHelper.ON_SWIPE_UP;
                  } else if (
                    downSwipeDifference > leftSwipeDifference &&
                    downSwipeDifference > rightSwipeDifference &&
                    downSwipeDifference > upSwipeDifference &&
                    downSwipeDifference > EventHelper.SWIPE_OFFSET
                  ) {
                    currentSwipe = EventHelper.ON_SWIPE_DOWN;
                  }
    
                  let result = true;
                  if (callBack) {
                    if (currentSwipe === EventHelper.ON_SWIPE_LEFT) {
                      callBack(event, touch, EventHelper.ON_SWIPE_LEFT);
                    } else if (currentSwipe === EventHelper.ON_SWIPE_RIGHT) {
                      callBack(event, touch, EventHelper.ON_SWIPE_RIGHT);
                    } else if (currentSwipe === EventHelper.ON_SWIPE_UP) {
                      callBack(event, touch, EventHelper.ON_SWIPE_UP);
                    } else if (currentSwipe === EventHelper.ON_SWIPE_DOWN) {
                      callBack(event, touch, EventHelper.ON_SWIPE_DOWN);
                    }
                    result = callBack(event, touch, EventHelper.ON_MOUSE_END);
                  }
                  return result || true;
                }
              }
    
              if (
                (!eventFilter && !cc.rectContainsPoint(rect, locationInNode)) ||
                (eventFilter && !eventFilter(event, locationInNode))
              ) {
                let result = true;
                if (callBack) {
                  // change: 06/02/2019.
                  // checking if mouse was inside before
                  if (currentTarget.insideFlag) {
                    result = callBack(event, touch, EventHelper.ON_MOUSE_OUT);
                  }
                }
                return result || true;
              }
    
              return false;
            }
          });
          cc.eventManager.addListener(listener, target);
    
          if (EventHelper.lastMousePos) {
            let currentTarget = target;
            let location = EventHelper.lastMousePos;
            let touch = new cc.Touch(location.x, location.y, 1);
            let locationInNode = currentTarget.convertToNodeSpace(
              location
            );
            let s = currentTarget.getContentSize();
            let rect = cc.rect(0, 0, s.width, s.height);
            let event = new cc.EventMouse(1);
            event.setLocation(locationInNode.x, locationInNode.y);
            event["_currentTarget"] = currentTarget;
            if (
              (!eventFilter &&
                (cc.rectContainsPoint(rect, locationInNode) || noCheck)) ||
              ((eventFilter && eventFilter(event, locationInNode)) ||
                (eventFilter && eventFilter(event, locationInNode)))
            ) {
              if (
                !event[EventHelper.ON_MOUSE_MOVE] ||
                event[EventHelper.ON_MOUSE_MOVE] === currentTarget
              ) {
                event[EventHelper.ON_MOUSE_MOVE] = currentTarget;
                currentTarget.insideFlag = true;
                if (callBack && !cc.sys.isMobile) {
                  callBack(event, touch, EventHelper.ON_MOUSE_OVER);
                }
              }
            }
          }
        }
        return listener;
      },



    handleTouch:function(event , touch ,type){
        // console.log(type);
        switch(type){
            case EventHelper.ON_MOUSE_BEGAN:{
                let target = event.getCurrentTarget();
                if(this.tempZIndex==null){
                    this.tempZIndex = target.zIndex;
                }
                this.initialPos = target.getPosition();
                target.zIndex = 100;
                target["isSelected"] = true;
                this.removeListenerFromallCards();
                break;
            }
            case EventHelper.ON_MOUSE_MOVE:{
                let target =event.getCurrentTarget();
                target.setPosition(touch.getLocation());
                break;
            }
            case EventHelper.ON_MOUSE_END:{
                let target = event.getCurrentTarget();
                target.zIndex = this.tempZIndex;
                this.tempZIndex = null;
                target["isSelected"] = false;
                if(target.getPosition().x==this.initialPos.x &&target.getPosition().y==this.initialPos.y){
                  this.handleSelectedCard(target);
                } else{
                  target.setPosition(this.initialPos);
                }
                target.removeListener();
                this.addListenersOnCards();
                break;
            }
            case EventHelper.ON_MOUSE_OUT:{
              break;
            }
            default:break;
        }
    },

    addListenersOnCards(){
        for(let i =0;i<this.cardArray.length;i++){
            this.addMouseTouchEvent(this.handleTouch.bind(this),this.cardArray[i]);
        }
    },


    removeEventListenerFromNode(
        node,
        recursive= false
      ) {
        try {
          recursive = recursive || false;
          cc.eventManager.removeListeners(node, recursive);
        } catch (err) {
          cc.error("Error while removing removeEventListenerFromNode:" + err);
        }
      },

      removeListenerFromallCards(){
        for(let i =0;i<this.cardArray.length;i++){
            if(!this.cardArray[i].isSelected){
                this.cardArray[i].removeListener();
            }
        }
      },

      addButton(name){
        this[name] =  new cc.Sprite("../../res/graphics/button.png");
        this[name].setAnchorPoint(0.5,0);
        this[name].setPosition(name=="split"?
        cc.winSize.width/2 - cc.winSize.width/4:cc.winSize.width/2 + cc.winSize.width/4,0);
        var fnt = "res/fonts/font.fnt";
        var buttonText = new cc.LabelTTF(name.toUpperCase(), fnt, 40);
        this[name].addChild(buttonText, 100);
        buttonText.setAnchorPoint(0.5,0);
        buttonText.setPosition(100,40);
        this.addChild(this[name], 50);
        this.addMouseTouchEvent(name=="split"?
        this.handleSplitButtonClick.bind(this):this.handleResetButtonClick.bind(this), this[name]);
      },

      handleSplitButtonClick(touch ,event ,type){
        switch(type){
          case EventHelper.ON_CLICK:{
            if(this.selectedArray.length){
              // this.buttonClicked++;
              let target = touch._currentTarget;
              target.setScale(1);
                this.selectedArray.forEach((card,i) => {
                    card.x = cc.winSize.width - CARD_WIDTH -i*CARD_WIDTH/4;
                    card.y -=card.height/2;
                });
                this.cardArray.forEach((card,i)=>{
                  card.x = CARD_WIDTH +i*CARD_WIDTH/4;
                })
            }
            this.removeEventListenerFromNode(this.split);
            break;
          }
          case EventHelper.ON_MOUSE_OVER:{
            let target = touch._currentTarget;
            target.setScale(1.1);
            break;
          }
          case EventHelper.ON_MOUSE_OUT:{
            let target = touch._currentTarget;
            target.setScale(1);
            break;
          }
        }
      },

      handleSelectedCard(card){
          card.y +=card.height/2;
          this.cardArray.splice(this.cardArray.indexOf(card),1);
          this.selectedArray.push(card);
      },

      handleResetButtonClick(touch, event, type){
        switch(type){
          case EventHelper.ON_CLICK:{
            this.cardArray=this.cardArray.concat(this.selectedArray);
            this.cardArray.sort(function(a,b){return a.zIndex-b.zIndex })
            this.selectedArray = [];
            this.buttonClicked = 0;
            this.setPositionOfCards();
            this.addMouseTouchEvent(this.handleSplitButtonClick.bind(this), this.split);
            break;
          }
          case EventHelper.ON_MOUSE_OVER:{
            let target = touch._currentTarget;
            target.setScale(1.1);
            break;
          }
          case EventHelper.ON_MOUSE_OUT:{
            let target = touch._currentTarget;
            target.setScale(1);
            break;
          }
        }
      },

      setPositionOfCards(){
        this.cardArray.forEach((card,i)=>{
          card.x = CARD_WIDTH + i*(CARD_WIDTH/4) 
          card.y = cc.winSize.height/2
          card.zIndex = i;
        })
      }
});
