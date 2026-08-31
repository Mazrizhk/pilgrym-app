import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPackages, getAgencies } from '../api/packages';
import PackageCard from '../components/PackageCard';
import FilterSidebar from '../components/FilterSidebar';
import CompareBar from '../components/CompareBar';

const EMPTY_FILTERS = {
  type: '',
  vendor: '',
  minPrice: '',
  maxPrice: '',
  minDuration: '',
  maxDuration: '',
  maxMakkahDistance: '',
  departureMonth: '',
  visaIncluded: '',
  flightsIncluded: '',
  transportIncluded: '',
  guidedZiyarah: '',
};

const Packages = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, ...Object.fromEntries(searchParams) });
  const [sort, setSort] = useState('recommended');
  const [data, setData] = useState({ packages: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState([]);
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    getAgencies().then(setAgencies).catch(() => setAgencies([]));
  }, []);

  const sortParam = useMemo(
    () => ({ recommended: '', price_asc: 'price_asc', price_desc: 'price_desc', rating: 'rating', departure: 'departure' }[sort]),
    [sort]
  );

  useEffect(() => {
    setLoading(true);
    const params = { ...filters, sort: sortParam, limit: 20 };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    getPackages(params)
      .then(setData)
      .finally(() => setLoading(false));
  }, [filters, sortParam]);

  const toggleCompare = (id) => {
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-28 sm:px-6">
      <p className="text-sm text-primary-500">Home / Packages</p>
      <h1 className="mt-1 text-3xl font-semibold text-primary-900">Explore Verified Hajj &amp; Umrah Packages</h1>
      <p className="mt-1 text-primary-600">Compare trusted agencies, transparent inclusions, departure dates and prices in one place.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {['', 'Umrah', 'Hajj'].map((t) => (
          <button
            key={t || 'all'}
            onClick={() => setFilters((f) => ({ ...f, type: t }))}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              filters.type === t ? 'bg-primary-800 text-white' : 'border border-primary-100 text-primary-700 hover:bg-primary-50'
            }`}
          >
            {t || 'All'}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          agencies={agencies}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />

        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-primary-600">{loading ? 'Searching…' : `${data.total} packages found`}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary-500">Sort by:</span>
              {[
                ['recommended', 'Recommended'],
                ['price_asc', 'Price'],
                ['departure', 'Departure Soon'],
                ['rating', 'Rating'],
              ].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setSort(val)}
                  className={`rounded-full px-3 py-1 font-medium ${
                    sort === val ? 'bg-primary-800 text-white' : 'border border-primary-100 text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="py-16 text-center text-primary-500">Loading packages…</p>
          ) : data.packages.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="font-semibold text-primary-900">No packages match those filters</p>
              <p className="mt-1 text-sm text-primary-600">Try widening your budget or clearing a few filters.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {data.packages.map((pkg) => (
                <PackageCard
                  key={pkg._id}
                  pkg={pkg}
                  compareChecked={compareIds.includes(pkg._id)}
                  compareDisabled={compareIds.length >= 3}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CompareBar
        selected={compareIds}
        packages={data.packages}
        onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
      />
    </div>
  );
};

export default Packages;
