import express, { Request, Response, NextFunction } from 'express';
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

const handler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contentType = req.accepts(['text/xml', 'application/xml', 'application/rss+xml']);
   if (contentType === false) {
     res.status(406).end();
     return;
   }
    res.set('Content-Type', contentType);
    const feed = await generateProgrammaFeed(req.params, { feedUrl: req.publicUrl });
    res.send(feed);
  } catch (error) {
    next(error);
  }
};

app.get('/:servizio/:programma', cache('1 minute'), handler);
app.get('/:programma', cache('1 minute'), handler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

