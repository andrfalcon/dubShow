const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

app.post('/download-video', async (req, res) => {

    ytdl(req.body.url, {
        filter: 'audioandvideo'
        })
      .pipe(fs.createWriteStream('youtube.mp4'))
      .on('finish', () => {

        // Extract audio
        ffmpeg('./youtube.mp4')
            .noVideo()
            .save('./audio.mp3')
        
        // Extract video
        ffmpeg('./youtube.mp4')
            .noAudio()
            .save('./video.mp4')
        
        console.log('Extraction successful!');

      })

    res.json({ message: "Download successful!!!" });
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});