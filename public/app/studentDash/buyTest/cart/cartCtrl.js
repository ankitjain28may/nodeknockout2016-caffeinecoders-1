'use strict';

angular.module('app.student').controller('cartCtrl', function($scope, $http, User, StudentPaper, Coupon, localStorageService, TestPaper, Question) {
    var studentID = localStorageService.get("id");
    // $scope.couponApplied = false;
    $scope.couponsData = [{}];
    $scope.bill = {
        initial: 0,
        final: 0
    };

    $scope.key = "reI7yw";
    var salt = "qSwagjaY";
    var d = new Date();
    var n = d.getTime();
    //console.log(n);
    $scope.txnid = n; //;,
    $scope.productinfo = "testproduct";
    //$scope.surl = "http://139.59.27.209:5000/paymentsuccess";
    $scope.furl = "http://139.59.27.209:5000/paymentfail";
    $scope.service_provider = "payu_paisa";

    $scope.checkout = function() {
        document.forms.myForm.submit();
    }
    User.one(studentID).get().then(function(data) {
        $scope.backup = data;
        $scope.itemsCopy = data;
        $scope.itemNum = JSON.parse(data.cart).length;
        $scope.testpapers = JSON.parse(data.cart);
        var parray = [];
        for (var i = 0; i < $scope.testpapers.length; i++) {
            parray.push($scope.testpapers[i]._id)
        }
        var pstring = parray.join();

        $scope.surl = "http://139.59.27.209:5000/paymentsuccess?u=" + studentID + "&p=" + pstring;

        $scope.firstname = data.firstName;
        $scope.email = data.email;
        $scope.phone = data.phone;



        function TotalPrice() {
            $.each($scope.testpapers, function(key, value) {
                $scope.bill.initial += parseInt(value.price);
                $scope.bill.final = $scope.bill.initial;
                $scope.amount = $scope.bill.final;
            });
        }
        $scope.applyCoupon = function(couponData) {
            if (couponData.couponCode) {
                Coupon.one().get({ code: couponData.couponCode }).then(function(data) {
                    if (data.length) {
                        couponData.coupon = data;
                        couponData.coupon[0].balance = parseInt(couponData.coupon[0].balance);
                        couponData.price = couponData.coupon[0].balance;
                        couponData.discount = couponData.coupon[0].balance - $scope.bill.final;
                        if (couponData.discount < 0) {
                            couponData.discount = couponData.coupon[0].balance;
                            couponData.coupon[0].balance = 0;
                        } else {
                            couponData.coupon[0].balance = couponData.discount;
                            couponData.discount = $scope.bill.final;
                        }
                        $scope.bill.final = $scope.bill.final - couponData.discount;
                        couponData.couponApplied = true;
                        couponData.coupon[0].status = "inactive";
                        couponData.coupon[0].studentID = studentID;

                    } else {
                        $.smallBox({
                            title: "Invalid Coupon",
                            content: "Please try another coupon!",
                            color: "#C46A69",
                            iconSmall: "fa fa-times fa-2x fadeInRight animated",
                            timeout: 4000
                        });
                    }
                });

            }

        };
        $scope.removeCoupon = function(couponData) {
            if (couponData.couponCode) {
                $scope.bill.final = $scope.bill.final + couponData.discount;
                couponData.coupon[0].status = "active";
                couponData.coupon[0].studentID = "";
                $scope.couponsData.splice($scope.couponsData.indexOf(couponData), 1);
                if ($scope.couponsData.length == 0) {
                    $scope.couponsData.push({});
                }
            }

        }
        $scope.appendCoupon = function() {
            $scope.couponsData.push({});
        }
        $scope.buyTest = function() {

            $.each($scope.couponsData, function(key, value) {

                $http.put('http://139.59.27.209:5000/coupon/' + value.coupon[0]._id, value.coupon[0]);
            });
            $.each($scope.testpapers, function(key, value) {
                if (value.testpaperID) {
                    var stdpaper = {};
                    stdpaper.testPaperName = value.name;
                    stdpaper.testpaperID = value.testpaperID;
                    stdpaper.subjectID = value.subjectID;
                    stdpaper.totalQuestions = value.totalQuestions;
                    stdpaper.totalTime = value.totalTime;
                    stdpaper.totalMarks = value.totalMarks;
                    stdpaper.paperTimeSpent = 0;
                    stdpaper.studentID = studentID;
                    Question.getList({ testpaperID: value.testpaperID }).then(function(data) {
                        stdpaper.testData = JSON.stringify(data);
                        // console.log(stdpaper);
                        StudentPaper.post(stdpaper).then(function(resp) {
                            // console.log(resp);
                        })
                    });
                    $scope.itemsCopy.cart = [];
                    $scope.itemsCopy.cart = JSON.stringify($scope.itemsCopy.cart);
                    $scope.itemsCopy.save().then(function() {});
                    $scope.testpapers = [];

                }
            });
            $.smallBox({
                title: "Done",
                content: "Buying Successfull",
                color: "#739E73",
                iconSmall: "fa  fa-paper-plane",
                timeout: 2000

            });

        }
        $scope.removeFromCart = function(item) {
            $.SmartMessageBox({
                title: "Confirm Delete ",
                content: "Do you really want to remove this item ?",
                buttons: '[No][Yes]'
            }, function(ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    var index = $scope.testpapers.indexOf(item);
                    var removedItem = $scope.testpapers.splice(index, 1);
                    $scope.itemsCopy.cart = JSON.stringify($scope.testpapers);
                    $scope.itemsCopy.save().then(function() {
                        $scope.itemNum--;
                        $scope.bill.initial -= removedItem[0].price;
                        $scope.bill.final -= removedItem[0].price;
                        $.smallBox({
                            title: "Done !",
                            content: "Successfully deleted Item",
                            color: "#C46A69",
                            iconSmall: "fa fa-times fa-2x fadeInRight animated",
                            timeout: 1000
                        });
                    });
                }
            });
        }

        TotalPrice();

        var string = $scope.key + '|' + $scope.txnid + '|' + $scope.amount + '|' + $scope.productinfo + '|' + $scope.firstname + '|' + $scope.email + '|||||||||||' + salt;

        console.log(string);
        $http.get('http://139.59.27.209:5000/gethash?string=' + string).then(function(hash) {
            $scope.hash = hash.data;
            console.log(hash.data);
        })
    });
});
