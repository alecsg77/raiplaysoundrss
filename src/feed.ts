import { Podcast } from 'podcast';
import moment from 'moment';
import { ProgrammaInfo } from 'RaiPlaySound';

export function newProgrammaFeed(programmaInfo: ProgrammaInfo, options?: { feed?: string }) {
    const feed = new Podcast({
        namespaces: {
            iTunes: true,
            podcast: false,
            simpleChapters: false
        },
        title: programmaInfo.podcast_info.title,
        description: programmaInfo.podcast_info.description,
        siteUrl: 'https://www.raiplaysound.it' + programmaInfo.podcast_info.weblink,
        language: "it-it",
        imageUrl: 'https://www.raiplaysound.it' + programmaInfo.podcast_info.image,
        copyright: "Rai - Radiotelevisione Italiana Spa",
        pubDate: moment(programmaInfo.block.update_date, "DD-MM-YYYY hh:mm:ss").toDate(),
        generator: "RaiPlay Sound",
        itunesOwner: {
            name: "RaiPlay Sound",
            email: "portaliradio@rai.it"
        },
        categories: programmaInfo.podcast_info.genres.map((genre) => genre.name),
        itunesAuthor: "RaiPlay Sound",
        itunesSummary: programmaInfo.podcast_info.description,
        itunesCategory: [{ text: 'Society & Culture' }],
        feedUrl: options?.feed
    });

    programmaInfo.block.cards.forEach(post => {
        feed.addItem({
            title: post.episode_title,
            url: 'https://www.raiplaysound.it' + post.weblink,
            guid: post.uniquename,
            description: post.description,
            date: moment(post.literal_publication_date, "DD MMM YYYY", "it").toDate() || moment(post.create_date, "DD-MM-YYYY").toDate(),
            imageUrl: 'https://www.raiplaysound.it' + post.image,
            enclosure: {
                url: (post.downloadable_audio || post.audio).url,
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
    return feed.buildXml();
}
