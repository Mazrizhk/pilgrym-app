import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPackageById } from '../api/packages';
import { createBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import PackageBadge from '../components/PackageBadge';
import Modal from '../components/Modal';
import Stars from '../components/Stars';
import AgencyProfileModal from '../components/AgencyProfileModal';
import AgencyLogoBadge from '../components/AgencyLogoBadge';

const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const shortDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const PackageDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [showAgency, setShowAgency] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [form, setForm] = useState({ travelers: 1, contactPhone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    getPackageById(id)
      .then(setPkg)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const openBooking = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/packages/${id}` } } });
      return;
    }
    setShowBooking(true);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setBookingError('');
    try {
      await createBooking({ packageId: id, ...form, travelers: Number(form.travelers) });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="py-24 text-center text-primary-600">Loading package…</p>;
  if (error || !pkg) return <p className="py-24 text-center text-red-600">{error || 'Package not found.'}</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="text-sm text-primary-500">
        <Link to="/packages" className="hover:underline">Packages</Link> / {pkg.title}
      </p>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={pkg.images?.[activeImage] || pkg.images?.[0] || '/images/hero-kaaba-day.jpg'}
              alt={pkg.title}
              className="h-72 w-full object-cover sm:h-96"
            />
            {pkg.badge !== 'None' && <div className="absolute left-4 top-4"><PackageBadge badge={pkg.badge} /></div>}
            <AgencyLogoBadge
              logo={pkg.agencyLogo || pkg.vendor?.agencyLogo}
              agencyName={pkg.vendor?.agencyName}
              corner="top-right"
              size="lg"
            />
          </div>

          {pkg.images?.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {pkg.images.map((src, i) => (
                <button
                  key={`${src.slice(0, 24)}-${i}`}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-24 overflow-hidden rounded-lg border-2 transition ${
                    activeImage === i ? 'border-primary-800' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View photo ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <h1 className="mt-5 text-3xl font-semibold text-primary-900">{pkg.title}</h1>

          {/* Agency strip */}
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border border-primary-100 bg-white p-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary-100 bg-white">
              {pkg.agencyLogo || pkg.vendor?.agencyLogo ? (
                <img
                  src={pkg.agencyLogo || pkg.vendor.agencyLogo}
                  alt={`${pkg.vendor?.agencyName} logo`}
                  className="max-h-10 max-w-10 object-contain"
                />
              ) : (
                <span className="text-sm font-bold text-primary-700">{initials(pkg.vendor?.agencyName)}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 font-semibold text-primary-900">
                {pkg.vendor?.agencyName}
                {pkg.vendor?.agencyVerified && <span className="badge bg-primary-100 text-primary-800">Verified Agency</span>}
              </p>
              {pkg.rating > 0 && (
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-primary-700">
                  <Stars value={pkg.rating} />
                  {pkg.rating.toFixed(1)} <span className="text-primary-400">({pkg.reviewsCount} reviews)</span>
                </p>
              )}
            </div>
            {pkg.vendor?._id && (
              <button onClick={() => setShowAgency(true)} className="btn-secondary !py-2 shrink-0">
                About {pkg.vendor.agencyName}
              </button>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-primary-700">{pkg.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              ['Duration', `${pkg.durationDays} Days`],
              ['Departure', new Date(pkg.departureDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })],
              ['Hotel Rating', `${pkg.hotelRating}★`],
              ['Makkah Distance', `${pkg.makkahDistanceM}m`],
              ['Madinah Distance', `${pkg.madinahDistanceM}m`],
              ['Slots Left', pkg.slotsAvailable ?? '—'],
            ].map(([label, value]) => (
              <div key={label} className="card p-3">
                <p className="text-xs text-primary-500">{label}</p>
                <p className="font-semibold text-primary-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="mb-2 font-semibold text-primary-900">What's included</h3>
            <div className="flex flex-wrap gap-2">
              {[
                [pkg.visaIncluded, 'Visa'],
                [pkg.flightsIncluded, 'Flights'],
                [pkg.transportIncluded, 'Transport'],
                [pkg.guidedZiyarah, 'Guided Ziyarah'],
              ]
                .filter(([included]) => included)
                .map(([, label]) => (
                  <span key={label} className="badge bg-primary-50 text-primary-700">✓ {label}</span>
                ))}
            </div>
            <p className="mt-3 text-sm text-primary-500">
              Free cancellation up to {pkg.freeCancellationDays} days before departure.
            </p>
          </div>

          {pkg.reviews?.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-primary-900">What pilgrims said</h3>
                {pkg.vendor?._id && (
                  <button
                    onClick={() => setShowAgency(true)}
                    className="text-sm font-semibold text-primary-700 hover:text-primary-900"
                  >
                    See all reviews for {pkg.vendor.agencyName} →
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {pkg.reviews.slice(0, 4).map((r) => (
                  <div key={r._id} className="card p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-primary-900">{r.name}</p>
                      <Stars value={r.rating} />
                    </div>
                    {r.comment && <p className="mt-1.5 text-sm leading-relaxed text-primary-700">"{r.comment}"</p>}
                    <p className="mt-2 text-xs text-primary-400">{shortDate(r.date)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-24 p-6">
            <p className="text-sm text-primary-500">From</p>
            <p className="text-3xl font-bold text-primary-900">{pkg.currency} {pkg.price.toLocaleString()}</p>
            <p className="text-sm text-primary-500">Per person</p>
            <button onClick={openBooking} className="btn-primary mt-5 w-full" disabled={pkg.slotsAvailable === 0}>
              {pkg.slotsAvailable === 0 ? 'Fully booked' : 'Book This Package'}
            </button>
            {pkg.vendor?._id && (
              <button onClick={() => setShowAgency(true)} className="btn-secondary mt-2 w-full">
                About {pkg.vendor.agencyName}
              </button>
            )}
            <p className="mt-3 text-xs text-primary-500">
              Contact: {pkg.vendor?.phone || 'available after booking'}
            </p>
          </div>
        </div>
      </div>

      {showAgency && pkg.vendor?._id && (
        <AgencyProfileModal
          agencyId={pkg.vendor._id}
          agencyName={pkg.vendor.agencyName}
          onClose={() => setShowAgency(false)}
        />
      )}

      {showBooking && (
        <Modal title={bookingSuccess ? 'Booking sent!' : `Book ${pkg.title}`} onClose={() => setShowBooking(false)}>
          {bookingSuccess ? (
            <div className="text-center">
              <p className="text-primary-700">
                Your booking request has been sent to {pkg.vendor?.agencyName}. You can track its status from your bookings page.
              </p>
              <Link to="/account" className="btn-primary mt-5 inline-flex">Go to my bookings</Link>
            </div>
          ) : (
            <form onSubmit={submitBooking} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-800">Travelers</label>
                <input
                  type="number"
                  min="1"
                  max={pkg.slotsAvailable}
                  required
                  className="input-field"
                  value={form.travelers}
                  onChange={(e) => setForm((f) => ({ ...f, travelers: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-800">Contact phone</label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  value={form.contactPhone}
                  onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-800">Notes (optional)</label>
                <textarea
                  rows="3"
                  className="input-field"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
              <div className="rounded-lg bg-primary-50 p-3 text-sm text-primary-800">
                Total: {pkg.currency} {(pkg.price * Number(form.travelers || 0)).toLocaleString()}
              </div>
              {bookingError && <p className="text-sm text-red-600">{bookingError}</p>}
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Sending…' : 'Confirm booking request'}
              </button>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default PackageDetail;
