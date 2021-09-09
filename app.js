// require('dotenv').config();
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const { default: axios } = require('axios');
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");

const app = express();
const { PORT, MONGO_URI } = process.env;

app.use(cors());
app.use(express.static("public"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: false }));

mongoose.Promise = global.Promise;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to db sucessfully"))
  .catch((e) => console.log("error", e));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  next();
});
app.use("/borrows", require("./routes/borrows"));
app.use("/books", require("./routes/books"));
app.use("/util", require("./routes/util"));
app.use("/posters", require("./routes/posters"));

app.listen(PORT, () => {
  console.log("server listening on", MONGO_URI);
});

// 자정 12시 1분에 썸네일 업데이트
cron.schedule('18 2 * * *', () => {
  console.log('update book thumbnail image');
  axios.post(`http://localhost:${PORT}/posters/update`).then(()=>{
    console.log('updated success');
  })
})