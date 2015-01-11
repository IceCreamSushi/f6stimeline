var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var app = express();


var baseUrl = "http://www.f6s.com/main/frontpage/ajax-programs-list?filter=1&types[1]=accelerator&page=";
var rslt = {};

function goScrap(i) {
	request(baseUrl + i, function (err, response, html) {
		if (err)  {
			console.log(err);
		}
		var $ = cheerio.load(html);
		var title, date;
		var finalArray = [];

		$("li").each(function (idx, elem) {
			var data = $(elem);
			var oRslt = {};
			var calendar = data.find('.calendar');
			var h3 = data.find('h3');
			var bullets = cleanText(data.find('.bullet, .r').parent().text());

			oRslt.title = h3.children().text();
			oRslt.deadline = calendar.children('.big-date').text() + " " + calendar.children('.small-date').text();
			oRslt.link = data.find('.find-out-more').attr('href');
			oRslt.country = cleanText(h3.next().text()); // apparently, the country is always the node after the <h3>

			var dateRange = /(\w{3}\s\d{1,2})*/g.exec(bullets);
			console.log(dateRange);
			oRslt.startDate = dateRange[0] || '';
			oRslt.endDate = dateRange[1] || '';


			finalArray.push(oRslt);
		});
		finalTxt = finalArray.filter(function (val) {
			if (val.title !== '' && val.deadline.split(' ').join('') !== '') {
				return 1;
			}
		});
		fs.appendFileSync('output.json', JSON.stringify(finalTxt, null, 4));
	});
}

function cleanText(txt) {
	return txt.replace(/[\n\r\t]+/g, '');
}

for (var i = 0; i < 10; i++) {
	goScrap(i);
}


exports = module.exports = app;
