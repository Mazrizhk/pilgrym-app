import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPackages } from '../api/packages';
import { getHeroImages } from '../api/settings';
import PackageCard from '../components/PackageCard';
import HeroCarousel from '../components/HeroCarousel';

const DEFAULT_HERO_IMAGES = [
  '/images/hero-kaaba-day.jpg',
  '/images/kaaba-aerial.jpg',
  '/images/kaaba-clocktower.jpg',
  '/images/kaaba-night.jpg',
  '/images/kaaba-skyline.jpg',
];

const FAQS = [
  {
    q: 'Do I need a visa for Umrah?',
    a: 'Yes. Most packages listed on Pilgrym include the Umrah visa in the price — look for the "Visa Included" tag on each package before booking.',
  },
  {
    q: 'What is included in the package?',
    a: 'Every listing spells out exactly what is included: hotel category, distance to Haram, flights, transport and guided ziyarah. Nothing is hidden until checkout.',
  },
  {
    q: 'How can I pay?',
    a: 'Payments are made securely and can be split as a deposit plus balance, depending on the agency you book with.',
  },
  {
    q: 'Can I customize a package?',
    a: 'Many agencies are open to customizing group size, room type or add-on days — message them from the package page once you have created an account.',
  },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const monthLabel = (date) =>
  new Date(date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

// Departures come back sorted ascending from the API, so grouping in order
// gives us "this month first, then next month" without any extra sorting.
const groupByMonth = (packages) =>
  packages.reduce((groups, pkg) => {
    const key = monthLabel(pkg.departureDate);
    const existing = groups.find((g) => g.label === key);
    if (existing) existing.items.push(pkg);
    else groups.push({ label: key, items: [pkg] });
    return groups;
  }, []);

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImages, setHeroImages] = useState(DEFAULT_HERO_IMAGES);
  const [activeSlide, setActiveSlide] = useState(0);
  const [search, setSearch] = useState({ type: 'Umrah', minPrice: '', maxPrice: '', departureMonth: '' });
  const [openFaq, setOpenFaq] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Next departures first: anything from the current month onwards, earliest first.
    getPackages({ sort: 'departure', upcoming: 'true', limit: 6 })
      .then((data) => setPackages(data.packages))
      .finally(() => setLoading(false));
    getHeroImages()
      .then((images) => images?.length && setHeroImages(images))
      .catch(() => {});
  }, []);

  const departureGroups = groupByMonth(packages);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.type) params.set('type', search.type);
    if (search.minPrice) params.set('minPrice', search.minPrice);
    if (search.maxPrice) params.set('maxPrice', search.maxPrice);
    if (search.departureMonth) params.set('departureMonth', search.departureMonth);
    navigate(`/packages?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero — fixed height so swiping to a textless slide never resizes the section */}
      <section className="relative h-[440px] sm:h-[480px] lg:h-[500px]">
        <HeroCarousel images={heroImages} onIndexChange={setActiveSlide} />

        {/* Marketing copy only shows on the first slide; slides 2-5 are shown as
            plain uploaded images (e.g. for agency banners), with no text over them. */}
        {activeSlide === 0 && (
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="mx-auto w-full max-w-7xl px-14 pt-8 sm:px-16 sm:pt-12 xl:px-6 xl:pt-16">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-semibold leading-tight text-white sm:text-5xl">
                  Compare Hajj &amp; Umrah Packages with Confidence
                </h1>
                <p className="mt-3 max-w-xl text-sm text-primary-100/90 sm:hidden">
                  Compare packages from verified agencies.
                </p>
                <p className="mt-4 hidden max-w-xl text-primary-100/90 sm:block">
                  Find the right package from verified agencies. Transparent details, best value, peace of mind — all in one place.
                </p>
                <div className="mt-6 hidden gap-3 text-sm text-primary-50 sm:grid sm:grid-cols-4">
                  {['Verified Agencies', 'Secure Payments', 'Sri Lanka Support', 'Transparent Pricing'].map((t) => (
                    <div key={t} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10.5l3.5 3.5L16 5" stroke="#e5b332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search bar — pinned so it straddles the seam with the next section */}
        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-1/2 px-4 sm:px-6">
          <form onSubmit={handleSearch} className="mx-auto max-w-6xl rounded-2xl bg-white p-3 shadow-cardHover">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <label className="block">
                <span className="mb-1 block px-1 text-xs font-semibold uppercase tracking-wide text-primary-500">Journey</span>
                <select
                  className="input-field"
                  value={search.type}
                  onChange={(e) => setSearch((s) => ({ ...s, type: e.target.value }))}
                >
                  <option value="Umrah">Umrah</option>
                  <option value="Hajj">Hajj</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block px-1 text-xs font-semibold uppercase tracking-wide text-primary-500">Min budget</span>
                <input
                  type="number"
                  min="0"
                  placeholder="LKR 150,000"
                  className="input-field"
                  value={search.minPrice}
                  onChange={(e) => setSearch((s) => ({ ...s, minPrice: e.target.value }))}
                />
              </label>

              <label className="block">
                <span className="mb-1 block px-1 text-xs font-semibold uppercase tracking-wide text-primary-500">Max budget</span>
                <input
                  type="number"
                  min="0"
                  placeholder="LKR 400,000"
                  className="input-field"
                  value={search.maxPrice}
                  onChange={(e) => setSearch((s) => ({ ...s, maxPrice: e.target.value }))}
                />
              </label>

              <label className="block">
                <span className="mb-1 block px-1 text-xs font-semibold uppercase tracking-wide text-primary-500">Departure month</span>
                <select
                  className="input-field"
                  value={search.departureMonth}
                  onChange={(e) => setSearch((s) => ({ ...s, departureMonth: e.target.value }))}
                >
                  <option value="">Any month</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
              </label>

              <div className="flex items-end">
                <button type="submit" className="btn-primary w-full">Find Packages</button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Upcoming departures */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-48 sm:px-6 sm:pt-32 lg:pt-20">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-primary-900">Upcoming Departures</h2>
            <p className="mt-1 text-sm text-primary-600">
              Packages leaving next, soonest first — starting with this month.
            </p>
          </div>
          <Link to="/packages" className="text-sm font-semibold text-primary-700 hover:text-primary-900">
            View all packages →
          </Link>
        </div>

        {loading ? (
          <p className="text-primary-600">Loading departures…</p>
        ) : packages.length === 0 ? (
          <p className="text-primary-600">
            No upcoming departures published yet. Once a vendor lists a package and it's approved, it will show up here.
          </p>
        ) : (
          <div className="space-y-8">
            {departureGroups.map((group) => (
              <div key={group.label}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="badge bg-gold-100 text-gold-600">Departing {group.label}</span>
                  <span className="h-px flex-1 bg-primary-100" />
                  <span className="text-xs text-primary-500">
                    {group.items.length} {group.items.length === 1 ? 'package' : 'packages'}
                  </span>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {group.items.map((pkg) => (
                    <PackageCard key={pkg._id} pkg={pkg} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-primary-50/60 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3">
          {[
            { n: 1, title: 'Search & Compare', desc: 'Filter packages by your preferences and budget.' },
            { n: 2, title: 'Choose with Confidence', desc: 'View verified agency details, reviews and inclusions.' },
            { n: 3, title: 'Book Securely', desc: 'Pay safely online or get help from our team.' },
          ].map((step) => (
            <div key={step.n} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-800 text-lg font-semibold text-white">
                {step.n}
              </div>
              <h3 className="font-semibold text-primary-900">{step.title}</h3>
              <p className="mt-1 text-sm text-primary-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* First timer + trusted agencies */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card p-8">
            <h3 className="text-xl font-semibold text-primary-900">First Time for Umrah?</h3>
            <p className="mt-1 text-sm text-primary-600">We guide you every step of the way.</p>
            <ul className="mt-4 space-y-2 text-sm text-primary-700">
              {['What to pack', 'Visa & documents', 'Ihram & prayers guide', 'Travel & stay tips'].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M4 10.5l3.5 3.5L16 5" stroke="#154744" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {i}
                </li>
              ))}
            </ul>
            <Link to="/first-timer-guide" className="btn-secondary mt-5 inline-flex">Explore First Timer Guide</Link>
          </div>

          <div className="card p-8">
            <h3 className="text-xl font-semibold text-primary-900">Trusted by Leading Agencies</h3>
            <p className="mt-1 text-sm text-primary-600">Every agency is reviewed before their packages go live.</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-medium text-primary-700">
              {['ZamZam Travels', 'Rayyan Travels', 'Noor Travels', 'Safa Holidays'].map((a) => (
                <div key={a} className="rounded-xl border border-primary-100 px-3 py-2.5">{a}</div>
              ))}
            </div>
            <Link to="/for-agencies" className="mt-5 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900">
              List your agency on Pilgrym →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <h2 className="mb-6 text-2xl font-semibold text-primary-900">Frequently Asked Questions</h2>
        <div className="divide-y divide-primary-100 rounded-2xl border border-primary-100 bg-white">
          {FAQS.map((f, idx) => (
            <div key={f.q}>
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-primary-900"
              >
                {f.q}
                <span className="text-primary-500">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && <p className="px-5 pb-4 text-sm text-primary-600">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
