"use strict";

angular.module('app.test', [
        'ui.router'
    ])
    .config(function($stateProvider) {
        $stateProvider.state('startTest', {
                url: '/test/starttest/:paperid/:order',
                views: {
                    root: {
                        controller: 'studentStartTestCtrl',
                        templateUrl: 'app/test/StartTest/startTest.html'
                    }
                },
                data: {
                    title: 'Online Test'
                },
                resolve: {
                    srcipts: function(lazyScript) {
                        return lazyScript.register([
                            "build/vendor.ui.js"
                        ])

                    }
                }
            });
    })


  .config(function($stateProvider) {
        $stateProvider.state('offstartTest', {
                url: '/test/offstarttest/:paperid/:order',
                views: {
                    root: {
                        controller: 'studentoffStartTestCtrl',
                        templateUrl: 'app/test/StartTest/offstartTest.html'
                    }
                },
                data: {
                    title: 'Offline Test'
                },
                resolve: {
                    srcipts: function(lazyScript) {
                        return lazyScript.register([
                            "build/vendor.ui.js"
                        ])

                    }
                }
            });
    });
