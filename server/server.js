const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs = require('fs');
const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

app.post('/download-video', async (req, res) => {
    console.log(req.body.url);
    const info = await ytdl.getInfo(req.body.url);
    const videoStream = ytdl.downloadFromInfo(info);
    const writeStream = fs.createWriteStream('video.mp4');
    videoStream.pipe(writeStream);  
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});