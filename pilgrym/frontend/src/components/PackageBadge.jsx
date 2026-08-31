import React from 'react';

const STYLES = {
  'Best Value': 'bg-gold-400 text-primary-900',
  Popular: 'bg-primary-800 text-white',
  'Verified Agency': 'bg-primary-100 text-primary-800',
};

const PackageBadge = ({ badge }) => {
  if (!badge || badge === 'None') return null;
  return <span className={`badge shadow-sm ${STYLES[badge]}`}>{badge}</span>;
};

export default PackageBadge;
