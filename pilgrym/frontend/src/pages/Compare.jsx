import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPackageById } from '../api/packages';

const ROWS = [
  ['price', 'Price', (p) => `${p.currency} ${p.price.toLocaleString()}`],
  ['durationDays', 'Duration', (p) => `${p.durationDays} Days`],
  ['makkahDistanceM', 'Makkah Distance', (p) => `${p.makkahDistanceM}m`],
  ['madinahDistanceM', 'Madinah Distance', (p) => `${p.madinahDistanceM}m`],
  ['hotelRating', 'Hotel Rating', (p) => `${p.hotelRating}★`],
  ['visaIncluded', 'Visa Included', (p) => (p.visaIncluded ? 'Yes' : 'No')],
  ['flightsIncluded', 'Flights Included', (p) => (p.flightsIncluded ? 'Yes' : 'No')],
  ['transportIncluded', 'Transport Included', (p) => (p.transportIncluded ? 'Yes' : 'No')],
  ['guidedZiyarah', 'Guided Ziyarah', (p) => (p.guidedZiyarah ? 'Yes' : 'No')],
  ['rating', 'Rating', (p) => (p.rating ? `★ ${p.rating.toFixed(1)} (${p.reviewsCount})` : '—')],
];

const Compare = () => {
  const [searchParams] = useSearchParams();
  const ids = (searchParams.get('ids') || '').split(',').filter(Boolean);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(ids.map((id) => getPackageById(id).catch(() => null)))
      .then((res) => setPackages(res.filter(Boolean)))
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) return <p className="py-24 text-center text-primary-600">Loading comparison…</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-primary-900">Compare Packages</h1>
      {packages.length < 2 ? (
        <p className="mt-4 text-primary-600">Pick at least two packages from the browse page to compare them side by side.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-2xl border border-primary-100 bg-white">
            <thead>
              <tr>
                <th className="w-40 bg-primary-50 p-4 text-left text-sm font-semibold text-primary-800">Package</th>
                {packages.map((p) => (
                  <th key={p._id} className="p-4 text-left">
                    <img src={p.images?.[0] || '/images/hero-kaaba-day.jpg'} alt={p.title} className="mb-2 h-24 w-full rounded-lg object-cover" />
                    <p className="font-semibold text-primary-900">{p.title}</p>
                    <p className="text-xs text-primary-500">{p.vendor?.agencyName}</p>
                    <Link to={`/packages/${p._id}`} className="btn-secondary mt-2 !py-1.5 text-xs">View</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([key, label, fmt]) => (
                <tr key={key} className="odd:bg-white even:bg-primary-50/40">
                  <td className="p-4 text-sm font-medium text-primary-700">{label}</td>
                  {packages.map((p) => (
                    <td key={p._id} className="p-4 text-sm text-primary-900">{fmt(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Compare;
