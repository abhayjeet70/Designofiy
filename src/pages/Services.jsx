import { useState } from 'react'
import { Link } from 'react-router-dom'
import { faqs, pageHeroes, photos, services } from '../data'
import { CtaBand } from '../components/common'
import { Curtain, PageBanner } from '../components/motion'

function Faqs() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section section--paper faqsec">
      <div className="faqsec__media">
        <Curtain src={photos.bathroom} alt="Charcoal stone bathroom" ratio="3/4" speed={0.18} />
      </div>
      <div className="faqsec__body">
        <p className="eyebrow" data-reveal>Questions</p>
        <h2 data-reveal style={{ '--d': '80ms' }}>The things everybody asks first.</h2>
        <div className="faq" data-reveal style={{ '--d': '160ms' }}>
          {faqs.map((f, i) => (
            <div className={`faq__item ${open === i ? 'is-open' : ''}`} key={f.q}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span>{f.q}</span>
                <i aria-hidden="true" />
              </button>
              <div className="faq__body"><p>{f.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Services() {
  return (
    <>
      <PageBanner
        {...pageHeroes.services}
        eyebrow="What we do"
        title={<>Eight ways <em>in</em>.</>}
        lede="From a single wardrobe to a full turnkey handover. The same team and the same itemised pricing, whichever you pick."
      />

      <section className="section section--tight">
        <div className="svclist">
          {services.map((s, i) => (
            <article className="svcrow" id={s.id} key={s.id}>
              <Curtain
                src={s.img}
                alt={s.alt}
                ratio="4/3"
                speed={i % 2 ? -0.12 : 0.12}
                className="svcrow__img"
              />
              <div className="svcrow__body">
                <span className="svcrow__idx" data-reveal>{String(i + 1).padStart(2, '0')}</span>
                <h2 data-reveal style={{ '--d': '70ms' }}>{s.title}</h2>
                <p data-reveal style={{ '--d': '140ms' }}>{s.blurb}</p>
                <ul data-stagger>
                  {s.points.map((pt) => <li key={pt} data-reveal>{pt}</li>)}
                </ul>
                <Link className="link" to="/contact" data-reveal>Enquire about this →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Faqs />

      <CtaBand
        title="Not sure which one you need?"
        body="Describe the space in a sentence or two. We will tell you what it actually needs, even if that is less than you asked for."
        cta="Ask us"
      />
    </>
  )
}
