// src/components/modals/UserProfileModal.jsx
// Description: Public profile modal showing a user's info, average rating, and all reviews received.

import React from 'react';
import Modal from '../ui/Modal.jsx';
import AvatarCircle from '../ui/AvatarCircle.jsx';
import StarRating from '../ui/StarRating.jsx';

const UserProfileModal = ({ userId, users, apps, jobs, onClose }) => {
  const user = users.find(u => u.id === userId);
  if (!user) return null;

  const isEmployer = user.role === 'employer';

  // Reviews received
  const reviews = isEmployer
    ? apps
        .filter(a => a.employerId === userId && a.employeeReviewForEmployer)
        .map(a => ({
          review: a.employeeReviewForEmployer,
          reviewerName: users.find(u => u.id === a.userId)?.name || 'ผู้ใช้',
          jobTitle: jobs.find(j => j.id === a.jobId)?.title || '',
        }))
    : apps
        .filter(a => a.userId === userId && a.employerReview)
        .map(a => ({
          review: a.employerReview,
          reviewerName: users.find(u => u.id === a.employerId)?.name || 'นายจ้าง',
          jobTitle: jobs.find(j => j.id === a.jobId)?.title || '',
        }));

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.review.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <Modal title="โปรไฟล์" onClose={onClose} wide>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 pb-4 border-b border-gray-100">
          <AvatarCircle name={user.name} size={72} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${isEmployer ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-[#F58220]'}`}>
            {isEmployer ? 'นายจ้าง' : 'นักศึกษา'}
          </span>

          {!isEmployer && user.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {user.skills.map((s, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">{s}</span>
              ))}
            </div>
          )}

          {avgRating && (
            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl">
              <StarRating value={Math.round(Number(avgRating))} readonly size={18} />
              <span className="font-bold text-[#F58220] text-sm">{avgRating}</span>
              <span className="text-xs text-gray-400">({reviews.length} รีวิว)</span>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div>
          <h4 className="font-bold text-gray-700 mb-3">
            {isEmployer ? 'รีวิวจากลูกจ้าง' : 'รีวิวจากนายจ้าง'}
          </h4>
          {reviews.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-2xl">
              <p className="text-gray-400 text-sm">ยังไม่มีรีวิว</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-700 text-sm">{r.reviewerName}</span>
                      {r.jobTitle && <span className="text-gray-400 text-xs ml-2">· {r.jobTitle}</span>}
                    </div>
                    <StarRating value={r.review.rating} readonly size={14} />
                  </div>
                  {r.review.text ? (
                    <p className="text-sm text-gray-600 italic">"{r.review.text}"</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserProfileModal;
