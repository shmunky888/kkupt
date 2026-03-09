// src/components/layout/Sidebar.jsx
// Description: Collapsible side navigation with tab links, user info, and logout button.

import React from 'react';
import { Home, Search, PlusCircle, MessageCircle, User, LogOut, X } from 'lucide-react';
import AvatarCircle from '../ui/AvatarCircle.jsx';

const Sidebar = ({ currentTab, setTab, currentUser, onLogout, isOpen, onClose }) => (
  <>
    {/* Mobile Overlay */}
    {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

    {/* Sidebar Container */}
    <div className={`flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-200 transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

      {/* Header */}
      <div className="h-14 flex items-center justify-between md:justify-center px-4 md:px-0 border-b border-gray-100">
        <div className="text-[#F58220] font-black text-xl tracking-wider">KKU <span className="text-gray-800">PT</span></div>
        <button className="md:hidden text-gray-400 hover:text-gray-600" onClick={onClose}><X size={20}/></button>
      </div>

      <div className="flex-1 py-4 space-y-1">
        {[
          { id: "home", icon: Home, label: "หน้าแรก" },
          { id: "search", icon: Search, label: "ค้นหา" },
          { id: "post", icon: PlusCircle, label: "ลงประกาศ" },
          { id: "chat", icon: MessageCircle, label: "ข้อความ" },
          { id: "profile", icon: User, label: "โปรไฟล์" }
        ].filter(t => currentUser.role === 'employer' ? t.id !== 'search' : t.id !== 'post').map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`w-full flex items-center px-6 py-3 font-medium transition-colors ${currentTab === t.id ? 'bg-orange-50 text-[#F58220] border-l-4' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
            style={currentTab === t.id ? { borderColor: "#F58220", color: "#F58220" } : {}}
          >
            <t.icon size={20} className="mr-3" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <AvatarCircle name={currentUser.name} size={40} />
          <div className="overflow-hidden">
            <div className="font-bold text-sm text-gray-800 truncate">{currentUser.name}</div>
            <div className="text-xs text-gray-500">{currentUser.role === 'employer' ? 'นายจ้าง' : 'นักศึกษา'}</div>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center text-red-500 font-medium text-sm hover:underline">
          <LogOut size={16} className="mr-2" /> ออกจากระบบ
        </button>
      </div>
    </div>
  </>
);

export default Sidebar;
