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
	