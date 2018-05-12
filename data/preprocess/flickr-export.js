fs = require("fs");
request = require("request");


raw = fs.readFileSync("tourismdata.json").toString();

tourismdata = JSON.parse(raw);

a = new Set();

queue = [];

for(i in tourismdata.features) {
	
	queue.push(tourismdata.features[i].properties);
	
	
	tourismdata.features[i].properties.lat = tourismdata.features[i].geometry.coordinates[1];
	tourismdata.features[i].properties.lon = tourismdata.features[i].geometry.coordinates[0];
}

END = 0;
THREAD = 10;

function end() {
	
	END++;
	
	if(END != THREAD) {
		return;
	}
	
	fs.writeFileSync("tourismdata2.json", JSON.stringify(tourismdata));
	
}

function loop () {
	
	feature = queue.pop();
	
	if(feature == null) {
		return end();
	}
	
	// console.log(feature);
	// process.exit();
	
	
	request({url : "https://www.flickr.com/services/api/render?method=flickr.photos.search&api_key=74e129101391605385516cd7ef1ad85c&text="+encodeURIComponent(feature.nom)+"&has_geo=&lat="+feature.lat+"&lon="+feature.lon+"&per_page=10&accuracy=13&format=json&nojsoncallback=1"}, function (error, response, body) {
		if (error) {
		  return console.error('upload failed:', error);
		}
		
		x = body.match(/"total"[^"0-9]*"?(\d+)"?/);
		
		if(x == null || x.length < 2) {
			console.log(feature.nom);
		}
		
		feature.popularity = parseInt(x[1]);
		//feature.popularity = JSON.parse(body).photos.total;
		
		console.log(queue.length, feature.nom, feature.popularity);
		
		setTimeout(loop, 20);
	});
	
	
}


for(var i = 0; i < THREAD; i++) {
	loop();
}