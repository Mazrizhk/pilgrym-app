import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const dashboardPath = (role) => (role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor' : '/account');

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const dest = location.state?.from?.pathname || dashboardPath(user.role);
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-primary-900">Welcome back</h1>
      <p className="mt-1 text-primary-600">Log in to browse, book, or manage your Pilgrym account.</p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-primary-800">Email</label>
          <input type="email" required className="input-field" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-primary-800">Password</label>
          <input type="password" required className="input-field" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-primary-600">
        New to Pilgrym? <Link to="/register" className="font-semibold text-primary-800 hover:underline">Create an account</Link>
      </p>

      <div className="mt-6 rounded-xl bg-primary-50 p-4 text-xs text-primary-600">
        <p className="mb-1 font-semibold text-primary-800">Demo logins (after running the seed script)</p>
        <p>Admin: admin@pilgrym.lk / admin1234</p>
        <p>Vendor: noor@noortravels.lk / vendor1234</p>
        <p>User: user@pilgrym.lk / user1234</p>
      </div>
    </div>
  );
};

export default Login;
