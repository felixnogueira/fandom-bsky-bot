import express from 'express';
import multer from 'multer';
import { runBot } from './bot.js';
import fs from 'node:fs';
import path from 'node:path';

const app = express();
const upload = multer({ dest: 'src/uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/setup', upload.single('quotes'), (req, res) => {
    const { username, password, interval } = req.body;
    const quotesFile = path.join('src/uploads', `${username}_quotes.txt`);
    const postedFile = path.join('src/uploads', `${username}_posted.txt`);

    if (!fs.existsSync(postedFile)) {
        fs.writeFileSync(postedFile, '');
    }

    setInterval(() => {
        runBot(username, password, quotesFile, postedFile);
    }, interval);

    res.send('Bot setup complete!');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
