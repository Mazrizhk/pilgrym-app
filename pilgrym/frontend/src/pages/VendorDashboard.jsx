import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyPackages, deleteMyPackage } from '../api/packages';
import { getVendorBookings, updateVendorBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const TABS = ['Packages', 'Bookings'];

const VendorDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('Packages');
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPackages = () => getMyPackages().then(setPackages);
  const loadBookings = () => getVendorBookings().then(setBookings);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadPackages(), loadBookings()]).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package? This cannot be undone.')) return;
    await deleteMyPackage(id);
    loadPackages();
  };

  const handleBookingStatus = async (id, status) => {
    await updateVendorBooking(id, status);
    loadBookings();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-900">{user.agencyName}</h1>
          <p className="text-primary-600">
            Vendor dashboard {user.agencyVerified && <span className="badge ml-1 bg-primary-100 text-primary-800">Verified Agency</span>}
          </p>
        </div>
        <Link to="/vendor/packages/new" className="btn-primary">+ Add New Package</Link>
      </div>

      <div className="mt-6 flex gap-2 border-b border-primary-100">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold ${
              tab === t ? 'border-primary-800 text-primary-900' : 'border-transparent text-primary-500 hover:text-primary-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-primary-600">Loading…</p>
      ) : tab === 'Packages' ? (
        <div className="mt-6 space-y-3">
          {packages.length === 0 && (
            <div className="card p-8 text-center text-primary-600">
              You haven't listed any packages yet. Click "Add New Package" to submit one for admin review.
            </div>
          )}
          {packages.map((pkg) => (
            <div key={pkg._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-primary-900">{pkg.title}</p>
                  <StatusBadge status={pkg.status} />
                </div>
                <p className="text-sm text-primary-500">
                  {pkg.type} · {pkg.currency} {pkg.price.toLocaleString()} · {pkg.durationDays} Days
                </p>
                {pkg.status === 'rejected' && pkg.rejectionReason && (
                  <p className="mt-1 text-sm text-red-600">Reason: {pkg.rejectionReason}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Link to={`/vendor/packages/${pkg._id}/edit`} className="btn-secondary !py-1.5 text-sm">Edit</Link>
                <button onClick={() => handleDelete(pkg._id)} className="rounded-lg border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {bookings.length === 0 && <div className="card p-8 text-center text-primary-600">No bookings yet.</div>}
          {bookings.map((b) => (
            <div key={b._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-primary-900">{b.package?.title}</p>
                  <StatusBadge status={b.status} />
                </div>
                <p className="text-sm text-primary-500">
                  {b.user?.name} · {b.travelers} traveler(s) · {b.contactPhone} · Total {b.totalPrice.toLocaleString()}
                </p>
                {b.notes && <p className="text-sm text-primary-500">Note: {b.notes}</p>}
              </div>
              {b.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => handleBookingStatus(b._id, 'confirmed')} className="btn-primary !py-1.5 text-sm">Confirm</button>
                  <button onClick={() => handleBookingStatus(b._id, 'cancelled')} className="rounded-lg border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
