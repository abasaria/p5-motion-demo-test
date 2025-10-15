let permissionGranted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(24);
}

function draw() {
  background(220);
  if (!permissionGranted) {
    text("Tap to enable motion access", width/2, height/2);
  } else {
    text("Move your phone!", width/2, height/2);
    text(`x: ${accelerationX.toFixed(2)}`, width/2, height/2 + 40);
    text(`y: ${accelerationY.toFixed(2)}`, width/2, height/2 + 70);
    text(`z: ${accelerationZ.toFixed(2)}`, width/2, height/2 + 100);
  }
}

function touchStarted() {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission().then(response => {
      if (response === 'granted') {
        permissionGranted = true;
        console.log('Motion permission granted');
      } else {
        console.log('Motion permission denied');
      }
    }).catch(err => console.error(err));
  } else {
    // Older devices / non-iOS
    permissionGranted = true;
  }
}

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
    });
  }
}
