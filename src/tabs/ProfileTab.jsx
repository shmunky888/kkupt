// src/tabs/ProfileTab.jsx
// Description: Profile tab showing user info, skills, applied/completed jobs (employee) or posted jobs (employer).

import React from 'react';
import AvatarCircle from '../components/ui/AvatarCircle.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import StarRating from '../components/ui/StarRating.jsx';
import Btn from '../components/ui/Btn.jsx';

const ProfileTab = ({ currentUser, jobs, apps, onWithdraw, handleDeleteJob, onManage, onViewDetails }) => {
  const isEmployer = currentUser.role === "employer";

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto items-start">
      {/* Left Card */}
      <div className="w-full md:w-80 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-20 text-center shrink-0">
        <div className="flex justify-center mb-4"><AvatarCircle name={currentUser.name} size={80} /></div>
        <h2 className="text-2xl font-bold text-gray-800">{currentUser.name}</h2>
        <p className="text-gray-500 text-sm mb-3">{currentUser.email}</p>
        <div className="flex justify-center mb-5">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${isEmployer ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-[#F58220]'}`}>
            {isEmployer ? "นายจ้าง" : "นักศึกษา"}
          </span>
        </div>
        {!isEmployer && currentUser.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {currentUser.skills.map((s, i) => <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">{s}</span>)}
          </div>
        )}
        <div className="space-y-3">
          <Btn full outline small onClick={() => window.alert("เปิด EditProfileModal")}>✏️ แก้ไขโปรไฟล์</Btn>
          <Btn full outline small onClick={() => window.alert("เปิด SettingsModal")}>⚙️ ตั้งค่า</Btn>
        </div>
      </div>

      {/* Right Sections */}
      <div className="flex-1 w-full space-y-6">
        {!isEmployer ? (
          <>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><span className="text-xl mr-2">⏳</span> งานที่สมัครแล้ว</h3>
              <div className="space-y-4">
                {apps.filter(a => a.userId === currentUser.id && a.workStatus !== "completed").length === 0 ? (
                  <p className="text-gray-500 text-sm py-4 text-center">ยังไม่มีงานที่สมัคร</p>
                ) : apps.filter(a => a.userId === currentUser.id && a.workStatus !== "completed").sort((a,b)=>b.appliedAt-a.appliedAt).map(a => {
                  const j = jobs.find(x => x.id === a.jobId);
                  if (!j) return null;
                  return (
                    <div key={a.id}
                      onClick={() => onViewDetails(j)}
                      className="p-4 border border-gray-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-orange-200 cursor-pointer transition-colors bg-gray-50/50"
                    >
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 mb-1">{j.title} <span className="text-sm font-normal text-gray-500">({j.company})</span></div>
                        <div className="text-xs text-gray-400 mb-2">วันที่สมัคร: {new Date(a.appliedAt).toLocaleDateString('th-TH', { year:'numeric', month:'short', day:'numeric' })}</div>
                        <StatusBadge status={a.applicationStatus} />
                      </div>
                      <div className="md:text-right" onClick={e => e.stopPropagation()}>
                        {a.applicationStatus === "pending" ? (
                          <Btn outline small color="#EF4444" onClick={() => onWithdraw(a.id)}>ยกเลิกการสมัคร</Btn>
                        ) : a.applicationStatus === "accepted" ? (
                          <div className="text-green-600 text-sm font-medium flex items-center gap-1">🔒 เริ่มงานแล้ว</div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><span className="text-xl mr-2">✅</span> ประวัติการทำงาน</h3>
              <div className="space-y-4">
                {apps.filter(a => a.userId === currentUser.id && a.workStatus === "completed").length === 0 ? (
                  <p className="text-gray-500 text-sm py-4 text-center">ยังไม่มีประวัติการทำงาน</p>
                ) : apps.filter(a => a.userId === currentUser.id && a.workStatus === "completed").sort((a,b)=>b.completedAt-a.completedAt).map(a => {
                  const j = jobs.find(x => x.id === a.jobId);
                  if (!j) return null;
                  return (
                    <div key={a.id}
                      onClick={() => onViewDetails(j)}
                      className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-3 cursor-pointer hover:border-orange-200 border border-transparent transition-colors"
                    >
                      <div>
                        <div className="font-bold text-gray-800">{j.title} <span className="text-sm font-normal text-gray-500">({j.company})</span></div>
                        <div className="text-xs text-gray-400">เสร็จสิ้นเมื่อ: {new Date(a.completedAt).toLocaleDateString('th-TH', { year:'numeric', month:'short', day:'numeric' })}</div>
                      </div>

                      {a.employerReview && (
                        <div className="bg-white p-3 rounded-xl border border-orange-100 relative">
                          <div className="text-xs font-bold text-[#F58220] mb-1">นายจ้างรีวิว:</div>
                          <StarRating value={a.employerReview.rating} readonly size={14} />
                          <p className="text-sm text-gray-600 mt-1 italic">"{a.employerReview.text}"</p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-gray-100" onClick={e => e.stopPropagation()}>
                        {a.employeeReview === null ? (
                          <Btn small color="#F58220" outline onClick={() => window.alert("เปิด ReviewModal: " + a.id)}>✍️ เขียนรีวิว</Btn>
                        ) : (
                          <div>
                            <div className="text-xs font-bold text-gray-600 mb-1">รีวิวของคุณ:</div>
                            <StarRating value={a.employeeReview.rating} readonly size={14} />
                            <p className="text-sm text-gray-600 mt-1">"{a.employeeReview.text}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><span className="text-xl mr-2">📌</span> งานที่ลงประกาศ</h3>
            <div className="space-y-4">
              {jobs.filter(j => j.employerId === currentUser.id && j.status !== "deleted").length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">ยังไม่มีงานที่ลงประกาศ</p>
              ) : jobs.filter(j => j.employerId === currentUser.id && j.status !== "deleted").sort((a,b)=>b.postedAt-a.postedAt).map(j => (
                <div key={j.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-200 transition-colors">
                  <div>
                    <div className="font-bold text-gray-800 mb-2">{j.title}</div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={j.status} />
                      <span className="text-xs font-medium bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                        {apps.filter(a => a.jobId === j.id).length} ผู้สมัคร
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Btn small outline onClick={() => onManage(j.id)}>จัดการ</Btn>
                    <Btn small outline color="#EF4444" onClick={() => handleDeleteJob(j.id)}>ลบ</Btn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
