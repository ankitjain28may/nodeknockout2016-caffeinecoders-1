'use strict';
angular.module('app.student').controller('cashCartCtrl', function($scope, User, localStorageService) {
    $scope.itemNum = 0;
    $scope.couponData = [
        {
            'name': 'Buy Cash Card ₹ 100',
            'price': '100',
            '__v': '3',
        },
        {
            'name': 'Buy Cash Card ₹ 400',
            'price': '400',
            '__v': '1',
        },
        {
            'name': 'Buy Cash Card ₹ 500',
            'price': '500',
            '__v': '5',
        },
        {
            'name': 'Buy Cash Card ₹ 100',
            'price': '100',
            '__v': '3',
        },
        {
            'name': 'Buy Cash Card ₹ 400',
            'price': '400',
            '__v': '1',
        },
        {
            'name': 'Buy Cash Card ₹ 500',
            'price': '500',
            '__v': '5',
        }
    ];
    /* Coupon.getList().then(function(data) {
         console.log(data);
         $scope.couponData =data;
     });*/
    $scope.userdata = {};
    $scope.itemNum = 0;
    var studentID = localStorageService.get("id");
    User.one(studentID).get().then(function(data) {
        $scope.userdata = data;
        console.log(data);
        $scope.userdata.cart = JSON.parse($scope.userdata.cart);
        $scope.itemNum = $scope.userdata.cart.length;
    });
    $scope.add = function(data) {
        $scope.userdata.cart.push(data);
        $scope.userdata.cart = JSON.stringify($scope.userdata.cart);
        console.log($scope.userdata.cart);
        $scope.userdata.save().then(function(resp) {
            $scope.userdata.cart = JSON.parse($scope.userdata.cart);
            $scope.itemNum = $scope.userdata.cart.length;

            $.smallBox({
                title: "Done !",
                content: "Cash Card Added Successfully",
                color: "#739E73",
                iconSmall: "fa  fa-paper-plane",
                timeout: 2000
            });
        });
    }
})
/*.factory('CouponRestangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setRestangularFields({
            id: '_id'
        });
    });
})
.factory('Coupon', function(CouponRestangular) {
    return CouponRestangular.service('coupon');
});*/