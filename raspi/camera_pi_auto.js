var autobahn = require('autobahn');

var when = autobahn.when;
var session = null;

function main () {

	console.log("Raspberry Pi Camera starting");

	// the WAMP connection to the Router
	var connection = new autobahn.Connection({
		// url: "ws://140.116.226.234:8080/ws", // replace with the url of your crossbar instance
		url: "ws://192.168.0.104:8080/ws",
		realm: "realm1"
	});

	// fired when connection is established and session attached
	connection.onopen = function (sess, details) {

		console.log("connected");

		session = sess;

		function takePhoto (args, kwargs, details) {

			console.log("takePicture called");

			var cameraResult = when.defer();

			var exec = require('child_process').exec;

			exec("raspistill -t 2000 -w 640 -h 480 -o '-' | uuencode --base64 /dev/stdout", {maxBuffer:640 * 480}, function(err, stdout, stderr) {
				if (stdout != "") {
					cameraResult.resolve(stdout);
				}
				if (stderr != "") {
					// actually contains feedback about actions on successful photo taken
					console.log("stderr ", stderr);
				}
				if (err != null) {
					console.log("exec error: ", err);
					cameraResult.reject(err);
				}
			});

			return cameraResult.promise;
		};



		setInterval(function() {
			var currentDate = new Date();
			var datetime = "Last Sync: " 
							+ currentDate.getDate() + "/"
							+ (currentDate.getMonth()+1)  + "/"
							+ currentDate.getFullYear() + " @ "
							+ currentDate.getHours() + ":"
							+ currentDate.getMinutes() + ":"
							+ currentDate.getSeconds();
			takePhoto().then(function(cameraResult){
				var obj = {time: datetime, photo: cameraResult};
				session.publish("io.crossbar.examples.pi.camera.take_photo", [], obj);
				console.log(obj.time);
			});
		}, 10000);
	};


	// fired when connection was lost (or could not be established)
	connection.onclose = function (reason, details) {
		console.log("Connection lost: " + reason, details);
	}

	// now actually open the connection
	connection.open();

}

main();
