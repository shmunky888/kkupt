// src/components/ui/StatusBadge.jsx
// Description: Colored pill badge that maps English status values to Thai labels.

import React from 'react';

const StatusBadge = ({ status }) => {
  let cls = "";
  let label = status;
  if (status === "pending")   { cls = "bg-yellow-100 text-yellow-700"; label = "รอดำเนินการ"; }
  else if (status === "accepted")  { cls = "bg-green-100 text-green-700";  label = "ตอบรับแล้ว"; }
  else if (status === "rejected")  { cls = "bg-red-100 text-red-600";      label = "ปฏิเสธ"; }
  else if (status === "completed") { cls = "bg-blue-100 text-blue-700";    label = "เสร็จสิ้น"; }
  else if (status === "active")    { cls = "bg-green-100 text-green-700";  label = "เปิดรับสมัคร"; }
  else { cls = "bg-gray-100 text-gray-700"; }

  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${cls}`}>{label}</span>;
};

export default StatusBadge;
