let permissionGranted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(24);
  fill(50);

  // Enable motion when button is tapped
  const enableButton = document.getElementById('enableMotion');
  enableButton.addEventListener('click', () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            permissionGranted = true;
            enableButton.style.display = 'none'; // hide button
            console.log('Motion permission granted');
          } else {
            alert('Motion permission denied');
          }
        })
        .catch(console.error);
    } else {
      // For non-iOS devices
      permissionGranted = true;
      enableButton.style.display = 'none';
    }
  });
}

function draw() {
  background(220);

  if (!permissionGranted) {
    text("Tap the button above to enable motion access", width / 2, height / 2);
  } else {
    text("Move your phone!", width / 2, height / 2 - 40);
    text(`x: ${accelerationX.toFixed(2)}`, width / 2, height / 2);
    text(`y: ${accelerationY.toFixed(2)}`, width / 2, height / 2 + 40);
    text(`z: ${accelerationZ.toFixed(2)}`, width / 2, height / 2 + 80);
  }
}

// Send live data to your Node.js server
function deviceMoved() {
  if (permissionGranted) {
    fetch('/imu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        x: accelerationX,
        y: accelerationY,
        z: accelerationZ,
        t: millis()
      })
    }).catch(err => console.error("Fetch error:", err));
  }
}
