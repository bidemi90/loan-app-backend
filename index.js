const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
require("dotenv").config();

app.set("view engine", "ejs");

// Configure body-parser with the increased limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Set up CORS
app.use(cors({ origin: "*" }));

const uri = process.env.MONGOODB_URI;

const loanapproutes = require("./routes/loanapproutes"); // Adjust the path as necessary

app.use("/loanapp", loanapproutes);

const connect = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri).then((result) => {
      console.log("mongoose connect react + node");
    });
  } catch (error) {
    console.log(error);
  }
};
connect();

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
