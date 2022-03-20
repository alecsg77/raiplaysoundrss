import express from 'express';
import pino from 'pino-http';
import cache from './cache';
import { fetchProgrammaAsync } from './api';
import { newProgrammaFeed } from './feed';

const app = express()
const port = 3000

app.use(pino());

app.get('/:programma', cache(60), async (req, res, next) => {
  try {
    const programmaInfo = await fetchProgrammaAsync(req.params.programma);
    const feed = newProgrammaFeed(programmaInfo);
    res.set('Content-Type', 'application/rss+xml');
    res.send(feed.rss2());
  } catch (error) {
    next(error);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})