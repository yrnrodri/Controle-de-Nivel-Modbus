import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-3">
          {/* Name and Title */}
          <div className="text-center">
            <h3 className="text-base font-medium">Tuna Sakar</h3>
            <p className="text-sm text-blue-200/90">DevOps & Platform Engineer, IIoT Enthusiast</p>
          </div>

          {/* Slogan with shimmer effect */}
          <p className="text-xs font-light tracking-widest text-blue-100/60 relative inline-block">
            <span className="relative inline-block animate-shimmer bg-gradient-to-r from-blue-100/40 via-blue-100/60 to-blue-100/40 text-transparent bg-clip-text">
              &lt;Anything as a Service /&gt;
            </span>
          </p>

          {/* License */}
          <a
            className="text-xs text-blue-200/80 hover:text-white transition-colors"
            href="/license"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT License
          </a>
        </div>
      </div>
    </footer>
  );
}