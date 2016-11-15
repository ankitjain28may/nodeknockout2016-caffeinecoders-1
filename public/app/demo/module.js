'use strict';

angular.module('app.demo', [
    'ui.router',
    'ngResource'
])

.config(function($stateProvider) {
    $stateProvider
        .state('app.demo', {
            url: '/demo',
            views: {
                "content@app": {
                    controller: 'demoStudentCtrl',
                    templateUrl: 'app/demo/demostudent.html'
                }
            }
        })
         .state('app.demo-cart', {
            url: '/demo-cart',
            views: {
                "content@app": {
                    controller: 'demoCaCtrl',
                    templateUrl: 'app/demo/demoCart.html'
                }
            }
        });
});
