
var Sound = {
    silence:false,
    _eatEffect:0,

    playGameBgMusic:function(){
        if(!Sound.silence)
            cc.audioEngine.playMusic("res/sounds/bgGame.mp3", true);
    },
 
    playGroup:function(){
        if(!Sound.silence)
            cc.audioEngine.playEffect("res/sounds/group.mp3", false);
    },
    playReset:function(){
        if(!Sound.silence)
            cc.audioEngine.playEffect("res/sounds/reset.mp3", false);
    }
};