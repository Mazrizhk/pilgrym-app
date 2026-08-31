import React from 'react';
import { Link } from 'react-router-dom';

const CompareBar = ({ selected, packages, onRemove }) => {
  if (selected.length === 0) return null;
  const items = selected.map((id) => packages.find((p) => p._id === id)).filter(Boolean);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-primary-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
        <p className="text-sm font-semibold text-primary-800">Compare Packages ({items.length}/3 selected)</p>
        <div className="flex flex-1 flex-wrap gap-2">
          {items.map((pkg) => (
            <span key={pkg._id} className="badge gap-2 bg-primary-50 text-primary-800">
              {pkg.title}
              <button onClick={() => onRemove(pkg._id)} aria-label={`Remove ${pkg.title}`}>×</button>
            </span>
          ))}
        </div>
        <Link
          to={`/compare?ids=${selected.join(',')}`}
          className={`btn-primary ${items.length < 2 ? 'pointer-events-none opacity-50' : ''}`}
        >
          Compare ({items.length})
        </Link>
      </div>
    </div>
  );
};

export default CompareBar;
