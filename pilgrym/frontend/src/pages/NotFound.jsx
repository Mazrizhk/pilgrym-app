import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
    <h1 className="text-4xl font-semibold text-primary-900">404</h1>
    <p className="mt-2 text-primary-600">This page doesn't exist.</p>
    <Link to="/" className="btn-primary mt-5">Back to home</Link>
  </div>
);

export default NotFound;
