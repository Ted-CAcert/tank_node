const child_process = require('child_process');
let cameraProc;

setInterval(dosnap, 60000);

exports.snap = dosnap;

function dosnap() {
    cameraProc = child_process.spawn("raspistill", [ "-o", "/var/www/html/rasptank/data/image.jpg", "-w", "1280", "-h", "980", "-n", "-rot", "180", "-br", "55", "-t", "500" ]);
    console.log("Create process "+cameraProc.pid);
}
