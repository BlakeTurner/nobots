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
  var app = angular.module('nobotsApp', [ 'ngRoute', 'ngStorage', 'nobots' ]);

  /*
    Routes
  */
  app.config(['$routeProvider', function($routeProvider) {
    var viewsPrefix = 'views/';
    $routeProvider
    .when('/', {
      controller: 'homeCtrl',
      templateUrl: viewsPrefix + 'home.html'
    })
    .when('/how-it-works', {
      controller: 'howItWorksCtrl',
      templateUrl: viewsPrefix + 'how-it-works.html'
    })
    .when('/build', {
      controller: 'buildCtrl',
      templateUrl: viewsPrefix + 'build.html'
    })
    .when('/nobots/:id?', {
      controller: 'nobotsCtrl',
      templateUrl: viewsPrefix + 'nobots.html'
    })
    .otherwise({
      redirectTo: '/'
    });
  }]);

  /*
    Controllers
  */

  // Navbar controller (active menu states)
  app.controller('navCtrl', function($scope, $location, $rootScope) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.navbarVisible = false;
    $scope.toggleNavbarVisible = function() {
      $scope.navbarVisible = !$scope.navbarVisible;
    };

    $rootScope.$on('$routeChangeSuccess', function() {
      $scope.navbarVisible = false;
    });
  });

  // GET /#
  app.controller('homeCtrl', function($scope, $http, $anchorScroll) {
    // Scroll to top on new page load
    $anchorScroll();

    // Initialize defaults
    $scope.readyForNobots = false;

    // Get array of gripes about captcha
    $http.get('api-data/haveyouever.json')
    .success(function(questions) {

      // Convert haveYouEver questions into array of q/a objects
      $scope.haveYouEver = questions.map(function(question) {
        return { q: question, a: false };
      });

      // Listen for users agreeing with my captcha dismay, reveal nobots CTA when they've conformed
      $scope.$watch('haveYouEver', checkAnswers, true);
    });

    // Iterate over haveYouEver answers looking for total agreement
    var checkAnswers = function() {
      $scope.readyForNobots = $scope.haveYouEver.reduce(function(state, question) {
        if (!question.a) { state = false; }
        return state;
      }, true);
    };
  });

  // GET /#/how-it-works
  app.controller('howItWorksCtrl', function($scope, $routeParams, $anchorScroll, $http, api) {
    // Scroll to top on new page load
    $anchorScroll();

    // Initialize defaults
    var demoNobots;
    var demoId;
    $scope.demoActive = false;

    // Randomly choose a new array index
    var nextDemoId = function() {
      var next;
      do {
        next = Math.floor(Math.random() * demoNobots.length);
      } while (next === demoId);
      return next;
    };

    // Get demo nobots from api
    api.get(function(data) {
      demoNobots = data;
      demoId = nextDemoId();
      $scope.demoNobot = [ demoNobots[demoId] ];
    });

    // Toggle demo active state
    $scope.toggleDemoActive = function() {
      $scope.demoActive = !$scope.demoActive;
    };

    // Randomly render a new demo
    // Fudging ng-repeat here to always use a single array element
    $scope.nextDemo = function() {
      $scope.demoActive = true;
      demoId = nextDemoId();
      var demoNobot = demoNobots[demoId];
      demoNobot.attempts = 0;
      demoNobot.nobotFail = false;
      $scope.demoNobot[0] = demoNobot;
    };
  });

  // GET /#/demo
  app.controller('buildCtrl', function($scope, $anchorScroll, $location, api, flash) {
    // Scroll to top on new page load
    $anchorScroll();

    var nobotForStorage = function(nobot) {
      var forStorage = angular.copy(nobot);
      delete forStorage.nobotValid;
      delete forStorage.nobotFail;
      forStorage.canDelete = true;
      return forStorage;
    };

    $scope.buildNobot = {
      image: 'http://lorempixel.com/500/350/',
      failImage: 'http://media.tumblr.com/d186c10ee8574f74300ecbdee892dc49/tumblr_inline_nbigicyN8D1rb7tcm.gif',
      caption: 'This is a very specific question about my image',
      failCaption: 'Nice try, robot!',
      answer: 'This is a specific answer to my question',
      answerCaption: 'Thank you for proving your humanity! Your form has been submitted to the ether...',
      attemptsAllowed: 3
    };

    $scope.reset = function(form) {
      form.$setPristine();

      $scope.buildNobot.attempts = 0;
      $scope.buildNobot.image = 'http://placehold.it/500x400';
      $scope.buildNobot.nobotValid = false;
      $scope.buildNobot.nobotFail = false;

      var cleanKeys = [ 'failImage', 'caption', 'failCaption', 'answer', 'answerCaption' ];
      cleanKeys.forEach(function(key) {
        $scope.buildNobot[key] = '';
      });
    };

    $scope.store = function(form) {
      if (!form.$valid) { return false; }

      api.post(nobotForStorage($scope.buildNobot), function(index) {
        flash.setMessage('We\'ve stored your NoBot in our library! Thanks for contributing!');
        $location.path('nobots/' + index);
      });
    };

    // Config for the nobot form directive
    $scope.formArgs = {
      resetAction: $scope.reset,
      resetText: 'Reset',
      submitAction: $scope.store,
      submitText: 'Save',
      buildNobot: $scope.buildNobot
    };

  });

  // GET /#/nobots
  app.controller('nobotsCtrl', function($scope, $anchorScroll, $routeParams, api, flash) {
    // Scroll to top on new page load
    $anchorScroll();
    $scope.buildActive = false;
    $scope.flash = flash;

    $scope.setActive = function(i) {
      $scope.activeIndex = i;
      $scope.noBots[i].attempts = 0;
      $scope.noBots[i].nobotFail = false;
      $scope.activeNoBots = [ $scope.noBots[i] ];
    };

    $scope.remove = function(index) {
      api.delete(index, function(lastIndex) {
        $scope.setActive(lastIndex);
      });
    };

    // Toggle build active state
    $scope.toggleBuildActive = function() {
      $scope.buildActive = !$scope.buildActive;
    };

    // Get demo nobot json
    api.get(function(data) {
      $scope.noBots = data;
      var id = $routeParams.id;
      var active = id && id < data.length ? id : 0;
      $scope.setActive(active);
    });
  });

  /*
    Directives
  */
  app.directive('nobot', function() {
    return {
      restrict: 'E',
      scope: {
        nobotArgs: '=args'
      },
      templateUrl: 'views/nobot.html',
      controller: function($scope) {
        $scope.nobotArgs.nobotValid = false;
        $scope.nobotArgs.attempts = 0;

        $scope.attemptAnswer = function() {
          // Pass clause
          if ($scope.guess.toLowerCase() === $scope.nobotArgs.answer.toLowerCase()) {
            $scope.nobotArgs.nobotValid = true;
            return;
          }
          // Reset answer and track remaining attempts
          $scope.guess = null;
          $scope.nobotArgs.attempts++;
          $scope.nobotArgs.nobotFail = $scope.nobotArgs.attempts >= $scope.nobotArgs.attemptsAllowed;
        };
      }
    };
  });

  app.directive('nobotForm', function() {
    return {
      restrict: 'A',
      scope: {
        formArgs: '=args'
      },
      templateUrl: 'views/_form.html',
    };
  });

  app.directive('checkMe', function() {
    return {
      restrict: 'E',
      templateUrl: '/views/check_me.html',
      controller: function($scope) {
        // Set default state based on model
        $scope.checked = $scope.question.a;

        // Toggle state
        $scope.toggleCheck = function() {
          $scope.question.a = !$scope.question.a;
        };
      },
      controllerAs: 'checkCtrl'
    };
  });

  /*
    Factories
  */

  // Rails type flash messages
  // Great recipe from http://fdietz.github.io/recipes-with-angular-js/common-user-interface-patterns/displaying-a-flash-notice-failure-message.html
  app.factory('flash', function($rootScope) {
    var queue = [];
    var currentMessage = '';

    $rootScope.$on('$routeChangeSuccess', function() {
      currentMessage = queue.shift() || '';
    });

    return {
      setMessage: function(message) {
        queue.push(message);
      },
      getMessage: function() {
        return currentMessage;
      }
    };
  });
})();
