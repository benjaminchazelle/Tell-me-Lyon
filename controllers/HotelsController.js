function HotelsController(controller, $rootScope, $scope, $timeout, $http) {

	function computeColor(occupation) {

		if(occupation < 0.50) {

			var q = occupation / 0.50;

			var r = Math.floor(0xDB + q * (0xFB - 0xDB));
			var g = Math.floor(0x28 + q * (0xBD - 0x28));
			var b = Math.floor(0x28 + q * (0x08 - 0x28));

		} else {

			var q = (occupation - 0.50) / 0.75;

			var r = Math.floor(0xFB + q * (0x21 - 0xFB));
			var g = Math.floor(0xBD + q * (0xBA - 0xBD));
			var b = Math.floor(0x08 + q * (0x45 - 0x08));

		}

		return "rgb("+ r + ", " + g + ", " + b + ")";

	}

	controller.layers.hotelsLayer = new function () {

		var layer = this;

		layer.canvas = null;
		layer.dataset = [];

		layer.update = function () {

			$rootScope.hotelsDataset.sort(function(a, b){
				return ($rootScope.selectedHotel == a) - ($rootScope.selectedHotel == b) || a.star - b.star || a.id - b.id;
			});

			// Create

			var markers = layer.canvas.selectAll("g")
			.data($rootScope.hotelsDataset)
			.enter().append("g")

			markers.append("path")
			.attr("class", "box")
			.style("opacity",  0.9)
			.attr("d", "m13 0c2 0 4-2 4-4l0-22c0-2-2-4-4-4l-22 0c-2 0-4 2-4 4l0 22c0 2 2 4 4 4l22 0z")

			markers.append("text")
			.attr("class", "bike")
			.attr("fill", "#fff")
			.style("font-family", "Lato")
			.style("font-size", "17x")
			.style("font-weight", "bold")
			.style("text-anchor", "middle")
			.text(function (d) {return d.star + "★"})

			markers.selectAll("path, text")
			.on("click", function(d) {
				d3.select(this.parentNode).moveToFront()
				$rootScope.selectedHotel = d;
				$rootScope.$digest();
			})
			.on("mouseenter", function(d) {
				$rootScope.hoverHotel = d;
				$rootScope.$digest();
			})
			.on("mouseleave", function(d) {
				$rootScope.hoverHotel = null;
				$rootScope.$digest();
			})

			// Update
			layer.canvas.selectAll(".box")
			.style("stroke", function (d) {

				return ($rootScope.selectedHotel != null && d.id == $rootScope.selectedHotel.id) ? "#000" : "#404040";
			})
			.style("stroke-width", function (d) {

				if($rootScope.selectedHotel != null && d.id == $rootScope.selectedHotel.id) {
					return 3;
				}

				return 1;
			})
			.style("fill", function (d) {

				var satisfaction = (d.satisfaction-1)/4;

				if(satisfaction < 0.5) {

					var q = satisfaction / 0.5;

					var r = Math.floor(0xDB + q * (0xFB - 0xDB));
					var g = Math.floor(0x28 + q * (0xBD - 0x28));
					var b = Math.floor(0x28 + q * (0x08 - 0x28));

				} else {

					var q = (satisfaction - 0.5) / 0.75;

					var r = Math.floor(0xFB + q * (0x21 - 0xFB));
					var g = Math.floor(0xBD + q * (0xBA - 0xBD));
					var b = Math.floor(0x08 + q * (0x45 - 0x08));

				}

				return "rgb("+ r + ", " + g + ", " + b + ")";
			});

			var wishList = $rootScope.getWishList();

			layer.canvas.selectAll("path, text")
			.style("display", function (d) {

				if(["hotels"].indexOf($rootScope.activeTab) == -1) {
					return "none";
				}

				if($rootScope.selectedHotel != null && d.id == $rootScope.selectedHotel.id) {
					return "";
				}

				var display = $rootScope.hotelsCategoriesStates[$rootScope.hotelsCategories[d.category]];

				display = display && $rootScope.hotelsQualityMin <= d.star && d.star <= $rootScope.hotelsQualityMax;

				display = display && $rootScope.hotelsSatisfactionMin/10 <= d.satisfaction && d.satisfaction <= $rootScope.hotelsSatisfactionMax/10;

				if(wishList.length > 0) {

					var inWishRadius = false;

					for(var w in wishList) {

						var wish = wishList[w];

						if(geoDistance(d.latlng.lat, d.latlng.lng, wish.latlng.lat, wish.latlng.lng) < $rootScope.hotelsRadius/10) {

							inWishRadius = true;
							break;

						}

					}

					display = display && inWishRadius;

				}

				return display ? "" : "none";
			})

			layer.canvas.selectAll("path")
			.attr("transform", function(d) {

				return "translate("+
				controller.map.latLngToLayerPoint(d.latlng).x +","+
				controller.map.latLngToLayerPoint(d.latlng).y +")";
			})

			layer.canvas.selectAll("text")
			.attr("transform", function(d) {

				return "translate("+
				(controller.map.latLngToLayerPoint(d.latlng).x + 2) +","+
				(controller.map.latLngToLayerPoint(d.latlng).y - 10) +")";
			})


	};
};

$rootScope.hotelsDataset = [];

d3.json("data/hotels.json", function(data) {

	var dataset = [];

	for(d in data) {

		var datum = data[d];

		var parseDomain = function(url) {
			var a  = document.createElement('a');
			a.href = url;
			return a.hostname;
		};

		dataset.push({
			id : d,
			nom : datum["properties.nom"],
			category : datum["properties.eng_type"],
			photoURL : datum["photoURL"],
			satisfaction : datum["properties.rating"],
			address : datum["properties.adresse"],
			star : datum["properties.star"] == 0 ? 1 : datum["properties.star"],
			phone : datum["properties.clean_telephone"],
			url : datum["properties.siteweb"].split(";")[0],
			domain : parseDomain(datum["properties.siteweb"].split(";")[0]),
			latlng : new L.LatLng( datum["geometry.coordinates"][1],  datum["geometry.coordinates"][0])
		});
	}

	controller.layers.hotelsLayer.dataset = dataset;
	controller.layers.hotelsLayer.update();

	$rootScope.hotelsDataset = dataset;

	$rootScope.$digest();
});

$rootScope.hotelsCategories = {
	'Hotel' : null,
	'Hostel' : null,
	'Private accomodation' : null,
};

var hotelsCategoriesStates = [];

var i = 0;
for(var category in $rootScope.hotelsCategories) {
	hotelsCategoriesStates.push(true);
	$rootScope.hotelsCategories[category] = i++;
}

$rootScope.hotelsCategoriesStates = hotelsCategoriesStates;


$rootScope.$watchCollection("hotelsCategoriesStates", controller.layers.hotelsLayer.update);

$rootScope.hotelsQualityMin = 1;
$rootScope.hotelsQualityMax = 5;

$rootScope.$watch("hotelsQualityMin", controller.layers.hotelsLayer.update);
$rootScope.$watch("hotelsQualityMax", controller.layers.hotelsLayer.update);

$rootScope.hotelsSatisfactionMin = 0;
$rootScope.hotelsSatisfactionMax = 50;

$rootScope.$watch("hotelsSatisfactionMin", controller.layers.hotelsLayer.update);
$rootScope.$watch("hotelsSatisfactionMax", controller.layers.hotelsLayer.update);

$rootScope.hotelsRadius = 200;

$rootScope.$watch("hotelsRadius", controller.layers.hotelsLayer.update);


// Hover & Active

$rootScope.selectedHotel = null;

$rootScope.hoverHotel = null;

$rootScope.getHighlightedHotel = function () {
	if($rootScope.hoverHotel != null) {
		return $rootScope.hoverHotel;
	}
	return $rootScope.selectedHotel;
}

$rootScope.$watch("selectedHotel", controller.layers.hotelsLayer.update);
$rootScope.$watch("hoverHotel", controller.layers.hotelsLayer.update);

$rootScope.hotelsFocus = function (hotel) {

	$rootScope.selectedHotel = hotel;

	controller.map.flyTo(hotel.latlng);

	if(controller.map.getZoom() != 17) {
		setTimeout(function () {
			controller.map.flyTo(hotel.latlng, 17);

		}, 500);
	}
};

$rootScope.hotelsStoryGood = function () {

		$rootScope.hotelsQualityMin = 1;
		$rootScope.hotelsQualityMax = 2;

		$rootScope.hotelsSatisfactionMin = 40;
		$rootScope.hotelsSatisfactionMax = 50;

};



$rootScope.hotelsStoryBad = function () {

	$rootScope.hotelsQualityMin = 4;
	$rootScope.hotelsQualityMax = 5;

	$rootScope.hotelsSatisfactionMin = 0;
	$rootScope.hotelsSatisfactionMax = 10;
};



}
