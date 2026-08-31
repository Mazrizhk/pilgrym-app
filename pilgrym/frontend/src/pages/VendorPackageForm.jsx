import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMyPackages, createPackage, updateMyPackage } from '../api/packages';
import { useAuth } from '../context/AuthContext';
import ImageDropzone from '../components/ImageDropzone';

const BLANK = {
  title: '',
  type: 'Umrah',
  description: '',
  price: '',
  currency: 'LKR',
  durationDays: '',
  departureDate: '',
  makkahDistanceM: '',
  madinahDistanceM: '',
  hotelRating: 3,
  visaIncluded: false,
  flightsIncluded: false,
  transportIncluded: false,
  guidedZiyarah: false,
  slotsTotal: 20,
  images: [],
  agencyLogo: '',
  reviews: [],
};

const BLANK_REVIEW = { name: '', rating: 5, comment: '', date: '' };

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

const VendorPackageForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ ...BLANK, agencyLogo: user?.agencyLogo || '' });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    getMyPackages().then((packages) => {
      const pkg = packages.find((p) => p._id === id);
      if (pkg) {
        setForm({
          ...BLANK,
          ...pkg,
          departureDate: toDateInput(pkg.departureDate),
          images: pkg.images || [],
          agencyLogo: pkg.agencyLogo || user?.agencyLogo || '',
          reviews: (pkg.reviews || []).map((r) => ({
            name: r.name || '',
            rating: r.rating || 5,
            comment: r.comment || '',
            date: toDateInput(r.date),
          })),
        });
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const setReview = (index, key, value) =>
    setForm((f) => ({
      ...f,
      reviews: f.reviews.map((r, i) => (i === index ? { ...r, [key]: value } : r)),
    }));

  const addReview = () => setForm((f) => ({ ...f, reviews: [...f.reviews, { ...BLANK_REVIEW }] }));

  const removeReview = (index) =>
    setForm((f) => ({ ...f, reviews: f.reviews.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        durationDays: Number(form.durationDays),
        makkahDistanceM: Number(form.makkahDistanceM) || 0,
        madinahDistanceM: Number(form.madinahDistanceM) || 0,
        hotelRating: Number(form.hotelRating),
        slotsTotal: Number(form.slotsTotal),
        images: form.images.length ? form.images : ['/images/hero-kaaba-day.jpg'],
        reviews: form.reviews
          .filter((r) => r.name.trim())
          .map((r) => ({
            name: r.name.trim(),
            rating: Number(r.rating),
            comment: r.comment.trim(),
            date: r.date || new Date().toISOString(),
          })),
      };
      if (isEdit) {
        await updateMyPackage(id, payload);
      } else {
        await createPackage(payload);
      }
      navigate('/vendor');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="py-24 text-center text-primary-600">Loading…</p>;

  const averageRating = form.reviews.length
    ? (form.reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / form.reviews.length).toFixed(1)
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-primary-900">{isEdit ? 'Edit Package' : 'Add New Package'}</h1>
      <p className="mt-1 text-primary-600">
        {isEdit
          ? 'Saving changes sends this listing back to the admin team for re-review.'
          : "New packages start as 'Pending review' until an admin approves them."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Package details */}
        <section className="card space-y-4 p-6">
          <h2 className="font-semibold text-primary-900">Package details</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-primary-800">Package title</label>
              <input required className="input-field" value={form.title} onChange={(e) => set('title', e.target.value)} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-primary-800">Type</label>
              <select className="input-field" value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option value="Umrah">Umrah</option>
                <option value="Hajj">Hajj</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-primary-800">Price per person (LKR)</label>
              <input type="number" required min="0" className="input-field" value={form.price} onChange={(e) => set('price', e.target.value)} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-primary-800">Duration (days)</label>
              <input type="number" required min="1" className="input-field" value={form.durationDays} onChange={(e) => set('durationDays', e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-primary-800">Departure date</label>
              <input type="date" required className="input-field" value={form.departureDate} onChange={(e) => set('departureDate', e.target.value)} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-primary-800">Makkah distance (m)</label>
              <input type="number" min="0" className="input-field" value={form.makkahDistanceM} onChange={(e) => set('makkahDistanceM', e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-primary-800">Madinah distance (m)</label>
              <input type="number" min="0" className="input-field" value={form.madinahDistanceM} onChange={(e) => set('madinahDistanceM', e.target.value)} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-primary-800">Hotel rating</label>
              <select className="input-field" value={form.hotelRating} onChange={(e) => set('hotelRating', e.target.value)}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} star</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-primary-800">Total slots</label>
              <input type="number" min="1" className="input-field" value={form.slotsTotal} onChange={(e) => set('slotsTotal', e.target.value)} />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-primary-800">Description</label>
              <textarea rows="3" className="input-field" value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ['visaIncluded', 'Visa included'],
              ['flightsIncluded', 'Flights included'],
              ['transportIncluded', 'Transport included'],
              ['guidedZiyarah', 'Guided ziyarah'],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-primary-700">
                <input type="checkbox" checked={Boolean(form[key])} onChange={(e) => set(key, e.target.checked)} />
                {label}
              </label>
            ))}
          </div>
        </section>

        {/* Package photos */}
        <section className="card space-y-3 p-6">
          <div>
            <h2 className="font-semibold text-primary-900">Package photos</h2>
            <p className="text-sm text-primary-600">
              The first image is used as the cover on search results. Drag to reorder, or leave empty for a default photo.
            </p>
          </div>
          <ImageDropzone
            value={form.images}
            onChange={(images) => set('images', images)}
            maxDim={1600}
            max={8}
            hint="up to 8 photos, 10MB each"
          />
        </section>

        {/* Agency logo */}
        <section className="card space-y-3 p-6">
          <div>
            <h2 className="font-semibold text-primary-900">Agency logo</h2>
            <p className="text-sm text-primary-600">
              Shown on this listing and on your public agency profile. A square PNG with a transparent background works best.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-primary-100 bg-white">
              {form.agencyLogo ? (
                <img src={form.agencyLogo} alt="Agency logo" className="max-h-20 max-w-20 object-contain" />
              ) : (
                <span className="text-xs text-primary-400">No logo</span>
              )}
            </div>
            <div className="flex-1">
              <ImageDropzone
                value={form.agencyLogo ? [form.agencyLogo] : []}
                onChange={(images) => set('agencyLogo', images[0] || '')}
                multiple={false}
                maxDim={512}
                keepTransparency
                hint="a single PNG or JPG logo"
                previewClass="h-16"
              />
            </div>
          </div>
        </section>

        {/* Customer reviews */}
        <section className="card space-y-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-primary-900">Customer reviews</h2>
              <p className="text-sm text-primary-600">
                Add reviews from pilgrims who have travelled with you. These appear on the package page and your agency profile.
              </p>
            </div>
            {averageRating && (
              <span className="badge bg-gold-100 text-gold-600">
                ★ {averageRating} average · {form.reviews.length} review{form.reviews.length === 1 ? '' : 's'}
              </span>
            )}
          </div>

          {form.reviews.length === 0 && (
            <p className="rounded-xl bg-primary-50/60 px-4 py-3 text-sm text-primary-600">
              No reviews added yet.
            </p>
          )}

          <div className="space-y-3">
            {form.reviews.map((review, i) => (
              <div key={i} className="rounded-xl border border-primary-100 p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-primary-800">Customer name</label>
                    <input
                      className="input-field"
                      value={review.name}
                      onChange={(e) => setReview(i, 'name', e.target.value)}
                      placeholder="Fathima R."
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-primary-800">Rating</label>
                    <select className="input-field" value={review.rating} onChange={(e) => setReview(i, 'rating', e.target.value)}>
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-primary-800">Date</label>
                    <input type="date" className="input-field" value={review.date} onChange={(e) => setReview(i, 'date', e.target.value)} />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="mb-1 block text-sm font-medium text-primary-800">Review</label>
                    <textarea
                      rows="2"
                      className="input-field"
                      value={review.comment}
                      onChange={(e) => setReview(i, 'comment', e.target.value)}
                      placeholder="What did they say about the trip?"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeReview(i)}
                  className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Remove review
                </button>
              </div>
            ))}
          </div>

          <button type="button" onClick={addReview} className="btn-secondary">+ Add a review</button>
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Submit for review'}
          </button>
          <button type="button" onClick={() => navigate('/vendor')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default VendorPackageForm;
