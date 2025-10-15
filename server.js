import express from "express";
const app = express();

app.use(express.static("public"));
app.use(express.json());

app.post("/imu", (req, res) => {
  console.log("IMU data:", req.body);
  res.sendStatus(200);
});

app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
