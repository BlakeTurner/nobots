'use strict';

/**
 * @ngdoc overview
 * @name nobotsApp
 * @description
 * # nobotsApp
 *
 * Main module of the application.
 */

(function() {
  var app = angular.module('nobotsApp', [ ]);

  app.directive('content', function() {
    return {
      replace: true,
      restrict: 'E',
      templateUrl: '/views/content.html',
      controller: function() {

        var viewsPath = '/views/';
        var viewsSuffix = '.html';
        var defaultTemplate = 'home';

        this.setTemplate = function(template) {
          this.template = viewsPath + template + viewsSuffix;
        };

        this.setTemplate(defaultTemplate);
      },
      controllerAs: 'contentCtrl'
    };
  });

  app.controller('homeCtrl', function($scope) {
    $scope.readyForNobots = false;

    $scope.haveYouEver = [
     { q: 'Struggled to read a pixelated photo of an address on a delapitated stucco house?', a: false },
     { q: 'Squinted to decode garbled and sometimes offensive 5th grader printing?', a: false },
     { q: 'Been appalled at the pimple of ugliness that a captcha can be on a beautifully designed page?', a: false }
    ];

    $scope.$on('checkMeEvent', function() {
      $scope.readyForNobots = $scope.haveYouEver.reduce(function(bool, question) {
        return question.a;
      }, false);
    });
  });

  app.directive('checkMe', function() {
    return {
      restrict: 'E',
      templateUrl: '/views/check_me.html',
      controller: function($scope) {
        // Set default state
        $scope.checked = $scope.question.a;

        // Toggle state on click
        $scope.toggleCheck = function() {
          $scope.question.a = !$scope.question.a;
          $scope.$emit('checkMeEvent', $scope);
        };
      },
      controllerAs: 'checkCtrl'
    };
  });
})();
