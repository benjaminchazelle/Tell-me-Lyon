angular.module('App', ['uiSlider']).controller('AppController', function($rootScope, $scope, $timeout, $http) {

	controller = this;

	TabController(controller, $rootScope, $scope, $timeout, $http);

	MapController(controller, $rootScope, $scope, $timeout, $http);

	WishController(controller, $rootScope, $scope, $timeout, $http);

	BikesController(controller, $rootScope, $scope, $timeout, $http);

	HotelsController(controller, $rootScope, $scope, $timeout, $http);

	TransportsController(controller, $rootScope, $scope, $timeout, $http);

	HotspotsController(controller, $rootScope, $scope, $timeout, $http);

	LayersController(controller, $rootScope, $scope, $timeout, $http);

	// Utilities

	$rootScope.checkbox = function () {

		document.querySelectorAll('.ui.checkbox').forEach(function (checkbox) {
			checkbox.onclick = function () {
				checkbox.querySelector("input").click();
			};
		});
	};

	$rootScope.range = function (length) {
		var range = [];
		for(var i = 0; i < length; i++) {
			range.push(i);
		}
		return range;
	};

	$rootScope.decimal = function(f)  {
		return parseFloat(f).toFixed(1);
	};


});
