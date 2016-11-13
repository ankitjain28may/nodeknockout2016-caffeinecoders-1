angular.module('app.student').controller('ModalInstanceCtrl',['$scope', '$uibModalInstance', 'items', function ($scope, $uibModalInstance, items) {

    $scope.data = items;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);