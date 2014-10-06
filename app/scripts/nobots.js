'use strict';

/**
 * @ngdoc overview
 * @name nobotsApi
 * @description
 * # nobotsApp
 *
 * Main module of the application.
 */

(function() {
  var app = angular.module('nobots', [ 'ngStorage' ]);

  // GET /#/nobots
  app.factory('api', function($http, $localStorage) {

    // A good ol' IIFE API
    return {
      get: function(cb) {
        // If nobots exist in localStorage get from there
        if ($localStorage.nobots) {
          return cb($localStorage.nobots);
        }

        // Get demo nobot json from fixtures
        $http.get('/api-data/demo-nobots.json')
        .success(function(data) {
          $localStorage.nobots = data;
          return cb(data);
        });
      },
      post: function(data, cb) {
        var length = $localStorage.nobots.push(data);
        cb(length - 1);
      },
      delete: function(index, cb) {
        $localStorage.nobots.splice(index, 1);
        cb($localStorage.nobots.length - 1);
      }
    };
  });

})();
