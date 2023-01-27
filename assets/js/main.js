
// const geoBtn = document.getElementById('geo')
// const networkBtn = document.getElementById('network')
// const UABtn = document.getElementById('UAgent')

// geoBtn.onclick = showGeo;
// networkBtn.onclick = showNetwork;
// UABtn.onclick = showUA;

// async function json(url) {
//   let response = await fetch(url);
//   return await response.json();
// }

function cleanUp(dirtyString) {
  let cleanString = dirtyString.replace(/[{}"]/g, '')
  return cleanString;
}

// async function getGeo() {

//   // let apiKey = ad7e871c6452c8eb60b75432b9f64b23009fe50a92f11d6407198196;
//   let res = await json(`https://api.ipdata.co?api-key=ad7e871c6452c8eb60b75432b9f64b23009fe50a92f11d6407198196`)
//   let data = await res;
//   console.log(data);
//   return data;
// };


// async function getUA() {
//   var parser = new UAParser();
//   var uaString = "";
// // const os = await parser.getOS();
// //   console.log(os);
//   uaString += "0S " + cleanUp(JSON.stringify(parser.getOS())) + " <br>";
//   uaString += "Browser " + cleanUp(JSON.stringify(parser.getBrowser())) + " <br>";
//   uaString += "CPU " + cleanUp(JSON.stringify(parser.getCPU()));

//   return uaString;

// }
// function getNetwork() {
//   // step 1. get image url
//   const chartImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Pizigani_1367_Chart_10MB.jpg';
  
//   var startTime, endTime;
//     var downloadSize = 10174706;
//     var testImg = new Image();
  
//     function testSpeed() {
//       var duration = (endTime - startTime) / 1000;
//       var bitsLoaded = downloadSize * 8;
//       var speedBps = Math.round(bitsLoaded / duration).toFixed(0); // added .toFixed(0) so variable 'speedBps' becomes string and not number type
//       var speedKbps = (speedBps / 1024).toFixed(2);
//       var speedMbps = (speedKbps / 1024).toFixed(2);
//       const speed = { Bps: speedBps, Kbps: speedKbps, Mbps: speedMbps };
//       return new Promise(resolve => resolve(speed)) // how to write this return? 
//     }
  
//     testImg.onload = async function () {
//       endTime = (new Date()).getTime();
//       let res = await testSpeed();
//       console.log(res);
//       // what to return here?
//       }
    
//     startTime = (new Date()).getTime();
//     testImg.src = imageAddr;
//   // how to return result of testSpeed via testImg.onload?
  

// }
// //Permissions for tests
// function getPermission() {
//   navigator.mediaDevices.getUserMedia({ audio: true, video: true })
//     .then(function (stream) {
//       console.log('Permissions granted')
//     })
//     .catch(function (err) {
//       console.log(err + 'Permissions denied')
//     });
// }

// function allTests() {
//   startMic();
//   startWebcam();
// }

// Cam Test

// function startWebcam() {
//   var videoPlayer = document.getElementById('videoPlayer');

//   var webcamStream = function (stream) {
//     videoPlayer.srcObject = stream;
//     document.getElementById("webcam-status").innerHTML = "Testing Webcam...";
//   };

//   navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(webcamStream);

// }

// Mic test

// function startMic() {
//   var visualizing = false;

//   console.log("Started recording...");
//   if (!visualizing) {
//     visualizing = true;
//     audioVisualizer();
//   }

//   var recordLength = document.getElementById("recordLength").value * 1000;

//   const recordAudio = () =>
//     new Promise(async resolve => {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       const audioChunks = [];

//       mediaRecorder.addEventListener("dataavailable", event => {
//         audioChunks.push(event.data);
//       });

//       const start = () => mediaRecorder.start();

//       const stop = () =>
//         new Promise(resolve => {
//           mediaRecorder.addEventListener("stop", () => {
//             const audioBlob = new Blob(audioChunks);
//             const audioUrl = URL.createObjectURL(audioBlob);
//             const audio = new Audio(audioUrl);
//             const play = () => audio.play();
//             resolve({ audioBlob, audioUrl, play });
//           });

//           mediaRecorder.stop();
//         });

//       resolve({ start, stop });
//     });

//   const sleep = time => new Promise(resolve => setTimeout(resolve, time));

//   (async () => {
//     const recorder = await recordAudio();
//     recorder.start();
//     await sleep(recordLength);
//     const audio = await recorder.stop();
//     audio.play();
//   })();

// }

function audioVisualizer() {
  const numberOfBars = 50;
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
  document.addEventListener("keydown", () => {
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

  document.addEventListener("keyup", () => {
    if (event.code != "") {
      keyReleased = event.code;
    } else {
      keyReleased = event.key;
    }
    document.getElementById(keyReleased).style.backgroundColor = "#228B22";
  });
}

function focusOnKeyboardTest() {
  document.getElementById("keyboard-test").focus();
}

// async function showGeo() {
//   let geoData = await getGeo();
//   let geoString = ""
//   geoString += "Public IP: " + geoData.ip + " <br>";
//   geoString += "Location: " + geoData.city + " " + geoData.region_code + " " + geoData.emoji_flag + " <br>";
//   geoString += geoData.time_zone.abbr + " " + geoData.time_zone.current_time;

//   document.getElementById("geoInfo").innerHTML = geoString;

//   var geoPopup = document.getElementById("geoView");
//   geoPopup.style.display = "block";


//   var closeBtn = document.getElementsByClassName("closeBtn");

//   // When the user clicks on <span> (x), close the modal
//   closeBtn.onclick = function () {
//     geoPopup.style.display = "none";
//   }

//   // When the user clicks anywhere outside of the modal, close it
//   window.onclick = function (event) {
//     if (event.target == geoPopup) {
//       geoPopup.style.display = "none";
//     }
//   }
// }

// function showNetwork() {
//  console.log("test");
//   let networkString = getNetwork();
//   document.getElementById("networkInfo").innerHTML = networkString;

//   var networkPopup = document.getElementById("networkView");
//   networkPopup.style.display = "block";

//   var closeBtn = document.getElementsByClassName("closeBtn");

//   // When the user clicks on <span> (x), close the modal
//   closeBtn.onclick = function () {
//     networkPopup.style.display = "none";
//   }

//   // When the user clicks anywhere outside of the modal, close it
//   window.onclick = function (event) {
//     if (event.target == networkPopup) {
//       networkPopup.style.display = "none";
//     }
//   }

// }

// function showUA() {
//   let UAString = getUA();
//   document.getElementById("UAInfo").innerHTML = UAString;

//   var UAPopup = document.getElementById("UAView");
//   UAPopup.style.display = "block";

//   var closeBtn = document.getElementsByClassName("closeBtn");

//   // When the user clicks on <span> (x), close the modal
//   closeBtn.onclick = function () {
//     UAPopup.style.display = "none";
//   }

//   // When the user clicks anywhere outside of the modal, close it
//   window.onclick = function (event) {
//     if (event.target == UAPopup) {
//       UAPopup.style.display = "none";
//     }
//   }
// }
