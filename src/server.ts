import express from 'express';
import compression from 'compression';
import cache from './cache';
import { httpLogger } from './logger';
import publicUrl from './publicUrl';
import { fetchProgrammaAsync } from './api';
import { newProgrammaFeed } from './feed';

const app = express()
const port = 3000

app.use(compression());
app.use(httpLogger);
app.use(publicUrl());

app.get('/:programma', cache(60), async (req, res, next) => {
  try {
    const programmaInfo = await fetchProgrammaAsync(req.params.programma);
    const feed = newProgrammaFeed(programmaInfo, { feed: req.publicUrl });
    const contentType = req.accepts(['text/xml', 'application/xml', 'application/rss+xml']);
    if (contentType === false) {
      res.status(406).end();
      return;
    }
    res.set('Content-Type', contentType);
    res.send(feed);
  } catch (error) {
    next(error);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})