"use strict";

angular.module('app.demo').controller('demoStudentCtrl', 
	function($scope, Question, User, TestPaper, Subject, localStorageService, StudentPaper,Board,Class) {
    $scope.itemNum=0;
    Subject.getList().then(function(data) {
     $scope.subject = data;
   });
    TestPaper.getList().then(function(data) {
     $scope.testpapers = data.filter(function(element){
      if(!element.image) element.image ='/styles/img/favicon/default.png';  
      if(element.price>0) return element; 

    })
     console.log($scope.testpapers);
   });
    Board.getList().then(function(data) {
     console.log(data);
     $scope.board=data;
   });
    Class.getList().then(function(data) {
     console.log(data);
     $scope.class=data;
   });
    $scope.userdata = {};
    /*var studentID = localStorageService.get("id");
    User.one(studentID).get().then(function(data) {
      $scope.userdata = data;
      $scope.userdata.cart = JSON.parse($scope.userdata.cart);
      $scope.itemNum = $scope.userdata.cart.length;
    });*/
    $scope.cart=[];
    $scope.add = function(paper) {
     $scope.cart.push(paper);

     localStorage.setItem('cartData',JSON.stringify($scope.cart));
     ++ $scope.itemNum;

  	/*if (paper.price != '0') {
  		$scope.itemNum += parseInt(1);
  		$scope.userdata.cart.push(paper);
  		console.log($scope.userdata.cart);
  		$scope.userdata.cart = JSON.stringify($scope.userdata.cart);
  		$scope.userdata.save().then(function(resp) {
  			$scope.userdata.cart = JSON.parse($scope.userdata.cart);
  			$.smallBox({
  				title: "Done !",
  				content: "Paper Added To Cart",
  				color: "#739E73",
  				iconSmall: "fa  fa-paper-plane",
  				timeout: 2000
  			});

  		});
  	}*/
  }

  var testPaperAdd = function(paper) {
  	var testpaperID = paper.testpaperID;

  	StudentPaper.one().get({
  		studentID: studentID,
  		testpaperID: testpaperID
  	}).then(function(resp) {
  		$.smallBox({
  			title: "Done !",
  			content: "Demo added to Assessments",
  			color: "#739E73",
  			iconSmall: "fa  fa-paper-plane",
  			timeout: 2000
  		});
  	})

  }
  
})
