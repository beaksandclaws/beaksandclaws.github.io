// const resultContainer = document.getElementById('results');

// const iceServers = [
//   {url: "stun:localhost:10000?transport=udp"}
// ];

// const connection = new RTCPeerConnection({ iceServers, iceCandidatePoolSize: 0 });

// connection.onicecandidate = function(e) {
//   if (e && e.candidate && e.candidate.candidate) {
//     console.log(e.candidate.candidate.split(' ')[4])
//   } else {
//     console.log('done')
//   }
// }

// connection.onicecandidateerror = function(e) {
//   if (e.url == null) {
//     return;
//   }

//   url_split = e.url.split(":");
//   host_div = document.createElement('div');
//   host_div.id = url_split[1];
//   host_div.innerHTML = url_split[1];
//   resultContainer.appendChild(host_div);
// }

// connection.createDataChannel('', {
//   reliable: false
// });

// connection.createOffer().then(
//   function (localSessionDescription) {
//     connection.setLocalDescription(localSessionDescription);
//   }
// );

var ports = [21, 22, 23, 25, 53, 80, 443, 445, 5900, 8080, 10000];
var target = "192.168.0.1";

address_div = document.createElement('div');
address_div.id = target;
address_div.innerHTML = target;
document.getElementById("hosts").appendChild(address_div);

var scan_array = [];
for (i = 0; i < ports.length; i++) {
  probe_address = "stun:" + target + ":" + ports[i] + "?transport=udp";
  scan_array.push({
    urls: probe_address,
    // credential: "lobster",
    // username: "albino"
  });

  port_div = document.createElement('div');
  port_div.id = ports[i]
  port_div.innerHTML = "&nbsp;&nbsp;&nbsp;-> Port " + ports[i] + " - ?"
  document.getElementById(target).appendChild(port_div);
}

var port_scan = new RTCPeerConnection({
  iceServers: scan_array,
  iceCandidatePoolSize: 0
});
port_scan.createDataChannel('', {
  reliable: false
});

port_scan.onicecandidateerror = function(e) {
  if (e.url == null) {
    return;
  }

  url_split = e.url.split(":");
  port_split = url_split[2].split("?");

  if (e.hostCandidate != "0.0.0.x:0") {
    document.getElementById(port_split[0]).innerHTML = "&nbsp;&nbsp;&nbsp;-> Port " + port_split[0] + " - <b><i>Open</i><b>"
  } else {
    document.getElementById(port_split[0]).innerHTML = "&nbsp;&nbsp;&nbsp;-> Port " + port_split[0] + " - Closed"
  }
}

setTimeout(function() {
  if (port_scan.iceGatheringState === "gathering") {
    port_scan.close();
  }
}, 60000);

port_scan.onicegatheringstatechange = function(e) {
  if (port_scan.iceGatheringState == "complete") {
    port_scan.close();
  }
}

port_scan.createOffer(function(offerDesc) {
    port_scan.setLocalDescription(offerDesc);
  },
  function(e) {
    console.log("Create offer failed callback.");
  });