function BikesController(controller, $rootScope, $scope, $timeout, $http) {

	$rootScope.bikeMarkerScale = 100;

	$rootScope.bikeAnimated = false;

	var bikeAnimationTimeout = [];

	$rootScope.toggleBikeAnimation = function () {

		if(!$rootScope.bikeAnimated) {

			$rootScope.bikeTime = 0;

			for(var t = 0; t < 24; t++) {

				bikeAnimationTimeout.push(setTimeout(function (t) {
					$rootScope.bikeTime = t;
					$rootScope.$digest();
				}, (t+1) * 300, t));

			}

			bikeAnimationTimeout.push(setTimeout(function (t) {
				$rootScope.bikeAnimated = false;
				$rootScope.$digest();
			}, (24) * 300, t));

			$rootScope.bikeAnimated = true;

		} else {

			for(var t in bikeAnimationTimeout) {
				clearTimeout(bikeAnimationTimeout[t]);
			}

			bikeAnimationTimeout = [];

			$rootScope.bikeAnimated = false;

		}

	};

	function computeColor(occupation) {

		if(occupation < 0.33) {

			var q = occupation / 0.33;

			var r = Math.floor(0xDB + q * (0xFB - 0xDB));
			var g = Math.floor(0x28 + q * (0xBD - 0x28));
			var b = Math.floor(0x28 + q * (0x08 - 0x28));

		} else {

			var q = (occupation - 0.33) / 0.75;

			var r = Math.floor(0xFB + q * (0x21 - 0xFB));
			var g = Math.floor(0xBD + q * (0xBA - 0xBD));
			var b = Math.floor(0x08 + q * (0x45 - 0x08));

		}

		return "rgb("+ r + ", " + g + ", " + b + ")";

	}

	function drawBikeGraph() {

		var w = 200;
		var h = 100;

		var highlightedStation = $rootScope.getHighlightedBike();

		if(highlightedStation == null) {
			return;
		}

		var dataset = [];

		var source = $rootScope.bikeMode == "bikes" ? highlightedStation.available_bikes : highlightedStation.available_bike_stands;

		for(var i in source) {
			dataset.push(source[i]);
		}


		var padding = 20;

		var svgbars = d3.select("#bikeGraph")

		// Scales

		var xScale = d3.scaleBand()
		.domain(d3.range(0, 24))
		.rangeRound([padding, w - padding])

		var xAxis = d3.axisBottom()
		.scale(xScale)
		.tickValues([0,3,6,9,12,15,18,21,24])
		.tickFormat(function(d) { return d; });

		var xAxisComponent = svgbars.selectAll(".x.axis");

		if(xAxisComponent.empty()) {

			svgbars.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0, " + (h - padding) + ")")
			.call(xAxis);
		} else {

			xAxisComponent
			.transition("xaxis")
			.duration(1000)
			.call(xAxis)
		}

		var yScale = d3.scaleLinear()
		.domain([0, highlightedStation.capacity])
		.range([h - padding, padding]);

		var yAxis = d3.axisLeft()
		.scale(yScale)
		.ticks(3)

		var yAxisComponent = svgbars.selectAll(".y.axis");

		if(yAxisComponent.empty()) {
			svgbars.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + padding + ",0)")
			.call(yAxis);
		} else {
			yAxisComponent
			.transition("yaxis")
			.duration(1000)
			.call(yAxis)
		}

		// Bars

		var rects = svgbars.selectAll("rect");

		var updated = false;

		if(rects.empty()) {

			rects = rects
			.data(dataset)
			.enter()
			.append("rect")

			updated = true;

		} else if(JSON.stringify(rects.data()) != JSON.stringify(dataset)) {

			rects = rects
			.data(dataset)
			.transition("bars")
			.duration(1000)

			updated = true;

		}


		if(true) {
			rects
			.attr("x", function(d, i) { return xScale(i); })
			.attr("y", function(d) { return yScale(d) ; })
			.attr("width", xScale.bandwidth())
			.attr("height", function(d) { return h - yScale(d) - padding; })
			.attr("fill", function(d) {
				return computeColor(d/highlightedStation.capacity);
			})
			.attr("stroke", function (d, k) {
				return k == $rootScope.bikeTime ? "black" : "transparent";
			})
			.attr("strok-width", function (d, k) {
				return k == $rootScope.bikeTime ? "2" : "0";
			})
		}






}

