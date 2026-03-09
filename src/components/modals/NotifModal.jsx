// src/components/modals/NotifModal.jsx
// Description: Notification list modal that auto-marks notifications as read on open.

import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Btn from '../ui/Btn.jsx';

const NotifModal = ({ notifs, onClose, onClearAll, currentUser, syncNotifs }) => {
  const myNotifs = notifs.filter(n => n.userId === currentUser.id).sort((a,b) => b.time - a.time);

  useEffect(() => {
    if (myNotifs.some(n => !n.read)) {
      syncNotifs(notifs.map(n => n.userId === currentUser.id ? { ...n, read: true } : n));
    }
  }, [myNotifs, notifs, currentUser.id, syncNotifs]);

  return (
    <Modal title="การแจ้งเตือน" onClose={onClose} wide>
      <div className="flex justify-end mb-4">
        <Btn small outline color="#EF4444" onClick={() => onClearAll(currentUser.id)}>ล้างการแจ้งเตือนทั้งหมด</Btn>
      </div>
      <div className="space-y-3">
        {myNotifs.length === 0 ? <p className="text-gray-500 text-center py-8">ไม่มีการแจ้งเตือน</p> : myNotifs.map(n => (
          <div key={n.id} className={`p-4 rounded-2xl border ${n.read ? 'bg-white border-gray-100' : 'bg-orange-50/50 border-orange-100'} flex gap-3 items-start`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.type === 'new_application' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{n.text}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(n.time).toLocaleString('th-TH')}</p>
            </div>
            {!n.read && <div className="w-2 h-2 bg-[#F58220] rounded-full mt-2"></div>}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default NotifModal;
