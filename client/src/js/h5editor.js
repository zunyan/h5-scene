// angular 1.3.x
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
    this.$elep.addClass(animation.name + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $(this).removeClass(animation.name + ' animated');
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