import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', agencyName: '', agencyDescription: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register({ ...form, role });
      navigate(role === 'vendor' ? '/vendor' : '/account', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-primary-900">Create your account</h1>
      <p className="mt-1 text-primary-600">Browse and book as a pilgrim, or list packages as a travel agency.</p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {[
          ['user', "I'm a pilgrim"],
          ['vendor', "I'm a travel agency"],
        ].map(([val, label]) => (
          <button
            key={val}
            type="button"
            onClick={() => setRole(val)}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              role === val ? 'border-primary-800 bg-primary-800 text-white' : 'border-primary-100 text-primary-700 hover:bg-primary-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card mt-5 space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-primary-800">Full name</label>
          <input required className="input-field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-primary-800">Email</label>
          <input type="email" required className="input-field" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-primary-800">Phone</label>
          <input className="input-field" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-primary-800">Password</label>
          <input type="password" required minLength={6} className="input-field" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
        </div>

        {role === 'vendor' && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-primary-800">Agency name</label>
              <input required className="input-field" value={form.agencyName} onChange={(e) => setForm((f) => ({ ...f, agencyName: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-primary-800">Agency description</label>
              <textarea rows="2" className="input-field" value={form.agencyDescription} onChange={(e) => setForm((f) => ({ ...f, agencyDescription: e.target.value }))} />
            </div>
            <p className="rounded-lg bg-gold-50 p-3 text-xs text-primary-700">
              After signing up you can add packages right away — each one is reviewed by our admin team before it appears to pilgrims.
            </p>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-primary-600">
        Already have an account? <Link to="/login" className="font-semibold text-primary-800 hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
