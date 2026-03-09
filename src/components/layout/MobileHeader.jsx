// src/components/layout/MobileHeader.jsx
// Description: Mobile-only sticky top header with hamburger menu and notification bell.

import React from 'react';
import { Menu, Bell } from 'lucide-react';

const MobileHeader = ({ unreadCount, toggleNotifs, toggleSidebar }) => (
  <div className="md:hidden h-14 bg-white border-b border-gray-200 fixed top-0 w-full z-50 flex items-center justify-between px-4">
    <div className="flex items-center gap-3">
      <button onClick={toggleSidebar} className="p-1 text-gray-500 hover:text-gray-800 transition-colors">
        <Menu size={20} />
      </button>
      <div className="text-[#F58220] font-black text-lg tracking-wider">KKU PT</div>
      <div className="text-gray-500 text-[10px] sm:text-xs font-semibold tracking-wider ml-1">PART-TIME</div>
    </div>
    <button onClick={toggleNotifs} className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
      <Bell size={20} />
      {unreadCount > 0 && <span className="absolute top-1 right-1.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full text-[0px]">unread</span>}
    </button>
  </div>
);

export default MobileHeader;
