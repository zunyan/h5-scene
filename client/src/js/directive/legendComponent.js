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