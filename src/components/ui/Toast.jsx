// src/components/ui/Toast.jsx
// Description: Auto-dismissing toast notification bar.

import React, { useEffect } from 'react';

const Toast = ({ msg, onDismiss }) => {
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => onDismiss(), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg, onDismiss]);

  if (!msg) return null;

  return (
    <div className="fixed z-50 bottom-20 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-6 md:right-6 bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-xl transition-all">
      {msg}
    </div>
  );
};

export default Toast;
