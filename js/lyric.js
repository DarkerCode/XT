function Lyric(){
	this.timeArr = [];
	this.lyricArr = [];
	this.iNow = -1;
}
Lyric.prototype.init = function(data){
	this.data = data;
}
Lyric.prototype.loadLyric = function(callback){
	var _this = this;
	$.ajax({
		url:_this.data,
		dataType:"text",
		success:function(data){
			_this.parseLyric(data);
			callback();
		}
	});
}

//解析歌词
Lyric.prototype.parseLyric = function(data){
	this.timeArr = [];
	this.lyricArr = [];
	var _this = this;
	var lrcArr = data.split("\n");
	var reg = /\[(\d*:\d*.\d*)\]/;
	$.each(lrcArr,function(index,ele){
		//选出歌词
		var lrc = ele.split("]")[1];
		if(lrc.length == 1) return true;//去除空字符串，满足条件，结束本次循环
		_this.lyricArr.push(lrc);
		//选出时间
		var res = reg.exec(ele);
		if(res == null) return true;
		var timeStr = res[1];
		var secArr = timeStr.split(":");
		var sec = parseFloat((parseInt(secArr[0])*60 + parseFloat(secArr[1])).toFixed(2));
		_this.timeArr.push(sec);
	});
}

//歌词同步
Lyric.prototype.showLrc = function(time){
	var length = this.timeArr.length;
	var times = time.toFixed(2);
	var a = 0;
	for (var i = 0;i < this.timeArr.length;i ++) {
		if(times >= this.timeArr[i]&&times <= this.timeArr[i+1]){
			a = i;
			break;
		}else if(time > this.timeArr[length-1]){
			a = length-1;
		}
	}
	return a;
	
	//return this.iNow;
}
