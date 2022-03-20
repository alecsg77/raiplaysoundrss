import { Feed } from 'feed';
import moment from 'moment';
import { ProgrammaInfo } from 'RaiPlaySound';
export { Feed } from 'feed';

export function newProgrammaFeed(programmaInfo: ProgrammaInfo, options?: { feed?: string} ) {
    const feed = new Feed({
        title: programmaInfo.podcast_info.title,
        description: programmaInfo.podcast_info.description,
        id: programmaInfo.podcast_info.uniquename,
        link: 'https://www.raiplaysound.it/' + programmaInfo.podcast_info.weblink,
        language: "it-it",
        image: 'https://www.raiplaysound.it/' + programmaInfo.podcast_info.image,
        copyright: "Rai - Radiotelevisione Italiana Spa",
        updated: moment(programmaInfo.block.update_date, "DD-MM-YYYY hh:mm:ss").toDate(), // optional, default = today
        generator: "RaiPlay Sound",
        author: {
            name: "RaiPlay Sound",
            email: "portaliradio@rai.it"
        },
        feed: options?.feed
    });

    programmaInfo.podcast_info.genres.forEach(genre => feed.addCategory(genre.name));
    programmaInfo.podcast_info.subgenres.forEach(subgenre => feed.addCategory(subgenre.name));

    programmaInfo.block.cards.forEach(post => {
        feed.addItem({
            title: post.episode_title,
            link: 'https://www.raiplaysound.it/' + post.weblink,
            id: post.uniquename,
            description: post.description,
            date: moment(post.literal_publication_date, "DD MMM YYYY", "it").toDate() || moment(post.create_date, "DD-MM-YYYY").toDate(),
            image: 'https://www.raiplaysound.it/' + post.image,
            audio: {
                url: (post.downloadable_audio || post.audio).url,
                title: (post.downloadable_audio || post.audio).title,
                type: 'audio/mpeg'
            }
        });
    });

    feed.addContributor({
        email: programmaInfo.podcast_info.contacts.email,
    });

    return feed;
}
