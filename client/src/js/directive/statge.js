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
}]);