/**
 * Main App module
 */

(function (angular) {
	'use strict';

// Declare app level module which depends on views, and components
	var module = angular.module('svgTestApp', [
		'ngRoute'
	]);

	module.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {
			template: '<editor-view></editor-view>'
		});
		$routeProvider.otherwise({
			// return to main view if we don't know where they were trying to go
			redirectTo: '/'
		});
	}]);


})(window.angular);