import React from 'react';

const DURATIONS = [
  { label: '5 - 7 Days', min: 5, max: 7 },
  { label: '8 - 10 Days', min: 8, max: 10 },
  { label: '11 - 14 Days', min: 11, max: 14 },
  { label: '15+ Days', min: 15, max: 999 },
];

const DISTANCES = [
  { label: 'Up to 200m', max: 200 },
  { label: '201m - 500m', max: 500 },
  { label: '501m - 800m', max: 800 },
  { label: '800m+', max: 999999 },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const FilterSidebar = ({ filters, setFilters, agencies = [], onClear }) => {
  const toggleDuration = (d) => {
    const active = filters.minDuration === String(d.min);
    setFilters((f) => ({
      ...f,
      minDuration: active ? '' : String(d.min),
      maxDuration: active ? '' : String(d.max),
    }));
  };

  const toggleDistance = (d) => {
    const active = filters.maxMakkahDistance === String(d.max);
    setFilters((f) => ({ ...f, maxMakkahDistance: active ? '' : String(d.max) }));
  };

  const toggleFlag = (key) => setFilters((f) => ({ ...f, [key]: f[key] === 'true' ? '' : 'true' }));

  const toggleAgency = (id) =>
    setFilters((f) => ({ ...f, vendor: f.vendor === id ? '' : id }));

  return (
    <aside className="card h-fit w-full shrink-0 p-5 lg:w-64">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-primary-900">Filters</h3>
        <button onClick={onClear} className="text-sm font-medium text-primary-600 hover:text-primary-800">
          Clear All
        </button>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm font-semibold text-primary-800">Price Range (LKR)</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            className="input-field"
            value={filters.minPrice}
            onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
          />
          <span className="text-primary-400">–</span>
          <input
            type="number"
            placeholder="Max"
            className="input-field"
            value={filters.maxPrice}
            onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
          />
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm font-semibold text-primary-800">Departure Month</p>
        <select
          className="input-field"
          value={filters.departureMonth || ''}
          onChange={(e) => setFilters((f) => ({ ...f, departureMonth: e.target.value }))}
        >
          <option value="">Any month</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm font-semibold text-primary-800">Agency</p>
        {agencies.length === 0 ? (
          <p className="text-sm text-primary-500">No agencies registered yet.</p>
        ) : (
          <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, vendor: '' }))}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm ${
                !filters.vendor ? 'bg-primary-50 font-semibold text-primary-900' : 'text-primary-700 hover:bg-primary-50/60'
              }`}
            >
              All agencies
            </button>
            {agencies.map((a) => (
              <button
                key={a._id}
                type="button"
                onClick={() => toggleAgency(a._id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm ${
                  filters.vendor === a._id
                    ? 'bg-primary-50 font-semibold text-primary-900'
                    : 'text-primary-700 hover:bg-primary-50/60'
                }`}
              >
                {a.agencyLogo ? (
                  <img src={a.agencyLogo} alt="" className="h-6 w-6 shrink-0 rounded-md object-contain" />
                ) : (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-100 text-[10px] font-bold text-primary-700">
                    {initials(a.agencyName)}
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate">{a.agencyName}</span>
                {a.agencyVerified && (
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-label="Verified">
                    <path d="M4 10.5l3.5 3.5L16 5" stroke="#1b615d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span className="shrink-0 text-xs text-primary-400">{a.packageCount}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm font-semibold text-primary-800">Duration</p>
        <div className="space-y-1.5">
          {DURATIONS.map((d) => (
            <label key={d.label} className="flex items-center gap-2 text-sm text-primary-700">
              <input
                type="checkbox"
                checked={filters.minDuration === String(d.min)}
                onChange={() => toggleDuration(d)}
              />
              {d.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm font-semibold text-primary-800">Hotel Distance to Haram</p>
        <div className="space-y-1.5">
          {DISTANCES.map((d) => (
            <label key={d.label} className="flex items-center gap-2 text-sm text-primary-700">
              <input
                type="checkbox"
                checked={filters.maxMakkahDistance === String(d.max)}
                onChange={() => toggleDistance(d)}
              />
              {d.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-primary-800">Inclusions</p>
        <div className="space-y-1.5">
          {[
            ['visaIncluded', 'Visa Included'],
            ['flightsIncluded', 'Flights Included'],
            ['transportIncluded', 'Transport Included'],
            ['guidedZiyarah', 'Guided Ziyarah'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-primary-700">
              <input type="checkbox" checked={filters[key] === 'true'} onChange={() => toggleFlag(key)} />
              {label}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
