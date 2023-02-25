const express = require('express')
const app = express()
app.use(express.json())

app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://escube-frontend.fly.dev'
  ]
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.get('/', (req, res) => {
  res.send('200 OK!')
})

const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')
const serviceAccount = require(`./${process.env.SERVICE_ACCOUNT_FILENAME}`)
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

app.post('/v1/profile', async (req, res) => {
  const profileUrl = req.body.profileUrl
  if (!profileUrl.match(/https:\/\/www.skoob.com.br\/usuario\/\d+/)) {
    return res.status(400).json({ error: 'profileUrl is required' })
  }

  await db.collection('searches').add({
    profileUrl: profileUrl,
    timestamp: FieldValue.serverTimestamp()
  })

  const BASE_URL = 'https://www.skoob.com.br'
  const userId = profileUrl.match(/\d+/)[0]
  const api = `${BASE_URL}/v1/bookcase/books/${userId}/shelf_id:13/page:1/limit:10000`

  const readedBooks = await axios
    .get(api)
    .then(res => {
      const books = res.data.response
      return books.map(book => ({
        id: book.edicao.id,
        title: book.edicao.titulo,
        ranking: book.ranking,
        readDate: book.dt_leitura
      }))
    })
    .catch(err => {
      console.log('Error: ', err.message)
      res.status(500).json({ error: err.message })
    })

  const based = readedBooks
    .sort((a, b) => {
      if (a.ranking > b.ranking) {
        return -1
      }
      if (a.ranking < b.ranking) {
        return 1
      }
      if (a.readDate > b.readDate) {
        return -1
      }
      if (a.readDate < b.readDate) {
        return 1
      }
      return 0
    })
    .slice(0, 5)

  const chat = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${process.env.PROMPT} ${based.map(v => v.title).join(',')}`,
    temperature: 0.5,
    max_tokens: 200,
    top_p: 1,
    frequency_penalty: 0.52,
    presence_penalty: 0.5,
    stop: ['11.']
  })

  res.json({
    based,
    recommendations: chat.data.choices[0].text
      .split('\n')
      .filter(line => line.trim() !== '')
      .map((line, index) => {
        return {
          id: index,
          title: line.trim()
        }
      })
  })
})

const port = process.env.PORT || 3002
app.listen(port, () => console.log(`App listening on port ${port}!`))
