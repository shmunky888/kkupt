// src/components/layout/MobileHeader.jsx
// Description: Mobile-only sticky top header with hamburger menu and notification bell.

import React from 'react';
import { Menu, Bell } from 'lucide-react';

const MobileHeader = ({ unreadCount, toggleNotifs, toggleSidebar }) => (
  <div className="md:hidden h-14 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-4">
    <div className="flex items-center gap-3">
      <button onClick={toggleSidebar} className="p-1 text-gray-600">
        <Menu size={24} />
      </button>
      <div className="text-[#F58220] font-black text-lg tracking-wider">KKU <span className="text-gray-800 text-base">PART-TIME</span></div>
    </div>
    <button onClick={toggleNotifs} className="relative p-2 text-gray-600">
      <Bell size={24} />
      {unreadCount > 0 && <span className="absolute top-1 right-1.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full text-[0px]">unread</span>}
    </button>
  </div>
);

export default MobileHeader;
