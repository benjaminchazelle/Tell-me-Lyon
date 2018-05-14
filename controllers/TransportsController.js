function TransportsController(controller, $rootScope, $scope, $timeout, $http) {

	controller.layers.transportsLayer = new function () {

		var layer = this;

		layer.canvas = null;
		layer.dataset = [];

		layer.update = function () {

			$rootScope.transportsDataset.sort(function(a, b){
				return ($rootScope.selectedTransport == a) - ($rootScope.selectedTransport == b) || a.star - b.star || a.id - b.id;
			});

			// Create

			var markers = layer.canvas.selectAll("g")
			.data($rootScope.transportsDataset)
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
			.text(function (d) {return "M"})


			markers.selectAll("path, text")
			.on("click", function(d) {
				d3.select(this.parentNode).moveToFront()
				$rootScope.selectedTransport = d;
				$rootScope.$digest();
			})
			.on("mouseenter", function(d) {
				$rootScope.hoverTransport = d;
				$rootScope.$digest();
			})
			.on("mouseleave", function(d) {
				$rootScope.hoverTransport = null;
				$rootScope.$digest();
			})

			// Update
			layer.canvas.selectAll(".box")
			.style("stroke", function (d) {

				return ($rootScope.selectedTransport != null && d.id == $rootScope.selectedTransport.id) ? "#000" : "#404040";
			})
			.style("stroke-width", function (d) {

				if($rootScope.selectedTransport != null && d.id == $rootScope.selectedTransport.id) {
					return 3;
				}

				return 1;
			})
			.style("fill", function (d) {

				return "#d51317";

			});

			var wishList = $rootScope.getWishList();

			layer.canvas.selectAll("path, text")
			.style("display", function (d) {

				if(["transports"].indexOf($rootScope.activeTab) == -1) {
					return "none";
				}

				if($rootScope.selectedTransport != null && d.id == $rootScope.selectedTransport.id) {
					return "";
				}

				var display = false;

				for(var l in d.lines) {

					if($rootScope.transportsLinesStates[$rootScope.transportsLines[d.lines[l]]]) {
						display = true;
						break;
					}
				}

				if(wishList.length > 0) {

					var inWishRadius = false;

					for(var w in wishList) {

						var wish = wishList[w];

						if(geoDistance(d.latlng.lat, d.latlng.lng, wish.latlng.lat, wish.latlng.lng) < $rootScope.transportsRadius/10) {

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

$rootScope.transportsDataset = [];

d3.json("data/metro.json", function(data) {

	var dataset = [];

	var transportsLines = {};

	for(d in data) {

		var datum = data[d];

		var allLines = {};

		datum["geometry.coordinates"] = JSON.parse(datum["geometry.coordinates"]);

		var lines = datum["properties.lignes"].match(/[A-Z0-9]+/g);

		lines = lines == null ? [] : lines;

		for(var l in lines) {
			transportsLines[lines[l]] = null;
		}

		dataset.push({
			id : d,
			nom : datum["properties.nom"],
			lines : lines,
			readableLines : lines.join(", "),
			latlng : new L.LatLng( datum["geometry.coordinates"][1],  datum["geometry.coordinates"][0])
		});
	}

	$rootScope.transportsLines = {};

	Object.keys(transportsLines).sort().forEach(function(key) {
	  $rootScope.transportsLines[key] = transportsLines[key];
	});

	var transportsLinesStates = [];

	var i = 0;
	for(var line in $rootScope.transportsLines) {
		transportsLinesStates.push(true);
		$rootScope.transportsLines[line] = i++;
	}

	$rootScope.transportsLinesStates = transportsLinesStates;

	$rootScope.$watchCollection("transportsLinesStates", controller.layers.transportsLayer.update);

	$rootScope.transportsDataset = dataset;
	controller.layers.transportsLayer.update();

	$rootScope.$digest();
});



$rootScope.transportsQualityMin = 1;
$rootScope.transportsQualityMax = 5;

$rootScope.$watch("transportsQualityMin", controller.layers.transportsLayer.update);
$rootScope.$watch("transportsQualityMax", controller.layers.transportsLayer.update);

$rootScope.transportsSatisfactionMin = 0;
$rootScope.transportsSatisfactionMax = 50;

$rootScope.$watch("transportsSatisfactionMin", controller.layers.transportsLayer.update);
$rootScope.$watch("transportsSatisfactionMax", controller.layers.transportsLayer.update);

$rootScope.transportsRadius = 150;

$rootScope.$watch("transportsRadius", controller.layers.transportsLayer.update);


// Hover & Active

$rootScope.selectedTransport = null;

$rootScope.hoverTransport = null;

$rootScope.getHighlightedTransport = function () {
	if($rootScope.hoverTransport != null) {
		return $rootScope.hoverTransport;
	}
	return $rootScope.selectedTransport;
}

$rootScope.$watch("selectedTransport", controller.layers.transportsLayer.update);
$rootScope.$watch("hoverTransport", controller.layers.transportsLayer.update);

$rootScope.transportsFocus = function (transport) {

	$rootScope.selectedTransport = transport;

	controller.map.flyTo(transport.latlng);

	if(controller.map.getZoom() != 17) {
		setTimeout(function () {
			controller.map.flyTo(transport.latlng, 17);

		}, 500);
	}
};

$rootScope.transportStoryMetro = function () {
	for(var l in $rootScope.transportsLinesStates) {
		$rootScope.transportsLinesStates[l] = true;
	}

	$rootScope.transportsLinesStates[$rootScope.transportsLines["F1"]] = false;
	$rootScope.transportsLinesStates[$rootScope.transportsLines["F2"]] = false;
};

$rootScope.transportStoryFunicular = function () {
	for(var l in $rootScope.transportsLinesStates) {
		$rootScope.transportsLinesStates[l] = false;
	}

	$rootScope.transportsLinesStates[$rootScope.transportsLines["F1"]] = true;
	$rootScope.transportsLinesStates[$rootScope.transportsLines["F2"]] = true;
};

}
