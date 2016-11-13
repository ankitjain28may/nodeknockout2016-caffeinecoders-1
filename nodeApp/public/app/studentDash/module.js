'use strict';

angular.module('app.student', [
    'ui.router',
    'ngResource'
])

.config(function($stateProvider) {
    $stateProvider
        .state('app.student', {
            url: '/student',
            views: {
                "content@app": {
                    controller: 'studentDashCtrl',
                    templateUrl: 'app/studentDash/dashboard.html'
                }
            },
            data: {
                title: 'Dashboard',
                permissions: {
                    only: 'seeStudentDashboard'
                }
            }
        })
        .state('app.student.takeOfflineTest', {
            url: '/takeOfflineTest',
            views: {
                "content@app": {
                    controller: 'studentOfflineTestCtrl',
                    templateUrl: 'app/studentDash/takeTest/OfflineTest/studentOfflineTest.html'
                }

            },
            data: {
                title: 'Take a Test'
            }
        })
       .state('app.student.takeOnlineTest', {
            url: '/takeOnlineTest',
            views: {
                "content@app": {
                    controller: 'studentOnlineTestCtrl',
                    templateUrl: 'app/studentDash/takeTest/OnlineTest/studentOnlineTest.html'
                }
            },
            data: {
                title: 'Take a Test'
            }
        })
        .state('app.student.viewReports', {
            url: '/viewReports',
            views: {
                "content@app": {
                    controller: 'studentReportsCtrl',
                    templateUrl: 'app/studentDash/viewReports/viewReports.html'
                }
            },
            data: {
                title: 'View Reports'
            }
        })
        .state('app.student.htmlReport', {
            url: '/htmlReport/:studentID/:testpaperID',
            views: {
                "content@app": {
                    controller: 'htmlReportsCtrl',
                    templateUrl: 'app/studentDash/htmlReport/htmlReport.html'
                }
            },
            data: {
                title: 'Report'
            }
        })
        .state('app.student.coupons', {
            url: '/coupons',
            views: {
                "content@app": {
                    controller: 'couponsCtrl',
                    templateUrl: 'app/studentDash/coupons/coupons.html'
                }
            },
            data: {
                title: 'View Coupons'
            }
        })
        .state('app.student.buyTest', {
            url: '/suggestedProduct',
            views: {
                "content@app": {
                    controller: 'studentbuyTestCtrl',
                    templateUrl: 'app/studentDash/buyTest/testPaper/buyTest.html'
                }
            },
            data: {
                title: 'Buy a Test'
            }
        })
        .state('app.student.cart', {
            url: '/suggestedProduct/cart',
            views: {
                "content@app": {
                    controller: 'cartCtrl',
                    templateUrl: 'app/studentDash/buyTest/cart/cart.html'
                }
            },
            data: {
                title: 'Buy a Test'
            }
        })
        .state('app.student.cashCart', {
            url: '/suggestedProduct/cashCard',
            views: {
                "content@app": {
                    controller: 'cashCartCtrl',
                    templateUrl: 'app/studentDash/buyTest/cashCart/cashCart.html'
                }
            },
            data: {
                title: 'Cash Card'
            }
        })
        .state('app.student.profile', {
            url: '/profile',
            views: {
                "content@app": {
                    controller: 'StudentProfileCtrl',
                    templateUrl: 'app/studentDash/profile/profile.html'
                }
            },
            data: {
                title: 'Edit Profile'
            }
        });




});