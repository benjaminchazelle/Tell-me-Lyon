function TabController(controller, $rootScope, $scope, $timeout, $http) {

	$rootScope.about = function () {
			window.location.href = "about.html"
	};

	$rootScope.tabs = {
		'hot_spots' : {label : 'Hot spots', icon : '005-location-mark.png'},
		'bikes' : {label : 'Shared-bikes', icon : '004-bike.png'},
		'hotels' : {label : 'Hotels', icon : 'double-king-size-bed.png'},
		'transports' : {label : 'Transports', icon : '006-front-of-bus.png'},
		// 'fete_des_lumieres' : {label : 'Fête des lumières', icon : '002-light-bulb.png'}
	};

	$rootScope.activeTab = 'hot_spots';

	var easterEggCounter = 3;

	$rootScope.setTab = function (tab) {

		if($rootScope.activeTab == tab) {
			--easterEggCounter
		} else {
			easterEggCounter = 3;
		}

		if(easterEggCounter == 0) {
			$rootScope.easterEgged = true;
		}



		$rootScope.activeTab = tab;

		$timeout(function () {

			$rootScope.hotspotsPopularityMax = parseFloat($rootScope.hotspotsPopularityMax);
			$rootScope.hotspotsPopularityMin = parseFloat($rootScope.hotspotsPopularityMin);

			$rootScope.hotelsQualityMin = parseFloat($rootScope.hotelsQualityMin);
			$rootScope.hotelsQualityMax = parseFloat($rootScope.hotelsQualityMax);

			$rootScope.hotelsSatisfactionMin = parseFloat($rootScope.hotelsSatisfactionMin);
			$rootScope.hotelsSatisfactionMax = parseFloat($rootScope.hotelsSatisfactionMax);

			$rootScope.bikeCapacityMin = parseFloat($rootScope.bikeCapacityMin);
			$rootScope.bikeCapacityMax = parseFloat($rootScope.bikeCapacityMax);

			$rootScope.bikeTime = parseFloat($rootScope.bikeTime);

			$rootScope.bikeMarkerScale = parseFloat($rootScope.bikeMarkerScale);

			$rootScope.hotelsRadius = parseFloat($rootScope.hotelsRadius);

			$rootScope.transportsRadius = parseFloat($rootScope.transportsRadius);
		}, 0);
	};

}
