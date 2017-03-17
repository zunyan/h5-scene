var app = angular.module('myApp', ['ui.router', 'ngAnimate', 'h5editorModule']);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/data-manager/member");

        // 概况
        $stateProvider.state('editor',{
            url: '/editor',
            templateUrl: 'assets/view/editor.html',
            controller: 'editor'     
        });
    }
]);
// 简单图片选择控件
app.factory('imageSelector', ['$compile', '$rootScope', '$http', '$q', function($compile, $rootScope, $http, $q){
    var scope = $rootScope.$new();
    var ele = $("<div></div>").appendTo(document.body);
    $http.get('assets/view/imageSelector.html').success(function(data){
        ele.html(data)
        $compile(ele[0])(scope);
    });

    scope.imglist = ['//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/707af7bf4192999f3ebe43d634da2cf3.png'];

    scope.select = function(src){
        if(scope.defer){
            scope.defer.resolve(src);
            scope.close();
        }
    };

    scope.close = function(){
        ele.find('.pop-dialog').removeClass('active');
    };
    
    scope.open = function(){
        if(!ele.find('.pop-dialog').hasClass('active')){
            ele.find('.pop-dialog').addClass('active');
            scope.defer = $q.defer();
            scope.defer.promise.then(function(){
                ele.find('.pop-dialog').removeClass('active');
            });
            return scope.defer.promise;
        }
    };
    return {
        open: function(){
            return scope.open();
        }
    }
}]);

app.controller("editor", ['$scope', '$rootScope', 'h5editor', '$http', 'imageSelector', function(s, $rootScope, h5editor, $http, imageSelector) {
    s.stage = new h5editor.Stage();
    // s.stage.pages[0].addComponent(new Component('componentTxt'));
    s.activePage = s.stage.pages[0];
    s.makeConponentActive = function(component) {
        s.activedComponent = component;
    };

    s.$on("component-selected", function(ev, component) {
        s.activedComponent = component;
    });

    s.$on("component-del", function(ev, component) {
        s.activedComponent = null;
        s.activePage.components = s.activePage.components.filter(function(x) {
            return x.id != component.id;
        });
    });

    s.addComponent = function(type) {
        if (type == 'componentImg') {
            imageSelector.open().then(function(pic){
                if(pic){
                    s.activedComponent = s.activePage.addComponent(type, {
                        url: pic
                    });                    
                }
            });
        } else {
            s.activedComponent = s.activePage.addComponent(type);
        }
    };

    s.setAnimations = function(animation) {
        s.activedComponent.$showAnimation(animation);
    };

    s.addAnimation = function() {
        s.activedComponent.addAnimation();
    };

    s.generate = function() {

        $http.post("api/generatePageToPreview.do", {
            url: s.stage.url,
            pages: s.stage.format()
        }).success(function(rsp) {
            if(rsp.code=='0'){
                s.stage.url = rsp.data;
            }else{
            }
        });
    };

    s.addPage = function() {
        s.activePage = s.stage.addPage();
        s.activedComponent = null;
    };

    s.makePageActive = function(page) {
        s.activePage = page;
        s.activedComponent = null;
    };
}]);