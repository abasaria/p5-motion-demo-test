let permissionGranted = false;
let bgColor = 220; // default background

// Shake thresholds
const lightShake = 10;  
const mediumShake = 15; 
const strongShake = 20;

let accel = { x: 0, y: 0, z: 0 }; // store current accelerometer values

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
            enableButton.style.display = 'none';
            console.log('Motion permission granted');

            // Start listening to motion events
            window.addEventListener('devicemotion', (event) => {
              if (event.acceleration) {
                accel.x = event.acceleration.x || 0;
                accel.y = event.acceleration.y || 0;
                accel.z = event.acceleration.z || 0;
              }
            });
          } else {
            alert('Motion permission denied');
          }
        })
        .catch(console.error);
    } else {
      // For non-iOS devices
      permissionGranted = true;
      enableButton.style.display = 'none';
      // Listen to motion events
      window.addEventListener('devicemotion', (event) => {
        if (event.acceleration) {
          accel.x = event.acceleration.x || 0;
          accel.y = event.acceleration.y || 0;
          accel.z = event.acceleration.z || 0;
        }
      });
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
  const totalAccel = Math.sqrt(accel.x**2 + accel.y**2 + accel.z**2);

  // Change background color based on thresholds
  if (totalAccel > strongShake) {
    bgColor = [255, 0, 0]; // red
  } else if (totalAccel > mediumShake) {
    bgColor = [255, 165, 0]; // orange
  } else if (totalAccel > lightShake) {
    bgColor = [255, 255, 0]; // yellow
  } else {
    bgColor = [220]; // grey
  }

  background(bgColor);

  // Display accelerometer values on canvas
  text("Move your phone!", width / 2, height / 2 - 60);
  text(`x: ${accel.x.toFixed(2)}`, width / 2, height / 2 - 20);
  text(`y: ${accel.y.toFixed(2)}`, width / 2, height / 2 + 20);
  text(`z: ${accel.z.toFixed(2)}`, width / 2, height / 2 + 60);

  // Display values in log div
  const logDiv = document.getElementById('log');
  if (logDiv) {
    logDiv.innerText = `
x: ${accel.x.toFixed(2)}
y: ${accel.y.toFixed(2)}
z: ${accel.z.toFixed(2)}
total: ${totalAccel.toFixed(2)}
    `;
  }

  // Log to console
  console.log(`x: ${accel.x.toFixed(2)}, y: ${accel.y.toFixed(2)}, z: ${accel.z.toFixed(2)}, total: ${totalAccel.toFixed(2)}`);
}
