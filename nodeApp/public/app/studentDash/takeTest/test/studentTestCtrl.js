'use strict';

angular.module('app.student').controller('studentTestCtrl', function($scope, Student) {
        $scope.ques = {};

        $scope.ques.nextBtnClicked = false;
        $scope.ques.isCorrect = false;
        $scope.ques.heading = "TP Diagnostic Mock B Class X Biology II";
        $scope.ques.quesTime = 600;
        $scope.ques.marks = 4;
        $scope.ques.timeElapsed = 0;
        $scope.ques.quesNo = 10;
        $scope.ques.quesContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae omnis consectetur magni aperiam facilis ratione nihil, perspiciatis laborum vero? A, laboriosam. Perspiciatis numquam qui vel minus provident iure, odio, dolore.";
        $scope.ques.options = [{
            no: "A",
            content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas fugit iure provident ipsam, quod earum animi sed repudiandae. Delectus minima sint esse ad eveniet vero quae necessitatibus rerum, hic, nostrum."
        }, {
            no: "B",
            content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas fugit iure provident ipsam, quod earum animi sed repudiandae. Delectus minima sint esse ad eveniet vero quae necessitatibus rerum, hic, nostrum."
        }, {
            no: "C",
            content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas fugit iure provident ipsam, quod earum animi sed repudiandae. Delectus minima sint esse ad eveniet vero quae necessitatibus rerum, hic, nostrum."
        }, {
            no: "D",
            content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas fugit iure provident ipsam, quod earum animi sed repudiandae. Delectus minima sint esse ad eveniet vero quae necessitatibus rerum, hic, nostrum."
        }];
        $scope.ques.attempt = 10;
        $scope.ques.total = 26;
        $scope.ques.timeTotal = 9000;
        $scope.ques.timeRem = parseInt($scope.ques.timeTotal);

        // Set name of hidden property and visibility change event
        // since some browsers only offer vendor-prefixed support
        var hidden, state, visibilityChange;
        if (typeof document.hidden !== "undefined") {
            hidden = "hidden";
            visibilityChange = "visibilitychange";
            state = "visibilityState";
        } else if (typeof document.mozHidden !== "undefined") {
            hidden = "mozHidden";
            visibilityChange = "mozvisibilitychange";
            state = "mozVisibilityState";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
            state = "msVisibilityState";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
            state = "webkitVisibilityState";
        }
        var timeOnLeaving = 0;
        var timeOnReturning = 0;
        var dt = 0;
        // Add a listener that constantly changes the title
        document.addEventListener(visibilityChange, function() {
            if (document[state] == "hidden") {
                clearInterval(timeElapsedTimer);
                dt = new Date();
                timeOnLeaving = parseInt(dt.getMinutes()) * 60 + parseInt(dt.getSeconds());
            } else {
                dt = new Date();
                timeOnReturning = parseInt(dt.getMinutes()) * 60 + parseInt(dt.getSeconds());
                var diff = timeOnReturning - timeOnLeaving;
                console.log(diff);
                if (diff < 0) {
                    diff += 3600;
                }
                if ($scope.ques.quesTime - $scope.ques.timeElapsed >= diff) {
                    $scope.ques.timeElapsed += diff;
                    timeElapsedTimerFn()
                } else {
                    $scope.ques.timeElapsed = $scope.ques.quesTime - 1;
                    timeElapsedTimerFn()
                }
            }

        }, false);

        $scope.ques.submit = function() {
            clearInterval(timeElapsedTimer); // to stop time
            if ($scope.ques.optionSelected !== undefined) {
                //checks that user has selected an option
                $scope.ques.quesNo++;
                $scope.ques.nextBtnClicked = true;
                $scope.ques.isCorrect = true;
            }
            // Student.post($scope.ques).then(function(resp){
            //     console.log(resp);
            // });
        };

        var timeknob = $(".timeElapsedKnob");
        timeknob.trigger(
            'configure', {
                'thickness': '0.20'
            });
        var percentProgress = 0;
        // Time elapsed in each ques
        var timeElapsedTimer = 0

        function timeElapsedTimerFn() {
            timeElapsedTimer = setInterval(function() {
                if ($scope.ques.timeElapsed < $scope.ques.quesTime) {
                    $scope.ques.timeElapsed += 1;
                    percentProgress = parseInt(($scope.ques.timeElapsed * 100) / $scope.ques.quesTime)
                    timeknob
                        .val(percentProgress)
                        .trigger('change');
                    if (percentProgress >= 75) {
                        timeknob.trigger(
                            'configure', {
                                // 'readOnly' : true,
                                // 'fgColor' : "#428BCA",
                                'fgColor': '#953b39'
                            })
                        $(".knobs-demo").addClass("text-red");
                    }
                } else {
                    console.log('ques ended');
                    $scope.ques.submit(); // to go to next ques
                }
            }, 1000);
        }
        $(document).ready(function() {
            timeElapsedTimerFn();
        })

        // Time rem for complete test
        var globalTimeRemTimer = setInterval(function() {
            if ($scope.ques.timeRem > 0) {
                $scope.ques.timeRem -= 1;
                // $scope.ques.timeElapsed = $scope.ques.timeTotal - $scope.ques.timeRem;
            } else {
                clearInterval(globalTimeRemTimer);
                console.log('test ended');
            }
        }, 1000);

        // console.log($scope.ques.optionSelected);

    })
    .factory('StudentRestangular', function(Restangular) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setRestangularFields({
                id: '_id'
            });
        });
    })

.factory('Student', function(StudentRestangular) {
    return StudentRestangular.service('student');
});


/*
 What is What ..

 ** Timers for complete test
 * $scope.ques.timeTotal: The total time allloted for the complete test
 * $scope.ques.timeRem:  The total time left in the complete test

 ** Timers for one question
 * $scope.ques.quesTime:  The time alloted for one question
 * $scope.ques.timeElapsed: The total time elapsed in one question


*/
