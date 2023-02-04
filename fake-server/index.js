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

app.post('/profile', async (req, res) => {
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
  await delay(500)
  const profileUrl = req.body.profileUrl
  res.json({
    based: [
      { id: 1, title: 'My favorite book' },
      { id: 2, title: 'My second favorite book' }
    ],
    recommendations: [
      { id: 1, title: 'Book 1' },
      { id: 2, title: 'Book 2' },
      { id: 3, title: 'Book 3' }
    ]
  })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
