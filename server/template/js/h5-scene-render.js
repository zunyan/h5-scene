(function() {
	$.fn.extend({
		/**
		 * 程序主入口
		 * @author kzy
		 * render函数主要用于document.body，为整个stage提供基本的事件路由功能，
		 * 并在合适的实际，调用pageRender，渲染对应的子页动画
		 */
		render: function(pages) {
			var width = $(document.body).width();
			var meta = $('	<meta name="viewport" content="width=414,target-densitydpi=high-dpi,initial-scale=' + (width/414) + ', minimum-scale=' + (width/414) + ', maximum-scale=1.0, user-scalable=no"/>');
			document.head.appendChild(meta[0]);
			if (document.all) {
				document.onselectstart = function() {
					return false;
				}; //for ie
			} else {
				document.onmousedown = function() {
					return false;
				};
				document.onmouseup = function() {
					return true;
				};
			}

			var me = this;

			var offset = 0,
				height = $(me).height(),
				stage = $("#stage"),
				pageNo = 0,
				maxPage = pages.length;

			// 绑定翻页事件
			$(this).on("mousedown touchstart", function(ev) {
				var me = $(this),
					ox = ev.pageX ||ev.originalEvent.changedTouches[0].pageX,
					oy = ev.pageY ||ev.originalEvent.changedTouches[0].pageY;
				stage.removeClass("ani");
				$(this).on("mousemove touchmove", function(ev) {
					var nx = ev.pageX||ev.originalEvent.changedTouches[0].pageX,
						ny = ev.pageY||ev.originalEvent.changedTouches[0].pageY;
					stage.css("transform", "translateY(" + (ny - oy + offset) + "px)")
					if (ny - oy > height / 5 || ny - oy < -height / 5) {
						if (ny > oy && pageNo > 0) {
							// 自上往下滚
							pageNo--;
						} else if (ny < oy && pageNo < maxPage - 1) {
							// 下滚
							pageNo++;
						}
						$(this).off("mousemove touchmove");
						stage.addClass("ani");
						stage.css("transform", "translateY(" + (-height * pageNo) + "px)");
					}
					return false;
				});

				$(this).one("mouseup touchend", function() {
					offset = -height * pageNo;
					stage.addClass("ani");
					stage.css("transform", "translateY(" + (offset) + "px)");
					$(this).off("mousemove touchend");
					$("#" + pages[pageNo].id).pageRender(pages[pageNo].components);
					return false;

				});

				return false;
			});

			me.removeClass('loading');
			setTimeout(function() {
				$("#" + pages[pageNo].id).pageRender(pages[pageNo].components);
			}, 500)

		},
		/**
		 * 页初始化函数，进行动画初始化，以及一些交互事件的转发和处理
		 * @author kezy
		 */
		pageRender: (function() {
			var oldPage = null;
			return function(component) {
				var animations = [],
					me = $(this);
				console.info("pageRender");
				if (!oldPage || oldPage[0].id != this[0].id) {
					oldPage && oldPage.removeClass('active').children().each(function(x, ele) {
						var animated = $(ele).attr("animated");
						animated && $(ele).removeClass(animated).removeClass("animated");
					})
					setTimeout(function() {
						me.addClass('active');
					}, 0);
					for (var i = 0; i < component.length; i++) {
						if (component[i].animations.length > 0) {
							$("#" + component[i].id).cssAnimate(component[i].animations);
						}
					};
				} else {
					return;
				}

				oldPage = this;
			}
		})(),
		/**
		 * 动画序列渲染器，为元素执行css3动画序列
		 * @author kezy
		 */
		cssAnimate: function(animations) {
			var oldAni = "",
				animations = $.extend([], animations),
				me = $(this);
			$(this).addClass("animated");

			function runAnimation(ani) {
				oldAni && me.removeClass(oldAni);
				oldAni = ani.name;
				me.attr("animated", ani.name);
				me.css("animation-duration", ani.duration + "s")
					.css("animation-delay", ani.delay + "s")
					.css("animation-iteration-count", ani.iterationCount)
					.addClass(ani.name)
					.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
						var ani = animations.shift();
						ani && runAnimation(ani);
					});
			};

			setTimeout(function() {
				var ani = animations.shift();
				ani && runAnimation(ani);
			}, 0);
		}
	})
})()