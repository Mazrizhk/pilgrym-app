import React, { useEffect, useState } from 'react';
import {
  adminGetPackages,
  adminApprovePackage,
  adminRejectPackage,
  adminDeletePackage,
} from '../api/packages';
import { getStats, getAllUsers, adminUpdateUser, adminDeleteUser } from '../api/admin';
import { adminGetBookings } from '../api/bookings';
import { getHeroImages, adminUpdateHeroImages } from '../api/settings';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ImageDropzone from '../components/ImageDropzone';

const TABS = ['Overview', 'Approvals', 'All Packages', 'Users', 'Bookings', 'Homepage'];

const StatCard = ({ label, value }) => (
  <div className="card p-4">
    <p className="text-xs text-primary-500">{label}</p>
    <p className="text-2xl font-bold text-primary-900">{value}</p>
  </div>
);

const RejectModal = ({ pkg, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  return (
    <Modal title={`Reject "${pkg.title}"`} onClose={onClose}>
      <p className="mb-3 text-sm text-primary-600">This reason is shown to the vendor so they can fix and resubmit.</p>
      <textarea
        rows="3"
        className="input-field"
        placeholder="e.g. Please upload your operating license"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="btn-secondary">Cancel</button>
        <button
          onClick={() => reason.trim() && onSubmit(reason)}
          className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
        >
          Reject Package
        </button>
      </div>
    </Modal>
  );
};

const HeroImagesPanel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getHeroImages()
      .then(setImages)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const updated = await adminUpdateHeroImages(images);
      setImages(updated);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-primary-600">Loading homepage settings…</p>;

  return (
    <div className="card max-w-3xl space-y-4 p-6">
      <div>
        <h3 className="font-semibold text-primary-900">Homepage slideshow</h3>
        <p className="mt-1 text-sm text-primary-600">
          These photos rotate in the swipeable slideshow behind the homepage hero. Add up to 5 — the first is shown first.
        </p>
      </div>

      <ImageDropzone
        value={images}
        onChange={(next) => { setImages(next); setSaved(false); }}
        max={5}
        maxDim={1920}
        hint="up to 5 photos, 1920×1080px (16:9) recommended, 10MB each"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-primary-600">Saved — the homepage now shows these images.</p>}

      <button onClick={handleSave} disabled={saving || images.length === 0} className="btn-primary">
        {saving ? 'Saving…' : 'Save slideshow'}
      </button>
    </div>
  );
};

