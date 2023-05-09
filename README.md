# RaiPlaySoundRSS
Convert RaiPlaySound JSON Metadata into a RSS Feed.

## How to run the server locally using docker

1. Build a local image from the GitHub repository
```bash
docker build https://github.com/alecsg77/raiplaysoundrss.git -t raiplaysoundrss
```
2. Run the server on the port 3000
```bash
docker run --name raiplaysoundrss --rm -d -p 3000:3000 raiplaysoundrss
```

## How to get the RaiPlaySound podcast's RSS feed

1. Copy the podcast_id from the RaiPlaySound website.
Example: https://www.raiplaysound.it/programmi/***podcast_id***
2. Add the podcast to your favorite app using the URL of your server.
Example: http://localhost:3000/***podcast_id***

Currently tested on
- iTunes
- [Podcast Addict](https://podcastaddict.com/)