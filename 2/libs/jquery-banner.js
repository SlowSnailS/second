// $.banner(wrap,{
// 			animate:”slide|fade”,
// 			autoPlay:true,
// 			nextBtn:$(“#next”),
// 			prevBtn:$(“#prev”)
// 		})	
//wrap 轮播图容器
//animate 动画播放方式
//autoPlay 是否自动播放
//nextBtn 播放下一张图的按钮jquery对象
//prevBtn 播放上一张图的按钮jquery对象
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		//必须先加载jquery然后再加载jquery.cookie源码;
		//jquery.cookie依赖jquery;
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS;
		// module.exports;
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) { //$ === jquery;
	$.banner = function (wrap,options) {
		new Banner(wrap,options);
	};
	function Banner(wrap,options){ 
        this.init(wrap,options);
    }
    Banner.prototype = {
        constructor:Banner,
        init(wrap,options){
        	this.index = 0;
        	this.wrap = $(wrap);
        	this.animate = options.animate ? options.animate : "fade";
        	this.contain = this.wrap.parent();
        	this.item = this.wrap.children();
        	this.itemNum = this.item.length;
        	if(!!options.nextBtn){
        		this.btnNext = options.nextBtn;
        		this.btnNext
                .on("click",{turn:"next"},$.proxy(this.change_index,this))
                .on("click",$.proxy(this.animation,this))
        	}
        	if(!!options.prevBtn){
        		this.btnPrev = options.prevBtn;
        		this.btnPrev
                .on("click.changeIndex",{turn:"prev"},$.proxy(this.change_index,this))
                .on("click.animation",$.proxy(this.animation,this))
        	}
        	if(options.autoPlay){
        		this.loop();
        	}
        },
        change_index(event){//改变图片下标
        	var turnList = {
        		"prev":function(){
        			this.prev = this.index;
        			if(this.index  == 0){
        				this.index = this.itemNum - 1;
        			}else{
        				this.index --;
        			}
        		}.bind(this),
        		"next":function(){
        			this.prev = this.index;
        			if(this.index == this.itemNum - 1){
        				this.index = 0;
        			}else{
        				this.index ++;
        			}
        		}.bind(this),
            }
            console.log(this.index);
            if(!(typeof turnList[event.data.turn] == "function")) return 0;
            turnList[event.data.turn]();
        },
        animation(event){//下标改变后的动画效果实现
        	if(this.prev == this.index) return ;
        	var animationList = {
        		"slide":function(){
                    animationList.slideFadeInit();
                    this.item.eq(this.index)
                    .css({
                        display:"none",
                        zIndex:2
                    })
                    .slideDown()
                    .siblings()
                }.bind(this),
                "fade":function(){
                    animationList.slideFadeInit();
                    this.item.eq(this.index)
                    .css({
                        display:"none",
                        zIndex:2
                    })
                    .fadeIn(2000)
                    .siblings()        
                }.bind(this),
                "slideFadeInit":function(){
                    this.item.eq(this.prev)
                    .css({
                        zIndex:1
                    })
                    .siblings()
                    .css({
                        zIndex:""
                    })
                }.bind(this)
        	}
        	animationList[this.animate]();
        },
        loop(){//自动播放
			this.contain.on("mouseenter",function(){
                clearInterval(this.timer);
            }.bind(this))
            this.contain.on("mouseleave",function(){
                clearInterval(this.timer);
                this.timer = setInterval(function(){
                    this.prev = this.index;
                    this.index = ++this.index  % this.itemNum;
                    this.animation();
                }.bind(this),2000);
            }.bind(this))
            this.contain.trigger("mouseleave")
        }
    }
}));