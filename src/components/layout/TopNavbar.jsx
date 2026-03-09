// src/components/layout/TopNavbar.jsx
// Description: Desktop sticky top navbar with search, notification bell, and user dropdown.

import React, { useState } from 'react';
import { Search, Bell, Menu, User, Settings, LogOut } from 'lucide-react';
import AvatarCircle from '../ui/AvatarCircle.jsx';

const TopNavbar = ({ keyword, setKeyword, unreadCount, toggleNotifs, currentUser, onLogout, toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div className="hidden md:flex h-14 bg-white border-b border-gray-200 fixed top-0 w-full z-50 items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-1 text-gray-500 hover:text-gray-800 transition-colors">
          <Menu size={20} />
        </button>
        <div className="text-[#F58220] font-black text-lg tracking-wider">KKU PT</div>
      </div>
      {currentUser.role !== 'employer' && (
        <div className="flex-1 max-w-md relative mx-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหางาน, บริษัท..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:border-[#F58220] transition-colors"
          />
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className="text-gray-500 text-[10px] sm:text-xs font-semibold tracking-wider hidden sm:block mr-2">PART-TIME</div>
        <button onClick={toggleNotifs} className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
          {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full text-[0px]">unread</span>}
        </button>
        <div className="flex items-center gap-2 cursor-pointer relative" onClick={() => setShowDropdown(!showDropdown)}>
          <AvatarCircle name={currentUser.name} size={32} />
          {showDropdown && (
            <div className="absolute right-0 top-10 w-48 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden block transition-all z-50">
              <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2" onClick={() => window.alert("เปิด EditProfileModal")}><User size={16}/> โปรไฟล์</button>
              <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2" onClick={() => window.alert("เปิด SettingsModal")}><Settings size={16}/> ตั้งค่า</button>
              <div className="border-t border-gray-100"></div>
              <button onClick={onLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"><LogOut size={16}/> ออกจากระบบ</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
