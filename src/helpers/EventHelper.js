const EventHelperStates = {
    ON_MOUSE_BEGAN : "onMouseBegan",
    ON_MOUSE_MOVE : "onMouseMove",
    ON_MOUSE_END : "onMouseEnd",
    ON_MOUSE_CANCEL : "onMouseCancel",
    ON_MOUSE_OUT : "onMouseOut",
    ON_MOUSE_OVER : "onMouseOver",
    ON_CLICK : "onClick",
    ON_SWIPE_LEFT : "onSwipeLeft",
    ON_SWIPE_RIGHT : "onSwipeRight",
    ON_SWIPE_UP : "onSwipeUp",
    ON_SWIPE_DOWN : "onSwipeDown",
    CLICK_OFFSET : 20,
    TIME_OFFSET : 250,
    SWIPE_OFFSET : 10,
    lastMousePos: null,
}


var EventHelper = cc.Class.extend({

    ctor:function(){

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
                  result = callBack(event, touch, EventHelperStates.ON_MOUSE_BEGAN);
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
                  result = callBack(event, touch, EventHelperStates.ON_MOUSE_MOVE);
                }
                return result || true;
              }
              if (
                (!eventFilter && !cc.rectContainsPoint(rect, locationInNode)) ||
                (eventFilter && !eventFilter(event, locationInNode))
              ) {
                let result = true;
                if (callBack) {
                  result = callBack(event, touch, EventHelperStates.ON_MOUSE_OUT);
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
                let timeTaken = Date.now() - target.startTime;
                if (
                  Math.abs(target.startX - touch.getLocation().x) <
                  EventHelperStates.CLICK_OFFSET &&
                  Math.abs(target.startY - touch.getLocation().y) <
                  EventHelperStates.CLICK_OFFSET &&
                  timeTaken < EventHelperStates.TIME_OFFSET
                ) {
                  if (callBack) {
                    callBack(event, touch, EventHelperStates.ON_CLICK);
                  }
                }
    
                let currentSwipe = null;
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
                  leftSwipeDifference > EventHelperStates.SWIPE_OFFSET
                ) {
                  currentSwipe = EventHelperStates.ON_SWIPE_LEFT;
                } else if (
                  rightSwipeDifference > leftSwipeDifference &&
                  rightSwipeDifference > upSwipeDifference &&
                  rightSwipeDifference > downSwipeDifference &&
                  rightSwipeDifference > EventHelperStates.SWIPE_OFFSET
                ) {
                  currentSwipe = EventHelperStates.ON_SWIPE_RIGHT;
                } else if (
                  upSwipeDifference > leftSwipeDifference &&
                  upSwipeDifference > rightSwipeDifference &&
                  upSwipeDifference > downSwipeDifference &&
                  upSwipeDifference > EventHelperStates.SWIPE_OFFSET
                ) {
                  currentSwipe = EventHelperStates.ON_SWIPE_UP;
                } else if (
                  downSwipeDifference > leftSwipeDifference &&
                  downSwipeDifference > rightSwipeDifference &&
                  downSwipeDifference > upSwipeDifference &&
                  downSwipeDifference > EventHelperStates.SWIPE_OFFSET
                ) {
                  currentSwipe = EventHelperStates.ON_SWIPE_DOWN;
                }
    
                if (callBack) {
                  if (currentSwipe === EventHelperStates.ON_SWIPE_LEFT) {
                    callBack(event, touch, EventHelperStates.ON_SWIPE_LEFT);
                  } else if (currentSwipe === EventHelperStates.ON_SWIPE_RIGHT) {
                    callBack(event, touch, EventHelperStates.ON_SWIPE_RIGHT);
                  } else if (currentSwipe === EventHelperStates.ON_SWIPE_UP) {
                    callBack(event, touch, EventHelperStates.ON_SWIPE_UP);
                  } else if (currentSwipe === EventHelperStates.ON_SWIPE_DOWN) {
                    callBack(event, touch, EventHelperStates.ON_SWIPE_DOWN);
                  }
                }
    
                let result = true;
                if (callBack) {
                  result = callBack(event, touch, EventHelperStates.ON_MOUSE_END);
                }
                return result || true;
              }
              if (
                (!eventFilter && !cc.rectContainsPoint(rect, locationInNode)) ||
                (eventFilter && !eventFilter(event, locationInNode))
              ) {
                let result = true;
                if (callBack) {
                  result = callBack(event, touch, EventHelperStates.ON_MOUSE_OUT);
                }
                return result || true;
              }
    
              return false;
            },
            onTouchCancelled(touch, event) {
              touchStarted = false;
              let result = true;
              if (callBack) {
                result = callBack(event, touch, EventHelperStates.ON_MOUSE_CANCEL);
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
                  !event[EventHelperStates.ON_MOUSE_BEGAN] ||
                  event[EventHelperStates.ON_MOUSE_BEGAN] === currentTarget
                ) {
                  event[EventHelperStates.ON_MOUSE_BEGAN] = currentTarget;
                  currentTarget.startX = touch.getLocation().x;
                  currentTarget.startY = touch.getLocation().y;
                  currentTarget.startTime = Date.now();
                  let result = true;
                  if (callBack) {
                    result = callBack(event, touch, EventHelperStates.ON_MOUSE_BEGAN);
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
              EventHelperStates.lastMousePos = touch.getLocation();
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
                  !event[EventHelperStates.ON_MOUSE_MOVE] ||
                  event[EventHelperStates.ON_MOUSE_MOVE] === currentTarget
                ) {
                  event[EventHelperStates.ON_MOUSE_MOVE] = currentTarget;
                  if (!currentTarget.insideFlag || !currentTarget.insideFlag) {
                    currentTarget.insideFlag = true;
                    if (callBack && !cc.sys.isMobile) {
                      callBack(event, touch, EventHelperStates.ON_MOUSE_OVER);
                    }
                  }
                  let result = true;
                  if (callBack && touchStarted) {
                    result = callBack(event, touch, EventHelperStates.ON_MOUSE_MOVE);
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
                    result = callBack(event, touch, EventHelperStates.ON_MOUSE_OUT);
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
                  !event[EventHelperStates.ON_MOUSE_END] ||
                  event[EventHelperStates.ON_MOUSE_END] === currentTarget
                ) {
                  event[EventHelperStates.ON_MOUSE_END] = currentTarget;
                  // sending callback for touch end
                  let timeTaken = Date.now() - currentTarget.startTime;
                  if (
                    Math.abs(currentTarget.startX - touch.getLocation().x) <
                    EventHelperStates.CLICK_OFFSET &&
                    Math.abs(currentTarget.startY - touch.getLocation().y) <
                    EventHelperStates.CLICK_OFFSET &&
                    timeTaken < EventHelperStates.TIME_OFFSET
                  ) {
                    if (callBack) {
                      touchStarted = false;
                      callBack(event, touch, EventHelperStates.ON_CLICK);
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
                    leftSwipeDifference > EventHelperStates.SWIPE_OFFSET
                  ) {
                    currentSwipe = EventHelperStates.ON_SWIPE_LEFT;
                  } else if (
                    rightSwipeDifference > leftSwipeDifference &&
                    rightSwipeDifference > upSwipeDifference &&
                    rightSwipeDifference > downSwipeDifference &&
                    rightSwipeDifference > EventHelperStates.SWIPE_OFFSET
                  ) {
                    currentSwipe = EventHelperStates.ON_SWIPE_RIGHT;
                  } else if (
                    upSwipeDifference > leftSwipeDifference &&
                    upSwipeDifference > rightSwipeDifference &&
                    upSwipeDifference > downSwipeDifference &&
                    upSwipeDifference > EventHelperStates.SWIPE_OFFSET
                  ) {
                    currentSwipe = EventHelperStates.ON_SWIPE_UP;
                  } else if (
                    downSwipeDifference > leftSwipeDifference &&
                    downSwipeDifference > rightSwipeDifference &&
                    downSwipeDifference > upSwipeDifference &&
                    downSwipeDifference > EventHelperStates.SWIPE_OFFSET
                  ) {
                    currentSwipe = EventHelperStates.ON_SWIPE_DOWN;
                  }
    
                  let result = true;
                  if (callBack) {
                    if (currentSwipe === EventHelperStates.ON_SWIPE_LEFT) {
                      callBack(event, touch, EventHelperStates.ON_SWIPE_LEFT);
                    } else if (currentSwipe === EventHelperStates.ON_SWIPE_RIGHT) {
                      callBack(event, touch, EventHelperStates.ON_SWIPE_RIGHT);
                    } else if (currentSwipe === EventHelperStates.ON_SWIPE_UP) {
                      callBack(event, touch, EventHelperStates.ON_SWIPE_UP);
                    } else if (currentSwipe === EventHelperStates.ON_SWIPE_DOWN) {
                      callBack(event, touch, EventHelperStates.ON_SWIPE_DOWN);
                    }
                    result = callBack(event, touch, EventHelperStates.ON_MOUSE_END);
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
                  if (currentTarget.insideFlag) {
                    result = callBack(event, touch, EventHelperStates.ON_MOUSE_OUT);
                  }
                }
                return result || true;
              }
    
              return false;
            }
          });
          cc.eventManager.addListener(listener, target);
    
          if (EventHelperStates.lastMousePos) {
            let currentTarget = target;
            let location = EventHelperStates.lastMousePos;
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
                !event[EventHelperStates.ON_MOUSE_MOVE] ||
                event[EventHelperStates.ON_MOUSE_MOVE] === currentTarget
              ) {
                event[EventHelperStates.ON_MOUSE_MOVE] = currentTarget;
                currentTarget.insideFlag = true;
                if (callBack && !cc.sys.isMobile) {
                  callBack(event, touch, EventHelperStates.ON_MOUSE_OVER);
                }
              }
            }
          }
        }
        return listener;
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

    
})