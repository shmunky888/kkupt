// src/components/modals/SettingsModal.jsx
// Description: Settings modal for password change, dark mode toggle, and notification preference.

import React, { useState } from 'react';
import { LS } from '../../services/storage.js';
import Modal from '../ui/Modal.jsx';
import Btn from '../ui/Btn.jsx';

const SettingsModal = ({ currentUser, users, syncUsers, onClose, onLogout, notifsEnabled, setNotifsEnabled, showToast }) => {
  const [pwd, setPwd] = useState({ current: "", new: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [showPolicy, setShowPolicy] = useState(false);

  const handleSavePwd = () => {
    if (pwd.current !== currentUser.password) return showToast("รหัสผ่านปัจจุบันไม่ถูกต้อง");
    if (pwd.new.length < 6) return showToast("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
    if (pwd.new !== pwd.confirm) return showToast("รหัสผ่านใหม่ไม่ตรงกัน");

    const newUsers = users.map(u => u.id === currentUser.id ? { ...u, password: pwd.new } : u);
    syncUsers(newUsers);
    showToast("เปลี่ยนรหัสผ่านสำเร็จ!");
    setPwd({ current: "", new: "", confirm: "" });
  };

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  if (showPolicy) return (
    <Modal title="นโยบายการใช้งาน" onClose={() => setShowPolicy(false)}>
      <div className="space-y-4 text-sm text-gray-600 p-2">
        <p>1. ห้ามโพสต์งานที่ผิดกฎหมายหรือศีลธรรมอันดี</p>
        <p>2. การติดต่อสื่อสารต้องสุภาพและให้เกียรติซึ่งกันและกัน</p>
        <p>3. แพลตฟอร์มเป็นเพียงสื่อกลาง ไม่รับผิดชอบต่อความเสียหายใดๆ</p>
      </div>
    </Modal>
  );

  return (
    <Modal title="การตั้งค่า" onClose={onClose} wide>
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-4">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowPwd(!showPwd)}>
            <h4 className="font-bold text-gray-800">เปลี่ยนรหัสผ่าน</h4>
            <span className="text-sm text-[#F58220]">{showPwd ? "ปิด" : "เปิด"}</span>
          </div>
          {showPwd && (
            <div className="space-y-3 pt-2">
              <input type="password" placeholder="รหัสผ่านปัจจุบัน" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F58220]" value={pwd.current} onChange={e => setPwd({...pwd, current: e.target.value})} />
              <input type="password" placeholder="รหัสผ่านใหม่ (อักขระ 6 ตัวขึ้นไป)" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F58220]" value={pwd.new} onChange={e => setPwd({...pwd, new: e.target.value})} />
              <input type="password" placeholder="ยืนยันรหัสผ่านใหม่" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F58220]" value={pwd.confirm} onChange={e => setPwd({...pwd, confirm: e.target.value})} />
              <Btn full color="#F58220" onClick={handleSavePwd} disabled={!pwd.current || !pwd.new || !pwd.confirm}>บันทึกรหัสผ่าน</Btn>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-800 px-2">การแสดงผล & การแจ้งเตือน</h4>
          <label className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-50">
            <span className="font-medium text-gray-700">โหมดกลางคืน (Dark Mode)</span>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-[#F58220]' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
            <input type="checkbox" className="hidden" checked={isDark} onChange={toggleDark} />
          </label>
          <label className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-50">
            <span className="font-medium text-gray-700">การแจ้งเตือน ({notifsEnabled ? "เปิด" : "ปิด"})</span>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${notifsEnabled ? 'bg-[#F58220]' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notifsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
            <input type="checkbox" className="hidden" checked={notifsEnabled} onChange={e => { setNotifsEnabled(e.target.checked); LS.set("kku_notifications_enabled", e.target.checked); }} />
          </label>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <Btn full outline onClick={() => setShowPolicy(true)}>นโยบายการใช้งาน</Btn>
          <Btn full color="#EF4444" outline onClick={onLogout}>ออกจากระบบ</Btn>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
