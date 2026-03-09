// src/components/ui/Btn.jsx
// Description: Reusable button component with solid, outline, and disabled variants.

import React from 'react';

const Btn = ({ children, onClick, color, outline, small, full, disabled, type = "button" }) => {
  const baseClasses = `font-semibold active:scale-95 flex justify-center items-center transition-all ${small ? 'px-3 py-1.5 text-xs rounded-lg' : 'px-4 py-2.5 text-sm rounded-xl'} ${full ? 'w-full' : ''}`;

  if (disabled) {
    return (
      <button type={type} disabled className={`${baseClasses} opacity-50 cursor-not-allowed bg-gray-300 text-gray-600`}>
        {children}
      </button>
    );
  }

  if (outline) {
    return (
      <button type={type} onClick={onClick} className={`${baseClasses} border-2 bg-transparent ${color ? '' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`} style={color ? { borderColor: color, color: color } : {}}>
        {children}
      </button>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${baseClasses} text-white ${color ? '' : 'bg-gray-800 focus:bg-gray-900'}`} style={color ? { backgroundColor: color } : {}}>
      {children}
    </button>
  );
};

export default Btn;
