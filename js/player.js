function Play(obj){
	this.obj = obj;
	this.play_index = -1;//正在播放的歌曲序号
	this.oAudio = this.obj.get(0);
}
Play.prototype.musicList = function(music){
	this.music = music;
}
Play.prototype.init = function(index){
	this.index = index-1;//要播放的歌曲序号
	this.player();
}
//歌曲播放
Play.prototype.player = function(){
	//判断是否为同一首音乐
	if(this.play_index == this.index){
		if(this.oAudio.paused){
			this.oAudio.play();		
		}else{
			this.oAudio.pause();
		}
	}else{
		this.oAudio.src = this.music[this.index].link_url;
		this.oAudio.play();
		this.play_index = this.index;
	}
}
//上一首
Play.prototype.preIndex = function(){
	var index = this.play_index-1;
	if(index < 0){
		index = this.music.length-1;
	}
	return index;
}
//下一首
Play.prototype.nextIndex = function(){
	var index = this.play_index+1;
	if(index > this.music.length-1){
		index = 0;
	}
	return index;
}
//删除歌曲
Play.prototype.delMusic = function(index){
	this.music.splice(index,1);
	//判断删除歌曲的序号是否小于正在播放的歌曲序号
	if(index<this.play_index){
		this.play_index-=1;
	}
}
//获取音乐总时长
Play.prototype.getMusicDuration = function(){
	return this.oAudio.duration;
}
//获取音乐播放时长
Play.prototype.getMusicCurrentTime = function(){
	return this.oAudio.currentTime;
}
//设置音乐播放时长
Play.prototype.setMusicTime = function(callback){
	var _this = this;
	this.obj.on("timeupdate",function(){
		var duration = _this.oAudio.duration;
		var currentTime = _this.oAudio.currentTime;
		var timeStr = _this.formateDate(duration,currentTime);
		callback(duration,currentTime,timeStr);
	})
}

//格式化时间格式
Play.prototype.formateDate = function(duration,currentTime){
	//歌曲总时长
	var endMin = parseInt(duration/60);
	var endSec = parseInt(duration%60);
	if(endMin < 10){
		endMin = "0" + endMin;
	}
	if(endSec < 10){
		endSec = "0" + endSec;
	}
	//已播放时长
	var starMin = parseInt(currentTime/60);
	var starSec = parseInt(currentTime%60);
	if(starMin < 10){
		starMin = "0" + starMin;
	}
	if(starSec < 10){
		starSec = "0" + starSec;
	}
	
	return starMin + ":" + starSec + " / " + this.music[this.play_index].time;
}
//设置播放进度
Play.prototype.musicSeekTo = function(value){
	if(this.play_index == -1) return;
	this.oAudio.currentTime = this.oAudio.duration * value;
}
//声音控制
Play.prototype.musicVoice = function(value){
	//volume属性控制播放声音，取值0~1
	this.oAudio.volume = value;
}
