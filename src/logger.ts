import http from 'pino-http';
import pretty from 'pino-pretty';

export const httpLogger = http(pretty({
    colorize: true
}));