var Event = angular.module('Event', ['ngRoute']);

Event.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/dashboard.html',
            controller: 'dashboardController'
        })
        .when('/new-event', {
            templateUrl: 'templates/new-event.html',
            controller: 'NewEventController'
        });
});

Event.controller('dashboardController', function($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all events and show them
    $http.get('/api/events')
        .success(function (data) {
            $scope.events = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    $http.get('/api/event_types')
        .success(function (data) {
            $scope.eventTypes = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });



    // delete a event after checking it
    $scope.deleteEvent = function (id) {
        $http.delete('/api/event/' + id)
            .success(function (data) {
                $scope.events = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
});

Event.controller('NewEventController', function($scope, $http) {
    // when submitting the add form, send the text to the node API
    $scope.createEvent = function () {
        $http.post('/api/events', $scope.formData)
            .success(function (event) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.events.push(event);
                console.log(event);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
});
