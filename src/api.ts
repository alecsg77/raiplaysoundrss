import fetch from 'node-fetch';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ProgrammaInfo } from 'RaiPlaySound';

export async function fetchProgrammaAsync(programma: string) {
    const response = await fetch(`https://www.raiplaysound.it/programmi/${programma}.json`);
    return await response.json() as Promise<ProgrammaInfo>;
}

export function proxyMediaHandler(paramName: string) {
    return createProxyMiddleware({
        target: "https://mediapolisvod.rai.it",
        changeOrigin: true,
        pathRewrite: (_path, req) => '/relinker/relinkerServlet.htm?cont=' + req.params[paramName],
        followRedirects: true
    });
}

export const urlResolver = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    link: (url: string, feedUrl?: string) => new URL(url, 'https://www.raiplaysound.it').href,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    image: (url: string, feedUrl?: string) => new URL(url, 'https://www.raiplaysound.it').href,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    audio: (url: string, feedUrl?: string) =>  url.replace('.htm','.mp3')
};