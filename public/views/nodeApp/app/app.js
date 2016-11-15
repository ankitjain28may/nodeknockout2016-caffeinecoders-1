'use strict';

/**
 * @ngdoc overview
 * @name app [smartadminApp]
 * @description
 * # app [smartadminApp]
 *
 * Main module of the application.
 */

angular.module('app', [
        'ngSanitize',
        'ngAnimate',
        'ngCookies',
        'restangular',
        'ui.router',
        'ui.bootstrap',
        'permission',
        'permission.ui',
        'LocalStorageModule',
        'angular-js-xlsx',
        'angular-md5',
        'ui.footable',
        'ui.splash',
        'ngDialog',
        'timer',
        'flow',
        'base64',

        // Smartadmin Angular Common Module
        'SmartAdmin',

        // App
        'app.test',
        'app.layout',
        'app.chat',
        'app.dashboard',
        'app.calendar',
        'app.inbox',
        'app.graphs',
        'app.tables',
        'app.forms',
        'app.ui',
        'app.widgets',
        'app.maps',
        'app.appViews',
        'app.misc',
        'app.smartAdmin',
        'app.eCommerce',
        'app.student',
        'app.demo',
        'angularUtils.directives.dirPagination',
        // 'ui.bootstrap',
        'angular.filter',
        '720kb.datepicker'
    ])
    .config(function($provide, $httpProvider, RestangularProvider) {


        // Intercept http calls.
        $provide.factory('ErrorHttpInterceptor', function($q) {
            var errorCounter = 0;

            function notifyError(rejection) {
                console.log(rejection);
                $.bigBox({
                    title: rejection.status + ' ' + rejection.statusText,
                    content: rejection.data,
                    color: "#C46A69",
                    icon: "fa fa-warning shake animated",
                    number: ++errorCounter,
                    timeout: 6000
                });
            }

            return {
                // On request failure
                requestError: function(rejection) {
                    // show notification
                    notifyError(rejection);

                    // Return the promise rejection.
                    return $q.reject(rejection);
                },

                // On response failure
                responseError: function(rejection) {
                    // show notification
                    notifyError(rejection);
                    // Return the promise rejection.
                    return $q.reject(rejection);
                }
            };
        });

        // Add the interceptor to the $httpProvider.
        $httpProvider.interceptors.push('ErrorHttpInterceptor');

        // RestangularProvider.setBaseUrl('http://localhost:5000');
        RestangularProvider.setBaseUrl('http://139.59.27.209:5000');

        RestangularProvider.setRequestInterceptor(function(elem, operation) {
            if (operation === 'post' && _.isArray(elem)) {
                return _.reduce(elem, function(acum, one, idx) {
                    return acum[idx] = one;
                }, {});
            }
            return elem;
        })

    })

.run(function($rootScope, PermPermissionStore, $location, $cookieStore, $http, localStorageService) {
    $rootScope.$on("$stateChangeStart", function() {
        $(window).scrollTop(0);
    });
    $(window).on('beforeunload', function() {
        $(window).scrollTop(0);
    });
})

.run(function($window, $rootScope) {
    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
            $rootScope.online = false;
        });
    }, false);

    $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
            $rootScope.online = true;
        });
    }, false);
})

.directive('myDirective', function() {
    return function(scope, element) {
        var footableTable = element.parents('table');


        if (!scope.$last) {
            return false;
        }

        scope.$evalAsync(function() {

            if (!footableTable.hasClass('footable-loaded')) {
                footableTable.footable();
            }

            footableTable.trigger('footable_initialized');
            footableTable.trigger('footable_resize');
            footableTable.data('footable').redraw();

        });
    };
})

.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}])

// .directive("ngRepeat", function(){
//   return {
//     require: "?^parent", // optionally require your parent
//     priority: 1010,
//     compile: function(tElem){
//       var template = tElem.html();
//       return function link(scope, element, attrs, ctrls){
//          var parentCtrl = ctrls;

//          if (!parentCtrl) return;

//          // hand it off to the parent controller
//          parentCtrl.setTemplate(template);
//       }
//     }
//   }
// })

.directive('myDirective', function() {
        return function(scope, element) {
            var footableTable = element.parents('table');


            if (!scope.$last) {
                return false;
            }

            scope.$evalAsync(function() {

                if (!footableTable.hasClass('footable-loaded')) {
                    footableTable.footable();
                }

                footableTable.trigger('footable_initialized');
                footableTable.trigger('footable_resize');
                footableTable.data('footable').redraw();

            });
        };
    })
    .filter('num', function() {
        return function(input) {
            return parseInt(input, 10);
        };
    })
    .constant('APP_CONFIG', window.appConfig)
    .run(function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        // editableOptions.theme = 'bs3';

    });
