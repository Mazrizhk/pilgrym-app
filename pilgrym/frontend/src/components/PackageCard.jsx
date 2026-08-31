import React from 'react';
import { Link } from 'react-router-dom';
import PackageBadge from './PackageBadge';
import AgencyLogoBadge from './AgencyLogoBadge';

const formatPrice = (price, currency = 'LKR') => `${currency} ${Number(price).toLocaleString()}`;

const PackageCard = ({ pkg, compareChecked, onToggleCompare, compareDisabled }) => {
  const dep = new Date(pkg.departureDate);
  const depLabel = dep.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="card flex flex-col overflow-hidden transition hover:shadow-cardHover sm:flex-row">
      <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-56">
        <img
          src={pkg.images?.[0] || '/images/hero-kaaba-day.jpg'}
          alt={pkg.title}
          className="h-full w-full object-cover"
        />
        {pkg.badge && pkg.badge !== 'None' && (
          <div className="absolute left-3 top-3">
            <PackageBadge badge={pkg.badge} />
          </div>
        )}
        <AgencyLogoBadge
          logo={pkg.agencyLogo || pkg.vendor?.agencyLogo}
          agencyName={pkg.vendor?.agencyName}
          size="sm"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-primary-900">{pkg.title}</h3>
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-primary-600">
            {pkg.vendor?.agencyName}
            {pkg.vendor?.agencyVerified && (
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-primary-700">
                <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M4 10.5l3.5 3.5L16 5" stroke="#1b615d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Verified
              </span>
            )}
          </p>
          {pkg.rating > 0 && (
            <p className="mt-1 text-sm text-primary-700">
              ★ {pkg.rating.toFixed(1)} <span className="text-primary-400">({pkg.reviewsCount} reviews)</span>
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary-700/90">
            <span>{pkg.durationDays} Days</span>
            <span>{depLabel}</span>
            <span>Makkah: {pkg.makkahDistanceM}m</span>
            <span>Madinah: {pkg.madinahDistanceM}m</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {pkg.visaIncluded && <span className="badge bg-primary-50 text-primary-700">Visa Included</span>}
            {pkg.flightsIncluded && <span className="badge bg-primary-50 text-primary-700">Flights Included</span>}
            {pkg.transportIncluded && <span className="badge bg-primary-50 text-primary-700">Transport</span>}
            {pkg.guidedZiyarah && <span className="badge bg-primary-50 text-primary-700">Guided Ziyarah</span>}
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-primary-50 pt-3">
          <div>
            <p className="text-xs text-primary-500">From</p>
            <p className="text-xl font-bold text-primary-900">{formatPrice(pkg.price, pkg.currency)}</p>
            <p className="text-xs text-primary-500">Per Person</p>
          </div>
          <div className="flex items-center gap-2">
            {onToggleCompare && (
              <label className={`btn-secondary !py-2 cursor-pointer ${compareDisabled && !compareChecked ? 'opacity-50' : ''}`}>
                <input
                  type="checkbox"
                  className="mr-1.5"
                  checked={compareChecked}
                  disabled={compareDisabled && !compareChecked}
                  onChange={() => onToggleCompare(pkg._id)}
                />
                Compare
              </label>
            )}
            <Link to={`/packages/${pkg._id}`} className="btn-primary !py-2">View Package</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
