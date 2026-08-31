import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IsoDocs, IsoIhram, IsoTawaf, IsoKaaba, IsoShield } from '../components/Illustrations';

const PREP = [
  {
    tag: 'Legal',
    title: 'Documents & permits',
    Art: IsoDocs,
    items: [
      'Passport valid for at least 6 months beyond your travel date',
      'Umrah visa — included in most packages listed on Pilgrym',
      'Nusuk app account for your Umrah and Rawdah permits',
      'Rawdah permit booked early; slots open on a rolling window',
      'Vaccination records as required for the season',
    ],
  },
  {
    tag: 'Spiritual',
    title: 'Preparing your heart',
    Art: IsoKaaba,
    items: [
      'Make your niyyah (intention) clear and only for the sake of Allah',
      'Learn the Talbiyah by heart before you leave',
      'Memorise a handful of duas you want to make at the Kaaba',
      'Read about the significance of each site you will visit',
      'Settle debts and seek forgiveness from those around you',
    ],
  },
  {
    tag: 'Practical',
    title: 'What to pack',
    Art: IsoIhram,
    items: [
      'Two sets of ihram for men; modest loose clothing for women',
      'Unscented soap, toothpaste and toiletries (no fragrance in ihram)',
      'Comfortable slip-on sandals plus a drawstring shoe bag',
      'A light prayer mat, small Quran and a foldable water bottle',
      'Universal adapter, power bank and a printed copy of your itinerary',
    ],
  },
];

const RITUALS = [
  {
    n: '01',
    name: 'Miqat & Ihram',
    body:
      'Before crossing the Miqat boundary you bathe, wear the two white cloths, and make your intention. From this moment the restrictions of ihram apply — no perfume, no cutting hair or nails, no arguing.',
  },
  {
    n: '02',
    name: 'Tawaf',
    body:
      'Seven circuits of the Kaaba, anticlockwise, beginning and ending at the Black Stone. Men perform ramal — a brisk walk — in the first three circuits. Pray two rakah at Maqam Ibrahim afterwards.',
  },
  {
    n: '03',
    name: "Sa'i",
    body:
      'Seven trips between Safa and Marwah, retracing Hajar\'s search for water for her son. The distance is around 3.5km in total, on smooth marble under cover.',
  },
  {
    n: '04',
    name: 'Halq or Taqsir',
    body:
      'Men shave the head (halq) or trim it (taqsir); women trim a fingertip length. With this your Umrah is complete and the restrictions of ihram are lifted.',
  },
];

const RESOURCES = [
  {
    title: 'Health & safety in the Haram',
    body:
      'The Haram is one of the busiest places on earth. Stay hydrated with Zamzam throughout the day, carry a small card with your hotel name and room number in Arabic, and agree a meeting point with your group before every prayer. If you have a chronic condition, carry a week of extra medication in your hand luggage with the prescription. Avoid peak tawaf times if you are travelling with elders — after Fajr and late at night are far calmer than after Maghrib.',
  },
  {
    title: 'Ihram 101 — the rules people get wrong',
    body:
      'Scented soap, deodorant and even scented tissues break ihram, so buy unscented versions before you fly. Men must leave the head uncovered and wear no stitched clothing; women wear ordinary modest clothing but leave the face and hands uncovered. Cutting hair or nails, plucking, arguing, and any intimacy are all prohibited until you complete the rites. Sheltering under an umbrella, washing, and changing your ihram cloths are all permitted.',
  },
  {
    title: 'Before you travel — the week before',
    body:
      'Confirm your visa is issued and your Rawdah permit is booked. Take photos of your passport, visa and package confirmation and store them offline on your phone. Get some Saudi Riyals in cash for small purchases even if you plan to use cards. Tell your bank you are travelling. Print your itinerary with the agency contact number on it, and leave a copy with family at home.',
  },
];

const CHECKLIST = [
  'Passport valid 6+ months',
  'Umrah visa confirmed',
  'Nusuk account set up',
  'Rawdah permit booked',
  'Ihram (2 sets) packed',
  'Unscented toiletries',
  'Comfortable sandals + shoe bag',
  'Medication + prescriptions',
  'Saudi Riyals in cash',
  'Offline copies of documents',
  'Agency contact saved',
  'Duas list written down',
];

