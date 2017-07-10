var autobahn = require('autobahn');

var when = autobahn.when;
var session = null;

function main () {

    console.log("Raspberry Pi Camera starting");

    // the WAMP connection to the Router
    //
    var connection = new autobahn.Connection({
        url: "ws://140.116.226.234:8080/ws", // replace with the url of your crossbar instance
        realm: "realm1"
    });

    // fired when connection is established and session attached
    //
    connection.onopen = function (sess, details) {

        console.log("connected");

        session = sess;

        function takePhoto (args, kwargs, details) {

            console.log("takePicture called");

            if (details.progress) {
                details.progress(["takePhoto called"]);
            }

            var cameraResult = when.defer();

            var exec = require('child_process').exec;

            // adjust to fit your webcam resolution
            // exec("fswebcam -r 640x480 --no-banner --save '-' | uuencode --base64 /dev/stdout", {maxBuffer:640 * 480}, function(err, stdout, stderr) {

            // adjust to fit your raspicamera resolution
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

        session.register("io.crossbar.examples.pi.camera.take_photo", takePhoto).then(
            function (registration) {
            console.log("Procedure 'io.crossbar.examples.pi.camera.take_photo' registered:", registration.id);
            },
            function (error) {
            console.log("Registration failed:", error);
            }
        );
    };


    // fired when connection was lost (or could not be established)
    //
    connection.onclose = function (reason, details) {
        console.log("Connection lost: " + reason, details);
    }

    // now actually open the connection
    //
    connection.open();

}

main();

                                                                                                                                                       85,0-1        Bot
