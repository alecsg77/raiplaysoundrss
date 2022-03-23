import express from 'express';
import compression from 'compression';
import { middleware as cache } from 'apicache';
import { httpLogger } from './logger';
import publicUrl from './publicUrl';
import { generateProgrammaFeed } from './RaiPlaySoundRSS';

const app = express()
const port = 3000

app.use(compression());
app.use(httpLogger);
app.use(publicUrl());

app.get('/:programma', cache('1 minute'), async (req, res, next) => {
  try {
    const contentType = req.accepts(['text/xml', 'application/xml', 'application/rss+xml']);
    if (contentType === false) {
      res.status(406).end();
      return;
    }
    res.set('Content-Type', contentType);
    const feed = await generateProgrammaFeed(req.params.programma, { feedUrl: req.publicUrl });
    res.send(feed);
  } catch (error) {
    next(error);
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

