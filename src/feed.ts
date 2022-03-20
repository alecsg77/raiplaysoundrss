import { Podcast } from 'podcast';
import moment from 'moment';
import { ProgrammaInfo } from 'RaiPlaySound';
import xmlescape from 'xml-escape';

export function newProgrammaFeed(programmaInfo: ProgrammaInfo, options?: { feed?: string }) {
    const feed = new Podcast({
        title: programmaInfo.podcast_info.title,
        description: programmaInfo.podcast_info.description,
        siteUrl: 'https://www.raiplaysound.it' + programmaInfo.podcast_info.weblink,
        language: "it-it",
        imageUrl: 'https://www.raiplaysound.it' + programmaInfo.podcast_info.image,
        copyright: "Rai - Radiotelevisione Italiana Spa",
        pubDate: moment(programmaInfo.block.update_date, "DD-MM-YYYY hh:mm:ss").toDate(),
        generator: "RaiPlay Sound",
        author: "RaiPlay Sound",
        itunesOwner: {
            name: "RaiPlay Sound",
            email: "portaliradio@rai.it"
        },
        categories: programmaInfo.podcast_info.genres.map((genre) => genre.name),
        itunesSummary: xmlescape(programmaInfo.podcast_info.description),
        itunesCategory: [{text: 'Society &amp; Culture'}],
        feedUrl: options?.feed
    });

    programmaInfo.block.cards.slice(-1).forEach(post => {
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
            itunesTitle: xmlescape(post.episode_title),
            itunesSummary: xmlescape(post.description),
            itunesDuration: post.audio?.duration
        });
    });

    return feed.buildXml();
}
