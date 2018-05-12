function LayersController(controller, $rootScope, $scope, $timeout, $http) {

	// Init SVG layer
	L.svg().addTo(controller.map);

	var svg = d3.select("#map").select("svg");
	
	for(var layer in controller.layers) {

		controller.layers[layer].canvas = svg.append("g");
		controller.layers[layer].canvas.classed("layer-canvas", true);

		controller.map.on("viewreset", controller.layers[layer].update);
		controller.map.on("zoom", controller.layers[layer].update);

		$rootScope.$watch("activeTab", controller.layers[layer].update);
	}
}
