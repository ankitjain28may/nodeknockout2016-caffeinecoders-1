angular.module('app.student').filter('secondsToDateTime', function() {
    return function(seconds) {
        var d = new Date(0, 0, 0, 0, 0, 0, 0);
        d.setSeconds(seconds);
        return d;
    };
});
