function MapController(controller, $rootScope, $scope, $timeout, $http) {

	controller.layers = {};

	controller.map = new L.Map("map", {
		attributionControl: false,
		boxZoom: false,
		center: [45.759723, 4.842223],
		dragging: true,
		doubleClickZoom: true,
		keyboard: true,
		maxBounds: new L.latLngBounds(
			new L.latLng(45.259723, 4.342223),
			new L.latLng(46.259723, 5.342223)
		),
		maxZoom: 18,
		minZoom: 11,
		scrollWheelZoom: true,
		tap: true,
		touchZoom: true,
		zoomControl: false,
		zoom: 11,
	}).addControl(new L.control.attribution({
		position: 'bottomright',
		prefix: false
	}))
	.addLayer(new L.tileLayer('https://openstreetmap.data.grandlyon.com/tms/1.0.0/osm_grandlyon@GoogleMapsCompatible/{z}/{x}/{y}.png', {
		tms: true,
		attribution: 'Attribution <a target="_blank" href="https://openstreetmap.org">OpenStreetMap</a> &ndash; <a target="_blank" href="http://www.grandlyon.com">Grand Lyon</a>'
	}));

	new L.Control.Zoom({position: "bottomright"}).addTo(controller.map);

}
