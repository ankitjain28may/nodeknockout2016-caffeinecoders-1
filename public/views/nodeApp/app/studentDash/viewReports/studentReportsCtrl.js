'use strict';

angular.module('app.student').controller('studentReportsCtrl', function($scope, StudentPaper, $filter, localStorageService) {

    StudentPaper.getList({ studentID: localStorageService.get("id") }).then(function(data) {
        $scope.testpapers = $filter('filter')(data, { status: "finished" });
        $scope.attemptedQues = function(data) {
            var totalQuestions = parseInt(data.totalQuestions);
            var unAattemptedQues = JSON.parse(data.testData).length;
            if (unAattemptedQues <= totalQuestions) {
                return totalQuestions - unAattemptedQues;
            }
            return 0;
        }

    });


});
