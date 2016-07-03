function convertToDate(timeStamp) {
		var ts = String(timeStamp);
		// Format: YYYY-MM-DD HH:MM:SS
		var string_split = ts.split(" ");
		var date_part = string_split[0].split("-");
		var time_part = string_split[1].split(":");
		return new Date(date_part[0], parseInt(date_part[1]) - 1, date_part[2], time_part[0], time_part[1], time_part[2]);
}

function drawViewersChart(rowData) {
		var convertedData = [];
		$.each(rowData, function( index, value ) {
        convertedData.push([convertToDate(value[0]), value[1]]);
		});
		console.log(convertedData);

		// Create the data table
		var data = new google.visualization.DataTable();
		data.addColumn('date', 'timestamp');
		data.addColumn('number', 'viewers');
		data.addRows(convertedData);
		data.sort([{column: 0}]);

		// Set options
		var columnWidth = $('#viewers-graph').width();
		var options = {
				title: 'Average Viewers over time',
				width: columnWidth,
				height: 400
		};

		// Instantiate and draw the chart
		var chart = new google.visualization.LineChart(document.getElementById('viewers-graph'));
		chart.draw(data, options);
}

// Draw all the charts
function drawCharts(streamerName, gameShortName, streamID) {
		// Make an AJAX call to get the data from the API
		$.ajax({
				url: "/api/v1/raw_stream_data/" + streamerName + "/" + gameShortName + "/" + streamID,
				success: function(data) {
						jsonData = JSON.parse(data);
						console.log("Data received from API:");
						console.log(jsonData);
						console.log("Drawing viewers chart for: " + streamerName + "'s " + gameShortName + " stream with ID: " + streamID);
						drawViewersChart(jsonData);
				}
		});
}

function loadCharts(streamerName, gameShortName, streamID) {
		// Load packages required
		google.charts.load('current', {'packages':['corechart', 'line']});
		// Set Callbacks
		google.charts.setOnLoadCallback(function() {
				drawCharts(streamerName, gameShortName, streamID);
		});
}
