import { useState } from 'react'
import { business, pageHeroes, services } from '../data'
import { WhatsAppIcon, waLink } from '../components/common'
import { PageBanner } from '../components/motion'

export default function Contact() {
  const [form, setForm] = useState({
    name: '', phone: '', type: services[0].title, message: '',
  })
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  // No backend: the enquiry is composed into a WhatsApp message the visitor sends.
  const submit = (e) => {
    e.preventDefault()
    const text =
      `Hi Designofiy! I'd like to enquire.\n\n` +
      `Name: ${form.name}\nPhone: ${form.phone}\nProject: ${form.type}\n\n${form.message}`
    window.open(waLink(text), '_blank', 'noopener')
    setSent(true)
  }

  const { address } = business

  return (
    <>
      <PageBanner
        {...pageHeroes.contact}
        eyebrow="Get in touch"
        title={<>Tell us about the <em>space</em>.</>}
        lede={`Consultations in ${business.city} are on us. Send a few lines about what you are planning and we will come back with a site visit slot.`}
      />

      <section className="section section--tight contact">
        <div className="contact__text" data-reveal>
          <h2 className="sr-head">Reach us</h2>
          <div className="contact__rows">
            <a className="crow" href={`tel:${business.phone}`}>
              <span>Phone</span><strong>{business.phoneDisplay}</strong>
            </a>
            <a className="crow" href={waLink('Hi Designofiy! I saw your website and would like to discuss a project.')} target="_blank" rel="noopener noreferrer">
              <span>WhatsApp</span><strong>Message us directly</strong>
            </a>
            <a className="crow" href={`mailto:${business.email}`}>
              <span>Email</span><strong>{business.email}</strong>
            </a>
            <a className="crow" href={business.instagram} target="_blank" rel="noopener noreferrer">
              <span>Instagram</span><strong>{business.instagramHandle}</strong>
            </a>
            <a
              className="crow"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.mapQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Studio</span>
              <strong>{address.line1}, {address.line2}, {address.city} {address.pin}</strong>
            </a>
            <div className="crow crow--static">
              <span>Hours</span>
              <strong>
                {business.hours.map(([d, h]) => <em key={d}>{d} — {h}</em>)}
              </strong>
            </div>
          </div>

          <a className="wa-inline" href={waLink('Hi Designofiy!')} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={22} />
            <span>Chat with us on WhatsApp</span>
          </a>
        </div>

        <form className="contact__form" onSubmit={submit} data-reveal>
          <h2>Start an enquiry</h2>
          <label>
            Your name
            <input required value={form.name} onChange={set('name')} placeholder="e.g. Ananya Verma" />
          </label>
          <label>
            Phone
            <input required type="tel" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile" />
          </label>
          <label>
            Project type
            <select value={form.type} onChange={set('type')}>
              {services.map((s) => <option key={s.id}>{s.title}</option>)}
              <option>Something else</option>
            </select>
          </label>
          <label>
            A little about the space
            <textarea
              rows="4"
              value={form.message}
              onChange={set('message')}
              placeholder="Size, location, what you have in mind, rough budget…"
            />
          </label>
          <button className="btn btn--full" type="submit">Send on WhatsApp</button>
          {sent && <p className="form__ok">WhatsApp should have opened — hit send there and we will reply shortly.</p>}
          <p className="form__note">
            This site has no server. Your details are only used to compose the message you send.
          </p>
        </form>
      </section>

      <section className="mapwrap" data-reveal>
        <iframe
          title="Designofiy studio location on Google Maps"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(business.mapQuery)}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  )
}
