import React from 'react';
import Logo from './Logo';

const Footer = () => (
  <footer className="mt-20 bg-primary-900 text-primary-100">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
      <div>
        <Logo dark />
        <p className="mt-4 max-w-xs text-sm text-primary-200/80">
          Your journey. Our priority. Compare verified Hajj & Umrah packages from trusted agencies in one place.
        </p>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-200">Company</h4>
        <ul className="space-y-2 text-sm text-primary-200/80">
          <li><a href="#" className="hover:text-white">About Us</a></li>
          <li><a href="#" className="hover:text-white">For Agencies</a></li>
          <li><a href="#" className="hover:text-white">Careers</a></li>
          <li><a href="#" className="hover:text-white">Blog</a></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-200">Support</h4>
        <ul className="space-y-2 text-sm text-primary-200/80">
          <li><a href="#" className="hover:text-white">Help Center</a></li>
          <li><a href="#" className="hover:text-white">Contact Us</a></li>
          <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
          <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-200">Need help?</h4>
        <p className="text-sm text-primary-200/80">+94 11 234 5678</p>
        <p className="text-sm text-primary-200/80">hello@pilgrym.lk</p>
        <p className="mt-1 text-sm text-primary-200/80">Mon – Fri, 9:00 AM – 6:00 PM</p>
      </div>
    </div>
    <div className="border-t border-primary-800 py-5 text-center text-xs text-primary-300">
      © {new Date().getFullYear()} Pilgrym. All rights reserved.
    </div>
  </footer>
);

export default Footer;
