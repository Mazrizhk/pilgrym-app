import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ dark = false, size = 'md' }) => {
  const sizes = { sm: 'h-7 w-7', md: 'h-9 w-9', lg: 'h-14 w-14' };
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-3xl' };
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <img
        src="/images/logo.png"
        alt="Pilgrym"
        className={`${sizes[size]} rounded-xl object-cover`}
      />
      <span
        className={`font-display italic ${textSizes[size]} ${dark ? 'text-white' : 'text-primary-800'}`}
      >
        pilgrym
      </span>
    </Link>
  );
};

export default Logo;
