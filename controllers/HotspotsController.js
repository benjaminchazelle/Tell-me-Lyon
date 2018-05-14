function HotspotsController(controller, $rootScope, $scope, $timeout, $http) {

	// Hotspots

	controller.layers.hotspotsLayer = new function () {

		var layer = this;

		layer.canvas = null;

		layer.update = function () {

			$rootScope.hotspotsDataset.sort(function(a, b){
				return a.wish - b.wish || ($rootScope.hotspotsSelectedPlace == a) - ($rootScope.hotspotsSelectedPlace == b) || a.popularity - b.popularity;
			});

			// Create
			layer.canvas.selectAll("path")
			.data($rootScope.hotspotsDataset)
			.enter().append("path")
			.style("opacity",  0.9)
			.attr("d", "m0 0c0 0 0 0 0 0s10-15 10-20c0-7-5-10-10-10-5 0-10 3-10 10 0 5 10 20 10 20s0 0 0 0zm-3-20c0-2 2-3 3-3 2 0 3 2 3 3s-2 3-3 3c-2 0-3-2-3-3z")
			.on("click", function(d) {
				$rootScope.hotspotsSelectedPlace = d;
				$rootScope.$digest();
			})
			.on("mouseenter", function(d) {
				$rootScope.hotspotsHoverPlace = d;
				$rootScope.$digest();
			})
			.on("mouseleave", function(d) {
				$rootScope.hotspotsHoverPlace = null;
				$rootScope.$digest();
			})

			// Update
			layer.canvas.selectAll("path")
			.style("display", function (d) {

				if(["bikes", "fete_des_lumieres"].indexOf($rootScope.activeTab) != -1) {
					return "none";
				}

				if(["hotels", "transports"].indexOf($rootScope.activeTab) != -1 && !d.wish) {
					return "none";
				}

				if($rootScope.hotspotsSelectedPlace != null && d.id == $rootScope.hotspotsSelectedPlace.id) {
					return "";
				}

				var display = $rootScope.hotspotsCategoriesStates[$rootScope.hotspotsCategories[d.category]];

				display = display && $rootScope.hotspotsPopularityMin <= d.popularity*1000 && d.popularity*1000 <= $rootScope.hotspotsPopularityMax;

				if($rootScope.hotspotsOnlyFree) {
					display = display && d.free;
				}

				return display ? "" : "none";
			})
			.style("stroke", function (d) {

				if(d.wish) {
					return "#d51317";
				}

				return ($rootScope.hotspotsSelectedPlace != null && d.id == $rootScope.hotspotsSelectedPlace.id) ? "#000" : "#404040";
			})
			.style("stroke-width", function (d) {

				if($rootScope.hotspotsSelectedPlace != null && d.id == $rootScope.hotspotsSelectedPlace.id) {
					return 3;
				}

				return d.wish ? 2 : 1;
			})
			.style("fill", function (d) {

				if(d.wish) {
					return "white";
				}

				var r = Math.floor(0xcf + d.popularity * (0xd5 - 0xcf));
				var g = Math.floor(0xd8 + d.popularity * (0x13 - 0xd8));
				var b = Math.floor(0xdc + d.popularity * (0x17 - 0xdc));

				return "rgb("+ r + ", " + g + ", " + b + ")";
			})
			.attr("transform", function(d) {

				return "translate("+
				controller.map.latLngToLayerPoint(d.latlng).x +","+
				controller.map.latLngToLayerPoint(d.latlng).y +")";
			})
		};
	};

	$rootScope.hotspotsDataset = [];

	d3.json("data/hotspots.json", function(data) {

		var dataset = [];

		for(d in data) {
			var datum = data[d];

			var parseDomain = function(url) {
				var a  = document.createElement('a');
				a.href = url;
				return a.hostname;
			};

			dataset.push({
				nom : datum["properties.nom_x"],
				category : datum["properties.variety"],
				photoURL : datum["photoURL"],
				nb_reviews : datum["properties.nb_reviews"],
				url : datum["properties.siteweb_x"].split(";")[0],
				domain : parseDomain(datum["properties.siteweb_x"].split(";")[0]),
				free : datum["properties.free"] != "",
				id : d,
				latlng : new L.LatLng( datum["geometry.coordinates_x"][1],  datum["geometry.coordinates_x"][0]),
				wish : false
			});
		}

		dataset.sort(function (a, b) {
			return a.nb_reviews - b.nb_reviews;
		});

		for(var d in dataset) {
			dataset[d].popularity = d/dataset.length;
			dataset[d].rank = dataset.length - d;
		}

		$rootScope.hotspotsDataset = dataset;
		controller.layers.hotspotsLayer.update();

		$rootScope.computeWishCentroid();

		$rootScope.$digest();
	});

	$rootScope.hotspotsCategories = {
		'Museum' : null,
		'Church' : null,
		'Castle' : null,
		'Park' : null,
		'Other' : null
	};

	var hotspotsCategoriesStates = [];

	var i = 0;
	for(var category in $rootScope.hotspotsCategories) {
		hotspotsCategoriesStates.push(true);
		$rootScope.hotspotsCategories[category] = i++;
	}

	$rootScope.hotspotsCategoriesStates = hotspotsCategoriesStates;


	$rootScope.$watchCollection("hotspotsCategoriesStates", controller.layers.hotspotsLayer.update);

	$rootScope.hotspotsSearchQuery = "";

	$rootScope.hotspotsPopularityMin = 0;
	$rootScope.hotspotsPopularityMax = 1000;

	$rootScope.$watch("hotspotsPopularityMin", controller.layers.hotspotsLayer.update);
	$rootScope.$watch("hotspotsPopularityMax", controller.layers.hotspotsLayer.update);

	$rootScope.hotspotsOnlyFree = false;

	$rootScope.$watch("hotspotsOnlyFree", controller.layers.hotspotsLayer.update);

	$rootScope.hotspotsSearching = function () {
		return $rootScope.hotspotsSearchQuery.trim().length > 0;
	};

	$rootScope.hotspotsSearch = function () {

		if(!$rootScope.hotspotsSearching()) {
			return [];
		}

		var results = $rootScope.hotspotsDataset.filter(function (datum) {

			var datumName = datum.nom.latinize().toLowerCase();
			var queryName = $rootScope.hotspotsSearchQuery.latinize().toLowerCase();

			datum.score = levensteinDistance(datumName, queryName);

			return datumName.indexOf(queryName) != -1;
		});

		results = results.sort(function (a, b) {
			return a.score - b.score;
		});

		results = results.filter(function (datum, index) {
			return index < 5;
		});

		return results;

	};

	// Hover & Active

	$rootScope.hotspotsSelectedPlace = null;

	$rootScope.hotspotsHoverPlace = null;

	$rootScope.getHighlightedPlace = function () {
		if($rootScope.hotspotsHoverPlace != null) {

			return $rootScope.hotspotsHoverPlace;
		}
		return $rootScope.hotspotsSelectedPlace;
	}

	var invokeUpdate = function () {

		if($rootScope.getHighlightedPlace() != null && [1].indexOf($rootScope.getHighlightedPlace().rank) != -1) {
			$rootScope.easterEgged = true;
		}

		controller.layers.hotspotsLayer.update();
	};

	$rootScope.$watch("hotspotsSelectedPlace", invokeUpdate);
	$rootScope.$watch("hotspotsHoverPlace", invokeUpdate);

	$rootScope.hotspotsFocus = function (place) {

		$rootScope.hotspotsSelectedPlace = place;

		controller.map.flyTo(place.latlng);

		if(controller.map.getZoom() != 17) {
			setTimeout(function () {
				controller.map.flyTo(place.latlng, 17);

			}, 500);
		}
	};

	$rootScope.hotspotsStoryChurches = function () {
		for(var i in $rootScope.hotspotsCategoriesStates) {
			$rootScope.hotspotsCategoriesStates[i] = false;
		}
		$rootScope.hotspotsCategoriesStates[$rootScope.hotspotsCategories["Church"]] = true;
	};

	$rootScope.hotspotsStoryParks = function () {
		for(var i in $rootScope.hotspotsCategoriesStates) {
			$rootScope.hotspotsCategoriesStates[i] = false;
		}
		$rootScope.hotspotsCategoriesStates[$rootScope.hotspotsCategories["Park"]] = true;
	};


	// Easter egg
	$rootScope.easterEgg = function () {

		d3.select("#roll")
		.style("position", "fixed")
		.style("width", "100%")
		.style("height", "100%")
		.style("z-index", "10000000")
		.style("position", "fixed")
		.append("div")
		.attr("id", "player");

		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	};
}

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '100%',
		width: '100%',
		videoId: 'dQw4w9WgXcQ',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	event.target.playVideo();
}

function onPlayerStateChange(event) {
	event.target.playVideo();
}
