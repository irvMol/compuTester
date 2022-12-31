function json(url) {
    return fetch(url).then(res => res.json());
  }
  

function cleanUp(dirtyString)
{
    let cleanString = dirtyString.replace(/[{}"]/g,'')
return cleanString;
}
 
function geoData(){
     
    // let apiKey = ad7e871c6452c8eb60b75432b9f64b23009fe50a92f11d6407198196;
  const geoData = json(`https://api.ipdata.co?api-key=ad7e871c6452c8eb60b75432b9f64b23009fe50a92f11d6407198196`).then(data => {    
    
return(data);
    // so many more properties
  });

  const printGeo = async () => {
    const a = await geoData;
    console.log(a);
  };

  printGeo();
  
}

function getInfo()
{   
    var parser = new UAParser();
    var uaString = "";
   
    geoData();
    uaString += "0S " + cleanUp(JSON.stringify(parser.getOS())) + " <br>";
    uaString += "Browser " + cleanUp(JSON.stringify(parser.getBrowser())) + " <br>";
    uaString += "CPU " + cleanUp(JSON.stringify(parser.getCPU()));
    
    document.getElementById("sysInfo").innerHTML = uaString


}

//Permissions for tests
function getPermission() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(function(stream) {
        console.log('Permissions granted')
      })
      .catch(function(err) {
        console.log('Permissions denied')
      });
  }

  function allTests() {
    startMic();
    startWebcam();
  }



// Cam Test

function startWebcam() {
    var videoPlayer = document.getElementById('videoPlayer');

    var handleSuccess = function(stream) {
    videoPlayer.srcObject = stream;
    document.getElementById("webcam-status").innerHTML = "Testing Webcam...";
    };

    navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(handleSuccess);
}

// Mic test
 
    var visualizing = false;

    function startMic() {
      console.log("Started recording...");
      if (!visualizing) {
          visualizing = true;
          audioVisualizer();
      }

      var recordLength = document.getElementById("recordLength").value * 1000;

      const recordAudio = () =>
          new Promise(async resolve => {
              const stream = await navigator.mediaDevices.getUserMedia({
                  audio: true });
              const mediaRecorder = new MediaRecorder(stream);
              const audioChunks = [];

              mediaRecorder.addEventListener("dataavailable", event => {
                  audioChunks.push(event.data);
              });

              const start = () => mediaRecorder.start();

              const stop = () =>
              new Promise(resolve => {
                  mediaRecorder.addEventListener("stop", () => {
                      const audioBlob = new Blob(audioChunks);
                      const audioUrl = URL.createObjectURL(audioBlob);
                      const audio = new Audio(audioUrl);
                      const play = () => audio.play();
                      resolve({
                          audioBlob,
                          audioUrl,
                          play
                      });
                  });
                  mediaRecorder.stop();
              });
              resolve({
                  start,
                  stop
              });
          });

          const sleep = time =>
              new Promise(resolve =>
                  setTimeout(resolve, time)
              );

          (async () => {
            document.getElementById("mic-status").innerHTML = "Testing Microphone...";
            const recorder = await recordAudio();
            recorder.start();
            await sleep(recordLength);
            const audio = await recorder.stop();
            audio.play();
          })();
    }

    function audioVisualizer(){
      const numberOfBars = 50;
      navigator.mediaDevices.getUserMedia({audio:true})
      .then(function(stream){
          const ctx = new AudioContext();
          const audioSource = ctx.createMediaStreamSource(stream);
          const analyzer = ctx.createAnalyser();

          audioSource.connect(analyzer);

          const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
          analyzer.getByteFrequencyData(frequencyData);

          const visualizerContainer = document.getElementById("visualizer-container");

          for(let i = 0; i < numberOfBars; i++){
              const bar = document.createElement("span");
              bar.setAttribute("id", "bar" + i);
              bar.setAttribute("class", "visualizer-container-bar");
              visualizerContainer.appendChild(bar);
          }

          function renderFrame(){
              analyzer.getByteFrequencyData(frequencyData);

              for(let i = 0; i < numberOfBars; i++) {
                  const index = (i + 10) * 2;
                  const fd = frequencyData[index];

                  const bar = document.querySelector("#bar" + i);
                  if(!bar) {
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
          if(event.code != ""){
              keyPressed = event.code;
          } else {
              keyPressed = event.key;
          }

          var key_array = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Tab", "AltLeft", "AltRight", "PrintScreen", "ScrollLock", "Pause", "Insert", "Home", "PageUp", "Delete", "End", "PageDown", "ContextMenu", "MetaLeft", "MetaRight"];

          if(key_array.includes(keyPressed)) {
              event.preventDefault();
          };

          document.getElementById(keyPressed).style.backgroundColor = "#cccccc";
      });

      document.addEventListener("keyup", () => {
          if(event.code != ""){
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

