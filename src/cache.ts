import { RequestHandler } from 'express';
import NodeCache from 'node-cache';

const nodecache = new NodeCache();

export default (duration: number): RequestHandler<{ programma: string; }> => {
    return (req, res, next) => {
        const key = '__express__' + req.originalUrl || req.url
        const cacheBody = nodecache.get(key);
        if (cacheBody) {
            req.log.info('Get reponse from cache');
            res.set('Content-Type', 'application/rss+xml');
            res.send(cacheBody);
            return;
        } else {
            const _send = res.send;
            res.send = (body) => {
                nodecache.set(key, body, duration);
                req.log.info('Set response in cache');
                return _send.call(res, body);
            }
            next();
        }
    }
}
