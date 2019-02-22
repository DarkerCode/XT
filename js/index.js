$(function(){
	//音乐播放
	var $audio = $("audio");
	var play = new Play($audio);
	
	var lyric = new Lyric();;
	var numbers = 0;

	//自定义滚动条
	$(".music-list").mCustomScrollbar();
	//加载歌曲列表
	setMusicList();
	function setMusicList(){
		$.ajax({
			url:"./source/musiclist.json",
			dataType:"json",
			success:function(data){
				play.musicList(data);
				$.each(data, function(index3,ele) {
					var $list = createMusic(index3,ele);
					$(".music-list ul").append($list);
				});
				initMusic(data[0]);
				initLyric(data[0]);
			},
			error:function(e){
				
			}
		});
	}
	//初始化歌曲信息
	function initMusic(song){
		var $musicImg = $(".music-img img");
		var $musicName = $(".song-names a");
		var $singerName = $(".singer-name a");
		var $speName = $(".special-name a");
		var $songName = $(".song-name");
		var $songTime = $(".song-time");
		var $musicBg = $(".mask-bg");
		$musicImg.attr("src",song.cover);
		$musicName.text(song.name);
		$singerName.text(song.singer);
		$speName.text(song.album);
		$songName.text(song.name +" / "+ song.singer);
		$songTime.text("00:00/"+song.time);
		$musicBg.css("background-image","url("+song.cover+")");
	}
	
	//初始化歌词信息
	
	function initLyric(data,index2){
		lyric.init(data.link_lrc);
		//避免暂停时重新加载歌词
		if(numbers != index2){
			$(".lyric").html("");
			lyric.loadLyric(function(){
				$.each(lyric.lyricArr, function(index,ele) {
					var $li = $("<li>"+ele+"</li>");
					$(".lyric").append($li);
				});
			});
			numbers = index2;
		}
	}
	
	//按钮点击
	clickBtn();
	function clickBtn(){
		//歌曲列表的移入移出事件
		$(".music-list").delegate(".song-list","mouseenter",function(){
			$(this).find(".music-time i").stop().fadeOut(100);
			$(this).find(".list-menu").stop().fadeIn(100);
			$(this).find(".music-time a").css("display","inline-block");
		});
		$(".music-list").delegate(".song-list","mouseleave",function(){
			$(this).find(".list-menu").stop().fadeOut(100);
			$(this).find(".music-time a").css("display","none");
			$(this).find(".music-time i").stop().fadeIn(100);
		});
		//复选框
		$(".music-list").delegate(".music-check i","click",function(){
			$(this).toggleClass("checked");
		})
		//进度条
		var $progressBar = $(".progress-bar");
		var $progress = $(".progress");
		var $progressCircle = $(".progress-circle");
		var progress = new Progress($progressBar,$progress,$progressCircle);
		progress.clickSet(function(num){
			play.musicSeekTo(num);
		});
		progress.move(function(num){
			play.musicSeekTo(num);
		});
		
		//音量进度条
		var $voiceBar = $(".voice-bar");
		var $voice = $(".voice");
		var $voiceCircle = $(".voice-circle");
		var voice = new Progress($voiceBar,$voice,$voiceCircle);
		var number = 1;
		voice.clickSet(function(num){
			play.musicVoice(num);
			number = num;
		});
		voice.move(function(num){
			play.musicVoice(num);
			number = num;
		});
		//歌曲播放
		$(".music-list").delegate(".music-play","click",function(){
			var $pre = $(this).parents(".song-list");
			var $border = $pre.siblings();
			var index = $pre.find(".music-num").html();
			$(this).toggleClass("music-play2");
			$border.find(".music-play").removeClass("music-play2");
			$border.css("color","rgba(255,255,255,0.5)");
			$border.find(".music-num").removeClass("music-num2");
			play.init(index);
			initMusic(play.music[index-1]);
			initLyric(play.music[index-1],index);
			
			//切换底部播放按钮
			if($(this).attr("class").indexOf("music-play2") == -1){
				$(".song-play").removeClass("song-play2");
				$pre.css("color","rgba(255,255,255,0.5)");
				$pre.find(".music-num").removeClass("music-num2");
			}else{
				$(".song-play").addClass("song-play2");
				$pre.css("color","#fff");
				$pre.find(".music-num").addClass("music-num2");
			}
		});
		//底部播放按钮
		$(".song-play").click(function(){
			if (play.play_index == -1) {
				$(".song-list").eq(0).find(".music-play").trigger("click");
			} else{
				$(".song-list").eq(play.play_index).find(".music-play").trigger("click");
			}
		});
		//上一首
		$(".song-pre").click(function(){
			if(play.play_index != -1){
				$(".song-list").eq(play.preIndex()).find(".music-play").trigger("click");
			}else{
				$(".song-list").eq(0).find(".music-play").trigger("click");
			}
		});
		//下一首
		$(".song-next").click(function(){
			$(".song-list").eq(play.nextIndex()).find(".music-play").trigger("click");
		});
		//删除歌曲
		$(".music-list").delegate(".music_del","click",function(){
			var $song = $(this).parents(".song-list");
			if ($song.find(".music-num").text() == (play.play_index+1)) {
				$(".song-next").trigger("click");
			} 
			$song.remove();
			play.delMusic($song.find(".music-num").text()-1);
			$(".song-list").each(function(index,ele){
				$(ele).find(".music-num").text(index+1);
			});
		})
		//底部功能按钮
		$(".song-mode").click(function(){
			
		});
		$(".song-fav").click(function(){
			$(this).toggleClass("song-fav2");
		});
		$(".song-down").click(function(){
			
		});
		$(".song-comment").click(function(){
			
		});
		$(".song-only").click(function(){
			$(this).toggleClass("song-only2");
		});	
		
		//音量控制
		$(".music_voice").click(function(){
			//声音图标
			$(this).toggleClass("music_voice2");
			//声音控制
			if($(this).attr("class").indexOf("music_voice2") == -1){
				//有声音
				play.musicVoice(number);
			}else{
				//无声音
				play.musicVoice(0);
			}
		})
		
		//显示播放时间
		play.setMusicTime(function(duration,currentTime,timestr){
			//播放时间
			$(".song-time").text(timestr);
			//播放进度
			var num = currentTime/duration*100;
			progress.proChange(num);
			if(duration == currentTime){
				$(".song-list").eq(play.nextIndex()).find(".music-play").trigger("click");
			}
			//匹配歌词
			var index1 = lyric.showLrc(currentTime);
			if($(".lyric li").length == 0) return;
			if(index1 < 0) return;
			$(".lyric li").eq(index1).addClass("lyric-color");
			$(".lyric li").get(index1).scrollIntoView();
			$(".lyric li").eq(index1).siblings().removeClass("lyric-color");
		})
	}
	
	
	//数据渲染
	function createMusic(index,music){
		var $data = `<li class="song-list">
			<span class="music-check"><i></i></span>
			<span class="music-num">${(index+1)}</span>
			<span class="music-name">${music.name}
			<span class="list-menu">
				<a href="javascript: ;" title="播放" class="music-play"></a>
				<a href="javascript: ;" title="添加"></a>
				<a href="javascript: ;" title="下载"></a>
				<a href="javascript: ;" title="分享"></a>
			</span></span>
			<span class="music-author">${music.singer}</span>
			<span class="music-time">
				<i>${music.time}</i>
				<a href="javascript: ;" title = "删除" class = "music_del"></a>
			</span>
			</li>`;
		return $data;
	}
})