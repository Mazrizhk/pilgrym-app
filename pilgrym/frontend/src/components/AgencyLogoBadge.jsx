import React from 'react';

// Small square logo chip pinned to a corner of a package photo — a thin white
// border around the logo itself, rather than a padded white card.
const AgencyLogoBadge = ({ logo, agencyName, corner = 'top-right', size = 'md' }) => {
  if (!logo) return null;

  const cornerClass = {
    'top-right': 'right-3 top-3',
    'top-left': 'left-3 top-3',
  }[corner];

  const sizeClass = {
    sm: 'h-9 w-9',
    md: 'h-12 w-12',
    lg: 'h-14 w-14',
  }[size];

  return (
    <div className={`absolute ${cornerClass} z-10 overflow-hidden rounded-md border-2 border-white bg-white/90 shadow-cardHover ${sizeClass}`}>
      <img src={logo} alt={agencyName ? `${agencyName} logo` : 'Agency logo'} className="h-full w-full object-cover" />
    </div>
  );
};

export default AgencyLogoBadge;
