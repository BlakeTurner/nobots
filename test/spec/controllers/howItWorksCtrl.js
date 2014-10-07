'use strict';

describe('Controller: homeCtrl', function () {

  // load the controller's module
  beforeEach(module('nobotsApp'));

  var howItWorksCtrl, scope, httpBackend;

  var nobots = [
    {
      header: 'Check out this bear holding a watermelon!',
      image: 'images/watermelon_bear.jpg',
      failImage: 'images/thumbsup-terminator.gif',
      caption: 'What fruit is the bear holding?',
      failCaption: 'Back where you came from, Terminator!',
      answer: 'watermelon',
      answerCaption: 'Thank you for proving your humanity! Your form has been submitted to the ether...',
      attemptsAllowed: 3,
      canDelete: false
    },
    {
      header: 'Check out this militant cat!',
      image: 'images/green_beret.jpg',
      failImage: 'images/thumbsup-terminator.gif',
      caption: 'What color is the cat\'s beret?',
      failCaption: 'Back where you came from, Terminator!',
      answer: 'green',
      answerCaption: 'Thank you for proving your humanity! Your form has been submitted to the ether...',
      attemptsAllowed: 3,
      canDelete: false
  }];

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;

    howItWorksCtrl = $controller('howItWorksCtrl', {
      $scope: scope
    });

    httpBackend.expect('GET', '/api-data/demo-nobots.json')
    .respond(nobots);

    httpBackend.flush();
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('initialization', function() {
     it('should initialize readyForNobots to false and collect haveYouEver questions', function () {
      expect(scope.demoActive).toBe(false);
      expect(scope.demoNobot.length).toEqual(1);
    });
  });

  describe('.toggleDemoActive', function() {
    beforeEach(function() {
      scope.demoActive = false;
    });
    it('should reverse the demoActive boolean', function () {
      scope.toggleDemoActive();
      expect(scope.demoActive).toBe(true);
    });
  });

  describe('.nextDemo', function() {
    beforeEach(function() {
      scope.demoActive = false;
    });
    it('should get a different nobot and reset its params', function () {
      var oldDemo = scope.demoNobot[0];
      scope.nextDemo();
      var newDemo = scope.demoNobot[0];

      expect(oldDemo.caption).not.toEqual(newDemo.caption);
      expect(newDemo.attempts).toEqual(0);
      expect(newDemo.nobotFail).toBe(false);
    });
  });



  // describe('.toggleNavbarVisible', function() {
  //   beforeEach(function() {
  //     scope.navbarVisible = false;
  //   });
  //   it('should toggle navbarVisible boolean', function () {
  //     scope.toggleNavbarVisible();
  //     expect(scope.navbarVisible).toBe(true);
  //   });
  // });
  //
  //


});
