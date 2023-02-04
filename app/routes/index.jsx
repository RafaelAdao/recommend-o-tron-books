import { useState } from 'react'
import styles from '~/styles/global.css'

export const links = () => [
  {
    rel: 'stylesheet',
    href: styles
  }
]

export default function Index() {
  const [profileURL, setProfileURL] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()

    // if (!profileURL.match(/https:\/\/www.skoob.com.br\/usuario\/\d+/)) {
    //   alert(`Link inválido: ${profileURL}`)
    //   return
    // }

    setLoading(true)
    const response = await fetch('http://localhost:3001/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ profileURL })
    })

    const data = await response.json()
    setData(data)
    setLoading(false)
  }

  return (
    <div className="wrapper">
      <div className="header">
        <h1>Recommend-o-tron Books</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="profileUrl">Link do perfil do Skoob</label>
          <input
            style={{ margin: '0px 4px' }}
            id="profileUrl"
            size="50"
            type="url"
            placeholder="https://www.skoob.com.br/usuario/123456"
            value={profileURL}
            onChange={event => setProfileURL(event.target.value)}
          />
          <button type="submit">OK</button>
        </form>
      </div>
      <article className="main">
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <div className="paper">
            <h2>Recomendações</h2>
            <ul>
              {data.recommendations.map(book => (
                <li key={book.id}>{book.title}</li>
              ))}
            </ul>
            <h2>Baseadas em</h2>
            <ul>
              {data.based.map(book => (
                <li key={book.id}>{book.title}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </article>
    </div>
  )
}
