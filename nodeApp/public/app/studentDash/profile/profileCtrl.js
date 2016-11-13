'use strict';

angular.module('app.student').controller('StudentProfileCtrl',

  function($scope,$http, User,localStorageService, Board,Country,State,City, Class, Section, Religion, Caste, Mothertongue) {
    var id = localStorageService.get("id");
    var user;
    
    Country.getList().then(function(data) {
            $scope.countrylist = data;
            $scope.schoolCountrylist = data;
            loadUser();
        });


        function loadUser() {
            User.one(id).get().then(function(data) {
                user = data;
                $scope.student = data;
                $scope.stepsModel = $scope.student.image;
                $scope.student.phone = data.phone;

                if ($scope.student.country) {
                    State.getList({
                        Country: $scope.student.country
                    }).then(function(resp) {
                        $scope.states = resp;
                        loadCity();
                    });
                }

                if ($scope.student.schoolCountry) {
                    State.getList({
                        Country: $scope.student.schoolCountry
                    }).then(function(resp) {
                        $scope.schoolStates = resp;
                        loadSchoolCity();
                        loadSchool();
                    });
                }

                Class.getList().then(function(data) {
                    $scope.classes = data;
                    if ($scope.student.classID) {
                        $scope.ondataChangeClass();
                    }
                })

            
                Religion.getList().then(function(resp) {
                    $scope.religions = resp;
                });

                Caste.getList().then(function(resp) {
                    $scope.castes = resp;
                });

                Mothertongue.getList().then(function(resp) {
                    $scope.languages = resp;
                });

            });
        }

        function loadCity() {
            City.getList({
                State: $scope.student.state
            }).then(function(resp1) {
                $scope.cities = resp1;
            });
        }

        function loadSchoolCity() {
            City.getList({
                State: $scope.student.schoolState
            }).then(function(resp1) {
                $scope.schoolCities = resp1;
            });
        }

        function loadSchool() {
            User.getList({
             type: 'School',
             city: $scope.student.schoolCity
             })
          .then(function(data) {
          $scope.schools=data;
         });
        }

        // Board.getList().then(function(data) {
        //   $scope.boards=data;
        // });



        $scope.ondataChangeClass = function() {
            Section.getList({
                id: $scope.student.classID
            }).then(function(data) {
                $scope.sections = data;
            });
        }




        $scope.ondataChangeCountry = function() {
            $scope.student.state = "";
            $scope.student.city = "";
            State.getList({
                Country: $scope.student.country
            }).then(function(resp) {
                $scope.states = resp;
            });
        };

        $scope.ondataChangeState = function() {
            City.getList({
                State: $scope.student.state
            }).then(function(resp1) {
                $scope.cities = resp1;
            });
        };





        $scope.schoolChangeCountry = function() {
            $scope.student.schoolState = "";
            $scope.student.schoolCity = "";
            State.getList({
                Country: $scope.student.schoolCountry
            }).then(function(resp) {
                $scope.schoolStates = resp;
            });
        };

        $scope.schoolChangeState = function() {
            City.getList({
                State: $scope.student.schoolState
            }).then(function(resp1) {
                $scope.schoolCities = resp1;
            });
        };

        $scope.schoolChangeCity = function() {
          User.getList({
             type: 'School',
             city: $scope.student.schoolCity
             })
          .then(function(data) {
          $scope.schools=data;
          console.log($scope.schools);
         });
        };

   $scope.imageUpload = function(event){

      var files = event.target.files; //FileList object
      var file = files[0];
      if(file.size<200000){
        var reader = new FileReader();
        reader.onload = $scope.imageIsLoaded;
        reader.readAsDataURL(file);
      }
      else{
       $.smallBox({
        title: "Warning",
        content: "Image Size is greater than 200 KB",
        color: "#CA4428",
        iconSmall: "fa  fa-paper-plane",
        timeout: 2000
      });
     }
   }
   $scope.imageIsLoaded = function(e){
    $scope.$apply(function() {
      $scope.student.image= null;
      $scope.stepsModel = e.target.result;
      $scope.student.image= $scope.stepsModel;
      console.log($scope.student);

    });
  }


$scope.save = function(form) {

  // if($scope.student.br){
  //   $scope.student.board=$scope.student.br + "" ;
  //   Board.post({ BoardName: $scope.student.br }).then(function(data) {
  //     console.log("send");
  //   });

  // }

  console.log("if_condition");
  $scope.student.save().then(function(resp) {
    $.smallBox({
     title: "Done !",
     content: "Updated Successfully",

     color: "#739E73",
     iconSmall: "fa  fa-paper-plane",
     timeout: 2000
   });
  },function(error){
    console.log(error);
  }
  );

}

})

.factory('CountryRestangular', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setRestangularFields({
      id: '_id'
    });
  });
})

.factory('Country', function(CountryRestangular) {
  return CountryRestangular.service('country');
})

.factory('StateRestangular', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setRestangularFields({
      id: '_id'
    });
  });
})

.factory('State', function(StateRestangular) {
  return StateRestangular.service('state');
})

.factory('CityRestangular', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setRestangularFields({
      id: '_id'
    });
  });
})

.factory('City', function(CityRestangular) {
  return CityRestangular.service('city');
});