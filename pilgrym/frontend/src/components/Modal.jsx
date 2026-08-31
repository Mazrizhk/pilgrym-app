import React from 'react';

const Modal = ({ title, onClose, children, maxWidth = 'max-w-lg' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/40 p-4" onClick={onClose}>
    <div
      className={`max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-2xl bg-white p-6 shadow-cardHover`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary-900">{title}</h3>
        <button onClick={onClose} aria-label="Close" className="rounded-full p-1 text-primary-500 hover:bg-primary-50">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;
