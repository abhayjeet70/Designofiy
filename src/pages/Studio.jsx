import { Link } from 'react-router-dom'
import { business, marqueeImages, pageHeroes, photos, stats } from '../data'
import { Curtain, PageBanner } from '../components/motion'
import DiagonalMarquee from '../components/DiagonalMarquee'
import SlideUpText from '../components/SlideUpText'

export default function Studio() {
  return (
    <>
      <PageBanner
        {...pageHeroes.studio}
        eyebrow="The studio"
        title={<>Ten years of practice, <em>one</em> studio.</>}
        lede="Design and execution under one roof. One accountable team, rather than a designer pointing at a contractor."
      />

      <section className="section section--tight studio">
        <div className="studio__img">
          <Curtain src={photos.partition} alt="Reclaimed pine and steel partition" ratio="4/5" />
          <div className="studio__badge" data-reveal>
            <strong>Since 2022</strong>
            <span>as {business.legalName}</span>
          </div>
        </div>

        <div className="studio__text">
          <p data-reveal>
            Designofiy is an interior design and execution studio based in Vineet Khand,
            Gomti Nagar. We were formally incorporated as {business.legalName} on{' '}
            {business.incorporated}, but the practice behind it is a decade old and has
            delivered over a hundred projects across Lucknow.
          </p>
          <p data-reveal style={{ '--d': '80ms' }}>
            Every project is planned to a budget you set, with branded materials named in
            the quote and no line item you did not approve. We would rather talk you out of
            something than hand over a room you stop liking in a year.
          </p>
          <ul className="ticks" data-stagger>
            <li data-reveal>Design, procurement and execution handled in-house</li>
            <li data-reveal>Itemised quotes with 100% price transparency, no lump sums</li>
            <li data-reveal>Branded, anti-termite ply and soft-close hardware as standard</li>
            <li data-reveal>Weekly photo updates and a fixed, dated project schedule</li>
            <li data-reveal>Snag list closed and warranties documented at handover</li>
          </ul>
        </div>
      </section>

      <section className="statband statband--alt" data-stagger>
        {stats.map((s) => (
          <div key={s.label} data-reveal>
            <strong>{s.value}<span>{s.suffix}</span></strong>
            <p>{s.label}</p>
          </div>
        ))}
      </section>

      {/* What the studio actually spends its time on, shown rather than listed. */}
      <section className="section">
        <div className="section__head" data-reveal>
          <p className="eyebrow">Across the city</p>
          <h2><SlideUpText split="words" stagger={0.07} inView once>What we spend our time on.</SlideUpText></h2>

        </div>
        <div className="mosaic" data-stagger>
          {[
            [photos.livingWide, 'Living rooms'],
            [photos.kitchen, 'Kitchens'],
            [photos.wardrobeCorridor, 'Wardrobes'],
            [photos.bathroom, 'Bathrooms'],
            [photos.diningArched, 'Dining'],
            [photos.salon, 'Commercial'],
          ].map(([src, label]) => (
            <figure key={src} data-reveal>
              <img src={src} alt={label} loading="lazy" />
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section section--paper">
        <div className="section__head" data-reveal>
          <p className="eyebrow">On record</p>
          <h2><SlideUpText split="words" stagger={0.07} inView once>Registration details.</SlideUpText></h2>

        </div>
        <dl className="records" data-stagger>
          <div data-reveal><dt>Registered name</dt><dd>{business.legalName}</dd></div>
          <div data-reveal><dt>LLPIN</dt><dd>{business.llpin}</dd></div>
          <div data-reveal><dt>GSTIN</dt><dd>{business.gstin}</dd></div>
          <div data-reveal><dt>Incorporated</dt><dd>{business.incorporated}</dd></div>
          <div data-reveal><dt>Registered office</dt><dd>{business.address.line1}, {business.address.line2}, {business.address.city} {business.address.pin}</dd></div>
          <div data-reveal><dt>Service area</dt><dd>Lucknow and the surrounding belt</dd></div>
        </dl>
      </section>

      <DiagonalMarquee images={marqueeImages} angle={-16}>
        <h2 data-reveal>
          <SlideUpText split="words" stagger={0.08} inView once>
            Come see a site.
          </SlideUpText>
        </h2>
        <p data-reveal style={{ '--d': '80ms' }}>
          The fastest way to judge a studio is to stand in something it built. Ask us and we will arrange a visit.
        </p>
        <div className="band__cta" data-reveal style={{ '--d': '150ms' }}>
          <Link className="btn btn--solid" to="/contact">Arrange a visit</Link>
          <a className="btn" href={`tel:${business.phone}`}>{business.phoneDisplay}</a>
        </div>
      </DiagonalMarquee>
    </>
  )
}
