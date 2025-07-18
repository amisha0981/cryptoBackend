const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const coinRoutes = require("./Routes/coinRoute");
const startCronJob = require("./utilis/cronJob")

dotenv.config({ path: "./.env" });

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL}))
app.use(express.json());


app.use('/api', coinRoutes);


app.get("/", (req, res) => {
  res.send("hello world i am here to help you  !! Last Deployed on 11-06-2025");  
});

mongoose.connect(process.env.DB).then(() => {
  console.log("mongodb is connected!!");
}).catch((error) => {
  console.log(error);
});

const port = process.env.PORT || 5000;

app.listen(port,function () {
  console.log(`server is running on port ${port} `);
  startCronJob();
});

  