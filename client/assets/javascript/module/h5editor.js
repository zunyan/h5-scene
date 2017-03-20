(function(angular, window){// angular 1.3.x
// h5editor
var app = angular.module('h5editorModule', []);

function Stage() {
    this.pages = [];
    this.pages.push(new Page());
}

Stage.prototype = {
    addPage:function(name) {
        var page = new Page(name);
        this.pages.push(page);
        return page;
    },
    format: function(){
        var pages = [];
        this.pages.forEach(function(page){
            pages.push(page.format());
        });
        return pages;
    }
}

app.factory('h5editor', function(){
    return {
        Stage: Stage,
        Page: Page,
        Component: Component,
    };
});

function Page(name) {
    this.name = name || "new page";
    this.id = "p" + (+new Date());
    this.components = [];
    this.$activeComponent = null;
}
Page.prototype = {
    addComponent: function(type, ext) {
        // components.parent = ;\
        var component = new Component(type, ext);
        this.components.push(component);
        return component;
    },
    format: function(){
        var components = [];
        this.components.forEach(function(component){
            components.push(component.format());
        });
        return {
            id: this.id,
            name: this.name,
            components: components
        }
    }
};

function Component(type, ext) {

    this.id = "c" + (+new Date());
    this.type = type;
    this.x = 50;
    this.y = 50;
    this.width = 100;
    this.height = 100;
    this.rotate = 0;
    this.opacity = 1;
    this.background = "transparent";
    this.zIndex = 100;
    this.animations = [];
    this.event = [];
    this.html = '';
    this.$ext = ext;
    for (var i in ext) {
        this[i] = ext[i];
    }
}
Component.prototype.render = function() {
    var _super = this;
    // 设置css
    this.$elep.css({
        left: this.x + "px",
        top: this.y + "px",
        transform: "rotate(" + this.rotate + "deg)",
        height: this.height + "px",
        width: this.width + "px",
        zIndex: this.zIndex,
        background: this.background
    });
    // ?
    this.html = this.$ele.html();
    // drag
    this.$elep.on("mousedown", function(ev) {
        if (!$(this).hasClass('active')) {
            return;
        }
        var me = $(this),
            c = _super,
            ox = ev.pageX,
            oy = ev.pageY,
            cx = parseInt(c.x),
            cy = parseInt(c.y),
            tx = c.x,
            ty = c.y;
        $(document.body).on("mousemove", function(ev) {
            var nx = ev.pageX,
                ny = ev.pageY;

            me.css("left", nx - ox + cx + "px");
            tx = nx - ox + cx;

            me.css("top", "auto")
                .css("bottom", "auto");
            me.css("top", ny - oy + cy + "px");
            ty = ny - oy + cy;
        });

        $(document.body).one("mouseup", function() {
            c.x = tx;
            c.y = ty;
            c.onChange("x");
            c.onChange("y");
            $(document.body).off("mousemove");
        })
    });
};
Component.prototype.addAnimation = function() {
    this.animations.push(new Animation(this.id));
};
Component.prototype.onChange = function(prop) {
    switch (prop) {
        case "x":
            this.$elep.css("left", this.x + "px");
            break;
        case "y":
            var top = this.top;
            this.$elep.css("top", "auto")
                .css("bottom", "auto");
            this.$elep.css("top", this.y + "px");

            switch (this.xyz) {
                case 'top':
                    this.$elep.css("top", this.y + "px");
                    break;
                case 'center':
                    this.$elep.css("top", (368 + parseInt(this.y)) + "px");
                    break;
                case "bottom":
                    this.$elep.css("bottom", this.y + "px");
                    break;
            }
            break;
        case 'rotate':
            this.$elep.css('transform', 'rotate(' + this.rotate + 'deg)');
            break;
        case 'height':
            this.$elep.css("height", this.height + "px");
            break;
        case 'width':
            this.$elep.css("width", this.width + "px");
            break;
    }
};
Component.prototype.$showAnimation = function(animation) {
    if(!isNaN(animation.duration)){
        this.$elep.css('animation-duration', animation.duration + 's');
        this.$elep.css('-webkit-animation-durationuration', animation.duration + 's');
    }
    this.$elep.addClass(animation.name + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $(this).removeClass(animation.name + ' animated');
        // $(this).css('animateDuration', '.5s');
        // $(this).css('webkitAnimateDuration', '.5s');
    });
};
Component.prototype.format = function(){
    var temp = {};
    for(var i in this){
        if(!/^\$/.test(i) && typeof this[i] != 'function'){
            temp[i] = this[i];
        }
    }
    return temp;
};

function Animation(id) {
    this.cid = id;
    this.id = "a" + (+new Date());
    this.delay = 0;
    this.duration = 0.5;
    this.name = 'none';
    this.iterationCount = 1;
}
function imgRegFn(url, cb) {
	var img = new Image();
	img.onload = function() {
		if (img.width == 1 && img.height == 1)
			return cb(2);
		return cb(0, img);
	};
	img.onerror = function() {
		return cb(2, img);
	};
	img.src = url;
};

app.directive('componentImg', [function() {
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		link: function(scope, ele, iAttrs, controller) {

			imgRegFn(scope.component.url,function(code,img){
				if(code==0 && !scope.component.html){
					scope.component.width = img.width;
					scope.component.height = img.height;
					if(img.width>414){
						scope.component.width = 414;
						scope.component.height = img.height/(img.width/414);
						scope.component.x = scope.component.y = 0;
					}else if(img.height>736){
						scope.component.height = 736;
						scope.component.width = img.width/(img.height/736);
						scope.component.x = scope.component.y = 0;
					}
				};

				ele.append(img);
				scope.component.render();
				scope.$apply();
			});
		}
	};
}]);
app.directive('componentTxt', [function() {
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		link: function(scope, ele, iAttrs, controller) {
			ele.text("input something in here");
			scope.component.render();
			var elep = ele.parent();
			elep.dblclick(function(){
				ele[0].contentEditable = true;
				elep.addClass('contentEditable');
				ele.focus();
				ele.on("blur",function(){
					elep.removeClass('contentEditable');
					this.contentEditable = false;
					scope.component.html = ele.html();
				});
			});

		}
	};
}]);
	
