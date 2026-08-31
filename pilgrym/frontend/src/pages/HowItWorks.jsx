import React from 'react';
import { Link } from 'react-router-dom';
import {
  IsoCardStack,
  IsoCompare,
  IsoShield,
  IsoBooking,
  IsoChaos,
  IsoKaaba,
} from '../components/Illustrations';

const PAINS = [
  {
    title: '"Just message this uncle"',
    body:
      'A WhatsApp forward, a phone number, a price with no breakdown. You end up trusting a screenshot with the most important journey of your life.',
  },
  {
    title: 'Every quote hides something different',
    body:
      'One includes the visa, one does not. One says "walking distance" and means 1.4km. There is no common format, so nothing is actually comparable.',
  },
  {
    title: 'No way to check who is real',
    body:
      'Sri Lankan families have been burned by agencies that vanished after collecting deposits. Nothing on a flyer tells you who has actually run trips.',
  },
];

const FIXES = [
  {
    before: 'Six WhatsApp chats and a notebook',
    after: 'Every package on one page, in one format',
  },
  {
    before: '"Price on request"',
    after: 'Full LKR price per person, shown upfront',
  },
  {
    before: '"Close to the Haram"',
    after: 'Exact distance in metres to Makkah and Madinah',
  },
  {
    before: 'Hope the agency is legitimate',
    after: 'Admin-reviewed listings and Verified Agency badges',
  },
  {
    before: 'Inclusions discovered at the airport',
    after: 'Visa, flights, transport and ziyarah listed per package',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Tell us your budget and month',
    body:
      'Set a price range and the month you can travel. We only show departures that actually exist on those dates — no bait listings, no "call for details".',
    Art: IsoCardStack,
    points: ['Filter by budget in LKR', 'Pick any departure month', 'Umrah or Hajj'],
  },
  {
    n: '02',
    title: 'Compare like for like',
    body:
      'Put up to three packages side by side. Hotel distance, duration, star rating, inclusions and price sit in the same columns, so the real difference is obvious in seconds.',
    Art: IsoCompare,
    points: ['Distance to Haram in metres', 'What is genuinely included', 'Slots left on each departure'],
  },
  {
    n: '03',
    title: 'Check the agency behind it',
    body:
      'Open "About the agency" on any package to see how long they have been operating, how many pilgrims they have taken, their recent trips, photos and customer reviews.',
    Art: IsoShield,
    points: ['Years operating and trip history', 'Real customer reviews', 'Verified Agency badge'],
  },
  {
    n: '04',
    title: 'Send a booking request',
    body:
      'Request your seats through Pilgrym. The agency confirms in your account, and you keep a record of exactly what was promised at the price you agreed.',
    Art: IsoBooking,
    points: ['Track status in your account', 'Written record of inclusions', 'Free cancellation window shown'],
  },
];

