require("dotenv").config();
const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
//config connection
const port = process.env.PORT || 5000;
const mongoDbUrl = require("./config/database");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//Connect Mongodb
mongoose
  .connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(db => {
    console.log("MONGO connected");
  })
  .catch(error => console.log(error));

// Body parser
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json({ limit: "300kb" })); // body-parser defaults to a body size limit of 100kb
if (process.env.NODE_ENV === "production") {
  app.use(limiter);
}
//import routes
const customers = require("./routes/api/customers");

//Use routes
app.use("/api/customers", customers);

app.listen(port);
console.log("Server listening on " + port); // eslint-disable-line no-console
