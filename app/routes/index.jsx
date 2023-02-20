import { useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import styles from '~/styles/global.css'

import * as gtag from '~/utils/gtags.client'

export const links = () => [
  {
    rel: 'stylesheet',
    href: styles
  }
]

export async function loader() {
  return process.env.SERVER_URL
}

export default function Index() {
  const SERVER_URL = useLoaderData(loader)
  const [profileUrl, setProfileUrl] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()

    if (!profileUrl.match(/https:\/\/www.skoob.com.br\/usuario\/\d+/)) {
      alert(`Link inválido: ${profileUrl}`)
      return
    }

    gtag.event({
      action: 'search',
      category: 'engagement',
      label: 'search_term',
      value: profileUrl
    })

    setLoading(true)
    const response = await fetch(`${SERVER_URL}/v1/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ profileUrl })
    })

    if (!response.ok) {
      const { error } = await response.json()
      alert(error)
      setLoading(false)
      return
    }
    const data = await response.json()
    setData(data)
    setLoading(false)
  }

  const handleViewGitHubClick = () => {
    gtag.event({
      action: 'click',
      category: 'engagement',
      label: 'view_github',
      value: 'https://github.com/RafaelAdao/recommend-o-tron-books'
    })
    window.open(
      'https://github.com/RafaelAdao/recommend-o-tron-books',
      '_blank'
    )
  }

  return (
    <div className="wrapper">
      <div className="header">
        <button className="ghbutton" onClick={handleViewGitHubClick}>
          View on GitHub
        </button>
        <h1>Recommend-o-tron Books</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="profileUrl">Link do perfil do Skoob</label>
          <input
            style={{ margin: '0px 4px' }}
            id="profileUrl"
            size="50"
            type="url"
            placeholder="https://www.skoob.com.br/usuario/123456"
            value={profileUrl}
            onChange={event => setProfileUrl(event.target.value)}
          />
          <button className="button" type="submit">
            Recomendar!
          </button>
        </form>
      </div>
      <article className="main">
        {loading ? (
          <div class="library">
            <div class="bot">
              <div class="head"></div>
              <div class="body">
                <div class="book"></div>
                <div class="book"></div>
                <div class="book"></div>
              </div>
            </div>
            <p style={{ marginLeft: '4px' }}>Buscando recomendações...</p>
          </div>
        ) : data ? (
          <div className="paper">
            <h2>Recomendações</h2>
            <ul>
              {data.recommendations.map(book => (
                <li key={book.id}>{book.title}</li>
              ))}
            </ul>
            <h2>Baseadas nos seus últimos livros favoritos</h2>
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
