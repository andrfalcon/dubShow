const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { OpenAI } = require('openai');
const { configDotenv } = require('dotenv');
const app = express();
const port = 5001;
require('dotenv');
configDotenv();

app.use(express.json());
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_SECRET_KEY })
  
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

app.get('/test-openai', async (req, res) => {
    console.log(process.env.OPEN_AI_SECRET_KEY);
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: 'Tell me about the capital of Venezuela.' }],
        model: 'gpt-3.5-turbo',
      });

    console.log(chatCompletion.choices[0].message);
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});