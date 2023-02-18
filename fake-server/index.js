const express = require('express')
const app = express()
const port = 3001

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/v1/profile', async (req, res) => {
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
  await delay(2000)
  const profileUrl = req.body.profileUrl
  const readedBooks = [
    {
      id: 1,
      title: 'My favorite book',
      ranking: 5,
      readDate: '2015-06-10 00:06:21'
    },
    {
      id: 2,
      title: 'My second favorite book',
      ranking: 4,
      readDate: '2015-06-02 07:06:44'
    },
    {
      id: 3,
      title: 'My third favorite book',
      ranking: 5,
      readDate: '2014-01-01 00:00:00'
    }
  ]
  const based = readedBooks.sort((a, b) => {
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

  const chat = `


1. O Poder do Hábito: Por Que Fazemos o Que Fazemos na Vida e nos Negócios, de Charles Duhigg 
2. O Cérebro de Buda: A Ciência da Meditação para a Transformação Pessoal, de Rick Hanson 
3. O Poder dos Mitos: Como Eles Moldam Nossas Vidas, de Joseph Campbell 
4. A Mente Inovadora: Um Guia Prático para Melhorar a Criatividade, de Michael Michalko 
5. Inteligência Emocional 2.0, de Travis Bradberry`

  const recommendations = chat
    .split('\n')
    .filter(line => line.trim() !== '')
    .map((line, index) => {
      return {
        id: index,
        title: line.trim()
      }
    })

  res.json({
    based,
    recommendations
  })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
