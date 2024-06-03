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

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_SECRET_KEY });

const extract = (url) => {
    return new Promise((resolve, reject) => {
        try {
            ytdl(url, {
                filter: 'audioandvideo'
            })
            .pipe(fs.createWriteStream('youtube.mp4'))
            .on('finish', () => {
                ffmpeg('./youtube.mp4')
                    .noVideo()
                    .save('./audio.mp3')
                    .on('end', () => {
                        ffmpeg('./youtube.mp4')
                            .noAudio()
                            .save('./video.mp4')
                            .on('end', () => {
                                resolve('Extraction successful.');
                            })
                    })
            })
        } catch (err) {
            reject(err);
        }
    })
}
  
app.post('/download-video', async (req, res) => {
    
    await extract(req.body.url);

    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream('audio.mp3'),
        model: 'whisper-1',
    });

    console.log(transcription.text);
    
    res.json({ message: "Download successful!!!" });
})

// app.get('/test-openai', async (req, res) => {
//     console.log(process.env.OPEN_AI_SECRET_KEY);
//     const chatCompletion = await openai.chat.completions.create({
//         messages: [{ role: 'user', content: 'Tell me about the capital of Venezuela.' }],
//         model: 'gpt-3.5-turbo',
//       });

//     console.log(chatCompletion.choices[0].message);
// })

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});