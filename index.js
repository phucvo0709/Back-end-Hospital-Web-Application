require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
//config connection
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 5000;
const mongoDbUrl = require("./config/database");

// Body parser
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//import routes
const hello = require("./routes/api/hello");

//Use routes
app.use("/api/hello", hello);

//Listen the server
app.listen(port, host);
console.log("Server listening on http://" + host + ":" + port); // eslint-disable-line no-console
