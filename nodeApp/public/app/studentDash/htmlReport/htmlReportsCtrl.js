'use strict';

angular.module('app.student').controller('htmlReportsCtrl', function($scope,User, City, State, Section,Class, Subject, StudentPaper, $filter, localStorageService,$stateParams,$uibModal,$log) {

    StudentPaper.getList({ studentID: localStorageService.get("id") }).then(function(data) {
        // $scope.testpapers = $filter('filter')(data, { status: "finished" });
        $scope.testpapers = data;
        $scope.attemptedQues = function(data) {
            var totalQuestions = parseInt(data.totalQuestions);
            var unAattemptedQues = JSON.parse(data.testData).length;
            if (unAattemptedQues <= totalQuestions) {
                return totalQuestions - unAattemptedQues;
            }
            return 0;
        }

    });

    var school;
    $scope.getData = function () {


        var studentID = $stateParams.studentID;
        var testpaperID = $stateParams.testpaperID;
        $scope.testpaperid = testpaperID;
        User.one().get({_id: studentID}).then(function(resp) {
            var now = new Date();
            if(resp.length > 0){
                $scope.studentData = resp[0];
                $scope.studentData.fullname = $scope.studentData.firstName + ' '+$scope.studentData.lastName;
            }
        
        Class.getList({classID: $scope.studentData.classID}).then(function(resp1) {
                    $scope.class = resp1[0];
                })
        Section.getList({sectionID: $scope.studentData.id}).then(function(resp1) {
                    $scope.section = resp1[0];
                })
        City.getList({Id: $scope.studentData.city}).then(function(resp1) {
                    $scope.city = resp1[0];
                })
        State.getList({Id: $scope.studentData.state}).then(function(resp1) {
                    $scope.state = resp1[0];
                })
        if($scope.studentData.schoolID != "other"){
                console.log("called");
            User.getList({type:"School", userID: $scope.studentData.schoolID}).then(function(resp2) {
                $scope.schooldata = resp2[0];
                console.log($scope.schooldata);
                $scope.school = $scope.schooldata.schoolName;
                console.log($scope.school);
            })        
        }else{
            $scope.school = $scope.studentData.schoolName;
            console.log($scope.studentData.schoolName);
        }
        });
        Number.prototype.toHHMMSS = function () {
            var sec_num = this; // don't forget the second param
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            return hours+':'+minutes+':'+seconds;
        }

        StudentPaper.one().get({studentID: studentID, testpaperID: testpaperID}).then(function(resp) {
            var result ={};
            if(resp.length > 0) result =resp[0];
            var data = JSON.parse(result.testData);
            var subjectID = result.subjectID;
            Subject.one().get({Id: subjectID}).then(function(resp) {
                if(resp.length > 0){
                    $scope.subject = resp[0].Name;
                }
            });
            var html = '';

            var green = [],
                blue = [],
                orange = [],
                pink = [];

            var lookup = {};
            var items = data;
            var result = [];

            var TotalTime = 0,TotalMarks = 0,TotalQuestions = data.length;
            var firstAttemptCorrect = 0,secondAttemptCorrect = 0,firstAttemptTime = 0,secondAttemptTime = 0;
            var firstAttemptMarksEarned = 0,secondAttemptMarksEarned = 0,firstAttemptTime = 0,secondAttemptTime = 0;
            for (var item, i = 0; item = items[i++];) {
                TotalMarks= TotalMarks + parseInt(item.maxMarks);
                TotalTime = TotalTime + parseInt(item.timeAlotted);

                if(item.firstAttemptStatus == "correct")
                {
                    firstAttemptCorrect++;
                    firstAttemptMarksEarned = firstAttemptMarksEarned + parseInt(item.maxMarks);

                }

                if(item.secondAttemptStatus == "correct")
                {
                    secondAttemptCorrect++;
                    secondAttemptMarksEarned = secondAttemptMarksEarned + parseInt(item.maxMarks);

                }

                firstAttemptTime = firstAttemptTime + parseInt(item.firstAttemptTime || 0);
                secondAttemptTime = secondAttemptTime + parseInt(item.secondAttemptTime || 0);


                var topicID = item.topicID;

                if (!(topicID in lookup)) {
                    lookup[topicID] = 1;
                    result.push(topicID);
                }
            }
            var idMap ={};
            for (var j = 0; j < data.length; j++) {
                var Fdata = data.filter(function(el) {
                    return (el.topicID == data[j].topicID && el.Attempted == "true");
                });

                var c = 0;
                for (var i = 0; i < Fdata.length; i++) {
                    if (Fdata[i].answer == "correct" && Fdata[i].Attempted == "true")
                        c++;
                }
                var percent = (c * 100) / Fdata.length;

                // GREEN
                if (percent > 80) {
                    for (var i = 0; i < Fdata.length; i++) {
                        if(!idMap[data[j]._id]){
                            idMap[data[j]._id] = true;
                            green.push(data[j])
                        }

                    }
                }

                // BLUE
                if (percent > 60 && percent <= 80) {
                    for (var i = 0; i < Fdata.length; i++) {
                            if(!idMap[data[j]._id]){
                                idMap[data[j]._id] = true;
                                blue.push(data[j])
                            }
                    }
                }

                // ORANGE
                if (percent > 40 && percent <= 60) {
                    for (var i = 0; i < Fdata.length; i++) {
                        if(!idMap[data[j]._id]){
                            idMap[data[j]._id] = true;
                            orange.push(data[j])
                        }
                    }
                }

                // PINK
                if (percent <= 40) {
                    for (var i = 0; i < Fdata.length; i++) {
                        if(!idMap[data[j]._id]){
                            idMap[data[j]._id] = true;
                            pink.push(data[j])
                        }
                    }
                }
            }
           var  reportData =[{
               type:'GREEN',
               data:green
           },{
               type:'BLUE',
               data:blue
           },{
               type:'ORANGE',
               data:orange
           },{
               type:'PINK',
               data:pink
           }]

            var firstAttemptPercetageGained = (firstAttemptMarksEarned*100)/TotalMarks
            var secondAttemptPercetageGained = (secondAttemptMarksEarned*100)/TotalMarks
            $scope.reportData={
                data:reportData,
                totalQuestions:TotalQuestions,
                totalMarks:TotalMarks,
                totalTime :TotalTime.toHHMMSS(),
                firstAttemptCorrect :firstAttemptCorrect,
                secondAttemptCorrect :secondAttemptCorrect,
                totalCorrect :firstAttemptCorrect + secondAttemptCorrect,
                firstAttemptMarksEarned :firstAttemptMarksEarned,
                secondAttemptMarksEarned :secondAttemptMarksEarned,
                totalMarksEarned : firstAttemptMarksEarned + secondAttemptMarksEarned,
                firstAttemptPercetageGained :firstAttemptPercetageGained,
                secondAttemptPercetageGained :secondAttemptPercetageGained,
                totalPercentage : firstAttemptPercetageGained + secondAttemptPercetageGained,
                firstAttemptTime :firstAttemptTime.toHHMMSS(),
                secondAttemptTime : secondAttemptTime.toHHMMSS(),
                totalTimeTaken :(firstAttemptTime + secondAttemptTime).toHHMMSS()
            }
console.log($scope.reportData)
        })
    }
    $scope.getData();

    $scope.open = function (data,type) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'app/studentDash/htmlReport/modal.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                items: function () {
                    return {
                        question: data,
                        type: type
                    };
                }
            }
        });
    }
});
