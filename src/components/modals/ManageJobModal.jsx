// src/components/modals/ManageJobModal.jsx
// Description: Employer modal to accept/reject applicants, mark jobs complete, and delete listings.

import React from 'react';
import AvatarCircle from '../ui/AvatarCircle.jsx';
import StatusBadge from '../ui/StatusBadge.jsx';
import Modal from '../ui/Modal.jsx';
import Btn from '../ui/Btn.jsx';

const ManageJobModal = ({ job, apps, users, syncApps, addNotif, showToast, onClose, handleDeleteJob, onViewProfile }) => {
  const jobApps = apps.filter(a => a.jobId === job.id);

  const handleAcceptReject = (appId, action) => {
    syncApps(apps.map(a => a.id === appId ? { ...a, applicationStatus: action } : a));
    const app = jobApps.find(a => a.id === appId);
    addNotif({
      userId: app.userId, type: "status_update", jobId: job.id,
      text: action === "accepted" ? "คุณได้รับการตอบรับเข้าทำงาน! 🎉" : "ขออภัย การสมัครงานถูกปฏิเสธ"
    });
    showToast(action === "accepted" ? "รับเข้าทำงานแล้ว!" : "ปฏิเสธแล้ว");
  };

  const handleMarkComplete = (appId) => {
    syncApps(apps.map(a => a.id === appId ? { ...a, workStatus: "completed", completedAt: Date.now() } : a));
    showToast("งานเสร็จสิ้น!");
  };

  return (
    <Modal title={job.title} onClose={onClose} wide>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4 flex justify-between items-center">
          <div><p className="text-sm font-bold text-gray-700">สถานะโพสต์</p><StatusBadge status={job.status} /></div>
          <div className="text-center">
            {job.slotsNeeded > 0 && (
              <>
                <p className="text-sm font-bold text-gray-700">รับแล้ว</p>
                <p className="font-bold text-xl" style={{ color: jobApps.filter(a => a.applicationStatus === "accepted").length >= job.slotsNeeded ? "#EF4444" : "#22C55E" }}>
                  {jobApps.filter(a => a.applicationStatus === "accepted").length}/{job.slotsNeeded} คน
                </p>
              </>
            )}
          </div>
          <div className="text-right"><p className="text-sm font-bold text-gray-700">ผู้สมัครทั้งหมด</p><p className="text-[#F58220] font-bold text-xl">{jobApps.length} คน</p></div>
        </div>

        <h4 className="font-bold text-gray-800">รายชื่อผู้สมัคร</h4>
        {jobApps.length === 0 ? <p className="text-gray-500 text-sm text-center py-6 border border-dashed border-gray-200 rounded-2xl">ยังไม่มีผู้สมัคร</p> : jobApps.map(a => {
          const u = users.find(x => x.id === a.userId);
          if (!u) return null;
          return (
            <div key={a.id} className="p-4 border border-gray-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button onClick={() => onViewProfile && onViewProfile(a.userId)} className="flex items-center gap-3 group text-left">
                  <AvatarCircle name={u.name} size={40} />
                  <div>
                    <div className="font-bold text-gray-800 text-sm group-hover:text-[#F58220] transition-colors">{u.name}</div>
                    <div className="text-xs text-gray-500">สมัครเมื่อ {new Date(a.appliedAt).toLocaleDateString('th-TH')}</div>
                    {u.skills.length > 0 && <div className="text-xs text-blue-500 mt-1">{u.skills.join(', ')}</div>}
                  </div>
                </button>
              </div>
              <div className="flex flex-col gap-2 items-end shrink-0">
                {a.applicationStatus === "pending" ? (
                  <div className="flex gap-2">
                    <Btn small outline color="#EF4444" onClick={() => handleAcceptReject(a.id, "rejected")}>✗ ปฏิเสธ</Btn>
                    <Btn small outline color="#22C55E" onClick={() => handleAcceptReject(a.id, "accepted")}>✓ รับเข้าทำงาน</Btn>
                  </div>
                ) : a.applicationStatus === "accepted" && a.workStatus !== "completed" ? (
                  <Btn small color="#22C55E" onClick={() => handleMarkComplete(a.id)}>✓ งานเสร็จแล้ว</Btn>
                ) : a.workStatus === "completed" ? (
                  <div className="flex flex-col gap-2 items-end">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-1">เสร็จสิ้น</span>
                    {!a.employerReview ? (
                      <Btn small color="#F58220" outline onClick={() => window.alert("เปิด ReviewModal: " + a.id)}>✍️ รีวิวลูกจ้าง</Btn>
                    ) : (
                      <span className="text-xs font-bold text-green-600">✓ รีวิวแล้ว</span>
                    )}
                  </div>
                ) : (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">ปฏิเสธแล้ว</span>
                )}
              </div>
            </div>
          );
        })}
        <div className="pt-4 mt-6 border-t border-gray-100">
          <Btn full outline color="#EF4444" onClick={() => { onClose(); handleDeleteJob(job.id); }}>🗑 ลบประกาศนี้</Btn>
        </div>
      </div>
    </Modal>
  );
};

export default ManageJobModal;
