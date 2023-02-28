const geoBtn = document.getElementById('geo')
const networkBtn = document.getElementById('network')
const UABtn = document.getElementById('UAgent')

geoBtn.onclick = showGeo;
networkBtn.onclick = showNetwork;
UABtn.onclick = showUA;


// <!-- wait for specified number of milliseconds, used in allTests and testMic, use with async functions-->
function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s * 1000));
}

// <!-- Returns a json object from the given URL parameter -->
async function json(url) {
  let response = await fetch(url);
  return await response.json();
}

// // <!-- function to ask for all required permissions at once -->
// function getPermission() {
//   navigator.mediaDevices.getUserMedia({ audio: true, video: true })
//     .then(function (stream) {
//       console.log('Permissions granted')
//     })
//     .catch(function (err) {
//       console.log(`${err} Permissions denied`)
//     });
// }

// // <!-- runs all tests -->
// async function allTests() {
//   startMic();
//   startWebcam();
//   document.getElementById("leftBtn").click();
//   await sleep(1.5); // sleep function to prevent both audio streams playing at once.
//   document.getElementById("rightBtn").click();
// }

// // <!-- Webcam test -->
function startWebcam() {
  var videoPlayer = document.getElementById('videoPlayer');

  var webcamStream = function (stream) {
    videoPlayer.srcObject = stream;
    document.getElementById("webcam-status").innerHTML = "Testing Webcam...";
  };

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(webcamStream)
    .catch(function (err) {
      console.log(`${err} Something went wrong, Please allow webcam permissions!`);
    });
}

// // <!-- Microphone test -->
function startMic() {

  const audioChunks = [];
  const recordLength = document.getElementById("recordLength").value;
  var visualizing = false;

  if (!visualizing) {
    visualizing = true;
    audioVisualizer();
  }

  var micStream = async function (stream) {

    console.log("Started recording...");
    document.getElementById("mic-status").innerHTML = "Testing Microphone...";
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    });

    await sleep(recordLength);
    mediaRecorder.stop();

  };

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(micStream)
    .catch(function (err) {
      console.log(`${err} Something went wrong, Please allow microphone permissions!`);
    });

}
//  <!-- Geolocation tests -->
async function getGeo() {

  let apiKey = 'ad7e871c6452c8eb60b75432b9f64b23009fe50a92f11d6407198196';
  let res = await json(`https://api.ipdata.co?api-key=${apiKey}`)
  console.log(res);
  return res;
};

async function showGeo() {
  let geoData = await getGeo();
  let geoString = `Public IP: ${geoData.ip} <br>`;
  geoString += `Location: ${geoData.city} ${geoData.region_code} ${geoData.emoji_flag} <br>`;
  geoString += `${geoData.time_zone.abbr} ${geoData.time_zone.current_time}`;

  document.getElementById("geoInfo").innerHTML = geoString;

  var geoPopup = document.getElementById("geoView");
  geoPopup.style.display = "block";


  var closeBtn = document.getElementById("closeGeoBtn");

  // When the user clicks on <span> (x), close the modal
  closeBtn.onclick = function () {
    geoPopup.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == geoPopup) {
      geoPopup.style.display = "none";
    }
  }
}

// <!-- Network tests -->
async function getNetwork() {

  // step 1. get image url
  const chartImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Pizigani_1367_Chart_10MB.jpg' + "?n=" + Math.random();

  // step 2. use fetch to download image
  async function fetchImage(url) {
    const request = await fetch(url);
    const data = await request.blob();
    return data;
  }

  // step 3. create speed test
  async function speedTest(imageUrl) {
    console.log('starting download...');
    const startTime = performance.now();
    const data = await fetchImage(imageUrl);
    const endTime = performance.now();
    console.log('download finished.')
    console.log(`download size: ${data.size / 1000} kilobytes`);
    var sizeBytes = data.size
    console.log(`download size: ${data.size} bytes`);
    var sizeBits = sizeBytes * 8;
    console.log(`size in bits: ${sizeBits} `);
    const totalTime = ((endTime - startTime) / 1000);
    var speedBps = Math.round(sizeBits / totalTime)
    console.log(`speedBps: ${speedBps}`)
    var speedKbps = (speedBps / 1024).toFixed(2);
    var speedMbps = (speedKbps / 1024).toFixed(2);
    const speed = { Bps: speedBps, Kbps: speedKbps, Mbps: speedMbps };
    console.log(speed);
    console.log(`download time: ${totalTime} seconds`);
    return speed;
  }

  // step 4. run it
  const speedObj = await speedTest(chartImageUrl);
  console.log(speedObj);
  return speedObj;
}

