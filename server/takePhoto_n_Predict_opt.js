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
            session.call("io.crossbar.examples.pi.camera.predict").then(
               function (res) {
                  console.log(res);
                 switch(res.trim()) {
                    case '0':
                        result['predict'] = '這是薊馬'; // black
                        break;
                    case '1':
                        result['predict'] = '沒有偵測到蟲類'; //leaf
                        break;
                    case '2':
                        result['predict'] = '這是蛾類幼蟲'; // moth
                        break;
                    case '3':
                        result['predict'] = '這是粉蝨'; // pink
                        break;
                    case '4':
                        result['predict'] = '這是葉蟎紅蜘蛛'; // red
                        break;
                    default:
                        result['predict'] = res;
                        break;
                }

                  console.log(result.predict);
                  session.publish("io.crossbar.examples.pi.camera.take_photo_n_predict", [], result);
              },
              function (err) {
                 console.log(err);
              }
            );

        }

        session.subscribe('io.crossbar.examples.pi.camera.take_photo', getPhoto);

    };

    // fired when connection was lost (or could not be established)
    //
    connection.onclose = function (reason, details) {

        console.log("Connection lost: " + reason);
    }

    connection.open()
}

main();