controller.layers.bikesLayer = new function () {

	var layer = this;

	layer.canvas = null;

	layer.update = function () {

		drawBikeGraph();

		// Create
		var markers = layer.canvas.selectAll("g")
		.data($rootScope.bikesDataset)
		.enter().append("g")

		markers.append("path")
		.attr("class", "box")
		.style("opacity",  0.9)
		.attr("d", "m13 0c2 0 4-2 4-4l0-22c0-2-2-4-4-4l-22 0c-2 0-4 2-4 4l0 22c0 2 2 4 4 4l22 0z")

		markers.append("path")
		.attr("class", "bike")
		.attr("fill", "#fff")
		.attr("d", "m-11-10c0-3 2-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-3 0-5-2-5-5m5 4c2 0 4-2 4-4 0-2-2-4-4-4-2 0-4 2-4 4 0 2 2 4 4 4m10-4c0-3 2-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-3 0-5-2-5-5m5 4c2 0 4-2 4-4 0-2-2-4-4-4-2 0-4 2-4 4 0 2 2 4 4 4m-5-17c1 0 2-1 2-2 0-1-1-2-2-2-1 0-2 1-2 2 0 1 1 2 2 2m0 5c0 0-1 0-1 0l-1-2-3 3 3 1c1 1 1 1 1 1l0 6c0 1 0 1-1 1-1 0-1-1-1-1l0-5-4-2c0 0-1-1-1-1 0 0 0-1 0-1l4-4c1-1 1 0 1 0 1 0 1 1 1 1l2 3 3 0c1 0 1 2 0 2l-4 0 0 0z")

		markers.selectAll("path")
		.on("click", function(d) {
			d3.select(this.parentNode).moveToFront()
			$rootScope.selectedBike = d;
			$rootScope.$digest();
		})
		.on("mouseenter", function(d) {
			$rootScope.hoverBike = d;
			$rootScope.$digest();
		})
		.on("mouseleave", function(d) {
			if($rootScope.selectedBike != null) {
				$rootScope.hoverBike = null;
			}
			$rootScope.$digest();
		})

		// Update
		layer.canvas.selectAll(".box")
		.style("stroke", function (d) {

			return ($rootScope.selectedBike != null && d.id == $rootScope.selectedBike.id) ? "#000" : "#404040";
		})
		.style("stroke-width", function (d) {

			if($rootScope.selectedBike != null && d.id == $rootScope.selectedBike.id) {
				return 3;
			}

			return 1;
		})
		.style("fill", function (d) {

			var input = $rootScope.bikeMode == "bikes" ? d.available_bikes : d.available_bike_stands;

			var occupation = input[$rootScope.bikeTime] / d.capacity;

			return computeColor(occupation);
		})


		layer.canvas.selectAll("path")
		.attr("transform", function(d) {
			return "translate("+
			controller.map.latLngToLayerPoint(d.latlng).x +","+
			controller.map.latLngToLayerPoint(d.latlng).y +"), scale(" + $rootScope.bikeMarkerScale/100 + ")";
		})
		.style("display", function (d) {

			if(["bikes"].indexOf($rootScope.activeTab) == -1) {
				return "none";
			}

			if($rootScope.selectedBike != null && d.id == $rootScope.selectedBike.id) {
				return "";
			}

			display = $rootScope.bikeCapacityMin <= d.capacity && d.capacity <= $rootScope.bikeCapacityMax;

			if($rootScope.bikeVariantOnly) {
				display = display && d.variant;
			}

			return display ? "" : "none";
		})
	};
};

$rootScope.bikesDataset = [];

$rootScope.BIKE_CAPACITY_MIN = 10;
$rootScope.BIKE_CAPACITY_MAX = 40;