app.directive('legendComponent', ["$compile", function($compile) {
    function legendScale(config, s, elep) {
        return function(ev) {
            var me = $(this),
                ox = ev.pageX,
                oy = ev.pageY,
                nh = s.component.height,
                nw = s.component.width;

            $(document.body).on("mousemove", function(ev) {
                var nx = ev.pageX,
                    ny = ev.pageY;
                if (config.enabledx) {
                    nw = parseInt(s.component.width) + (nx - ox);
                }

                if (config.enabledy) {
                    nh = parseInt(s.component.height) + (ny - oy);
                }
                elep.css({
                    width: nw + "px",
                    height: nh + "px"
                });
                return false;
            });

            $(document.body).one("mouseup", function() {
                s.component.height = nh;
                s.component.width = nw;
                s.component.onChange("width");
                s.component.onChange("height");
                $(document.body).off("mousemove");
                return false;
            });

            $(document.body).on("keydown", function(ev) {
                if (ev.keyCode == 27) {
                    s.component.height = nh;
                    s.component.width = nw;
                    s.component.onChange("width");
                    s.component.onChange("height");
                    $(document.body).off("mousemove");
                }
            });
            ev.stopPropagation();
            return false;
        }
    }

    function legendScale2(config, fn) {
        return function(ev) {
            var me = $(this),
                ox = ev.pageX,
                oy = ev.pageY,
                nh = s.component.height,
                nw = s.component.width;

            $(document.body).on("mousemove", function(ev) {
                var nx = ev.pageX,
                    ny = ev.pageY;

                var newOffset = fn();
                elep.css({
                    width: newOffset.width + "px",
                    height: newOffset.height + "px",
                    x: newOffset.x + "px",
                    y: newOffset.y + "px",
                });
                return false;
            });

            $(document.body).one("mouseup", function() {
                s.component.height = nh;
                s.component.width = nw;
                s.component.onChange("width");
                s.component.onChange("height");
                $(document.body).off("mousemove");
                return false;
            });

            // $(document.body).on("keydown", function(ev) {
            //     if (ev.keyCode == 27) {
            //         s.component.height = nh;
            //         s.component.width = nw;
            //         s.component.onChange("width");
            //         s.component.onChange("height");
            //         $(document.body).off("mousemove");
            //     }
            // });
            ev.stopPropagation();
            return false;
        }
    }

    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        scope: {
            component: '=component'
        },
        link: function(s, iElm, iAttrs, controller) {

            // 构建一个目标指令元素
            var ele = document.createElement(s.component.type.match(/[a-zA-z][a-z]+/g).join("-"));
            var directiveName = s.component.type;

            var componentTool = $("<div class='component-tool'></div>"),
                scaleXY1 = $("<div class='component-scale-xy-top'></div>"),
                scaleXY2 = $("<div class='component-scale-xy-bottom'></div>"),
                scaleX = $("<div class='component-scale-x'></div>"),
                scaleY = $("<div class='component-scale-y'></div>");

            var setting = $('<div class="component-setting"></div>'),
                up = $("<div class='component-up uicon-up-big'></div>"),
                down = $("<div class='component-down uicon-down-big'></div>"),
                del = $("<div class='component-del uicon-trash'></div>");
            setting.append(up).append(down).append(del);
            componentTool.append(scaleXY1).append(scaleXY2).append(scaleX).append(scaleY).append(setting);

            iElm.append(ele).append(componentTool);

			s.component.$ele = $(ele);
			s.component.$elep = iElm;

            // 编译
            $compile(ele)(s);

            // 设置事件
            scaleXY1.on("mousedown", legendScale({
                enabledx: true,
                enabledy: true
            }, s, iElm));
            scaleXY2.on("mousedown", legendScale({
                enabledx: true,
                enabledy: true
            }, s, iElm));
            scaleX.on("mousedown", legendScale({
                enabledx: true
            }, s, iElm));
            scaleY.on("mousedown", legendScale({
                enabledy: true
            }, s, iElm));

            up.on("click",function(){
                s.component.zIndex ++ ;
                iElm.css("zIndex",s.component.zIndex);
                s.$apply();
            });
            down.on("click",function(){
                s.component.zIndex-- ;
                iElm.css("zIndex",s.component.zIndex);
                s.$apply();
            });
            del.on("click",function(){
                s.$emit("component-del", s.component);
                s.$apply();
            });
            iElm.on("click", function() {
                s.$emit("component-selected", s.component);
                s.$apply();
                return false;
            });

            // 设置方向键快捷
            s.component.onkeydown = function(ev){
                if(ev.keyCode==46){
                    s.$emit("component-del", s.component);
                    s.$apply();
                }

                switch(ev.keyCode){
                    case 37: 
                        s.component.x -- ;
                        s.component.onChange('x');
                        s.$apply();
                        break;
                    case 38:
                        s.component.y -- ;
                        s.component.onChange('y');
                        s.$apply();    
                        break;
                    case 39:
                        s.component.x ++ ;
                        s.component.onChange('x');
                        s.$apply();    
                        break;
                    case 40:
                        s.component.y ++ ;
                        s.component.onChange('y');
                        s.$apply();    
                        break;
                }

            };
            iElm.addClass('component-box');
        }
    };
}]);
app.directive('stage', [function($compile) {
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        link: function(s, iElm, iAttrs, controller) {
            $(document).on("keydown",function(ev){
                s.activedComponent && s.activedComponent.onkeydown && s.activedComponent.onkeydown(ev);
            });

            iElm.on("click",function(){
                s.activedComponent = null;
                s.$apply();
            })
        }
    };
}]);})(angular, window);