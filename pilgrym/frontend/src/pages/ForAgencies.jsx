import React from 'react';
import { Link } from 'react-router-dom';
import { IsoGrowth, IsoShield, IsoCardStack, IsoBooking } from '../components/Illustrations';

const BENEFITS = [
  {
    title: 'Reach pilgrims already deciding',
    body:
      'Everyone on Pilgrym is comparing packages right now, with a budget and a month in mind. You are not paying to interrupt strangers — you are appearing in front of people at the point of choice.',
    Art: IsoCardStack,
  },
  {
    title: 'Compete on substance, not shouting',
    body:
      'Your hotel distance, inclusions and star rating sit in the same columns as everyone else. If your package is genuinely better value, the comparison shows it without you saying a word.',
    Art: IsoGrowth,
  },
  {
    title: 'Build a reputation that follows you',
    body:
      'Your agency profile carries your years of operation, trip history, photos and customer reviews. Every good departure compounds into the next booking.',
    Art: IsoShield,
  },
  {
    title: 'Booking requests, not missed calls',
    body:
      'Requests arrive in your dashboard with traveller count, contact number and notes. Confirm or decline in one click, and seat counts update themselves.',
    Art: IsoBooking,
  },
];

const FEATURES = [
  ['Unlimited package listings', 'List every departure you run — Umrah, Hajj, Ramadan specials and group charters.'],
  ['Drag-and-drop photo uploads', 'Upload your own trip photography and your agency logo straight from the package form.'],
  ['Customer reviews on your listings', 'Add reviews from pilgrims who have travelled with you, shown on your packages and profile.'],
  ['Live seat management', 'Total slots and remaining seats update automatically as you confirm bookings.'],
  ['Verified Agency badge', 'Once our team has checked your credentials, the badge appears beside your name everywhere.'],
  ['A public agency page', 'Years operating, trips completed, pilgrims travelled, photos and reviews — all in one place.'],
];

const STEPS = [
  ['Register your agency', 'Create a vendor account with your agency name and contact details. Takes two minutes.'],
  ['List your packages', 'Add price, dates, hotel distances, inclusions, photos and your logo.'],
  ['Get reviewed', 'Our team checks each listing before it goes live, so buyers trust what they see.'],
  ['Receive bookings', 'Requests land in your dashboard. Confirm, and the seat count takes care of itself.'],
];

const ForAgencies = () => (
  <div>
    {/* Hero */}
    <section className="relative overflow-hidden bg-primary-900">
      <div className="absolute inset-0">
        <img src="/images/kaaba-skyline.jpg" alt="" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-900/85 to-primary-800/70" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <div>
          <span className="badge bg-white/10 text-gold-200">For agencies</span>
          <h1 className="text-balance mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Your packages deserve to be seen next to the competition.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-primary-100/90">
            If you run honest trips at fair prices, comparison is your best salesperson. List on Pilgrym and let
            Sri Lankan pilgrims see exactly what you offer — hotel distance, inclusions, price and reviews — beside
            everyone else.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-gold">Register your agency</Link>
            <Link to="/packages" className="btn-secondary !border-white/40 !bg-white/10 !text-white hover:!bg-white/20">
              See how listings look
            </Link>
          </div>
          <p className="mt-4 text-sm text-primary-200/70">Free to list · Reviewed within 48 hours · No commission on requests</p>
        </div>

        <div className="scene-3d hidden lg:block">
          <div className="tilt-right relative mx-auto h-80 w-full max-w-md">
            <div className="glass-panel float-slow absolute right-2 top-2 w-72 rounded-2xl p-5 shadow-cardHover">
              <p className="text-xs uppercase tracking-wide text-gold-200">This month</p>
              <p className="mt-1 text-3xl font-bold text-white">18 requests</p>
              <div className="mt-4 flex items-end gap-1.5">
                {[35, 52, 44, 68, 60, 88].map((h, i) => (
                  <span
                    key={i}
                    className={`w-6 rounded-t ${i === 5 ? 'bg-gold-400' : 'bg-white/25'}`}
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>
            <IsoGrowth className="float-slower absolute -left-4 bottom-0 h-48 w-48 drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <span className="badge bg-primary-50 text-primary-700">Why list with us</span>
        <h2 className="text-balance mx-auto mt-3 max-w-2xl text-3xl font-semibold text-primary-900 sm:text-4xl">
          Four things a listing on Pilgrym does for your agency
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {BENEFITS.map((b) => (
          <div key={b.title} className="lift-3d card flex flex-col gap-5 p-7 sm:flex-row sm:items-start">
            <div className="scene-3d shrink-0">
              <div className="tilt-left rounded-2xl bg-gradient-to-br from-primary-50 to-white p-3">
                <b.Art className="h-24 w-24" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-900">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-600">{b.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* What you get */}
    <section className="bg-primary-900 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="badge bg-white/10 text-gold-200">What's included</span>
          <h2 className="text-balance mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Everything you need to sell a trip properly
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(([title, body]) => (
            <div key={title} className="glass-panel rounded-2xl p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/90">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10.5l3.5 3.5L16 5" stroke="#0d3230" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-primary-100/80">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How to get listed */}
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <span className="badge bg-primary-50 text-primary-700">Getting started</span>
        <h2 className="text-balance mt-3 text-3xl font-semibold text-primary-900 sm:text-4xl">
          Listed and live in four steps
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-4">
        {STEPS.map(([title, body], i) => (
          <div key={title} className="relative">
            <div className="lift-3d card h-full p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-900 text-sm font-bold text-gold-300">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-semibold text-primary-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-primary-600">{body}</p>
            </div>
            {i < STEPS.length - 1 && (
              <span className="absolute -right-3 top-1/2 hidden text-2xl text-primary-200 md:block">→</span>
            )}
          </div>
        ))}
      </div>
    </section>

    {/* Trust note + CTA */}
    <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
      <div className="card overflow-hidden">
        <div className="grid gap-8 p-8 sm:p-10 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-primary-900">A word on the review process</h2>
            <p className="mt-3 leading-relaxed text-primary-600">
              Every listing is checked by our team before it is published, and any edit to a live listing goes back
              through review. It is a small amount of friction for you, and it is the entire reason travellers trust
              what they read here. Agencies that pass our credential check also carry a{' '}
              <span className="font-semibold text-primary-800">Verified Agency</span> badge on every package.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary">Register your agency</Link>
              <Link to="/how-it-works" className="btn-secondary">How the platform works</Link>
            </div>
          </div>
          <div className="scene-3d flex justify-center">
            <IsoShield className="tilt-right h-44 w-44" />
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default ForAgencies;
