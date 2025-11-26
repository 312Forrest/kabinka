import React from 'react';

export const UploadIcon: React.FC = () => (
  <svg className="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
  </svg>
);

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={`animate-spin ${className} text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const MagicWandIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 4V2"/><path d="M15 10V8"/>
        <path d="M12.5 6.5L14 5"/>
        <path d="M17.5 6.5L16 5"/>
        <path d="M10 4h.01"/>
        <path d="M20 4h.01"/>
        <path d="M17.5 13.5L16 12"/>
        <path d="M12.5 13.5L14 12"/>
        <path d="M20 10v.01"/>
        <path d="M10 10v.01"/>
        <path d="m3 21 9-9"/>
        <path d="M12.5 18.5L14 17"/>
    </svg>
);