d3.json("data/hourly_data.json", function(hourlyData) {

	d3.json("data/station_data.json", function(stationData) {

		var dataset = [];

		for(d in stationData) {

			var stationDatum = stationData[d];

			var available_bikes = {};
			var available_bike_stands = {};

			for(var i = 0; i < 24; i++) {
				available_bikes[i] = [];
				available_bike_stands[i] = [];
			}

			capacity = 0;

			for(var r in hourlyData[d]) {
				var record = hourlyData[d][r];
				var t = Math.floor(record.time);

				available_bikes[t].push(record.available_bikes);
				available_bike_stands[t].push(record.available_bike_stands);

				capacity = Math.max(capacity, Math.ceil(record.available_bikes + record.available_bike_stands));
			}

			var min = null;
			var max = null;

			for(var t in available_bikes) {
				available_bikes[t] = available_bikes[t].reduce(function(a, b) { return a + b; }, 0) / available_bikes[t].length;
				available_bike_stands[t] = available_bike_stands[t].reduce(function(a, b) { return a + b; }, 0) / available_bike_stands[t].length;

				if(min == null || available_bikes[t] < min) {
					min = available_bikes[t];
				}

				if(max == null || available_bikes[t] > max) {
					max = available_bikes[t];
				}
			}

			var range = max - min;

			var variant = (range / capacity) > 0.75;

			$rootScope.BIKE_CAPACITY_MIN = Math.min($rootScope.BIKE_CAPACITY_MIN, capacity);
			$rootScope.BIKE_CAPACITY_MAX = Math.max($rootScope.BIKE_CAPACITY_MAX, capacity);

			dataset.push({
				id : d,
				nom : stationDatum["name"].split("-")[1].trim(),
				address : stationDatum["address"],
				available_bikes : available_bikes,
				available_bike_stands : available_bike_stands,
				capacity : capacity,
				variant : variant,
				latlng : new L.LatLng( stationDatum["position"].lat,  stationDatum["position"].lng)
			});
		}

		$rootScope.bikesDataset = dataset;
		controller.layers.bikesLayer.update();

		$rootScope.bikeCapacityMax = $rootScope.BIKE_CAPACITY_MAX;

		$rootScope.$digest();
	});
});

$rootScope.bikesCategories = {
	'Bike' : null,
	'Hostel' : null,
	'Private accomodation' : null,
};

var bikesCategoriesStates = [];

var i = 0;
for(var category in $rootScope.bikesCategories) {
	bikesCategoriesStates.push(true);
	$rootScope.bikesCategories[category] = i++;
}

$rootScope.bikesCategoriesStates = bikesCategoriesStates;


$rootScope.$watchCollection("bikesCategoriesStates", controller.layers.bikesLayer.update);

$rootScope.bikeTime = 12;

$rootScope.$watch("bikeTime", controller.layers.bikesLayer.update);

$rootScope.bikeVariantOnly = false;

$rootScope.$watch("bikeVariantOnly", controller.layers.bikesLayer.update);

$rootScope.bikeMode = "bikes";

$rootScope.$watch("bikeMode", controller.layers.bikesLayer.update);

$rootScope.bikeCapacityMin = parseInt($rootScope.BIKE_CAPACITY_MIN);
$rootScope.bikeCapacityMax = parseInt($rootScope.BIKE_CAPACITY_MAX);

$rootScope.$watch("bikeCapacityMin", controller.layers.bikesLayer.update);
$rootScope.$watch("bikeCapacityMax", controller.layers.bikesLayer.update);

$rootScope.$watch("bikeMarkerScale", controller.layers.bikesLayer.update);


// Hover & Active

$rootScope.selectedBike = null;

$rootScope.hoverBike = null;

$rootScope.getHighlightedBike = function () {
	if($rootScope.hoverBike != null) {
		return $rootScope.hoverBike;
	}
	return $rootScope.selectedBike;
}

$rootScope.$watch("selectedBike", controller.layers.bikesLayer.update);
$rootScope.$watch("hoverBike", controller.layers.bikesLayer.update);

$rootScope.bikesFocus = function (bike) {

	$rootScope.selectedBike = bike;

	controller.map.flyTo(bike.latlng);

	if(controller.map.getZoom() != 17) {
		setTimeout(function () {
			controller.map.flyTo(bike.latlng, 17);

		}, 500);
	}
};

$rootScope.bikeStoryHomes = function () {
	$rootScope.bikeVariantOnly = true;
	$rootScope.bikeMode = 'bikes';
	$rootScope.bikeTime = 5;
};

$rootScope.bikeStoryOffices = function () {
	$rootScope.bikeVariantOnly = true;
	$rootScope.bikeMode = 'bikes';
	$rootScope.bikeTime = 21;
};


}
