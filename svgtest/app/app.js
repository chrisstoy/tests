/**
 * Main App module
 */

(function () {
	'use strict';

// Require all of our requirements
	var jquery = require('jquery');
	var angular = require('angular');


// Declare app level module which depends on views, and components
	var appModule = angular.module('svgTestApp', [
		require('angular-route')
	]);


	appModule.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {
			template: '<editor-view></editor-view>'
		});
		$routeProvider.otherwise({
			// return to main view if we don't know where they were trying to go
			redirectTo: '/'
		});
	}]);

})();