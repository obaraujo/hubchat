//simple express server to run frontend production build;
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(process.cwd(), "dist")));
app.get(/.*/, function (req, res) {
	res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port " + (process.env.PORT || 3000));
});