import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, cancelMyBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => getMyBookings().then(setBookings).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    await cancelMyBooking(id);
    load();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-primary-900">Assalamu alaikum, {user.name.split(' ')[0]}</h1>
      <p className="text-primary-600">Here's everything you've booked through Pilgrym.</p>

      {loading ? (
        <p className="mt-8 text-primary-600">Loading your bookings…</p>
      ) : bookings.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="font-semibold text-primary-900">No bookings yet</p>
          <p className="mt-1 text-sm text-primary-600">Browse verified packages and request your first booking.</p>
          <Link to="/packages" className="btn-primary mt-4 inline-flex">Browse Packages</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="card flex flex-wrap items-center gap-4 p-4">
              <img
                src={b.package?.images?.[0] || '/images/hero-kaaba-day.jpg'}
                alt={b.package?.title}
                className="h-20 w-28 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-primary-900">{b.package?.title}</p>
                  <StatusBadge status={b.status} />
                </div>
                <p className="text-sm text-primary-500">
                  {b.vendor?.agencyName} · {b.travelers} traveler(s) · Total LKR {b.totalPrice.toLocaleString()}
                </p>
                {b.package?.departureDate && (
                  <p className="text-sm text-primary-500">
                    Departs {new Date(b.package.departureDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
              {b.status === 'pending' && (
                <button onClick={() => cancel(b._id)} className="rounded-lg border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
