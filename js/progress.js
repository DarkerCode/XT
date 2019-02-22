function Progress(progressbar,progress,progresscircle){
	this.progressBar = progressbar;
	this.progress = progress;
	this.progressCircle = progresscircle;
	this.isMove = false;//防止进度条拖拽时和proChange冲突
}
Progress.prototype.init = function(){
	this.click();
	this.move();
}

//进度条点击
Progress.prototype.clickSet = function(callback){
	var _this = this;
	this.progressBar.click(function(e){
		var left = e.pageX - $(this).offset().left;
		var width = _this.progressBar.width();
		if(left >= width){
			left = width;
		}
		if( left <= 0){
			left = 0;
		}
		_this.progress.css("width",left-5);
		_this.progressCircle.css("left",left-5);
		callback(left / _this.progressBar.width());
	})
}

//进度条拖拽
Progress.prototype.move = function(callback){
	var key  = false;
	var $left = null;
	var _this = this;
	this.progressBar.mousedown(function(){
		_this.isMove = true;
		var left = $(this).offset().left;
		var width = _this.progressBar.width();
		$(document).mousemove(function(e){
			key = true;
			$left = e.pageX - left;
			if($left >= width){
				$left = width;
			}
			if( $left <= 0){
				$left = 0;
			}
			_this.progress.css("width",$left-5);
			_this.progressCircle.css("left",$left-5);
		})
	})
	$(document).mouseup(function(){
		_this.isMove = false;
		$(document).off("mousemove");
		//此处调用函数，在进度条拖拽的时候不影响歌曲正常播放。
		if(key){
			callback($left / _this.progressBar.width());
		}
		key = false;
	});
}

//歌曲播放时改变进度条
Progress.prototype.proChange = function(num){
	if(this.isMove) return ;
	if(num < 0 || num > 100) return ;
	this.progress.css("width",num + "%");
	this.progressCircle.css("left",num + "%");
}