const HowItWorks = () => (
  <div>
    {/* Hero */}
    <section className="relative overflow-hidden bg-primary-900">
      <div className="absolute inset-0">
        <img src="/images/kaaba-night.jpg" alt="" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-900/85 to-primary-800/70" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <div>
          <span className="badge bg-white/10 text-gold-200">How Pilgrym works</span>
          <h1 className="text-balance mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Your Umrah shouldn't start with a leap of faith.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-primary-100/90">
            Most pilgrims plan the most important trip of their life through forwarded flyers and half-answered
            phone calls. Pilgrym puts every package into one honest format — so you compare facts, not promises.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/packages" className="btn-gold">Browse packages</Link>
            <Link to="/first-timer-guide" className="btn-secondary !border-white/40 !bg-white/10 !text-white hover:!bg-white/20">
              First time travelling?
            </Link>
          </div>
        </div>

        {/* 3D composition */}
        <div className="scene-3d relative hidden lg:block">
          <div className="tilt-left relative mx-auto h-80 w-full max-w-md">
            <div className="glass-panel float-slow absolute left-0 top-4 w-64 rounded-2xl p-4 shadow-cardHover">
              <p className="text-xs uppercase tracking-wide text-gold-200">Premium Umrah</p>
              <p className="mt-1 text-2xl font-bold text-white">LKR 299,000</p>
              <div className="mt-3 space-y-1.5 text-xs text-primary-50/90">
                <p>✓ Visa · Flights · Transport</p>
                <p>✓ 150m from the Haram</p>
                <p>✓ 12 days · 5★ hotels</p>
              </div>
            </div>
            <div className="glass-panel float-slower absolute right-0 top-36 w-60 rounded-2xl p-4 shadow-cardHover">
              <p className="text-xs uppercase tracking-wide text-gold-200">Classic Umrah</p>
              <p className="mt-1 text-2xl font-bold text-white">LKR 189,000</p>
              <div className="mt-3 space-y-1.5 text-xs text-primary-50/90">
                <p>✓ Visa · Flights · Transport</p>
                <p>✓ 600m from the Haram</p>
                <p>✓ 7 days · 3★ hotels</p>
              </div>
            </div>
            <IsoKaaba className="float-slow absolute -left-6 bottom-0 h-44 w-44 drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>

    {/* The pain */}
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
        <div>
          <span className="badge bg-red-50 text-red-700">The problem</span>
          <h2 className="text-balance mt-3 text-3xl font-semibold text-primary-900 sm:text-4xl">
            Booking Umrah today is guesswork dressed up as choice.
          </h2>
          <p className="mt-3 max-w-2xl text-primary-600">
            You are not being careless. The information simply is not published anywhere you can check it.
          </p>
        </div>
        <div className="scene-3d hidden justify-self-end lg:block">
          <IsoChaos className="tilt-right h-48 w-48" />
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {PAINS.map((p) => (
          <div key={p.title} className="lift-3d card border-l-4 border-l-red-300 p-6">
            <h3 className="font-semibold text-primary-900">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-primary-600">{p.body}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Before / after */}
    <section className="bg-primary-900 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <span className="badge bg-white/10 text-gold-200">The shift</span>
          <h2 className="text-balance mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Same journey. Completely different way of choosing it.
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-white/15">
          <div className="grid grid-cols-2 bg-white/5 text-sm font-semibold uppercase tracking-wide">
            <p className="px-5 py-3 text-primary-200/70">Without Pilgrym</p>
            <p className="border-l border-white/15 px-5 py-3 text-gold-200">With Pilgrym</p>
          </div>
          {FIXES.map((f, i) => (
            <div key={f.after} className={`grid grid-cols-2 text-sm ${i % 2 ? 'bg-white/[0.03]' : ''}`}>
              <p className="flex items-start gap-2 px-5 py-4 text-primary-100/60">
                <span className="mt-0.5 text-red-300">✕</span>
                <span className="line-through decoration-white/25">{f.before}</span>
              </p>
              <p className="flex items-start gap-2 border-l border-white/15 px-5 py-4 font-medium text-white">
                <span className="mt-0.5 text-gold-300">✓</span>
                {f.after}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Steps */}
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <span className="badge bg-primary-50 text-primary-700">Four steps</span>
        <h2 className="text-balance mx-auto mt-3 max-w-2xl text-3xl font-semibold text-primary-900 sm:text-4xl">
          From "where do I even start" to a confirmed seat
        </h2>
      </div>

      <div className="mt-14 space-y-14">
        {STEPS.map((step, i) => (
          <div
            key={step.n}
            className={`grid items-center gap-8 md:grid-cols-2 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}
          >
            <div className="scene-3d flex justify-center">
              <div className={`relative rounded-3xl bg-gradient-to-br from-primary-50 to-white p-8 shadow-card ${i % 2 ? 'tilt-right' : 'tilt-left'}`}>
                <step.Art className="h-44 w-44 sm:h-52 sm:w-52" />
                <span className="absolute -left-3 -top-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-900 text-sm font-bold text-gold-300 shadow-cardHover">
                  {step.n}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-primary-900">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-primary-600">{step.body}</p>
              <ul className="mt-4 space-y-2">
                {step.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm font-medium text-primary-800">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M4 10.5l3.5 3.5L16 5" stroke="#154744" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Assurance strip */}
    <section className="bg-primary-50/70 py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3">
        {[
          ['Reviewed before it goes live', 'No listing appears on Pilgrym until our team has checked the agency and the details on it.'],
          ['Nothing hidden until checkout', 'Price, inclusions, hotel distance and cancellation window are all on the listing itself.'],
          ['Built for Sri Lankan pilgrims', 'Prices in LKR, departures from Colombo, and support in the language your family speaks.'],
        ].map(([title, body]) => (
          <div key={title} className="lift-3d card p-6">
            <h3 className="font-semibold text-primary-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-primary-600">{body}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
      <h2 className="text-balance text-3xl font-semibold text-primary-900">Ready to compare real packages?</h2>
      <p className="mx-auto mt-3 max-w-xl text-primary-600">
        Every departure listed on Pilgrym has a price, a date, an agency and a review trail behind it.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to="/packages" className="btn-primary">Find packages</Link>
        <Link to="/for-agencies" className="btn-secondary">I run an agency</Link>
      </div>
    </section>
  </div>
);

export default HowItWorks;
