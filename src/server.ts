import express from 'express';
import compression from 'compression';
import cache from './cache';
import { httpLogger } from './logger';
import publicUrl from './publicUrl';
import { fetchProgrammaAsync, proxyMediaHandler } from './api';
import { newProgrammaFeed } from './feed';

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
    const programmaInfo = await fetchProgrammaAsync(req.params.programma);
    const feed = newProgrammaFeed(programmaInfo, { feedUrl: req.publicUrl });
    res.set('Content-Type', contentType);
    res.send(feed);
  } catch (error) {
    next(error);
  }
})

app.use('/:programma/audio/:cont.mp3', httpLogger, proxyMediaHandler('cont'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
