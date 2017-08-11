var session = null;
var image = document.getElementById("image");
var imageProgress = document.getElementById("imageProgress");

var wsuri;
if (document.location.origin == "file://") { // test in self server
	wsuri = "ws://localhost:8080/ws"; // localhost for development
} 
else { // show in other client
	wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" + document.location.host + "/ws"; // URL of the Crossbar.io instance this is served from
}

// the WAMP connection to the Router
//
var connection = new autobahn.Connection({
	url: wsuri, // replace with URL of WAMP router if this doesn't serve the file
	realm: "realm1"
});

var cameraResult = null;

var requestPhoto = function (args, res) {
	imageProgress.innerHTML = "";
	base64image = res['base64image'];

	image.src = "data:image/jpg;base64," + base64image;

	console.log(res['predict'], base64image);

	imageProgress.innerHTML = res['time'] +'|' + res['predict'];
};

var requestSensor = function (args) {
	res = args[0];
	
	console.log(res);
							
	time = Math.floor((new Date()).getTime() / 1000) * 1000;
	
	var series = temperatureChart.series[0], y = res.dht11.temperature / 1;
	series.addPoint([time, y], true, series.data.length > 24);
	
	var series = humidityChart.series[0], y = res.dht11.humidity / 1;
	series.addPoint([time, y], true, series.data.length > 24);
	
	var series = earthmoistureChart.series[0], y = res.moisture.split(",")[1] / 1;
	series.addPoint([time, y], true, series.data.length > 24);
};

// fired when connection is established and session attached
connection.onopen = function (sess, details) {

	session = sess;

	console.log("connected");

	session.subscribe('io.crossbar.examples.pi.camera.take_photo_n_predict', requestPhoto);
	
	session.subscribe('io.crossbar.examples.pi.get_dht11_n_moisture', requestSensor);

};

// fired when connection was lost (or could not be established)
connection.onclose = function (reason, details) {

	console.log("Connection lost: " + reason);

}

// now actually open the connection
connection.open();
