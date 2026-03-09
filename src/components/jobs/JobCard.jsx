// src/components/jobs/JobCard.jsx
// Description: Card component showing job listing details with apply/withdraw/manage actions.

import React from 'react';
import { DAY_MAP } from '../../constants/data.js';
import AvatarCircle from '../ui/AvatarCircle.jsx';
import MapPreview from '../ui/MapPreview.jsx';
import Btn from '../ui/Btn.jsx';

const JobCard = ({ job, myApp, isOwner, onApply, onWithdraw, onOpenChat, onManage, currentUser }) => {
  let badgeClass = "bg-gray-100 text-gray-700";
  if (job.category === "เด็กเสิร์ฟ") badgeClass = "bg-orange-100 text-orange-700";
  else if (job.category === "ถ่ายรูป") badgeClass = "bg-purple-100 text-purple-700";
  else if (job.category === "อีเวนต์") badgeClass = "bg-pink-100 text-pink-700";
  else if (job.category === "พนักงานร้านกาแฟ") badgeClass = "bg-yellow-100 text-yellow-700";
  else if (job.category === "งานออฟฟิศ") badgeClass = "bg-blue-100 text-blue-700";
  else if (job.category === "รับส่งเอกสาร") badgeClass = "bg-green-100 text-green-700";

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 items-center">
          <AvatarCircle name={job.company} size={40} />
          <div>
            <div className="font-semibold text-gray-900">{job.company}</div>
            <div className={`mt-0.5 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
              {job.category}
            </div>
          </div>
        </div>
      </div>

      <div className="text-lg font-bold text-gray-800 mb-2">{job.title}</div>

      <div className="space-y-1.5 mb-3">
        <MapPreview lat={job.lat} lng={job.lng} mapLink={job.mapLink} locationName={job.location} />
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-gray-400">🕐</span>
          {job.startTime} – {job.endTime}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-gray-400">📅</span>
          {job.days.map(d => DAY_MAP[d]).join(" · ")}
        </div>
        <div className="flex items-center gap-2 text-sm mt-2">
          <span className="font-bold text-lg" style={{ color: "#F58220" }}>{job.wage} บาท/{job.wageType}</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{job.desc}</p>

      <div className="mt-3 flex gap-2">
        {isOwner ? (
          <Btn full small outline onClick={() => onManage(job)}>จัดการงาน</Btn>
        ) : currentUser?.role === "employee" ? (
          <>
            <Btn outline small onClick={() => onOpenChat(job)}>ติดต่อ</Btn>
            {!myApp ? (
              <Btn full small color="#F58220" onClick={() => onApply(job)}>สมัครงาน</Btn>
            ) : myApp.applicationStatus === "pending" ? (
              <Btn full small onClick={() => onWithdraw(myApp.id)}>ยกเลิกการสมัคร</Btn>
            ) : myApp.applicationStatus === "accepted" ? (
              <Btn full small color="#22C55E" disabled>ได้รับการตอบรับ ✓</Btn>
            ) : (
              <Btn full small color="#EF4444" disabled>ถูกปฏิเสธ</Btn>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default JobCard;