const FirstTimerGuide = () => {
  const [checked, setChecked] = useState([]);
  const [openResource, setOpenResource] = useState(0);

  const toggle = (item) =>
    setChecked((c) => (c.includes(item) ? c.filter((x) => x !== item) : [...c, item]));

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-900">
        <div className="absolute inset-0">
          <img src="/images/kaaba-aerial.jpg" alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-900/85 to-primary-800/60" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="badge bg-white/10 text-gold-200">First timer guide</span>
            <h1 className="text-balance mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Embarking on your first sacred journey
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-primary-100/90">
              From the moment you form the intention to the moment you stand before the Kaaba, there is a lot to
              arrange and a lot to feel. This guide gives you both — the spiritual preparation and the practical
              clarity — so nothing distracts you once you arrive.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#ritual-path" className="btn-gold">See the ritual path</a>
              <a href="#checklist" className="btn-secondary !border-white/40 !bg-white/10 !text-white hover:!bg-white/20">
                Open the checklist
              </a>
            </div>
          </div>

          <div className="scene-3d hidden lg:block">
            <div className="tilt-left relative mx-auto h-80 w-full max-w-md">
              <IsoKaaba className="float-slow absolute left-8 top-4 h-56 w-56 drop-shadow-2xl" />
              <div className="glass-panel float-slower absolute bottom-4 right-0 w-64 rounded-2xl p-5 shadow-cardHover">
                <p className="text-xs uppercase tracking-wide text-gold-200">The four rites</p>
                <ol className="mt-2 space-y-1.5 text-sm text-white">
                  {RITUALS.map((r) => (
                    <li key={r.name} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gold-300">{r.n}</span>
                      {r.name}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Essential preparation */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <span className="badge bg-primary-50 text-primary-700">Essential preparation</span>
          <h2 className="text-balance mx-auto mt-3 max-w-2xl text-3xl font-semibold text-primary-900 sm:text-4xl">
            Three things to settle before you fly
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-primary-600">
            Get these right and the rest of the trip takes care of itself.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PREP.map((p) => (
            <div key={p.title} className="lift-3d card overflow-hidden">
              <div className="scene-3d flex justify-center bg-gradient-to-br from-primary-50 to-white pb-2 pt-6">
                <p.Art className="tilt-flat h-32 w-32" />
              </div>
              <div className="p-6">
                <span className="badge bg-primary-100 text-primary-800">{p.tag}</span>
                <h3 className="mt-2 text-lg font-semibold text-primary-900">{p.title}</h3>
                <ul className="mt-3 space-y-2">
                  {p.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-relaxed text-primary-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ritual path */}
      <section id="ritual-path" className="scroll-mt-20 bg-primary-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <span className="badge bg-white/10 text-gold-200">The ritual path</span>
              <h2 className="text-balance mt-3 text-3xl font-semibold text-white sm:text-4xl">
                What actually happens, in order
              </h2>
              <p className="mt-3 max-w-2xl text-primary-100/80">
                Umrah is four rites performed in sequence. Read them once now and once on the plane — that is all
                it takes to walk in without hesitation.
              </p>
            </div>
            <div className="scene-3d hidden justify-self-end lg:block">
              <IsoTawaf className="tilt-right h-48 w-48" />
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {RITUALS.map((r, i) => (
              <div key={r.name} className="glass-panel relative rounded-2xl p-6">
                <span className="text-3xl font-bold text-gold-300/60">{r.n}</span>
                <h3 className="mt-2 text-lg font-semibold text-white">{r.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-100/85">{r.body}</p>
                {i < RITUALS.length - 1 && (
                  <span className="absolute -right-3 top-1/2 hidden text-2xl text-white/25 lg:block">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section id="checklist" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <span className="badge bg-primary-50 text-primary-700">Your checklist</span>
            <h2 className="text-balance mt-3 text-3xl font-semibold text-primary-900">
              Tick these off before you leave home
            </h2>
            <p className="mt-2 text-primary-600">
              {checked.length} of {CHECKLIST.length} done
            </p>
            <div className="mt-3 h-2 w-full max-w-sm overflow-hidden rounded-full bg-primary-100">
              <div
                className="h-full rounded-full bg-gold-400 transition-all duration-500"
                style={{ width: `${(checked.length / CHECKLIST.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="scene-3d hidden justify-self-end md:block">
            <IsoShield className="tilt-left h-36 w-36" />
          </div>
        </div>

        <div className="mt-8 grid gap-2 sm:grid-cols-2">
          {CHECKLIST.map((item) => {
            const done = checked.includes(item);
            return (
              <label
                key={item}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm transition ${
                  done
                    ? 'border-gold-200 bg-gold-50 font-medium text-primary-900'
                    : 'border-primary-100 bg-white text-primary-700 hover:border-primary-200'
                }`}
              >
                <input type="checkbox" checked={done} onChange={() => toggle(item)} className="h-4 w-4 accent-gold-500" />
                <span className={done ? 'line-through decoration-gold-500/50' : ''}>{item}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Guided resources */}
      <section className="bg-primary-50/70 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <span className="badge bg-white text-primary-700">Guided resources</span>
            <h2 className="text-balance mt-3 text-3xl font-semibold text-primary-900">
              The three things first timers ask us most
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {RESOURCES.map((r, i) => (
              <div key={r.title} className="card overflow-hidden">
                <button
                  onClick={() => setOpenResource(openResource === i ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-primary-900">{r.title}</span>
                  <span className="text-xl text-primary-400">{openResource === i ? '−' : '+'}</span>
                </button>
                {openResource === i && (
                  <p className="px-6 pb-6 text-sm leading-relaxed text-primary-600">{r.body}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/madinah-arches.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-primary-900/85" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
            Ready to book your first journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-100/90">
            Several agencies on Pilgrym run departures built specifically around first timers, with a pre-departure
            briefing before you fly and a guide with the group throughout.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/packages" className="btn-gold">Browse packages</Link>
            <Link to="/how-it-works" className="btn-secondary !border-white/40 !bg-white/10 !text-white hover:!bg-white/20">
              How Pilgrym works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FirstTimerGuide;
