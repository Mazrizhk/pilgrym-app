import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const dashboardPath = (role) =>
  role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor' : '/account';

const accountLabel = (role) =>
  role === 'admin' ? 'Admin Panel' : role === 'vendor' ? 'My Agency' : 'My Account';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition hover:text-primary-600 ${
      isActive ? 'text-primary-800' : 'text-primary-700/70'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-primary-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/packages" className={linkClass}>Find Packages</NavLink>
          <NavLink to="/how-it-works" className={linkClass}>How It Works</NavLink>
          <NavLink to="/for-agencies" className={linkClass}>For Agencies</NavLink>
          <NavLink to="/first-timer-guide" className={linkClass}>First Timer Guide</NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="group relative pb-1">
              <Link
                to={dashboardPath(user.role)}
                className="flex items-center gap-2 rounded-lg bg-primary-800 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-primary-900"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold uppercase">
                  {user.name.trim().charAt(0)}
                </span>
                {accountLabel(user.role)}
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <div className="invisible absolute right-0 mt-1 w-56 rounded-xl border border-primary-100 bg-white p-1.5 opacity-0 shadow-cardHover transition group-hover:visible group-hover:opacity-100">
                <p className="truncate px-3 pb-1.5 pt-1 text-xs text-primary-500">
                  Signed in as {user.name}
                </p>
                <Link to={dashboardPath(user.role)} className="block rounded-lg px-3 py-2 text-sm text-primary-800 hover:bg-primary-50">
                  {user.role === 'admin' ? 'Admin dashboard' : user.role === 'vendor' ? 'Vendor dashboard' : 'My bookings'}
                </Link>
                <Link to="/packages" className="block rounded-lg px-3 py-2 text-sm text-primary-800 hover:bg-primary-50">
                  Browse packages
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-primary-800 hover:text-primary-600">Log in</Link>
              <Link to="/register" className="btn-primary !py-2">Sign up</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="#154744" strokeWidth="1.7" strokeLinecap="round" /></svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-primary-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink to="/packages" onClick={() => setOpen(false)} className={linkClass}>Find Packages</NavLink>
            <NavLink to="/how-it-works" onClick={() => setOpen(false)} className={linkClass}>How It Works</NavLink>
            <NavLink to="/for-agencies" onClick={() => setOpen(false)} className={linkClass}>For Agencies</NavLink>
            <NavLink to="/first-timer-guide" onClick={() => setOpen(false)} className={linkClass}>First Timer Guide</NavLink>
            <hr className="border-primary-100" />
            {user ? (
              <>
                <Link to={dashboardPath(user.role)} onClick={() => setOpen(false)} className="btn-primary w-fit">
                  {accountLabel(user.role)}
                </Link>
                <button onClick={() => { logout(); setOpen(false); navigate('/'); }} className="text-left text-sm font-semibold text-red-600">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-semibold text-primary-800">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-fit">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
