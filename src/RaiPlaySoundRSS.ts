import { Podcast } from 'podcast';
import moment from 'moment';
import { ProgrammaInfo, Audio, DownloadableAudio } from 'RaiPlaySound';

const baseUrl = 'https://www.raiplaysound.it';

// Regex pattern for valid parameter names (alphanumeric and hyphens only)
const VALID_PARAM_PATTERN = /^[a-z0-9-]+$/i;

export interface Options {
    feedUrl?: string;
}

export async function generateProgrammaFeed(name: { [key: string]: string }, options?: Options): Promise<string> {
    const programmaInfo = await fetchProgramma(name);
    const feed = toFeed(programmaInfo, options);
    return feed.buildXml();
}

async function fetchProgramma(name: { [key: string]: string }) {
    const servizio = name.servizio;
    const programma = name.programma;
    
    // Validate input parameters to prevent SSRF attacks
    if (servizio && !VALID_PARAM_PATTERN.test(servizio)) {
        throw new Error('Invalid servizio parameter. Only alphanumeric characters and hyphens allowed.');
    }
    if (programma && !VALID_PARAM_PATTERN.test(programma)) {
        throw new Error('Invalid programma parameter. Only alphanumeric characters and hyphens allowed.');
    }
    
    let url: URL;
    
    if (servizio && programma) {
        // Double parameter case: /:servizio/:programma -> /{servizio}/{programma}.json
        url = new URL(`/${servizio}/${programma}.json`, baseUrl);
    } else if (programma) {
        // Single parameter case: /:programma (servizio defaults to "programmi") -> /programmi/{programma}.json
        url = new URL(`/programmi/${programma}.json`, baseUrl);
    } else {
        throw new Error('Program name is required. Expected either programma or both servizio and programma parameters.');
    }
    
    let response = await fetch(url);
    if (!response.ok) {
        // Fallback to audiolibri only for single parameter case
        if (!servizio && programma) {
            url = new URL(`/audiolibri/${programma}.json`, baseUrl);
            response = await fetch(url);
        }
    }
    
    if (!response.ok) {
        throw new Error(`Failed to fetch program data for ${servizio ? `${servizio}/` : ''}${programma || 'unknown'}`);
    }
    return response.json() as Promise<ProgrammaInfo>;
}

function toFeed(programmaInfo: ProgrammaInfo, options?: Options) {
    const feed = new Podcast({
        namespaces: {
            iTunes: true,
            podcast: false,
            simpleChapters: false
        },
        title: programmaInfo.podcast_info.title,
        description: programmaInfo.podcast_info.description,
        siteUrl: weblink(programmaInfo.podcast_info),
        language: "it-it",
        imageUrl: image(programmaInfo.podcast_info),
        copyright: "Rai - Radiotelevisione Italiana Spa",
        pubDate: moment(programmaInfo.block.update_date, "DD-MM-YYYY hh:mm:ss").toDate(),
        generator: "RaiPlay Sound",
        itunesOwner: {
            name: "RaiPlay Sound",
            email: "portaliradio@rai.it"
        },
        itunesAuthor: "Rai Radio 3",
        itunesSubtitle: programmaInfo.podcast_info.description,
        itunesCategory: [{ text: 'Science &amp; Medicine' }],
        feedUrl: options?.feedUrl
    });

    programmaInfo.block.cards.forEach(post => {
        feed.addItem({
            title: post.episode_title,
            url: weblink(post, programmaInfo.podcast_info),
            guid: post.uniquename,
            description: post.description,
            date: moment(post.literal_publication_date, "DD MMM YYYY", "it").toDate() || moment(post.create_date, "DD-MM-YYYY").toDate(),
            imageUrl: image(post, programmaInfo.podcast_info),
            enclosure: {
                url: audio(post),
                type: 'audio/mpeg'
            },
            itunesAuthor: "RaiPlay Sound",
            itunesTitle: post.episode_title,
            itunesSummary: post.description,
            itunesDuration: post.audio?.duration
        });
    });

    for (const i in feed.feed.customElements) {
        const element = feed.feed.customElements[i] as { "itunes:explicit": string };
        if (element['itunes:explicit'] === undefined)
            continue;
        element['itunes:explicit'] = "no";
    }
    for (const i in feed.items) {
        const item = feed.items[i];
        if (item.customElements === undefined)
            continue;
        for (const key in item.customElements) {
            const element = item.customElements[key] as { "itunes:explicit": string };
            if (element['itunes:explicit'] === undefined)
                continue;
            element['itunes:explicit'] = "no";
        }
    }
    return feed;
}

function weblink(...args: { weblink: string; }[]) {
    const url = args.find(x => x != null && x.weblink != null)?.weblink;
    return url ? new URL(url, baseUrl).href : undefined;
}
function image(...args: { image: string; }[]) {
    const url = args.find(x => x != null && x.image != null)?.image;
    return url ? new URL(url, baseUrl).href : undefined;
}
function audio({ audio, downloadable_audio }: { audio: Audio, downloadable_audio: DownloadableAudio }) {
    const url = new URL((downloadable_audio || audio).url);
    url.pathname = url.pathname.replace('.htm', '.mp3');
    return url.href;
}
