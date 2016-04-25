/**
 * Created by cstoy on 4/22/2016.
 */

(function(angular) {

	'use strict';

	var amodule = angular.module('svgTestApp');


	var EditorViewController = function($interval) {

		var ctrl = this;

		ctrl.counter = 0;

		$interval(function() {
			ctrl.counter++;
		}, 1000);
	};


	amodule.component('editorView', {
		templateUrl: 'components/EditorView/EditorView.html',
		controller : EditorViewController
	});


})(window.angular);