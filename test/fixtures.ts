import { ProgrammaInfo } from 'RaiPlaySound';

export const mockProgrammaInfo: ProgrammaInfo = {
  page_updated: {
    date: "31-08-2023",
    hour: "12:25:28"
  },
  uniquename: "test-podcast",
  title: "Test Podcast",
  podcast_info: {
    uniquename: "test-podcast",
    type: "programma",
    create_date: "31-08-2023",
    create_time: "12:00:00",
    year: "2023",
    date_tracking: "2023-08-31",
    title: "Test Podcast",
    description: "A test podcast description",
    onair_date: "31-08-2023",
    images: {
      landscape: "/static/media/test-podcast-landscape.jpg",
      square: "/static/media/test-podcast-square.jpg"
    },
    image: "/static/media/test-podcast.jpg",
    weblink: "/programmi/test-podcast",
    path_id: "test-podcast-path",
    channel: {
      name: "Rai Radio 3",
      logo: "/static/media/rai-radio-3.png",
      category_path: "/radio/radiotre",
      palinsesto_url: "/palinsesto/radiotre",
      palinsesto_name: "Rai Radio 3"
    },
    typology: "podcast",
    genres: [{
      id: "1",
      name: "Scienza e Medicina",
      pipe: "scienza-e-medicina"
    }],
    subgenres: [{
      id: "1",
      name: "Divulgazione scientifica",
      pipe: "divulgazione-scientifica"
    }],
    editor: "Rai Radio 3",
    socials: [],
    contacts: {
      email: "portaliradio@rai.it"
    },
    people: [],
    metadata: {
      product_sources: [{
        id: "1",
        name: "Test Source",
        pipe: "test-source",
        principal: true
      }],
      targets: [],
      school_levels: [],
      languages: [],
      audiodescription: []
    },
    adv: false,
    noroll: true,
    nobanner: true,
    nofloorad: true,
    play_inverted: false,
    dfp: {
      escaped_name: "test-podcast",
      label: "Test Podcast",
      escaped_genres: [{
        id: "1",
        name: "Test Genre"
      }],
      escaped_typology: [{
        id: "1",
        name: "Podcast"
      }]
    }
  },
  tab_menu: [{
    content_type: "programma",
    label: "Episodes",
    weblink: "/programmi/test-podcast",
    path_id: "test-podcast",
    sub_type: "episodes",
    active: true
  }],
  block: {
    uniquename: "test-podcast-block",
    title: "Episodes",
    type: "cards",
    content_type: "audio",
    create_date: "31-08-2023",
    update_date: "31-08-2023 12:00:00",
    path: "/programmi/test-podcast",
    cards: [
      {
        uniquename: "test-episode-1",
        type: "audio",
        create_date: "31-08-2023",
        create_time: "12:00:00",
        title: "Test Episode 1",
        toptitle: "",
        subtitle: "",
        channel: {
          name: "Rai Radio 3",
          logo: "/static/media/rai-radio-3.png",
          category_path: "/radio/radiotre",
          palinsesto_url: "/palinsesto/radiotre",
          palinsesto_name: "Rai Radio 3"
        },
        description: "First test episode description",
        episode_title: "Test Episode 1",
        season: "2023",
        form: "podcast",
        audio: {
          title: "Test Episode 1",
          poster: "/static/media/test-episode-1-poster.jpg",
          url: "https://mediapolis.rai.it/relinker/relinkerServlet.htm?cont=test1",
          type: "audio/mpeg",
          duration: "00:15:30"
        },
        downloadable_audio: {
          title: "Test Episode 1",
          url: "https://mediapolis.rai.it/relinker/relinkerServlet.htm?cont=test1-dl",
          type: "audio/mpeg"
        },
        images: {
          landscape: "/static/media/test-episode-1-landscape.jpg",
          square: "/static/media/test-episode-1-square.jpg"
        },
        image: "/static/media/test-episode-1.jpg",
        program: {
          id: "test-podcast",
          name: "Test Podcast",
          pipe: "test-podcast",
          category_path: "/programmi/test-podcast",
          weblink: "/programmi/test-podcast",
          configuratore: "",
          contestual_page: "",
          path_id: "test-podcast"
        },
        weblink: "/programmi/test-podcast/test-episode-1",
        path_id: "test-episode-1",
        literal_publication_date: "31 ago 2023",
        literal_duration: "15 minuti e 30 secondi",
        podcast_info: {
          uniquename: "test-podcast",
          name: "Test Podcast",
          path_id: "test-podcast",
          weblink: "/programmi/test-podcast"
        },
        dfp: {
          escaped_name: "test-episode-1",
          label: "Test Episode 1",
          escaped_genres: [{
            id: "1",
            name: "Scienza e Medicina"
          }],
          escaped_typology: [{
            id: "1",
            name: "Podcast"
          }]
        },
        track_info: {
          id: "test-episode-1",
          domain: "raiplaysound.it",
          platform: "web",
          media_type: "audio",
          page_type: "episode",
          editor: "Test Editor",
          year: "2023",
          edit_year: "2023",
          section: "programmi",
          sub_section: "test-podcast",
          content: "episode",
          title: "Test Episode 1",
          channel: "Rai Radio 3",
          date: "31-08-2023",
          typology: "podcast",
          genres: ["Scienza e Medicina"],
          sub_genres: ["Divulgazione scientifica"],
          program_title: "Test Podcast",
          program_typology: "podcast",
          edition: "",
          season: "2023",
          episode_number: "1",
          episode_title: "Test Episode 1",
          form: "podcast",
          page_url: "/programmi/test-podcast/test-episode-1"
        }
      }
    ]
  },
  track_info: {
    id: "test-podcast",
    domain: "raiplaysound.it",
    platform: "web",
    media_type: "audio",
    page_type: "program",
    editor: "Test Editor",
    year: "2023",
    edit_year: "2023",
    section: "programmi",
    sub_section: "",
    content: "program",
    title: "Test Podcast",
    channel: "Rai Radio 3",
    date: "31-08-2023",
    typology: "podcast",
    genres: ["Scienza e Medicina"],
    sub_genres: ["Divulgazione scientifica"],
    program_title: "Test Podcast",
    program_typology: "podcast",
    edition: "",
    season: "2023",
    episode_number: "",
    episode_title: "",
    form: "podcast",
    page_url: "/programmi/test-podcast"
  }
};

