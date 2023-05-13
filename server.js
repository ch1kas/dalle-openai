const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());
const fs = require("fs");
const multer = require("multer");

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/images", async (req, res) => {
  try {
    const response = await openai.createImage({
      prompt: req.body.message,
      n: 5,
      size: "1024x1024",
    });
    res.send(response.data.data);
  } catch (error) {
    console.error(error);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("file");

let filePath;

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    filePath = req.file.path;
  });
});

app.post("/variations", async (req, res) => {
  try {
    const response = await openai.createImageVariation(
      fs.createReadStream(filePath),
      4,
      "1024x1024"
    );
    res.send(response.data.data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => console.log("Your server is runnning on port " + PORT));
