// src/components/modals/ReviewModal.jsx
// Description: Modal for employees to write a star rating + text review for a completed job.

import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Btn from '../ui/Btn.jsx';
import StarRating from '../ui/StarRating.jsx';

const ReviewModal = ({ appId, jobTitle, apps, syncApps, onClose, showToast }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const handleSave = () => {
    if (rating === 0) return showToast("กรุณาให้คะแนนดาว");
    syncApps(apps.map(a => a.id === appId ? { ...a, employeeReview: { rating, text } } : a));
    showToast("บันทึกรีวิวแล้ว!");
    onClose();
  };

  return (
    <Modal title={`รีวิวงาน: ${jobTitle}`} onClose={onClose}>
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">ให้คะแนนความพึงพอใจ</p>
          <StarRating value={rating} onChange={setRating} size={40} />
        </div>
        <textarea rows="4" placeholder="เขียนความประทับใจของคุณ..." className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220] resize-none" value={text} onChange={e => setText(e.target.value)} />
        <Btn full color="#F58220" disabled={rating === 0} onClick={handleSave}>บันทึกรีวิว</Btn>
      </div>
    </Modal>
  );
};

export default ReviewModal;
