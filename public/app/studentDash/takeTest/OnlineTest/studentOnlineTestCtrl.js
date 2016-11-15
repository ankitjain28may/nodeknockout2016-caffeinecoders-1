'use strict';

angular.module('app.student').controller('studentOnlineTestCtrl', function(
  $scope, StudentPaper, $rootScope, Subject, $filter, ngDialog, TestPaper,
  $state, $stateParams, localStorageService) {
  $('.table').data('page-size', 8);
  // window.location.reload();
  Subject.getList().then(function(data) {
      $scope.subjects = data;
      $('.table').data('page-size', 8);
      $('.table').trigger('footable_redraw');
    })
    //$('.table').data('page-size', 2);

  StudentPaper.getList({
    studentID: localStorageService.get("id")
  }).then(function(data) {
    $scope.testpapers = data;
    console.log(data);
  })

  $scope.$watch('online', function(newStatus) {
    console.log($rootScope.online);
  });

  $scope.openModal = function(paper) {
    ngDialog.open({
      template: 'app/studentDash/takeTest/OnlineTest/popupTmpl.html',
      width: '60%',
      height: "auto",
      className: 'ngdialog-theme-default',
      scope: $scope
    });
    $scope.startTest = function(close, choice) {
      console.log(choice);
      close();
      $state.go('startTest', {
        paperid: paper._id,
        order: choice
      });
    }
  }
  $scope.attemptedQues = function(data) {
    return $filter('filter')(JSON.parse(data.testData), {
      Attempted: "true"
    }).length;
  }

  function checkStatus() {
    StudentPaper.one().get({
      studentID: localStorageService.get("id"),
    }).then(function(resp) {

    });
  }
  $scope.removePaper = function(id) {
    $.SmartMessageBox({
      title: "Confirm Delete ",
      content: "Do you really want to remove this item ?",
      buttons: '[No][Yes]'
    }, function(ButtonPressed) {
      if (ButtonPressed === "Yes") {
        StudentPaper.one(id).remove().then(function() {
          $.smallBox({
            title: "Done !",
            content: "Successfully deleted Item",
            color: "#C46A69",
            iconSmall: "fa fa-times fa-2x fadeInRight animated",
            timeout: 1000
          });
          StudentPaper.getList({
            studentID: localStorageService.get("id")
          }).then(function(data) {
            $scope.testpapers = data;
          })
        });
      }
    });
  }
});
