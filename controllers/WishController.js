function WishController(controller, $rootScope, $scope, $timeout, $http) {

	$rootScope.wishListFocused = false;


	$rootScope.getWishList = function () {

		if($rootScope.hotspotsDataset == null) {
			return [];
		}

		return $rootScope.hotspotsDataset.filter(function(place) {
			return place.wish;
		});
	}

	$rootScope.wishCentroid = null;

	$rootScope.computeWishCentroid = function () {

		var centroid = {
			lat : 0,
			lng : 0
		};

		var wishes = $rootScope.getWishList();

		if(wishes.length == 0) {
			$rootScope.wishCentroid = null;
			return;
		}

		for(var i = 0; i < wishes.length; i++) {
			centroid.lat += wishes[i].latlng.lat;
			centroid.lng += wishes[i].latlng.lng;
		}

		centroid.lat /= wishes.length;
		centroid.lng /= wishes.length;

		$rootScope.wishCentroid = centroid;
	};

	$rootScope.computeWishCentroid();


	$rootScope.isWishListFocused = function () {
		return $rootScope.wishListFocused && $rootScope.getWishList().length;
	};

	$rootScope.wishListFocus = function(focus) {
		$rootScope.wishListFocused = focus && $rootScope.getWishList().length;
	}

	$rootScope.isWishListed = function(place) {
		return place != null && place.wish;
	};

	$rootScope.wishListToggle = function (place) {

		place.wish = !place.wish;

		$rootScope.computeWishCentroid();

		controller.layers.hotspotsLayer.update();

		if(!$rootScope.getWishList().length) {
			$rootScope.wishListFocused = false;
		}

	};
}
