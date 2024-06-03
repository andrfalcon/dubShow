const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const { configDotenv } = require('dotenv');
const app = express();
const port = 5001;
require('dotenv');
configDotenv();

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET_KEY,
});
  
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
    
    // Transcription


    res.json({ message: "Download successful!!!" });
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});