import bsky from '@atproto/api';
const { BskyAgent } = bsky;
import fs from 'node:fs';

export async function runBot(username: string, password: string, quotesFile: string, postedFile: string) {
    const agent = new BskyAgent({
        service: 'https://bsky.social',
    });

    await agent.login({
        identifier: username,
        password: password,
    });

    const lines = fs.readFileSync(quotesFile, 'utf8').split('\n');
    const alreadyPosted = fs.readFileSync(postedFile, 'utf8').split('\n');
    let possibleOutput = lines.filter((line) => !alreadyPosted.includes(line));
    if (possibleOutput.length === 0) {
        fs.rmSync(postedFile);
        possibleOutput = lines;
        fs.appendFileSync(postedFile, '\n');
    }
    const post = possibleOutput[Math.floor(Math.random() * possibleOutput.length)];

    await agent.post({
        $type: 'app.bsky.feed.post',
        text: post,
        createdAt: new Date().toISOString(),
    });

    fs.appendFileSync(postedFile, post + '\n');
}
