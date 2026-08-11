import { Link } from 'react-router-dom'
import { ROUTES } from '../components/Layout'

export default function NotFound() {
  return (
    <section className="notfound">
      <p className="eyebrow">404</p>
      <h1>That room does not exist.</h1>
      <p className="lede">The page you were after has moved or was never here. Try one of these.</p>
      <div className="notfound__links">
        <Link className="btn" to="/">Home</Link>
        {ROUTES.map(([label, path]) => (
          <Link className="btn btn--ghost" key={path} to={path}>{label}</Link>
        ))}
      </div>
    </section>
  )
}
