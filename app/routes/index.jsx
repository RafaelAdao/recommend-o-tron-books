import { useState } from 'react'

export default function Index() {
  const [profileURL, setProfileURL] = useState('')
  const [bookList, setBookList] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()

    if (!profileURL.match(/https:\/\/www.skoob.com.br\/usuario\/\d+/)) {
      alert('Link inválido')
      return
    }
    setLoading(true)
    const response = await fetch('http://localhost:3001/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ profileURL })
    })

    const { books } = await response.json()
    setBookList(books)
    setLoading(false)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Link do perfil do Skoob
          <input
            type="text"
            value={profileURL}
            onChange={event => setProfileURL(event.target.value)}
          />
        </label>
        <button type="submit">OK</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        bookList.length > 0 && (
          <ul>
            {bookList.map(book => (
              <li key={book.id}>{book.title}</li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}
