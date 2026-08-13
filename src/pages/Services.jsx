import { useState } from 'react'
import { Link } from 'react-router-dom'
import { business, faqs, marqueeImages, pageHeroes, photos, services } from '../data'
import { Curtain, PageBanner } from '../components/motion'
import DiagonalMarquee from '../components/DiagonalMarquee'
import SlideUpText from '../components/SlideUpText'

function Faqs() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section section--paper faqsec">
      <div className="faqsec__media">
        <Curtain src={photos.bathroom} alt="Charcoal stone bathroom" ratio="3/4" speed={0.18} />
      </div>
      <div className="faqsec__body">
        <p className="eyebrow" data-reveal>Questions</p>
        <h2 data-reveal style={{ '--d': '80ms' }}>
          <SlideUpText split="words" stagger={0.07} inView once>
            The things everybody asks first.
          </SlideUpText>
        </h2>

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
        <h2 data-reveal style={{ '--d': '70ms' }}>
          <SlideUpText split="words" stagger={0.06} inView once>{s.title}</SlideUpText>
        </h2>

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

      <DiagonalMarquee images={marqueeImages} angle={-18}>
        <h2 data-reveal>
          <SlideUpText split="words" stagger={0.08} inView once>
            Not sure which one you need?
          </SlideUpText>
        </h2>
        <p data-reveal style={{ '--d': '80ms' }}>
          Describe the space in a sentence or two. We will tell you what it actually needs, even if that is less than you asked for.
        </p>
        <div className="band__cta" data-reveal style={{ '--d': '150ms' }}>
          <Link className="btn btn--solid" to="/contact">Ask us</Link>
          <a className="btn" href={`tel:${business.phone}`}>{business.phoneDisplay}</a>
        </div>
      </DiagonalMarquee>
    </>
  )
}
