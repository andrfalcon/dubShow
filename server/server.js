const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { OpenAI } = require('openai');
const { configDotenv } = require('dotenv');
const deepl = require('deepl-node');
const axios = require('axios');
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

    const sourceTranscription = (await openai.audio.transcriptions.create({
        file: fs.createReadStream('audio.mp3'),
        model: 'whisper-1',
    })).text

    console.log(sourceTranscription);

    // Translation: targetTranscription
    const translator = new deepl.Translator(process.env.DEEPL_KEY);
    const targetTranscription = (await translator.translateText(sourceTranscription, 'en', 'fr')).text;

    console.log(targetTranscription);
    
    res.json({ message: "Download successful!!!" });
})

app.post('/dub', async (req, res) => {
    const form = new FormData();
    form.append("mode", "automatic");
    form.append("source_url", req.body.url);
    form.append("source_lang", "en");
    form.append("target_lang", "fr");
    form.append("num_speakers", "0");
    form.append("watermark", "false");

    const options = {
    method: 'POST',
    headers: {
        'xi-api-key': process.env.ELEVEN_LABS_KEY,
    }
    };

    options.body = form;

    await fetch('https://api.elevenlabs.io/v1/dubbing', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));

    res.json({ message: "Download successful!!!" });
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});