const AdminDashboard = () => {
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [userRoleFilter, setUserRoleFilter] = useState('');

  const loadAll = () =>
    Promise.all([
      getStats().then(setStats),
      adminGetPackages().then(setPackages),
      getAllUsers().then(setUsers),
      adminGetBookings().then(setBookings),
    ]);

  useEffect(() => {
    setLoading(true);
    loadAll().finally(() => setLoading(false));
  }, []);

  const approve = async (id) => {
    await adminApprovePackage(id);
    loadAll();
  };
  const reject = async (id, reason) => {
    await adminRejectPackage(id, reason);
    setRejectTarget(null);
    loadAll();
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this package permanently?')) return;
    await adminDeletePackage(id);
    loadAll();
  };
  const toggleUserActive = async (u) => {
    await adminUpdateUser(u._id, { isActive: !u.isActive });
    loadAll();
  };
  const toggleAgencyVerified = async (u) => {
    await adminUpdateUser(u._id, { agencyVerified: !u.agencyVerified });
    loadAll();
  };
  const removeUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    await adminDeleteUser(id);
    loadAll();
  };

  const pending = packages.filter((p) => p.status === 'pending');
  const filteredUsers = userRoleFilter ? users.filter((u) => u.role === userRoleFilter) : users;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-primary-900">Admin Dashboard</h1>
      <p className="text-primary-600">Approve vendor packages, manage users and monitor bookings platform-wide.</p>

      <div className="mt-6 flex gap-2 overflow-x-auto border-b border-primary-100">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${
              tab === t ? 'border-primary-800 text-primary-900' : 'border-transparent text-primary-500 hover:text-primary-800'
            }`}
          >
            {t} {t === 'Approvals' && pending.length > 0 && <span className="ml-1 rounded-full bg-gold-400 px-1.5 text-xs text-primary-900">{pending.length}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-primary-600">Loading dashboard…</p>
      ) : (
        <div className="mt-6">
          {tab === 'Overview' && stats && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Pending packages" value={stats.pendingPackages} />
              <StatCard label="Approved packages" value={stats.approvedPackages} />
              <StatCard label="Rejected packages" value={stats.rejectedPackages} />
              <StatCard label="Total vendors" value={stats.totalVendors} />
              <StatCard label="Total pilgrims" value={stats.totalUsers} />
              <StatCard label="Total bookings" value={stats.totalBookings} />
              <StatCard label="Confirmed bookings" value={stats.confirmedBookings} />
            </div>
          )}

          {tab === 'Approvals' && (
            <div className="space-y-3">
              {pending.length === 0 && <div className="card p-8 text-center text-primary-600">Nothing waiting on review 🎉</div>}
              {pending.map((pkg) => (
                <div key={pkg._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold text-primary-900">{pkg.title}</p>
                    <p className="text-sm text-primary-500">
                      {pkg.vendor?.agencyName} · {pkg.type} · {pkg.currency} {pkg.price.toLocaleString()} · {pkg.durationDays} Days
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approve(pkg._id)} className="btn-primary !py-1.5 text-sm">Approve</button>
                    <button onClick={() => setRejectTarget(pkg)} className="rounded-lg border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'All Packages' && (
            <div className="space-y-3">
              {packages.map((pkg) => (
                <div key={pkg._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-primary-900">{pkg.title}</p>
                      <StatusBadge status={pkg.status} />
                    </div>
                    <p className="text-sm text-primary-500">
                      {pkg.vendor?.agencyName} · {pkg.type} · {pkg.currency} {pkg.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {pkg.status !== 'approved' && (
                      <button onClick={() => approve(pkg._id)} className="btn-secondary !py-1.5 text-sm">Approve</button>
                    )}
                    {pkg.status !== 'rejected' && (
                      <button onClick={() => setRejectTarget(pkg)} className="btn-secondary !py-1.5 text-sm">Reject</button>
                    )}
                    <button onClick={() => remove(pkg._id)} className="rounded-lg border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'Users' && (
            <div>
              <div className="mb-4 flex gap-2">
                {['', 'user', 'vendor', 'admin'].map((r) => (
                  <button
                    key={r || 'all'}
                    onClick={() => setUserRoleFilter(r)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                      userRoleFilter === r ? 'bg-primary-800 text-white' : 'border border-primary-100 text-primary-700 hover:bg-primary-50'
                    }`}
                  >
                    {r ? r[0].toUpperCase() + r.slice(1) + 's' : 'All'}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {filteredUsers.map((u) => (
                  <div key={u._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-primary-900">{u.name}</p>
                        <span className="badge bg-primary-50 text-primary-700">{u.role}</span>
                        {!u.isActive && <span className="badge bg-red-100 text-red-700">Suspended</span>}
                        {u.role === 'vendor' && u.agencyVerified && <span className="badge bg-gold-100 text-gold-600">Verified Agency</span>}
                      </div>
                      <p className="text-sm text-primary-500">{u.email} {u.agencyName && `· ${u.agencyName}`}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {u.role === 'vendor' && (
                        <button onClick={() => toggleAgencyVerified(u)} className="btn-secondary !py-1.5 text-sm">
                          {u.agencyVerified ? 'Unverify agency' : 'Verify agency'}
                        </button>
                      )}
                      {u.role !== 'admin' && (
                        <button onClick={() => toggleUserActive(u)} className="btn-secondary !py-1.5 text-sm">
                          {u.isActive ? 'Suspend' : 'Reactivate'}
                        </button>
                      )}
                      {u.role !== 'admin' && (
                        <button onClick={() => removeUser(u._id)} className="rounded-lg border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Homepage' && <HeroImagesPanel />}

          {tab === 'Bookings' && (
            <div className="space-y-3">
              {bookings.length === 0 && <div className="card p-8 text-center text-primary-600">No bookings yet.</div>}
              {bookings.map((b) => (
                <div key={b._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-primary-900">{b.package?.title}</p>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-sm text-primary-500">
                      {b.user?.name} ({b.user?.email}) · {b.vendor?.agencyName} · Total {b.totalPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {rejectTarget && (
        <RejectModal pkg={rejectTarget} onClose={() => setRejectTarget(null)} onSubmit={(reason) => reject(rejectTarget._id, reason)} />
      )}
    </div>
  );
};

export default AdminDashboard;
