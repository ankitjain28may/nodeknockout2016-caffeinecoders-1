"use strict";


angular.module('app.main', ['ui.router'])
    .config(function($stateProvider) {

        $stateProvider
            .state('app.main', {
                abstract: true,
                data: {
                    title: 'App views'
                }
            })
            .state('app.main.feed', {
                url: '/feed',
                data: {
                    title: 'Feed'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/main/feed/feed.html'
                    }
                },
                resolve: {
                    scripts: function(lazyScript) {
                        return lazyScript.register([
                            'smartadmin-plugin/legacy/superbox/superbox.min.js'
                        ]);
                    }
                }
            })
            .state('app.main.timeline', {
                url: '/timeline',
                data: {
                    title: 'Timeline'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/main/timeline/timeline.html'
                    }
                }
            })
    });
