var xhttp;
var obSnapshotImg;
var obEditAddr;
var etagImg;
var intervalWork;

function main() {
    if (!obSnapshotImg) obSnapshotImg = document.getElementById("camerasnap");
    if (!obEditAddr) obEditAddr = document.getElementById("address");
    if (xhttp) return;

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                const bytes = new Uint8Array(this.response);
                var len = bytes.byteLength;
                var binary = '';
                for (var i = 0; i < len; i++) {
                    binary += String.fromCharCode( bytes[ i ] );
                }
                var tmpString = "data:image/jpg;base64,"+btoa(binary);
                obSnapshotImg.src=tmpString;

                etagImg = xhttp.getResponseHeader("Etag");
            } else if (this.status == 304) {
//                console.log("Not modified");
            } else {
                console.log("Unexpected result: "+this.status+" "+this.statusText);
            }
            xhttp = undefined;
        }
    };
    xhttp.onprogress = function(event) {
        if (event.total > 0) {
            console.log("Progress "+event.loaded+"/"+event.total);
        }
    }
    xhttp.open("GET", "../data/image.jpg", true);
    xhttp.responseType="arraybuffer";
    if (etagImg) {
        xhttp.setRequestHeader("If-None-Match", etagImg);
    }
    xhttp.send();
}

// convert a Unicode string to a string in which
// each 16-bit unit occupies only one byte
function toBinary(string) {
  const codeUnits = Uint16Array.from(
    { length: string.length },
    (element, index) => string.charCodeAt(index)
  );
  const charCodes = new Uint8Array(codeUnits.buffer);

  let result = "";
  charCodes.forEach((char) => {
    result += String.fromCharCode(char);
  });
  return result;
}


intervalWork=setInterval(main, 1000);
