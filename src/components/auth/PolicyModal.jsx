// src/components/auth/PolicyModal.jsx
// Description: One-time policy acceptance modal shown before completing login/register.

import React from 'react';
import { Home } from 'lucide-react';
import Btn from '../ui/Btn.jsx';

const PolicyModal = ({ onAccept }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-orange-100 text-[#F58220] rounded-full flex items-center justify-center mb-4">
        <Home size={32} />
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">นโยบายการใช้งาน</h3>
      <p className="text-sm text-gray-600 mb-6">
        ข้อตกลงการใช้งาน KKU PART-TIME ห้ามนำข้อมูลไปใช้ในทางที่ผิด ห้ามกลั่นแกล้งหรือโพสต์ข้อมูลเท็จ
        ผู้ใช้ต้องรับผิดชอบต่อข้อมูลของตนเอง
      </p>
      <Btn full color="#F58220" onClick={onAccept}>ยอมรับและเข้าใช้งาน</Btn>
    </div>
  </div>
);

export default PolicyModal;
