'use strict';

angular.module('app.demo').controller('demoCaCtrl', 
	function($scope, $http, User, ngDialog, 
		localStorageService,$rootScope ) {
		console.log("js");
		var total = 0;
		$rootScope.user={};

		var cartData = localStorage.getItem('cartData');

		$scope.testpapers = JSON.parse(cartData);
		console.log(JSON.parse(cartData));

		$scope.removeFromCart = function(item) {
			$.SmartMessageBox({
				title: "Confirm Delete ",
				content: "Do you really want to remove this item ?",
				buttons: '[No][Yes]'
			}, function(ButtonPressed) {
				if (ButtonPressed === "Yes") {
					var index = $scope.testpapers.indexOf(item);
					var removedItem = $scope.testpapers.splice(index, 1);
					$scope.bill -= removedItem[0].price;
				}
			});
		}
		TotalPrice()

		function TotalPrice() {
			$.each($scope.testpapers, function(key, value) {
				total += parseInt(value.price);
				$scope.bill = total;
			});
		}
		var ctrl = function(){
			
			$scope.nam ='aaaaa'
			console.log($scope)
			$scope.loginDemo=function(user){

				console.log(user);
			}
		} 

		$scope.checkout = function(){
			ngDialog.open({ template: 'templateId',
				controller : ctrl,
				scope: $rootScope
			});
		}

		


	});