async function showNetwork() {

  const networkPopup = document.getElementById("networkView");
  networkPopup.style.display = "block";

  document.getElementById("networkInfo").innerHTML = "Running test...";
  const networkString = await getNetwork();
  console.log(`NetworkString: ${networkString.Mbps}`);
  document.getElementById("networkInfo").innerHTML = `Your network speed is roughly ${networkString.Mbps} megabits per second.`;


  const closeBtn = document.getElementById("closeNetworkBtn");


  // When the user clicks on <span> (x), close the modal
  closeBtn.onclick = function () {
    networkPopup.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == networkPopup) {
      networkPopup.style.display = "none";
    }
  }
}

// <!-- User Agent tests -->
async function getUA() {
  var parser = new UAParser();

  const uaObj = await parser.getResult();

  console.log("object");

  console.log(uaObj);

  return uaObj;

}

async function showUA() {
  const osList = document.getElementById('os')
  const cpuList = document.getElementById('cpu')
  const browserList = document.getElementById('browser')

  const UA = await getUA();
  let uaString = "";


  osList.innerHTML = "0S: " + UA.os.name + " " + UA.os.version + " <br>";
  cpuList.innerHTML= "CPU: " + UA.cpu.architecture+ " <br>";
  browserList.innerHTML = "Browser: " + UA.browser.name;

  const UAPopup = document.getElementById("UAView");
  UAPopup.style.display = "block";

  const closeBtn = document.getElementById("closeUABtn");

  // When the user clicks on <span> (x), close the modal
  closeBtn.onclick = function () {
    UAPopup.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == UAPopup) {
      UAPopup.style.display = "none";
    }
  }
}

// toggle sidebar

$(function() {
  // Sidebar toggle behavior
  $('#vertSidebarCollapse').on('click', function() {
    $('#vertical-sidebar, #content').toggleClass('active');

    if ($("#vertical-sidebar").hasClass("active")) {
      $("#sidebarBtnText").html("More Tests");
      $('#main-content').removeClass('dim');
    }
    
    else{
      $("#sidebarBtnText").html("Less Tests");
      $('#main-content').addClass('dim');
    }
  });
});

$(function() {
  // Sidebar toggle behavior
  $('#peripheral').on('click', function() {
    $('#vertical-sidebar, #content').toggleClass('active');

    if ($("#vertical-sidebar").hasClass("active")) {
      $("#sidebarBtnText").html("More Tests");
      $('#main-content').removeClass('dim');
    }
    
    else{
      $("#sidebarBtnText").html("Less Tests");
      $('#main-content').addClass('dim');
    }
  });
});


///////////////////////////////////////////////////////////////////// These functions still need cleaned up

function audioVisualizer() {
  const numberOfBars = 35;
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
      const ctx = new AudioContext();
      const audioSource = ctx.createMediaStreamSource(stream);
      const analyzer = ctx.createAnalyser();

      audioSource.connect(analyzer);

      const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteFrequencyData(frequencyData);

      const visualizerContainer = document.getElementById("visualizer-container");

      for (let i = 0; i < numberOfBars; i++) {
        const bar = document.createElement("span");
        bar.setAttribute("id", "bar" + i);
        bar.setAttribute("class", "visualizer-container-bar");
        visualizerContainer.appendChild(bar);
      }

      function renderFrame() {
        analyzer.getByteFrequencyData(frequencyData);

        for (let i = 0; i < numberOfBars; i++) {
          const index = (i + 10) * 2;
          const fd = frequencyData[index];

          const bar = document.querySelector("#bar" + i);
          if (!bar) {
            continue;
          }

          const barHeight = Math.max(4, fd || 0);
          bar.style.height = barHeight + "px";
        }

        window.requestAnimationFrame(renderFrame);
      }
      renderFrame();
    })
}

// <!-- Keyboard test -->

function highlightOnlyOnFocus() {
  var keyPressed = "";
  var keyReleased = "";
  document.addEventListener("keydown", (event) => {
    if (event.code != "") {
      keyPressed = event.code;
    } else {
      keyPressed = event.key;
    }

    var key_array = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Tab", "AltLeft", "AltRight", "PrintScreen", "ScrollLock", "Pause", "Insert", "Home", "PageUp", "Delete", "End", "PageDown", "ContextMenu", "MetaLeft", "MetaRight"];

    if (key_array.includes(keyPressed)) {
      event.preventDefault();
    };

    document.getElementById(keyPressed).style.backgroundColor = "#cccccc";
  });

  document.addEventListener("keyup", (event) => {
    if (event.code != "") {
      keyReleased = event.code;
    } else {
      keyReleased = event.key;
    }
    document.getElementById(keyReleased).style.backgroundColor = "#228B22";
  });
}

function focusOnKeyboardTest() {
  document.getElementById("keyboard-test").focus({focusVisible: true});
}