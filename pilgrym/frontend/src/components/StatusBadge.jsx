import React from 'react';

const STYLES = {
  approved: 'bg-primary-100 text-primary-800',
  pending: 'bg-gold-100 text-gold-600',
  rejected: 'bg-red-100 text-red-700',
  confirmed: 'bg-primary-100 text-primary-800',
  cancelled: 'bg-slate-100 text-slate-600',
};

const LABELS = {
  approved: 'Approved',
  pending: 'Pending review',
  rejected: 'Rejected',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
};

const StatusBadge = ({ status }) => (
  <span className={`badge ${STYLES[status] || 'bg-slate-100 text-slate-600'}`}>
    {LABELS[status] || status}
  </span>
);

export default StatusBadge;
