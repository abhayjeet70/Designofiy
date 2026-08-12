import { pageHeroes, photos, process } from '../data'
import { CtaBand } from '../components/common'
import { Curtain, PageBanner } from '../components/motion'

// One photograph per step, so the timeline reads as work rather than a list.
const STEP_IMAGES = [
  photos.diningOpen,
  photos.wardrobeShelving,
  photos.bedroomTerracotta,
  photos.wardrobeInterior,
  photos.kitchen,
  photos.livingWarm,
]

export default function Process() {
  return (
    <>
      <PageBanner
        {...pageHeroes.process}
        eyebrow="How we work"
        title={<>Six steps. You know the cost by the <em>fourth</em>.</>}
        lede="No stage begins before you have signed off on the one before it. Here is what happens, and when."
      />

      <section className="section section--tight">
        <ol className="steps">
          {process.map((p, i) => (
            <li key={p.step} className={i % 2 ? 'is-flipped' : ''}>
              <Curtain
                src={STEP_IMAGES[i]}
                alt={p.title}
                ratio="4/3"
                speed={i % 2 ? -0.1 : 0.1}
                className="steps__media"
              />
              <div className="steps__body">
                <span className="steps__num" data-reveal>{p.step}</span>
                <h2 data-reveal style={{ '--d': '70ms' }}>{p.title}</h2>
                <p data-reveal style={{ '--d': '140ms' }}>{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section section--alt">
        <div className="section__head" data-reveal>
          <p className="eyebrow">Typical Timelines</p>
          <h2>How long it usually takes.</h2>
          <p className="lede">
            Measured from design sign-off. Civil work and fully custom furniture are the two
            things that move these numbers.
          </p>
        </div>
        <div className="timings" data-stagger>
          <div data-reveal><strong>3 – 4 weeks</strong><span>Modular kitchen</span></div>
          <div data-reveal><strong>3 – 5 weeks</strong><span>Wardrobe wall</span></div>
          <div data-reveal><strong>4 – 6 weeks</strong><span>Single room or styling</span></div>
          <div data-reveal><strong>45 – 75 days</strong><span>2–3 BHK turnkey</span></div>
        </div>
      </section>

      <CtaBand
        title="Ready for step one?"
        body="Step one is a conversation, and it costs nothing. Tell us about the space and we will take it from there."
        cta="Start the conversation"
      />
    </>
  )
}
