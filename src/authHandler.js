const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const { authRoute } = require("./routes/auth");
const app = express();
app.use(express.json({ strict: false }));
app.use(cors());

app.use("/", authRoute);

module.exports.authHandler = serverless(app);
