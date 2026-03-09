// src/components/layout/BottomTabBar.jsx
// Description: Mobile-only fixed bottom tab bar for primary navigation.

import React from 'react';
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react';

const BottomTabBar = ({ currentTab, setTab, currentUser }) => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-30 flex items-center justify-around pb-1">
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
        className="flex flex-col items-center justify-center w-full h-full space-y-1"
        style={currentTab === t.id ? { color: "#F58220" } : { color: "#6B7280" }}
      >
        <t.icon size={22} className={currentTab === t.id ? "fill-orange-50" : ""} />
        <span className="text-[10px] font-medium">{t.label}</span>
      </button>
    ))}
  </div>
);

export default BottomTabBar;
