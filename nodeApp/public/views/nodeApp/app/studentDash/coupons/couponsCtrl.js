'use strict';

angular.module('app.demo').controller('couponsCtrl', function($scope, Coupon, StudentPaper, $filter, localStorageService) {
    var id = localStorageService.get("id");
    Coupon.one().get({ studentID: id }).then(function(data) {
        $scope.coupons = data;
    });

});