export const mockAudiolibroInfo: ProgrammaInfo = {
  page_updated: {
    date: "31-08-2023",
    hour: "12:25:28"
  },
  uniquename: "test-audiolibro",
  title: "Test Audiolibro",
  podcast_info: {
    uniquename: "test-audiolibro",
    type: "audiolibro",
    create_date: "31-08-2023",
    create_time: "12:00:00",
    year: "2023",
    date_tracking: "2023-08-31",
    title: "Test Audiolibro",
    description: "Un audiolibro di prova della letteratura italiana",
    onair_date: "31-08-2023",
    images: {
      landscape: "/static/media/test-audiolibro-landscape.jpg",
      square: "/static/media/test-audiolibro-square.jpg"
    },
    image: "/static/media/test-audiolibro.jpg",
    weblink: "/audiolibri/test-audiolibro",
    path_id: "test-audiolibro-path",
    channel: {
      name: "Rai Radio 3",
      logo: "/static/media/rai-radio-3.png",
      category_path: "/radio/radiotre",
      palinsesto_url: "/palinsesto/radiotre",
      palinsesto_name: "Rai Radio 3"
    },
    typology: "audiolibro",
    genres: [{
      id: "2",
      name: "Letteratura",
      pipe: "letteratura"
    }],
    subgenres: [{
      id: "2",
      name: "Narrativa classica",
      pipe: "narrativa-classica"
    }],
    editor: "Rai Radio 3",
    socials: [],
    contacts: {
      email: "portaliradio@rai.it"
    },
    people: [],
    metadata: {
      product_sources: [{
        id: "2",
        name: "Audiolibri Source",
        pipe: "audiolibri-source",
        principal: true
      }],
      targets: [],
      school_levels: [],
      languages: [],
      audiodescription: []
    },
    adv: false,
    noroll: true,
    nobanner: true,
    nofloorad: true,
    play_inverted: false,
    dfp: {
      escaped_name: "test-audiolibro",
      label: "Test Audiolibro",
      escaped_genres: [{
        id: "2",
        name: "Letteratura"
      }],
      escaped_typology: [{
        id: "2",
        name: "Audiolibro"
      }]
    }
  },
  tab_menu: [{
    content_type: "audiolibro",
    label: "Capitoli",
    weblink: "/audiolibri/test-audiolibro",
    path_id: "test-audiolibro",
    sub_type: "capitoli",
    active: true
  }],
  block: {
    uniquename: "test-audiolibro-block",
    title: "Capitoli",
    type: "cards",
    content_type: "audio",
    create_date: "31-08-2023",
    update_date: "31-08-2023 12:00:00",
    path: "/audiolibri/test-audiolibro",
    cards: [
      {
        uniquename: "test-capitolo-1",
        type: "audio",
        create_date: "31-08-2023",
        create_time: "12:00:00",
        title: "Capitolo 1",
        toptitle: "",
        subtitle: "",
        channel: {
          name: "Rai Radio 3",
          logo: "/static/media/rai-radio-3.png",
          category_path: "/radio/radiotre",
          palinsesto_url: "/palinsesto/radiotre",
          palinsesto_name: "Rai Radio 3"
        },
        description: "Il primo capitolo del nostro audiolibro",
        episode_title: "Capitolo 1",
        season: "2023",
        form: "audiolibro",
        audio: {
          title: "Capitolo 1",
          poster: "/static/media/test-capitolo-1-poster.jpg",
          url: "https://mediapolis.rai.it/relinker/relinkerServlet.htm?cont=testcap1",
          type: "audio/mpeg",
          duration: "00:45:15"
        },
        downloadable_audio: {
          title: "Capitolo 1",
          url: "https://mediapolis.rai.it/relinker/relinkerServlet.htm?cont=testcap1-dl",
          type: "audio/mpeg"
        },
        images: {
          landscape: "/static/media/test-capitolo-1-landscape.jpg",
          square: "/static/media/test-capitolo-1-square.jpg"
        },
        image: "/static/media/test-capitolo-1.jpg",
        program: {
          id: "test-audiolibro",
          name: "Test Audiolibro",
          pipe: "test-audiolibro",
          category_path: "/audiolibri/test-audiolibro",
          weblink: "/audiolibri/test-audiolibro",
          configuratore: "",
          contestual_page: "",
          path_id: "test-audiolibro"
        },
        weblink: "/audiolibri/test-audiolibro/test-capitolo-1",
        path_id: "test-capitolo-1",
        literal_publication_date: "31 ago 2023",
        literal_duration: "45 minuti e 15 secondi",
        podcast_info: {
          uniquename: "test-audiolibro",
          name: "Test Audiolibro",
          path_id: "test-audiolibro",
          weblink: "/audiolibri/test-audiolibro"
        },
        dfp: {
          escaped_name: "test-capitolo-1",
          label: "Capitolo 1",
          escaped_genres: [{
            id: "2",
            name: "Letteratura"
          }],
          escaped_typology: [{
            id: "2",
            name: "Audiolibro"
          }]
        },
        track_info: {
          id: "test-capitolo-1",
          domain: "raiplaysound.it",
          platform: "web",
          media_type: "audio",
          page_type: "episode",
          editor: "Rai Radio 3",
          year: "2023",
          edit_year: "2023",
          section: "audiolibri",
          sub_section: "test-audiolibro",
          content: "episode",
          title: "Capitolo 1",
          channel: "Rai Radio 3",
          date: "31-08-2023",
          typology: "audiolibro",
          genres: ["Letteratura"],
          sub_genres: ["Narrativa classica"],
          program_title: "Test Audiolibro",
          program_typology: "audiolibro",
          edition: "",
          season: "2023",
          episode_number: "1",
          episode_title: "Capitolo 1",
          form: "audiolibro",
          page_url: "/audiolibri/test-audiolibro/test-capitolo-1"
        }
      }
    ]
  },
  track_info: {
    id: "test-audiolibro",
    domain: "raiplaysound.it",
    platform: "web",
    media_type: "audio",
    page_type: "program",
    editor: "Rai Radio 3",
    year: "2023",
    edit_year: "2023",
    section: "audiolibri",
    sub_section: "",
    content: "program",
    title: "Test Audiolibro",
    channel: "Rai Radio 3",
    date: "31-08-2023",
    typology: "audiolibro",
    genres: ["Letteratura"],
    sub_genres: ["Narrativa classica"],
    program_title: "Test Audiolibro",
    program_typology: "audiolibro",
    edition: "",
    season: "2023",
    episode_number: "",
    episode_title: "",
    form: "audiolibro",
    page_url: "/audiolibri/test-audiolibro"
  }
};
