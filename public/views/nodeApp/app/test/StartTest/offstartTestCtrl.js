'use strict';
angular.module('app.test').controller('studentoffStartTestCtrl', function($scope, $timeout, $rootScope, localStorageService, $filter, $interval, ngDialog, Subject, $splash, Topic, $stateParams, TestPaper, Question, StudentPaper, $state, $http) {
    $scope.countdown = 50;
    $scope.pc = 0;
    $scope.testpaperid = $stateParams.paperid;
    $scope.testorder = $stateParams.order;
    var starttime;
    // console.log($scope.testorder);

    var date = new Date();
    $scope.studentPaper = {
        studentID: localStorageService.get("id"),
        testpaperID: $scope.testpaperid,
        paperDate: date
    };
    var questionData = {};
    StudentPaper.one($scope.testpaperid).get().then(function(data) {
        $scope.testpaper = data;
        console.log($scope.testpaper);
        $scope.pc = data.paperTimeSpent;
        $scope.QuesNoAttempted = $filter('filter')(JSON.parse($scope.testpaper.testData), { Attempted: "true" }).length;
        getSubjectID();
    });
    $scope.startQuestion = function() {
        $scope.userAttempting = true;
        qf();
    }
    $scope.QuesNo = 0;
    $scope.selectQues = function() {
        $scope.unAttempted = $filter('filter')($scope.questions, { Attempted: "false" });
        $.each($scope.unAttempted, function(key, value) {
            value.questionOrder = parseInt(value.questionOrder);
        });
        $scope.unAttempted = $filter('orderBy')($scope.unAttempted, 'questionOrder');
        if ($scope.testorder == 0) {
            //Seq
            $scope.openQuestion($scope.unAttempted[0]);
            $scope.startQuestion();

        }
        // if ($scope.testorder == 1) {
        //     //Random
        //     $scope.openQuestion($scope.unAttempted[Math.random() * $scope.unAttempted.length >> 0]);
        // }
        $scope.returnToTopics();
    }
    $scope.circulateQues = function() {
        // console.log($scope.unAttempted[0].questionDescription);
        $scope.unAttempted.push($scope.unAttempted.shift());
        // console.log($scope.unAttempted[0].questionDescription);
        // $scope.CurrentQuesDescription = $scope.unAttempted[0].questionDescription;
        $scope.openQuestion($scope.unAttempted[0]);
    }

    function getSubjectID() {
        Subject.getList({ Id: $scope.testpaper.subjectID }).then(function(data) {
            $scope.subID = data._id;
            getSubjectTopics();
        })
    }

    function getSubjectTopics() {
        Topic.getList({ subjectID: $scope.subID }).then(function(data) {
            $scope.Topics = data;
            getTestQuestions();
        })
    }

    function getTestQuestions() {
        $scope.questions = JSON.parse($scope.testpaper.testData);
        console.log($scope.questions);
        $scope.selectQues();
        $scope.attempted = $filter('filter')($scope.questions, { Attempted: "true" }).length
        pf();
    }
    $scope.getSubject = function(topicid) {
            var topic = $filter("filter")($scope.Topics, { topicID: topicid });
            if (topic) {
                return topic[0].name;
            }
        }
        //$('#wid-id-52 a.jarviswidget-fullscreen-btn').trigger('click');

    $scope.quc = 0;
    $scope.openQuestion = function(q) {
        //this gets called when attempt btn is clicked 
        $scope.showOptions = true;
        $scope.selectedOption = null;
        $scope.difficulty = "Moderate";
        $scope.userAttempting = false;
        $scope.attempt = 0;
        $scope.currentQ = q;
        $scope.quc = 0;
        $scope.ques = q;
        //Remove this after testing
        // $scope.ques.timeAlotted = 0;
        $scope.QuesNo++;

    };

    

    var pstart;
    var pnextAt;

    function pf() {
        if (!pstart) {
            pstart = new Date().getTime();
            pnextAt = pstart;
        }
        pnextAt += 1000;
        $scope.pc++;
        var drift = (new Date().getTime() - pstart) % 1000;
        // $('<li>').text(c).appendTo('#results');
        setTimeout(pf, pnextAt - new Date().getTime());
    };
    var qstart;
    var qnextAt;

    function qf() {
        if (!qstart) {
            qstart = new Date().getTime();
            qnextAt = qstart;
        }
        qnextAt += 1000;
        $scope.quc++;
        var drift = (new Date().getTime() - qstart) % 1000;
        // $('<li>').text(c).appendTo('#results');
        setTimeout(qf, qnextAt - new Date().getTime());
    };

    $scope.checkAnswer = function() {
        if ($scope.selectedOption) {
            $scope.attempt += 1;
            console.log($scope.attempt);
            if ($scope.ques.correctOption == $scope.selectedOption) {
                $scope.ques.answer = 'correct';
            } else {
                $scope.ques.answer = 'wrong';
            }
            /*
            if ($scope.B.checked == true) {
                if ($scope.ques.correctOption == 'B')
                    $scope.ques.answer = 'correct'
                else
                    $scope.ques.answer = 'wrong'
            }*/

            var index = $scope.questions.indexOf($scope.currentQ);
            $scope.questions[index].Attempted = "true";
            $scope.questions[index].difficulty = $scope.difficulty;
            $scope.attempted = $filter('filter')($scope.questions, { Attempted: "true" }).length;
            if ($scope.attempt == 1) {
                $scope.QuesNoAttempted++;
                $scope.questions[index].firstAttemptTime = 0;
                starttime = $scope.quc;
                $scope.questions[index].firstAttemptStatus = $scope.ques.answer;
                $scope.questions[index].firstAttemptIsGuess = $scope.ques.guess;
                if ($scope.ques.answer == 'correct') {
                    // console.log($scope.questions);
                }
            }
            if ($scope.attempt == 2) {
                $scope.questions[index].secondAttemptTime = parseInt($scope.quc) - parseInt(starttime);
                $scope.questions[index].secondAttemptStatus = $scope.ques.answer;
                $scope.questions[index].secondAttemptIsGuess = $scope.ques.guess;
                if ($scope.ques.answer == 'correct') {
                    // console.log($scope.questions);
                }
                if ($scope.ques.answer == 'wrong') {
                    $scope.questions[index].Color = "#d7c2c3";
                    // console.log($scope.questions);
                }
            }
        }
    };
    $scope.pauseTest = function() {
        $scope.testpaper.status = "paused";
        $scope.testpaper.testData = JSON.stringify($scope.questions);
        // $scope.testpaper.testData = JSON.stringify($scope.unAttempted);
        $scope.testpaper.paperTimeSpent = $scope.pc;
        console.log($scope.testpaper);
        $scope.testpaper.save().then(function() {
            $state.go("app.student.takeOfflineTest");
        });

    }
    $scope.$on("$stateChangeStart", instantSave);
    $(window).on('beforeunload',instantSave);
    function instantSave() {
        if ($scope.unAttempted.length == 0) {
            $scope.returnToTopics();
        } else {
            $scope.pauseTest();
        }
    }
    
    $scope.returnToTopics = function() {
        $scope.testpaper.testData = JSON.stringify($scope.questions);
        $scope.testpaper.paperTimeSpent = $scope.pc;

        if ($scope.unAttempted.length == 0) {
            $scope.testpaper.status = "finished";
        }

        $scope.testpaper.report = 'http://139.59.27.209:5000/reports/' + $scope.testpaper.studentID + '/' + $scope.testpaper.testpaperID + '.pdf';
        console.log($scope.testpaper.report);
        $scope.testpaper.save().then(function(resp) {
            $http({
                url: 'http://139.59.27.209:5000/studentreport',
                method: "GET",
                params: { studentID: $scope.testpaper.studentID, testpaperID: $scope.testpaper.testpaperID }
            });
            //  $scope.questions = JSON.parse(resp.testData);
        })
    }

    $scope.$watch('online', function(newStatus) {
        // console.log($rootScope.online);
        $scope.onlineStatus = $rootScope.online;
    });
})

.factory('StudentPaperRestangular', function(Restangular) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setRestangularFields({
                id: '_id'
            });
        });
    })
    .factory('StudentPaper', function(StudentPaperRestangular) {
        return StudentPaperRestangular.service('studentpaper');
    });
