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