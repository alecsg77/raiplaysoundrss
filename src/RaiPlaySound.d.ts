declare namespace RaiPlaySound {

    interface PageUpdated {
        date: string;
        hour: string;
    }

    interface Images {
        landscape: string;
        landscape_logo?: unknown;
        square: string;
        square_external?: unknown;
        cover?: unknown;
    }

    interface Channel {
        name: string;
        logo: string;
        category_path: string;
        palinsesto_url: string;
        palinsesto_name: string;
    }

    interface Genre {
        id: string;
        name: string;
        pipe: string;
    }

    interface Subgenre {
        id: string;
        name: string;
        pipe: string;
    }

    interface Contacts {
        email: string;
        phone_number?: unknown;
        sms?: unknown;
        whatsapp?: unknown;
        newsletter?: unknown;
    }

    interface ProductSource {
        id: string;
        name: string;
        pipe: string;
        principal: boolean;
    }

    interface Metadata {
        product_sources: ProductSource[];
        targets: unknown[];
        school_levels: unknown[];
        languages: unknown[];
        audiodescription: unknown[];
    }

    interface EscapedGenre {
        id: string;
        name: string;
    }

    interface EscapedTypology {
        id: string;
        name: string;
    }

    interface Dfp {
        escaped_name: string;
        label: string;
        escaped_genres: EscapedGenre[];
        escaped_typology: EscapedTypology[];
    }

    interface PodcastInfo {
        uniquename: string;
        type: string;
        create_date: string;
        create_time: string;
        year: string;
        date_tracking: string;
        title: string;
        description: string;
        onair_date: string;
        images: Images;
        image: string;
        weblink: string;
        path_id: string;
        channel: Channel;
        typology: string;
        genres: Genre[];
        subgenres: Subgenre[];
        editor: string;
        socials: unknown[];
        contacts: Contacts;
        people: unknown[];
        metadata: Metadata;
        adv: boolean;
        noroll: boolean;
        nobanner: boolean;
        nofloorad: boolean;
        play_inverted: boolean;
        dfp: Dfp;
    }

    interface TabMenu {
        content_type: string;
        label: string;
        weblink: string;
        path_id: string;
        sub_type: string;
        active: boolean;
    }

    interface Audio {
        title: string;
        poster: string;
        url: string;
        type: string;
        duration: string;
    }

    interface DownloadableAudio {
        title: string;
        url: string;
        type: string;
    }

    interface Program {
        id: string;
        name: string;
        pipe: string;
        category_path: string;
        weblink: string;
        configuratore: string;
        contestual_page: string;
        path_id: string;
    }

    interface PodcastInfoRef {
        uniquename: string;
        name: string;
        path_id: string;
        weblink: string;
    }

    interface TrackInfo {
        id: string;
        domain: string;
        platform: string;
        media_type: string;
        page_type: string;
        editor: string;
        year: string;
        edit_year: string;
        section: string;
        sub_section: string;
        content: string;
        title: string;
        channel: string;
        date: string;
        typology: string;
        genres: string[];
        sub_genres: string[];
        program_title: string;
        program_typology: string;
        edition: string;
        season: string;
        episode_number: string;
        episode_title: string;
        form: string;
        media_name?: string;
        listaDateMo?: unknown[];
        create_date?: string;
        page_url: string;
    }

    interface AudioItem {
        uniquename: string;
        type: string;
        create_date: string;
        create_time: string;
        title: string;
        toptitle: string;
        subtitle: string;
        channel: Channel;
        description: string;
        episode_title: string;
        episode?: unknown;
        season: string;
        form: string;
        audio: Audio;
        downloadable_audio: DownloadableAudio;
        images: Images;
        image: string;
        program: Program;
        weblink: string;
        path_id: string;
        literal_publication_date: string;
        literal_duration: string;
        podcast_info: PodcastInfoRef;
        dfp: Dfp;
        track_info: TrackInfo;
    }

    interface Block {
        uniquename: string;
        title: string;
        type: string;
        content_type: string;
        create_date: string;
        update_date: string;
        path: string;
        cards: AudioItem[];
    }

    interface ProgrammaInfo {
        page_updated: PageUpdated;
        uniquename: string;
        title: string;
        podcast_info: PodcastInfo;
        tab_menu: TabMenu[];
        block: Block;
        track_info: TrackInfo;
    }

}

