// src/components/modals/ReportModal.jsx
// Description: Modal for reporting a user with a reason selector and optional description.

import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Btn from '../ui/Btn.jsx';

const ReportModal = ({ targetUserId, targetName, showToast, onClose }) => {
  const [reason, setReason] = useState("พฤติกรรมไม่เหมาะสม");
  const [detail, setDetail] = useState("");

  return (
    <Modal title={`รายงาน ${targetName}`} onClose={onClose}>
      <div className="space-y-4">
        <label className="text-sm font-bold text-gray-700 mb-1 block">ระบุเหตุผลในการรายงาน</label>
        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={reason} onChange={e => setReason(e.target.value)}>
          {["พฤติกรรมไม่เหมาะสม","ข้อมูลเท็จ","ไม่จ่ายค่าจ้าง","การคุกคาม","อื่นๆ"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <textarea rows="4" placeholder="อธิบายเพิ่มเติม..." className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220] resize-none" value={detail} onChange={e => setDetail(e.target.value)} />
        <div className="pt-4 border-t border-gray-100">
          <Btn full color="#F58220" onClick={() => { showToast("ส่งรายงานเรียบร้อยแล้ว ขอบคุณ"); onClose(); }}>ส่งรายงาน</Btn>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
