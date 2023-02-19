# recommend-o-tron-books

The purpose of this project is to recommend books based on your reader-tracker (like skoob, goodreads, thestorygraph, etc) apps data

![image](https://user-images.githubusercontent.com/5923706/219982325-6f3842f6-101f-48a6-a80f-19b48d29b2b2.png)

0.0.1 version:
- [x] recommend books based on your top last read books on [Skoob](https://www.skoob.com.br)

Currently working on a 0.0.2 working version.
Possibly features:
- [ ] don't recommend already read books
- [ ] user can choose the recommendation category (non-fiction, horror, ...)


## Techs

- Frontend: [Remix](https://remix.run)
- Backend: [NodeJS](https://nodejs.org/en/) with [Express.js](https://expressjs.com/) framework
- Cloud: [Fly.io ](https://fly.io/)
- Recommendations: [OpenAI](https://openai.com/)


The beautiful [background image](https://github.com/RafaelAdao/recommend-o-tron-books/blob/main/app/images/background.png) generated by [DALL-E](https://labs.openai.com/)

### Running

```sh
make setup
make run
make fake-server
```
