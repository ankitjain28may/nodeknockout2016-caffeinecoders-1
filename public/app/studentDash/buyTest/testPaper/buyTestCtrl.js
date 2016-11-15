'use strict';

angular.module('app.student').controller('studentbuyTestCtrl',
        function($scope, Question, User, TestPaper, Subject, $filter,
            localStorageService, StudentPaper, Board, Class) {

            Subject.getList().then(function(data) {
                $scope.subject = data;
                var classSelected = null;
                var subSelected = null;
                var boardSelected = null;
                var datas = {};
                var classPresent = {};
                var boardPresent = {};
                //$scope.subject.testpapers = [];
                TestPaper.getList().then(function(data) {
                    $scope.testpapers = data.filter(function(element) {
                        if (!element.image) { element.image = '/styles/img/favicon/default.png'; }
                        if (element.status) return element;
                    })
                    angular.forEach($scope.subject, function(subitem) {
                        datas[subitem.Id] = {
                            subject: subitem,
                            testpapers: []
                        }
                    })
                    angular.forEach($scope.class, function(item) {
                        classPresent[item.classID] = {
                            className: item.className,
                            classID: null
                        }
                    })
                    angular.forEach($scope.board, function(item) {
                        boardPresent[item.boardId] = {
                            name: item.name,
                            boardId: null
                        }
                    })
                    angular.forEach($scope.testpapers, function(testitem) {
                            if (datas[testitem.subjectID]) {
                                datas[testitem.subjectID].testpapers.push(testitem);
                            }
                            if (classPresent[testitem.classID]) {
                                classPresent[testitem.classID].classID = testitem.classID;
                            }
                            if (boardPresent[testitem.boardID]) {
                                boardPresent[testitem.boardID].boardId = testitem.boardID;
                            }
                        })
                        // console.log(datas);
                    var subArr = [];
                    angular.forEach(datas, function(item) {
                        if (item.testpapers.length > 0) subArr.push(item.subject);
                    });
                    // console.log(subArr);
                    $scope.subShow = subArr;
                    var classArr = [];
                    angular.forEach(classPresent, function(item) {
                        if (item.classID) classArr.push(item);
                    });
                    var boardArr = [];
                    angular.forEach(boardPresent, function(item) {
                        if (item.boardId) boardArr.push(item);
                    });
                    $scope.boardShow = boardArr;
                    $scope.classShow = classArr;
                    $scope.datas = datas;
                });
            });

            Board.getList().then(function(data) {
                //console.log(data);
                $scope.board = data;
            });
            Class.getList().then(function(data) {
                // console.log(data);
                $scope.class = data;
            });
            $scope.userdata = {};
            var studentID = localStorageService.get("id");
            User.one(studentID).get().then(function(data) {
                $scope.userdata = data;
                $scope.userdata.cart = JSON.parse($scope.userdata.cart);
                $scope.itemNum = $scope.userdata.cart.length;
            });
            $scope.add = function(paper) {
                //console.log('test');
                if (!paper.isUsed) {
                    if (paper.price != '0') {
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
                    }
                    if (paper.price == '0') {
                        testPaperAdd(paper);
                    }
                }
                paper.isUsed = true;
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
                    var studentpaper = {
                        studentID: studentID,
                        testPaperName: paper.name,
                        testpaperID: paper.testpaperID,
                        subjectID: paper.subjectID,
                        totalQuestions: paper.totalQuestions,
                        totalTime: paper.totalTime,
                        totalMarks: paper.totalMarks
                    };
                    if (resp.length == 0) {
                        Question.getList({
                            testpaperID: paper.testpaperID
                        }).then(function(data) {
                            studentpaper.testData = JSON.stringify(data);
                            studentpaper.report = 'http://45.55.228.207:52295/reports/' + studentID + '/' + testpaperID + '.pdf';
                            StudentPaper.post(studentpaper).then(function(resp) {
                                console.log(resp);
                            })
                        })
                    }
                })
            }

            function getTestQuestions() {
                $scope.questions = Question.getList({
                    testpaperID: $scope.testpaper.testpaperID
                }).$object;
                $scope.studentPaper.testData = JSON.stringify($scope.questions);
                StudentPaper.post($scope.studentPaper).then(function() {})
            }
        })
    .factory('SubjectRestangular', function(Restangular) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setRestangularFields({
                id: '_id'
            });
        });
    })
    .factory('Subject', function(SubjectRestangular) {
        return SubjectRestangular.service('subject');
    });
