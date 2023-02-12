var xhttp;
var obSnapshotImg;
var obEditAddr;
var intervalWork;

function main() {
    if (!obSnapshotImg) obSnapshotImg = document.getElementById("camerasnap");
    if (!obEditAddr) obEditAddr = document.getElementById("address");
    if (xhttp) return;

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           console.log("Done");
        }
    };
}

intervalWork=setInterval(main, 1000);
