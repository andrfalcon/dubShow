const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

app.post('/download-video', (req, res) => {
    console.log(req.body.url);
    res.json({message: "Post successful!!!"})
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});