const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const { businessesRoute } = require("./routes/bizzyKa");
const app = express();
const { authorizeUser } = require("./middleware");
const { authRoute } = require("./routes/auth");
app.use(express.json({ strict: false }));
app.use(cors());

app.get("/", authorizeUser, function (req, res) {
  res.send("Hello World!!!!!!!");
});

app.use("/auth", authRoute);
app.use("/businesses", authorizeUser, businessesRoute);

module.exports.handler = serverless(app);
