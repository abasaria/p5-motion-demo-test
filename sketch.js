let permissionGranted = false;
let bgColor = 220; // default background

// Shake thresholds (you can tweak these)
const lightShake = 10;  // mild shake
const mediumShake = 15; // medium shake
const strongShake = 20; // strong shake

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
  if (!permissionGranted) {
    background(220);
    text("Tap the button above to enable motion access", width / 2, height / 2);
    return;
  }

  // Compute total acceleration
  const totalAccel = Math.sqrt(accelerationX**2 + accelerationY**2 + accelerationZ**2);

  // Change background color based on thresholds
  if (totalAccel > strongShake) {
    bgColor = color(255, 0, 0); // strong shake → red
  } else if (totalAccel > mediumShake) {
    bgColor = color(255, 165, 0); // medium shake → orange
  } else if (totalAccel > lightShake) {
    bgColor = color(255, 255, 0); // light shake → yellow
  } else {
    bgColor = color(220); // no shake → default grey
  }

  background(bgColor);

  // Display accelerometer values on canvas
  text("Move your phone!", width / 2, height / 2 - 60);
  text(`x: ${accelerationX.toFixed(2)}`, width / 2, height / 2 - 20);
  text(`y: ${accelerationY.toFixed(2)}`, width / 2, height / 2 + 20);
  text(`z: ${accelerationZ.toFixed(2)}`, width / 2, height / 2 + 60);

  // Display values in log div
  const logDiv = document.getElementById('log');
  if (logDiv) {
    logDiv.innerText = `
x: ${accelerationX.toFixed(2)}
y: ${accelerationY.toFixed(2)}
z: ${accelerationZ.toFixed(2)}
total: ${totalAccel.toFixed(2)}
    `;
  }

  // Also log to console for Web Inspector
  console.log(`x: ${accelerationX.toFixed(2)}, y: ${accelerationY.toFixed(2)}, z: ${accelerationZ.toFixed(2)}, total: ${totalAccel.toFixed(2)}`);
}
