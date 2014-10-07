'use strict';

describe('Controller: homeCtrl', function () {

  // load the controller's module
  beforeEach(module('nobotsApp'));

  var MainCtrl, scope, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;

    MainCtrl = $controller('homeCtrl', {
      $scope: scope
    });
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('when http request for questions has been made', function() {

    var questions = ['Question 1', 'Question 2'];

    beforeEach(function() {
      httpBackend.expect('GET', 'api-data/haveyouever.json')
      .respond(questions);
    });

    it('should initialize readyForNobots to false and collect haveYouEver questions', function () {
      expect(scope.readyForNobots).toBe(false);
      httpBackend.flush();

      expect(scope.haveYouEver.length).toEqual(questions.length);
      expect(scope.haveYouEver[0].q).toEqual(questions[0]);
      expect(scope.haveYouEver[0].a).toEqual(false);
    });

    describe('when haveYouEverChanges and there are still false answers', function() {
      beforeEach(function() {
        httpBackend.flush();
        scope.haveYouEver[0].a = true;
      });
      it('should maintain readyForNobots as false', function() {
        expect(scope.readyForNobots).toBe(false);
      });
    });

    describe('when haveYouEverChanges and there are no remaining false answers', function() {
      beforeEach(function() {
        httpBackend.flush();
        scope.haveYouEver[0].a = true;
        scope.haveYouEver[1].a = true;
      });
      it('should set readyForNobots to true', function() {
        // Wait for watch event to run
        setTimeout(function() {
          expect(scope.readyForNobots).toBe(true);
        }, 100);
      });
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
