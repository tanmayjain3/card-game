
var Sound = {
    silence:false,
    _eatEffect:0,

    playGameBgMusic:function(){
        if(!Sound.silence)
            cc.audioEngine.playMusic("res/sounds/bgGame.mp3", true);
            cc.audioEngine.setMusicVolume(0.1);
    },
 
    playGroup:function(){
        if(!Sound.silence)
            cc.audioEngine.playEffect("res/sounds/group.mp3", false);
    },
    playReset:function(){
        if(!Sound.silence)
            cc.audioEngine.playEffect("res/sounds/reset.mp3", false);
    },
    playCardClick:function(){
        if(!Sound.silence)
            cc.audioEngine.playEffect("res/sounds/cardClick.mp3", false);
    },
    playCardMove:function(){
        if(!Sound.silence)
            cc.audioEngine.playEffect("res/sounds/cardMove.mp3", false);
    }
};