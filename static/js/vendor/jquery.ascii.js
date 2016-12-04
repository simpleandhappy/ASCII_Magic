/*!
 * jQuery plugin for converting HTML tables into ASCII representation
 *
 * Version: 0.3.0 (Jan 2013)
 *
 * Copyright 2011-2012, Vladimir Kostyukov http://vkostyukov.ru
 * License: http://www.apache.org/licenses/LICENSE-2.0.html
 * Project page: https://github.com/vkostyukov/jquery-ascii
 */
(function ($) {
	$.fn.ascii = function() {
		var newline = "<br>";
		var space = "&nbsp;";

		if (!this.is("table")) {
			return "+----------------------------+"
				+ newline + "| Source isn't a html table. |" + newline
				+ "+----------------------------+";
		}

		var data = [];
		var lengths = []; // width of each column
		var header = -1;

		var row = 0;
		this.find("tr").each(function() {
			var line = data[row] || []; // if (data[row] == something){var line = something} else{var line = []} 
			var column = 0;
			$(this).find("td,th").each(function() { // for each td or th 
				line[column] = $(this).html();
				
				var text_len;

				if ($(this).find("a").length != 0) {
					text_len = $(this).find("a").first().text().length;
				} else {
					text_len = $(this).text().length;
				}

				console.log(text_len);

				if (lengths[column] == undefined
					|| text_len > lengths[column]) { // adding column length to length array
					lengths[column] = text_len;
				}

				column += 1;
			});

			data[row] = line;

			if ($(this).find("th").length > 0) { //creating the header
				header = row + 1;
			}

			row++;
		});

		var repeat = function(string, times) { //repeats character in string
			if (times > 0) return new Array(times + 1).join(string);
			return "";
		};

		var process = function(row, total) {
			var typed = 0;
			var result = ""; //returned at the end written to webpage
			for (var cell in row) {
				var text_len;

				if (row[cell][0] == '<') {
					text_len = $(row[cell]).text().length;
				} else {
					text_len = row[cell].length;
				}

				var align = 1 + lengths[cell] - text_len;
				typed += 2 + text_len + align;
				result += "| " + row[cell] + repeat(space, align);
			}

			if (typed < total - 1) {
				result += "| " + repeat(space, total) - typed - 1;
			}

			return result + "|" + newline;
		};

		console.log(lengths);
		var total = lengths.length - 1; // account for |s in header
		for(var length in lengths) {
			total += lengths[length] + 2; // sum lengths of text + 2 for padding
		}

		var out = "+" + repeat("-", total) + "+" + newline;
		for (var row in data) {
			if (row == header) {
				out += "+" + repeat("-", total) + "+" + newline;
			}
			out += process(data[row], total);
		}

		out += "+" + repeat("-", total) + "+" + newline;

		return out;
	};
}) (jQuery);
