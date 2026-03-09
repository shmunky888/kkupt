// src/components/ui/Modal.jsx
// Description: Generic modal overlay with title, close button, and scrollable content area.

import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ title, onClose, wide, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className={`bg-white w-full md:rounded-2xl rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh] ${wide ? 'md:max-w-xl' : 'md:max-w-md'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
