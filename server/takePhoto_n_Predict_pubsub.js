var autobahn = require('autobahn');
var fs = require('fs');
var child_process = require('child_process');


var base64_decode = function(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

var when = autobahn.when;
var session = null;

function main(){
    console.log('Server get Photo starting')
    var curdir = require('path').dirname(require.main.filename);

    var connection = new autobahn.Connection({
//        url: 'ws://140.116.226.234:8080/ws', // replace with URL of WAMP router if this doesn't serve the file
        url: 'ws://localhost:8080/ws', // replace with URL of WAMP router if this doesn't serve the file
        realm: "realm1"
    });

//    var predictPhoto = function (args, kwargs, details) {
//
//        console.log("takePicture&predict called");
//
//        if (details.progress) {
//            details.progress(["takePhoto&predict called"]);
//        }
//
//        var predictResult = when.defer();
//        var result = {};
//
//        session.call("io.crossbar.examples.pi.camera.take_photo").then(
//            function (res) {
//                result['base64image'] = res;
//                // need to remove the header and footer which uuencode adds
//                res = res.slice(29);
//                res = res.slice(0, -6);
//
//                base64_decode(res, curdir + '/copy.jpg');
//                console.log('Get Photo successfully!')
//                var cmd = 'python2.7 '+curdir+'/predict.py';
//                child_process.exec(cmd, function(error, stdout, stderr) {
//                    // command output is in stdout
//                    console.log(stdout.trim());
//                    switch(stdout.trim()) {
//                        case '0':
//                            result['predict'] = '薊馬'; // black
//                            break;
//                        case '1':
//                            result['predict'] = '蛾類幼蟲'; // moth
//                            break;
//                        case '2':
//                            result['predict'] = '粉蝨'; // pink
//                            break;
//                        case '3':
//                            result['predict'] = '葉蟎紅蜘蛛'; // red
//                            break;
//                        default:
//                            result['predict'] = stdout;
//                            break;
//                    }
//
//                    console.log('Predict successfully!');
//                    predictResult.resolve(result);
//                });
//
//            },
//            function (err) {
//                console.log("requestImage failed", err);
//                imageProgress.innerHTML = "Error getting image!";
//            }
//        );
//
//        return predictResult.promise;
//    };

    // fired when connection is established and session attached
    //
    connection.onopen = function (sess, details) {

        session = sess;

        console.log("connected");

        function getPhoto (args, kwargs) {
            var result = {};
            result['base64image'] = kwargs.photo;
            result['time'] = kwargs.time;
            console.log(result.time);
            // need to remove the header and footer which uuencode adds
            result['base64image'] = result['base64image'].slice(29);
            result['base64image'] = result['base64image'].slice(0, -6);

            base64_decode(result['base64image'], curdir + '/copy.jpg');
            console.log('Get Photo successfully!');
            var cmd = 'python2.7 '+curdir+'/predict.py';
            child_process.exec(cmd, function(error, stdout, stderr) {
                // command output is in stdout
                console.log(stdout.trim());
                switch(stdout.trim()) {
                    case '0':
                        result['predict'] = '薊馬'; // black
                        break;
                    case '1':
                        result['predict'] = '蛾類幼蟲'; // moth
                        break;
                    case '2':
                        result['predict'] = '粉蝨'; // pink
                        break;
                    case '3':
                        result['predict'] = '葉蟎紅蜘蛛'; // red
                        break;
                    default:
                        result['predict'] = stdout;
                        break;
                }

                console.log('這是' + result.predict);
                
                session.publish("io.crossbar.examples.pi.camera.take_photo_n_predict", [], result);
            });
        }

        session.subscribe('io.crossbar.examples.pi.camera.take_photo', getPhoto);
//        session.register("io.crossbar.examples.pi.camera.take_photo_n_predict", predictPhoto).then(
//            function (registration) {
//                console.log("Procedure 'io.crossbar.examples.pi.camera.take_photo_n_predict' registered:", registration.id);
//            },
//            function (error) {
//                console.log("Registration failed:", error);
//            }
//        );

    };

    // fired when connection was lost (or could not be established)
    //
    connection.onclose = function (reason, details) {

        console.log("Connection lost: " + reason);

    }

    connection.open()
}

main();
