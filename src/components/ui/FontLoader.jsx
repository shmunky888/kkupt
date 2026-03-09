// src/components/ui/FontLoader.jsx
// Description: Injects the Sarabun Google Font and global dark-mode CSS overrides.

import React from 'react';

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
    body {
      font-family: 'Sarabun', sans-serif;
    }
    html.dark body { background-color: #111827; color: #f3f4f6; }
    html.dark .bg-white { background-color: #1f2937 !important; border-color: #374151 !important; color: #f9fafb !important; }
    html.dark .bg-gray-50 { background-color: #111827 !important; border-color: #374151 !important; color: #f9fafb !important; }
    html.dark .text-gray-800, html.dark .text-gray-900 { color: #f9fafb !important; }
    html.dark .text-gray-700 { color: #e5e7eb !important; }
    html.dark .text-gray-600 { color: #d1d5db !important; }
    html.dark .text-gray-500 { color: #9ca3af !important; }
    html.dark .border-gray-100, html.dark .border-gray-200, html.dark .border-gray-300 { border-color: #374151 !important; }
    html.dark input, html.dark select, html.dark textarea { background-color: #374151 !important; color: #f9fafb !important; border-color: #4b5563 !important; }
    html.dark .bg-orange-50 { background-color: rgba(245, 130, 32, 0.1) !important; border-color: rgba(245, 130, 32, 0.2) !important; color: #f9fafb !important; }
    html.dark .bg-blue-100 { background-color: #1e3a8a !important; color: #bfdbfe !important; }
    html.dark .text-blue-700 { color: #bfdbfe !important; }
    html.dark .bg-green-100 { background-color: #064e3b !important; color: #a7f3d0 !important; }
    html.dark .text-green-700 { color: #a7f3d0 !important; }
    html.dark .bg-red-100 { background-color: #7f1d1d !important; color: #fecaca !important; }
    html.dark .text-red-700 { color: #fecaca !important; }
    html.dark .bg-yellow-100 { background-color: #713f12 !important; color: #fef08a !important; }
    html.dark .text-yellow-700 { color: #fef08a !important; }
  `}</style>
);

export default FontLoader;
