'use strict';

describe('Controller: NavCtrl', function () {

  // load the controller's module
  beforeEach(module('nobotsApp'));

  var MainCtrl, scope, $location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$location_) {
    scope = $rootScope.$new();
    $location = _$location_;
    MainCtrl = $controller('navCtrl', {
      $scope: scope
    });
  }));

  it('should initialize navbarVisible to false', function () {
    expect(scope.navbarVisible).toBe(false);
  });

  describe('.toggleNavbarVisible', function() {
    beforeEach(function() {
      scope.navbarVisible = false;
    });
    it('should toggle navbarVisible boolean', function () {
      scope.toggleNavbarVisible();
      expect(scope.navbarVisible).toBe(true);
    });
  });

  describe('.isActive', function() {
    beforeEach(function() {
      $location.path('/my-path');
    });
    describe('when path matches', function() {
      it('should return true', function () {
        expect(scope.isActive('/my-path')).toBe(true);
      });
    });
    describe('when path does not match', function() {
      it('should return false', function () {
        expect(scope.isActive('/your-path')).toBe(false);
      });
    });
  });


});
