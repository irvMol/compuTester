function getPermission() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(function(stream) {
        console.log('Perms granted')
      })
      .catch(function(err) {
        console.log('Perms denied')
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
      if (visualizing == false) {
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

