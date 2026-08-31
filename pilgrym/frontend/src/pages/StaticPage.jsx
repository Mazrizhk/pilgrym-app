import React from 'react';

const StaticPage = ({ title, children }) => (
  <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
    <h1 className="text-3xl font-semibold text-primary-900">{title}</h1>
    <div className="prose mt-4 max-w-none text-primary-700">{children}</div>
  </div>
);

export default StaticPage;
