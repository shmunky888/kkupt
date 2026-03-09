// src/components/modals/EditProfileModal.jsx
// Description: Modal for editing name, email, and skills of the current user.

import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Btn from '../ui/Btn.jsx';

const EditProfileModal = ({ currentUser, users, syncUsers, setCurrentUser, onClose, showToast }) => {
  const [data, setData] = useState({ name: currentUser.name, email: currentUser.email, skills: currentUser.skills.join(", ") });

  const handleSave = () => {
    if (!data.name || !data.email) return showToast("กรุณากรอกชื่อและอีเมล");
    const updatedSkills = currentUser.role === "employee" ? data.skills.split(",").map(s => s.trim()).filter(Boolean) : [];

    const updatedUser = { ...currentUser, name: data.name, email: data.email, skills: updatedSkills };
    syncUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    showToast("บันทึกข้อมูลสำเร็จ!");
    onClose();
  };

  return (
    <Modal title="แก้ไขโปรไฟล์" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">ชื่อ-นามสกุล</label>
          <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">อีเมล</label>
          <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
        </div>
        {currentUser.role === "employee" && (
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">ทักษะของคุณ (คั่นด้วยจุลภาค)</label>
            <input type="text" placeholder="เช่น สื่อสาร, ถ่ายรูป" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={data.skills} onChange={e => setData({...data, skills: e.target.value})} />
          </div>
        )}
        <div className="pt-4 border-t border-gray-100">
          <Btn full color="#F58220" onClick={handleSave}>บันทึกโปรไฟล์</Btn>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
