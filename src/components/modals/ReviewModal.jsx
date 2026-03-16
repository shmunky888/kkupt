// src/components/modals/ReviewModal.jsx
// Description: Modal for writing star+text reviews. Supports both directions:
//   direction="employer" → employer reviews employee (stores in employerReview)
//   direction="employee" → employee reviews employer (stores in employeeReviewForEmployer)

import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Btn from '../ui/Btn.jsx';
import StarRating from '../ui/StarRating.jsx';

const ReviewModal = ({ appId, targetName, direction = "employer", apps, syncApps, onClose, showToast }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const isEmployerReviewing = direction === "employer";
  const title = isEmployerReviewing ? `รีวิวพนักงาน: ${targetName}` : `รีวิวนายจ้าง: ${targetName}`;
  const field = isEmployerReviewing ? "employerReview" : "employeeReviewForEmployer";

  const handleSave = () => {
    if (rating === 0) return showToast("กรุณาให้คะแนนดาว");
    syncApps(apps.map(a => a.id === appId ? { ...a, [field]: { rating, text } } : a));
    showToast("บันทึกรีวิวแล้ว!");
    onClose();
  };

  return (
    <Modal title={title} onClose={onClose}>
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
