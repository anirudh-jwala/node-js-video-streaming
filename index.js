const express = require("express");
const app = express();

const fs = require("fs");

const port = 8000;

/**
 * On Visting the home route of the website, we server index.html file
 */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

/**
 * When source tag hits /video route, we provide it with video
 */
app.get("/video", (req, res) => {
  // range value is requested by source tag mentioning the starting point from which the user is requesting
  const range = req.headers.range;

  if (!range) {
    res.status(400).send("User didn't mention the start point of the video");
  }

  const videoPath = "./videos/SampleVideo_1280x720.mp4";
  const videoSize = fs.statSync(videoPath).size;

  // 1 MB of buffer chunck is sent as partial content on request
  const VIDEO_CHUNK_SIZE = 10 ** 6;

  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + VIDEO_CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });

  videoStream.pipe(res);
});

app.listen(port, () => {
  console.log(`Website is live at http://127.0.0.1:${port}`);
});
