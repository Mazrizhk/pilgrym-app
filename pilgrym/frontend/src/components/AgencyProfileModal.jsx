import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAgencyProfile } from '../api/packages';
import Modal from './Modal';
import Stars from './Stars';

const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const shortDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const TABS = ['Overview', 'Reviews', 'Trips', 'Photos'];

const AgencyProfileModal = ({ agencyId, agencyName, onClose }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('Overview');

  useEffect(() => {
    getAgencyProfile(agencyId)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [agencyId]);

  const title = data?.agency?.agencyName || agencyName || 'Agency';

  return (
    <Modal title={`About ${title}`} onClose={onClose} maxWidth="max-w-3xl">
      {error ? (
        <p className="py-8 text-center text-red-600">{error}</p>
      ) : !data ? (
        <p className="py-8 text-center text-primary-500">Loading agency profile…</p>
      ) : (
        <div>
          {/* Identity */}
          <div className="flex flex-wrap items-center gap-4 border-b border-primary-100 pb-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary-100 bg-white">
              {data.agency.agencyLogo ? (
                <img src={data.agency.agencyLogo} alt={`${title} logo`} className="max-h-14 max-w-14 object-contain" />
              ) : (
                <span className="text-lg font-bold text-primary-700">{initials(title)}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-lg font-semibold text-primary-900">{title}</h4>
                {data.agency.agencyVerified && (
                  <span className="badge bg-primary-100 text-primary-800">✓ Verified Agency</span>
                )}
              </div>
              <p className="text-sm text-primary-600">
                {data.agency.agencyLocation || 'Sri Lanka'} · Operating since {data.stats.foundedYear}
              </p>
              {data.stats.averageRating > 0 && (
                <div className="mt-1 flex items-center gap-1.5 text-sm text-primary-700">
                  <Stars value={data.stats.averageRating} />
                  <span className="font-semibold">{data.stats.averageRating.toFixed(1)}</span>
                  <span className="text-primary-400">({data.stats.reviewsCount} reviews)</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 py-5 sm:grid-cols-4">
            {[
              [data.stats.yearsOperating > 0 ? `${data.stats.yearsOperating} yrs` : 'New', 'Operating'],
              [data.stats.tripsCompleted, 'Trips completed'],
              [data.stats.pilgrimsTravelled, 'Pilgrims travelled'],
              [data.stats.packagesListed, 'Packages listed'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl bg-primary-50/70 p-3 text-center">
                <p className="text-xl font-bold text-primary-900">{value}</p>
                <p className="text-xs text-primary-600">{label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-primary-100">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold ${
                  tab === t ? 'border-primary-800 text-primary-900' : 'border-transparent text-primary-500 hover:text-primary-800'
                }`}
              >
                {t}
                {t === 'Reviews' && data.reviews.length > 0 && (
                  <span className="ml-1 text-xs text-primary-400">{data.reviews.length}</span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-4">
            {tab === 'Overview' && (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-primary-700">
                  {data.agency.agencyDescription ||
                    `${title} lists Hajj and Umrah packages on Pilgrym. Every listing is reviewed by our team before it goes live.`}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-primary-100 p-3">
                    <p className="text-xs text-primary-500">Contact</p>
                    <p className="text-sm font-medium text-primary-900">{data.agency.phone || 'Available after booking'}</p>
                  </div>
                  <div className="rounded-xl border border-primary-100 p-3">
                    <p className="text-xs text-primary-500">Based in</p>
                    <p className="text-sm font-medium text-primary-900">{data.agency.agencyLocation || 'Sri Lanka'}</p>
                  </div>
                </div>
                <Link
                  to={`/packages?vendor=${data.agency._id}`}
                  onClick={onClose}
                  className="btn-secondary w-full sm:w-auto"
                >
                  See all packages from {title}
                </Link>
              </div>
            )}

            {tab === 'Reviews' && (
              data.reviews.length === 0 ? (
                <p className="py-6 text-center text-sm text-primary-500">
                  This agency has not published any customer reviews yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {data.reviews.map((r) => (
                    <div key={r._id} className="rounded-xl border border-primary-100 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-primary-900">{r.name}</p>
                        <Stars value={r.rating} />
                      </div>
                      {r.comment && <p className="mt-1.5 text-sm leading-relaxed text-primary-700">"{r.comment}"</p>}
                      <p className="mt-2 text-xs text-primary-400">
                        {r.packageTitle} · {shortDate(r.date)}
                      </p>
                    </div>
                  ))}
                </div>
              )
            )}

            {tab === 'Trips' && (
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-sm font-semibold text-primary-800">Upcoming departures</p>
                  {data.upcomingTrips.length === 0 ? (
                    <p className="text-sm text-primary-500">No upcoming departures listed.</p>
                  ) : (
                    <div className="space-y-2">
                      {data.upcomingTrips.map((t) => (
                        <Link
                          key={t._id}
                          to={`/packages/${t._id}`}
                          onClick={onClose}
                          className="flex items-center justify-between gap-3 rounded-xl border border-primary-100 p-3 hover:bg-primary-50/60"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-primary-900">{t.title}</p>
                            <p className="text-xs text-primary-500">{t.durationDays} days · {t.type}</p>
                          </div>
                          <span className="shrink-0 text-xs font-medium text-primary-700">{shortDate(t.departureDate)}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-primary-800">Recent trips</p>
                  {data.pastTrips.length === 0 ? (
                    <p className="text-sm text-primary-500">No completed trips recorded on Pilgrym yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {data.pastTrips.map((t) => (
                        <div key={t._id} className="flex items-center justify-between gap-3 rounded-xl bg-primary-50/60 p-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-primary-900">{t.title}</p>
                            <p className="text-xs text-primary-500">{t.slotsBooked} pilgrims travelled</p>
                          </div>
                          <span className="shrink-0 text-xs font-medium text-primary-600">{shortDate(t.departureDate)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'Photos' && (
              data.photos.length === 0 ? (
                <p className="py-6 text-center text-sm text-primary-500">No photos uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {data.photos.map((src, i) => (
                    <img
                      key={`${src.slice(0, 24)}-${i}`}
                      src={src}
                      alt={`${title} trip photo ${i + 1}`}
                      className="h-28 w-full rounded-xl object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AgencyProfileModal;
