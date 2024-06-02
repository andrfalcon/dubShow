const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs = require('fs');
const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

app.post('/download-video', async (req, res) => {

    ytdl(req.body.url, {
        filter: 'audioandvideo'
      })
      .pipe(fs.createWriteStream('video.mp4'))
      .on('finish', () => {
        console.log('Video downloaded successfully!');
      })

    res.json({ message: "Download successful!!!" });
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});