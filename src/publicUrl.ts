import { RequestHandler } from 'express';

const firstValue = (header?: string | string[]) => ((Array.isArray(header) ? header[0] : header) || '').split(',')[0];

export default (debugMode?: boolean): RequestHandler<{ programma: string; }> => {

    return (req, res, next) => {

        const hostHeaderValue = String(req.headers.host || '');
        const protocol = firstValue(req.headers['x-forwarded-proto']) || req.protocol || 'http';
        let host = firstValue(req.headers['x-forwarded-host']) || hostHeaderValue.replace(/:[0-9]+/, '');
        let port = firstValue(req.headers['x-forwarded-port']) || req.app.settings.port || (hostHeaderValue.match(/:([0-9]+)/) || [])[1] || '';

        const url = req.url; // Ottieni l'URL completo richiesto dal client
        const urlSegments = url.split('/'); // Dividi l'URL in segmenti
        const lastSegment = "/" + urlSegments[urlSegments.length - 1];
        const resource = lastSegment;

        // clear default ports
        port = (protocol === 'https' && port === '443') ? '' : port;
        port = (protocol === 'http' && port === '80') ? '' : port;

        // add port number of present
        host += ((port !== '') ? ':' + port : '');

        const publicUrl = protocol + '://' + host + resource;

        // expose as a header in debug mode for testing
        if (debugMode) {
            res.setHeader('x-public-url', publicUrl);
        }

        req.app.locals.protocol = protocol;
        req.app.locals.domain = host;
        req.app.locals.path = (req.path !== '/') ? req.path : '';
        req.app.locals.baseUrl = protocol + '://' + host;
        req.app.locals.publicUrl = publicUrl;

        req.urlBase = protocol + '://' + host;

        // make the public Url available on both request objects
        req.publicUrl = publicUrl;

        next();
    };
};