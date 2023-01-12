import stylesUrl from '../styles/index.css'

export let links = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

export default function Index() {
  return (
    <section className="layout">
      <div className="header">1</div>
      <div className="leftSide">2</div>
      <div className="body">3</div>
      <div className="rightSide">4</div>
      <div className="footer">5</div>
    </section>
  )
}
