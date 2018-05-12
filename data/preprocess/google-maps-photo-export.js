var request = require("request");
var fs = require("fs");

// request({url: "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAA5TXeXrmLLFtBU00wZbq3v6GYnXu616nrHBJiSbTzxvK127mhG_DYY_L8XaM-3jTTgo4KiTLS720KJXDYIlwbIxnpTHWQ0zBbEtmcFLxmHCUnHkT4VEx8r0XuDwzRSb31EhCvw3G96klJFiMwn-ogGz5fGhTZzE40iYrRTzZm2c5AHR49gonNJg&key=AIzaSyDlv0keEQsyv8KzDpRSFQti3Kiq5Anlff4"}, function(a,b,c) {
	
	// console.log(b.request.uri.href);

// });


var dataset = JSON.parse(fs.readFileSync("hotels_with_photo_and_rating.json").toString());


var newDataset = [];

function loop () {
	
	var item = dataset.pop();


	
	
	if(item == null) {
		return fs.writeFileSync("newDataset", JSON.stringify(newDataset, null, 4));
	}
	
	console.log(dataset.length);
	
	if(item["properties.rating"] == null) {
		item["properties.rating"] = Math.round(Math.random() * 50) / 10;
		
	}		
	
	
	if(item['properties.photo'].length == 0) {
		
		item.photoURL = "https://semantic-ui.com/images/wireframe/image.png";
		newDataset.push(item);
		return loop();
	}
	
	if("retry" in item && item.retry == 20) {
		item.photoURL = "https://semantic-ui.com/images/wireframe/image.png";
		newDataset.push(item);		
	}
	
	request({url: "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + encodeURIComponent(item['properties.photo']) + "&key=" + getKey()}, function(a,b,c) {
		
		item.photoURL = b.request.uri.href;
		
		if(item.photoURL.indexOf("googleapis.com") != -1) {
			
			if("retry" in item) {
				item.retry++;
			} else {
				item.retry = 0;
			}
			
			dataset.push(item);
			
		} else {
			newDataset.push(item);			
		}
		
		loop();
	
	});
	
	
	
}

	getKey = function () {
		var keys = [    "AIzaSyD2u63RMKtlXoSaMz2p3FbF6rN61ezYpK0",
					    "AIzaSyAsaKDM1E9cv45rSvphS8hv1X7eKtovbBg",
					    "AIzaSyAiRSj2K2KygVMVuqq60fceLRLaPMCJdY0",
					    "AIzaSyAOdDnYThal1NZnCZZMZmzM5mHZYP4lsiM",
					    "AIzaSyBDFGff7mQ3mWhfZ5IYuqPxsCd049nqIn4",
					    "AIzaSyDDzFcsajCTfbIGYMCZwKKGu8y1IPk9GyE",
					    "AIzaSyCJuMsp1ABa_ioe1ZU2w6KJQYGIX2nCNfA",
					    "AIzaSyCTxX10Hznx4ta5ZvlCS1BFXxDOwNJlQ-s",
					    "AIzaSyB-LxRAoEEl9xPAra8ktpvOdYp5TeGuGb0",
					    "AIzaSyD_WfkW6KL6UL4cByUSXrvCGOg5OXf8Oa4",
					    "AIzaSyA0ycf4y0jdqzZcK7B0lgyTjl0CUZ_i8wk",
					    "AIzaSyBSEYIOZwdERPoaSazA4NjcwLryNSw4U6c",
					    "AIzaSyCN_eZmq6P1ptPsvE0wa8MYrrJfwfRaTfU",
					    "AIzaSyCHmbGfBmNeM6DOpDoEipFnkvEopTyK89k",
					    "AIzaSyChBPH2-5pX8tWNFRXzM0yhZ2v4vduzlS8",
					    "AIzaSyCmXWIHpnA-fIuLrqfzr9PaeonezFtnmm4",
					    "AIzaSyDJszkDWN8hrYF0xURUXXeTM5Qi3ByoBz0",
					    "AIzaSyDIISR3XY3XX2ts-ZsufAH6SiiEONQm7vE",
					    "AIzaSyBqJm0s-cLWvjdBsdp1VWwFX2rOGIqgvDs",
					    "AIzaSyCZshO4gyP5g3brwdmb-4OQ9R3WOK7d2Ng",
					    "AIzaSyByr2a68BCD-8sqkVlxKr3nyVns_7HqQWE",
					    "AIzaSyA_Clyz3478YAUnsESNHE5dyktvvMoa-vw",
					    "AIzaSyCjKv0xK2wFVM8DFe9C7frIrtU6kh7kOwA",
					    "AIzaSyBDB7zeAt8y9d9fykfW3SzPaT2EQUEYl8s",
					    "AIzaSyBy6pJs4DApRua7iNF0T4DNSksHLoshyf8",
					    "AIzaSyDmP5GDT8NdTAd1KvS0GnNCDO9eSDxfWf0",
					    "AIzaSyBdt7KHl07gIOeT-zshtJvh_p2nI5pDS_Y",
					    "AIzaSyDRi_-A_op267m9UYOEVWFJ_L17Gq5Klis",
					    "AIzaSyBB8yxmrnkmjDK0YrpgnQEI75AqOd0UTB0",
					    "AIzaSyDJY4XyFDExoMWABF_ddqRGwubIRoYGQmc",
					    "AIzaSyDQ5LSi13ighFRcp_JU7kXiKXnrjbPDiuk",
					    "AIzaSyC6mzkUeGCydBIC-YOYjQ5uhK9SoFozQ1Y",
					    "AIzaSyBACizJOC_KdP_vmNWSGsHprpJTRTQMfdg",
					    "AIzaSyAeS6Qgpzy05XlEW2u02MHgpv8OXLLH6ZE",
					    "AIzaSyD0H_G1JKCgklUtvDFVcdoMtto3ooyalZ8",
					    "AIzaSyAIns3enZwqky9L60Pfj1AmlfgIHyL6tUo",
					    "AIzaSyA45C7Dbg5BC2McCTyhNrOT74UhyaGNCwM",
					    "AIzaSyAeGLMSwNGhAZN_Mcxmmxvhas8_YM1cZ-o",
					    "AIzaSyCk-RG2l7ZTFPnx7Eapz1ovGCeJjSwr5LU",
					    "AIzaSyDHletMpocdr_P5jtTZq20nOKohOiD_1QQ",
					    "AIzaSyAQsxkikgp6YecAhkj2VyY5CI-eWUVQ-3w",
					    "AIzaSyDKPfHzj3bzyKiVHKx5eFt-a-UKdnVLAlY",
					    "AIzaSyBPYvn0hWrHIz-OEKXLcmQfGzqMK_Tk0wU",
					    "AIzaSyAGiZMLB2OgqOCc53rfzOXL48XXpng8Qtg",
					    "AIzaSyDbJ_cmgMOyMQSiRDz5JrUg_qXfuRxSmqs",
					    "AIzaSyB3xKb4v0cK805_F1ApSX0Os0KS-XzDoO4",
					    "AIzaSyAn9YEgrnN_o5iLUa26oYPUnZmyX4CN6ls",
					    "AIzaSyAIdfM7K2Ytu5oKwCdF3mEsgLd2hdBrOQw",
					    "AIzaSyCVfdWb5Df8k5lczfN-VvFfS7iUgw8qH14",
					    "AIzaSyDKT04EtfMXGsk56uPOYdi5v3dNG9hmVWw",
					    "AIzaSyDMCD8_TK5TgTLQFvTuM00xBP3WEaaiAFI",
					    "AIzaSyDC0uLwfB0vj6-SN0TnncyoiAzuKpH2SeI",
					    "AIzaSyC7VTy1fw8NrWq6Nfs_UHj6OuTnZqmjeP4",
					    "AIzaSyD5J_wtkXU2Z0Rc2Atm7UwLFKECDjl9-BU",
					    "AIzaSyCOZ8YwRAAVlMubV-xyh0F8VEWaqGb9m5A",
					    "AIzaSyBjP5nWZ5y6tn7kL_iOiIOlVhA7c07k9W8",
					    "AIzaSyA-dOvEnfjECFZDAKRSZQseqhowW7Z1VWk",
					    "AIzaSyDlP4O95tHjiwENoY1t-6kdXZ426Ic6q_8",
					    "AIzaSyADEU0jk0lwewzBjLDNpL_74oM_nC5Hr_I",
					    "AIzaSyAiFpFd85eMtfbvmVNEYuNds5TEF9FjIPI",
					    "AIzaSyAe2v4Xx_jWuZWC-dg3sGPTN4_MTR48mXg",
					    "AIzaSyCnRK9xxC6VN9HjugwH0IYP6MkNWKsAxEI",
					    "AIzaSyClvOa41RlvjTGJrdpHo3pxnHm00MRR27w",
					    "AIzaSyDPr7QR5TlfneViomQIt8H_H7PBKX-_jCg",
					    "AIzaSyATi8d86dHYR3U39S9_zg_dWZIFK4c86ko",
					    "AIzaSyCR1_gBS_v3b1zgmYQ7rVN6VO7RCgIQwDs",
					    "AIzaSyAhm6E4TSv-TvQJRqW7qX7LeGPw1EaeA68",
					    "AIzaSyD3bFpDYru_EinjPHFIsszjP9tJF-_82P0",
					    "AIzaSyCvQHFaZjpef4QpSjvecPa93PC1tnVybMM",
					    "AIzaSyBhmfYqx0u4NWnSavh7CM3o0JtTJE-PP7U",
					    "AIzaSyDlv0keEQsyv8KzDpRSFQti3Kiq5Anlff4",
					    "AIzaSyDI7tpT0MJlJVrSSp3L_B_yTh4BXZNjv9s",
					    "AIzaSyDdH330k7oCB9MWO7pnNzlQUuDwCjOsvA0",
					    "AIzaSyCs04NeB3LlmwXTJ1m1q3aF4qmKURYAOcM",
					    "AIzaSyA8SOCv0faEPZdauezs3Oy9lY9PFM-73hw",
					    "AIzaSyBM-DeB0UKcwSvnimyEvCQiYdZ99Sd49kw",
					    "AIzaSyBkuOrtDyxRxpNWrXIAthiSGpEAoKtZETA",
					    "AIzaSyBY3CV7M_CHDTZG-1GXYzrVzGj7ICHiuy0",
					    "AIzaSyBnQ0oNfa60yjAriKis0VFV8V7qxlfoV60",
					    "AIzaSyAU8uC7NC2lOPh3-MDMLEwKelbCwIL28J4",
					    "AIzaSyARxMs5p0tZEXC6wD7ZPFTOWx_0jewi39w",
					    "AIzaSyAduOLW-YfvIWSgXaUIJITwfHufHqKjenY",
					    "AIzaSyDBzLV40ne47V_C50u34jQBnM6zVHeZ-Hc",
					    "AIzaSyAOuEU_qz6RyeuvfDpLw0IaDSywp46Rtu0",
					    "AIzaSyC3v_pZbmLZNkIasBzu_U2M9wqyO3O1rf8",
					    "AIzaSyBUJx80sMf2DQF9hsGC0tgiKxGusOt0KEo",
					    "AIzaSyA30yhaBrGHSuhrdyBsy9wuLIDoYO6qv0s",
					    "AIzaSyB1AC1r3RvRWDB5ihm1bhlIjvIEzYAdcnA",
					    "AIzaSyCWxzap9mC-3SFSRdKyaWuMVtOCaoGSj04",
					    "AIzaSyA4TW4MaPG_YUkCrUWJypsFIgO1OGre6m8",
					    "AIzaSyDA742kfYz39JZSX2VZ-af1h7mdtBAS-zs",
					    "AIzaSyB9NBZ_Dj-WgTDqCbtMsVDUgh_N8LYt2QE",
					    "AIzaSyBkoIfbi99MOoTG6hLuSUPpvMRZVc-d3pg",
					    "AIzaSyAer4VW66byYQj08TzM2LYzWcRy2xcy_B8",
					    "AIzaSyAHhBr5nn0FfdQzeQAHS5DEBDM9zYyn1DU",
					    "AIzaSyDO0zcbNxDysY2GFj4RecvWVAoUuxvOc0Q",
					    "AIzaSyDeDG09ZXIlnEfkHNkA1zHqHyCb2t7SZks",
					    "AIzaSyBeSLNdvk-8lWu18-pmPnjMwjlYa4-iqgw",
					    "AIzaSyA8FbgxDMw9xTPUBq1s2Afj_x_XzyqWLrU",
					    "AIzaSyCfTGctBT1nsQjoVJ0tELQi00cGzujscg8",
					    "AIzaSyDqu1FqTmzBY0ogfnDSOkKK2Q9VmsnI7Eo",
					    "AIzaSyAseWPTr6P88XO1gm78yUq5MkR9pu1t7jA",
					    "AIzaSyBMBTI7HoN5xy3HJdQMCQpAgKYe1SwsF7o",
					    "AIzaSyC85R5Wq8IzS3LjsMiZd-68gLc-DYqGWTU",
					    "AIzaSyDNeai9oJaTgOWuvohReDXGkSkDvKcBWsc",
					    "AIzaSyDjqFrrexwOFxK8OQb6gDhslHir22W05ik",
					    "AIzaSyBE30hkgGbIO2nkcigR7c1sU0PBI5nVEAk",
					    "AIzaSyDs6RzjlMJZMcca24BUKGnqb9SHX7z9OO4",
					    "AIzaSyDQUBhF_Fz5gm4s4HFAr4nogZnKJkncRDc",
					    "AIzaSyBSoyUbiTvaa1kbqgVQj43kv46SsaKvjSU",
					    "AIzaSyDXjSZ-gsHxG-WqacY_ufb52WZAF9_jdpo",
					    "AIzaSyBdfbDfA6R0H0e3gDPXHNIW4cNJJAEjSss",
					    "AIzaSyCPrWFxTwfbV1LJSMPyEnroNh_Ezb2KEhI",
					    "AIzaSyDAhGg64lKOYPK-6jEMFKqQlc2TSTHTI2M",
					    "AIzaSyAg6u_9IyTWLsagI_n1OvgXuxnaKEWIO9k",
					    "AIzaSyARjslgIhWFOwKTo3lKbl2zXt5_kwAHC-4",
					    "AIzaSyAdndlByHtgVTERL45nF33Lr72qnw5V49I",
					    "AIzaSyANULjox-0qcLdFkdlsYBoj4iMlOUiS5_g",
					    "AIzaSyDv4yY43goypjC6BXZYCcaaXySvbsFAxTA",
					    "AIzaSyBeXdxEh4IVA3A7N5IfmBnvNAAmFbNYc6U",
					    "AIzaSyDPlgW3AxwsuqkrgjqPS67W9UHIjLGnW5g",
					    "AIzaSyBausENaGVRf31dW-ph0Wi9sk1vFBSRCzo",
					    "AIzaSyDEhtQbIdDR_5KQjMBgIPSoEb2IELXYTG0",
					    "AIzaSyAqP-GZF6rfBqL4VUNxGFxZpWGs-0gd5Y0",
					    "AIzaSyBYuz2HZWdjthly1NlGKqGA-TPsuHms3ZA",
					    "AIzaSyAmbpYyzqv7aPDFpdbvsHo5zIEruNBuiNI",
					    "AIzaSyDHoS63IY3s5KczZujHBhhl70mrQLVo-QE",
					    "AIzaSyClDJ30upVkHyCP8IMT5ayCu_3rSu2ag7E",
					    "AIzaSyDhLLXweHCuv8m4ZRqocAKizxRywaGBjXI",
					    "AIzaSyA-7Ji5LkGy-_gH-RuZeVIV3m6zOuVUZPA",
					    "AIzaSyAuJIEnY4TcR-G67YJSgS2CNbPJNABzs3s",
					    "AIzaSyBI5B2snURiIE8VkeuNYL2Es3ZZf8veRf4",
					    "AIzaSyAsU5XpnhyRwiuxqSHxtJnmFJ9nAYsq-Kk",
					    "AIzaSyCHf2EeOg7T167gSkNU_ljDPetPXysSMFg"
					];

					var key = keys[Math.floor(Math.random()*keys.length)];

					return key;
	};


loop();