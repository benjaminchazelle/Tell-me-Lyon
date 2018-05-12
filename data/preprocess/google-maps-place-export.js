fs = require("fs");
request = require("request");
var levenshtein = require('fast-levenshtein');

raw = fs.readFileSync("tourismdata2.json").toString();

tourismdata = JSON.parse(raw);

a = new Set();

queue = [];

for(i in tourismdata.features) {
	
	
	queue.push(tourismdata.features[i].properties);
	
	
	tourismdata.features[i].properties.lat = tourismdata.features[i].geometry.coordinates[1];
	tourismdata.features[i].properties.lon = tourismdata.features[i].geometry.coordinates[0];
}

END = 0;
THREAD = 1;
TIME = 2;

function end() {
	
	END++;
	
	if(END != THREAD) {
		return;
	}

	fs.writeFileSync("tourismdata2_copy.json", JSON.stringify(tourismdata, null, 4));
	fs.writeFileSync("tourismdata2.json", JSON.stringify(tourismdata, null, 4));
	
}

function loop () {

	feature = queue.pop();
	/*
	if(queue.length > 2852) {
		console.log(queue.length)
		return setTimeout(loop, 0);
	}*/
	
	console.log("$$$", queue.length);
	

	
	if(feature == null) {
		return end();
	}

	function getKey() {
		
		keys = [
			// "AIzaSyC-EhpXoUtprv6FByrEvBZVbUb2nVF2Oxw",
			// "AIzaSyBgnn4AdWeZL-XdnGcwbGYbFDsW8vu8f4g",
			// "AIzaSyBhIDK0v1jSaWJOT-RM8vcNu42V5Gw2Dts",
			// "AIzaSyBWdGF64FkkjJxI8pP_vRdKZRJpa_D_1X8",
			// "AIzaSyAbuCfpH92zB0PbeZN9nA89nxC1TsWcmLs",
			// "AIzaSyCcC1umkWPK6Rk69BRKZ0cU3aoThHrVq3c",
			// "AIzaSyCS-13dZx-mKh20AeIWcC9cIMWkdLSyXGU",
			// "AIzaSyDChFjyFs-cU9WenwKu86ZV4SPixZuP2Hw",
			// "AIzaSyCxNNk0Rgln3UgBas7zYlsu5Z5JtGDSk-I",
			// "AIzaSyABma0xkgZHGheVPVKepIiSJkT9dBd1v6I",
			// "AIzaSyAbHrHRksBDGtuQYws-KGV3n4sr_f0kjH0",
			// "AIzaSyC3hWyKG1k9JfWozxn061RZgU16bCP1oAo",
			// "AIzaSyBnBQz95mJzvyxw1uo-IIVi3XYDMeW-Xro",
			// "AIzaSyDydF0njb3xlQ8tnovgssxQDQmtZCL29ws",
			
			// "AIzaSyDyVzlxGhR1nW0gPUCfNtmXWU3-YMej44k",
			// "AIzaSyBFpi5ipXAjQ-g-DNl_6A2-zG3QPYoPB6Y",
			// "AIzaSyCO0X5rNJUu74JxGyCbMnWsdXuIhhgxql0",
			// "AIzaSyBH2BUSYTpBzM_MpdGPMuMm7I1c6opilq8",
			// "AIzaSyC1OJ-1SKJpr7IUhaPcEzkQDd_e9wK_wGU",
			// "AIzaSyDSmhqh5Q3J-VLuHtqSN0--vyeJD7UchDQ",
			// "AIzaSyDH0BPN9xmNC7P7neQW0MZh8-xMwJ2-XtQ",
			
			// "AIzaSyDpNUzRRHh55ea5LFngDycuxmhEtgjsiTE",
			// "AIzaSyD0SBNOfy50ZdLwBZiFlBtfaOt67T6cQLU",
			
    "AIzaSyCHf2EeOg7T167gSkNU_ljDPetPXysSMFg",
    "AIzaSyAsU5XpnhyRwiuxqSHxtJnmFJ9nAYsq-Kk",
    "AIzaSyBI5B2snURiIE8VkeuNYL2Es3ZZf8veRf4",
    "AIzaSyAuJIEnY4TcR-G67YJSgS2CNbPJNABzs3s",
    "AIzaSyA-7Ji5LkGy-_gH-RuZeVIV3m6zOuVUZPA",
    "AIzaSyDhLLXweHCuv8m4ZRqocAKizxRywaGBjXI",
    "AIzaSyClDJ30upVkHyCP8IMT5ayCu_3rSu2ag7E",
    "AIzaSyDHoS63IY3s5KczZujHBhhl70mrQLVo-QE",
    "AIzaSyBYuz2HZWdjthly1NlGKqGA-TPsuHms3ZA",
    "AIzaSyAqP-GZF6rfBqL4VUNxGFxZpWGs-0gd5Y0",
    "AIzaSyDEhtQbIdDR_5KQjMBgIPSoEb2IELXYTG0",
    "AIzaSyBausENaGVRf31dW-ph0Wi9sk1vFBSRCzo",
    "AIzaSyDPlgW3AxwsuqkrgjqPS67W9UHIjLGnW5g",
    "AIzaSyBeXdxEh4IVA3A7N5IfmBnvNAAmFbNYc6U",
    "AIzaSyDv4yY43goypjC6BXZYCcaaXySvbsFAxTA",
    "AIzaSyANULjox-0qcLdFkdlsYBoj4iMlOUiS5_g",
    "AIzaSyAdndlByHtgVTERL45nF33Lr72qnw5V49I",
    "AIzaSyARjslgIhWFOwKTo3lKbl2zXt5_kwAHC-4",
    "AIzaSyAg6u_9IyTWLsagI_n1OvgXuxnaKEWIO9k",
    "AIzaSyDAhGg64lKOYPK-6jEMFKqQlc2TSTHTI2M",
    "AIzaSyCPrWFxTwfbV1LJSMPyEnroNh_Ezb2KEhI",
    "AIzaSyBdfbDfA6R0H0e3gDPXHNIW4cNJJAEjSss",
    "AIzaSyDXjSZ-gsHxG-WqacY_ufb52WZAF9_jdpo",
    "AIzaSyBSoyUbiTvaa1kbqgVQj43kv46SsaKvjSU",
    "AIzaSyDQUBhF_Fz5gm4s4HFAr4nogZnKJkncRDc",
    "AIzaSyDs6RzjlMJZMcca24BUKGnqb9SHX7z9OO4",
    "AIzaSyBE30hkgGbIO2nkcigR7c1sU0PBI5nVEAk",
    "AIzaSyDjqFrrexwOFxK8OQb6gDhslHir22W05ik",
    "AIzaSyDNeai9oJaTgOWuvohReDXGkSkDvKcBWsc",
    "AIzaSyC85R5Wq8IzS3LjsMiZd-68gLc-DYqGWTU",
    "AIzaSyBMBTI7HoN5xy3HJdQMCQpAgKYe1SwsF7o",
    "AIzaSyAseWPTr6P88XO1gm78yUq5MkR9pu1t7jA",
    "AIzaSyDqu1FqTmzBY0ogfnDSOkKK2Q9VmsnI7Eo",
    "AIzaSyBeSLNdvk-8lWu18-pmPnjMwjlYa4-iqgw",
    "AIzaSyDO0zcbNxDysY2GFj4RecvWVAoUuxvOc0Q",
    "AIzaSyAer4VW66byYQj08TzM2LYzWcRy2xcy_B8",
    "AIzaSyBkoIfbi99MOoTG6hLuSUPpvMRZVc-d3pg",
    "AIzaSyA4TW4MaPG_YUkCrUWJypsFIgO1OGre6m8",
    "AIzaSyCWxzap9mC-3SFSRdKyaWuMVtOCaoGSj04",
    "AIzaSyB1AC1r3RvRWDB5ihm1bhlIjvIEzYAdcnA",
    "AIzaSyA30yhaBrGHSuhrdyBsy9wuLIDoYO6qv0s",
    "AIzaSyBUJx80sMf2DQF9hsGC0tgiKxGusOt0KEo",
    "AIzaSyC3v_pZbmLZNkIasBzu_U2M9wqyO3O1rf8",
    "AIzaSyAOuEU_qz6RyeuvfDpLw0IaDSywp46Rtu0",
    "AIzaSyDBzLV40ne47V_C50u34jQBnM6zVHeZ-Hc",
    "AIzaSyAduOLW-YfvIWSgXaUIJITwfHufHqKjenY",
    "AIzaSyARxMs5p0tZEXC6wD7ZPFTOWx_0jewi39w",
    "AIzaSyAU8uC7NC2lOPh3-MDMLEwKelbCwIL28J4",
    "AIzaSyBnQ0oNfa60yjAriKis0VFV8V7qxlfoV60",
    "AIzaSyBY3CV7M_CHDTZG-1GXYzrVzGj7ICHiuy0",
    "AIzaSyBkuOrtDyxRxpNWrXIAthiSGpEAoKtZETA",
    "AIzaSyBM-DeB0UKcwSvnimyEvCQiYdZ99Sd49kw",
    "AIzaSyA8SOCv0faEPZdauezs3Oy9lY9PFM-73hw",
    "AIzaSyCs04NeB3LlmwXTJ1m1q3aF4qmKURYAOcM",
    "AIzaSyDdH330k7oCB9MWO7pnNzlQUuDwCjOsvA0",
    "AIzaSyDlv0keEQsyv8KzDpRSFQti3Kiq5Anlff4",
    "AIzaSyBhmfYqx0u4NWnSavh7CM3o0JtTJE-PP7U",
    "AIzaSyCvQHFaZjpef4QpSjvecPa93PC1tnVybMM",
    "AIzaSyD3bFpDYru_EinjPHFIsszjP9tJF-_82P0",
    "AIzaSyCR1_gBS_v3b1zgmYQ7rVN6VO7RCgIQwDs",
    "AIzaSyATi8d86dHYR3U39S9_zg_dWZIFK4c86ko",
    "AIzaSyDPr7QR5TlfneViomQIt8H_H7PBKX-_jCg",
    "AIzaSyClvOa41RlvjTGJrdpHo3pxnHm00MRR27w",
    "AIzaSyCnRK9xxC6VN9HjugwH0IYP6MkNWKsAxEI",
    "AIzaSyAe2v4Xx_jWuZWC-dg3sGPTN4_MTR48mXg",
    "AIzaSyADEU0jk0lwewzBjLDNpL_74oM_nC5Hr_I",
    "AIzaSyBjP5nWZ5y6tn7kL_iOiIOlVhA7c07k9W8",
    "AIzaSyD5J_wtkXU2Z0Rc2Atm7UwLFKECDjl9-BU",
    "AIzaSyC7VTy1fw8NrWq6Nfs_UHj6OuTnZqmjeP4",
    "AIzaSyDC0uLwfB0vj6-SN0TnncyoiAzuKpH2SeI",
    "AIzaSyDKT04EtfMXGsk56uPOYdi5v3dNG9hmVWw",
    "AIzaSyCVfdWb5Df8k5lczfN-VvFfS7iUgw8qH14",
    "AIzaSyAIdfM7K2Ytu5oKwCdF3mEsgLd2hdBrOQw",
    "AIzaSyAn9YEgrnN_o5iLUa26oYPUnZmyX4CN6ls",
    "AIzaSyDbJ_cmgMOyMQSiRDz5JrUg_qXfuRxSmqs",
    "AIzaSyAGiZMLB2OgqOCc53rfzOXL48XXpng8Qtg",
    "AIzaSyDKPfHzj3bzyKiVHKx5eFt-a-UKdnVLAlY",
    "AIzaSyAQsxkikgp6YecAhkj2VyY5CI-eWUVQ-3w",
    "AIzaSyCk-RG2l7ZTFPnx7Eapz1ovGCeJjSwr5LU",
    "AIzaSyAIns3enZwqky9L60Pfj1AmlfgIHyL6tUo",
    "AIzaSyD0H_G1JKCgklUtvDFVcdoMtto3ooyalZ8",
    "AIzaSyAeS6Qgpzy05XlEW2u02MHgpv8OXLLH6ZE",
    "AIzaSyDQ5LSi13ighFRcp_JU7kXiKXnrjbPDiuk",
    "AIzaSyDJY4XyFDExoMWABF_ddqRGwubIRoYGQmc",
    "AIzaSyBB8yxmrnkmjDK0YrpgnQEI75AqOd0UTB0",
    "AIzaSyDRi_-A_op267m9UYOEVWFJ_L17Gq5Klis",
    "AIzaSyBdt7KHl07gIOeT-zshtJvh_p2nI5pDS_Y",
    "AIzaSyDmP5GDT8NdTAd1KvS0GnNCDO9eSDxfWf0",
    "AIzaSyCjKv0xK2wFVM8DFe9C7frIrtU6kh7kOwA",
    "AIzaSyA_Clyz3478YAUnsESNHE5dyktvvMoa-vw",
    "AIzaSyCZshO4gyP5g3brwdmb-4OQ9R3WOK7d2Ng",
    "AIzaSyBqJm0s-cLWvjdBsdp1VWwFX2rOGIqgvDs",
    "AIzaSyDIISR3XY3XX2ts-ZsufAH6SiiEONQm7vE",
    "AIzaSyCmXWIHpnA-fIuLrqfzr9PaeonezFtnmm4",
    "AIzaSyChBPH2-5pX8tWNFRXzM0yhZ2v4vduzlS8",
    "AIzaSyCHmbGfBmNeM6DOpDoEipFnkvEopTyK89k",
    "AIzaSyCN_eZmq6P1ptPsvE0wa8MYrrJfwfRaTfU",
    "AIzaSyBSEYIOZwdERPoaSazA4NjcwLryNSw4U6c",
    "AIzaSyD_WfkW6KL6UL4cByUSXrvCGOg5OXf8Oa4",
    "AIzaSyB-LxRAoEEl9xPAra8ktpvOdYp5TeGuGb0",
    "AIzaSyCTxX10Hznx4ta5ZvlCS1BFXxDOwNJlQ-s",
    "AIzaSyCJuMsp1ABa_ioe1ZU2w6KJQYGIX2nCNfA",
    "AIzaSyDDzFcsajCTfbIGYMCZwKKGu8y1IPk9GyE",
    "AIzaSyBDFGff7mQ3mWhfZ5IYuqPxsCd049nqIn4",
    "AIzaSyAOdDnYThal1NZnCZZMZmzM5mHZYP4lsiM",
    "AIzaSyAiRSj2K2KygVMVuqq60fceLRLaPMCJdY0",
    "AIzaSyAsaKDM1E9cv45rSvphS8hv1X7eKtovbBg",
    "AIzaSyD2u63RMKtlXoSaMz2p3FbF6rN61ezYpK0"
		];
		
		var key = keys[Math.floor(Math.random()*keys.length)];

		return key;
	}	
	
	k = getKey();
	
	if("place_id" in feature && feature.place_id != null) {
		return setTimeout(loop, TIME);
	}

	fs.writeFileSync("tourismdata2_copy.json", JSON.stringify(tourismdata, null, 4));
	fs.writeFileSync("tourismdata2.json", JSON.stringify(tourismdata, null, 4));

	
	feature.place_id = null;
	
	console.log(queue.length + " - " + feature.nom)
	request({url : "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+encodeURIComponent(feature.nom)+"&location="+feature.lat+","+feature.lon+"&radius=200&key=" + k}, function (error, response, body) {
		if (error) {
		  return console.error('upload failed:', error);
		  delete feature.place_id;
		}
		
		var nearby = JSON.parse(body);	
		
		if(nearby.results.length) {
			
			var bestResult = nearby.results[0];
			var bestDist = 99999999999;

			for(const result of nearby.results) {
				
				var dist = levenshtein.get(feature.nom, result.name);
				
				if(dist < bestDist) {
					
					bestDist = dist;
					bestResult = result;
				}
			}

			feature.place_id = bestResult.place_id;			
			
			request({url : "https://maps.googleapis.com/maps/api/place/details/json?placeid="+encodeURIComponent(feature.place_id)+"&key=" + k}, function (error, response, body) {
				if (error) {
				  return console.error('upload failed:', error);
				  delete feature.place_id;
				}
				
				var result = JSON.parse(body);
				
				if(result.result) {
					
					var details = result.result;
							
					feature.photos = [];
					for(var p in details.photos) {
						feature.photos.push(details.photos[p].photo_reference);
					}
					feature.rating = details.rating;
					feature.reference = details.reference;
					feature.reviews = [];
					
					for(var r in details.reviews) {
						feature.reviews.push(details.reviews[r].rating);
					}
					
					console.log(">>>" + feature.nom);
					
					
					
				} else {

					if(result.status == "OVER_QUERY_LIMIT") {
						delete feature.place_id;
					}
					
					console.log(k, result);
				}
				
				setTimeout(loop, TIME);
			});				
			
			//console.log(bestResult.name, ":::", feature.nom)
			
		} else {
			
			// if(nearby.status == "ZERO_RESULTS") {
				// feature.place_id = null;
			// }
					if(nearby.status == "OVER_QUERY_LIMIT") {
						delete feature.place_id;
					}
					
			console.log(k, nearby);
			setTimeout(loop, TIME);
			
		}
	
	//	feature.popularity = parseInt(x[1]);
		//feature.popularity = JSON.parse(body).photos.total;
		
		//console.log(queue.length, feature.nom, feature.popularity);
		
		
	});
	
	
}


for(var i = 0; i < THREAD; i++) {
	loop();
}