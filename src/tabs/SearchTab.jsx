// src/tabs/SearchTab.jsx
// Description: Advanced job search tab with multi-filter (keyword, category, wage, days, time).

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { DAY_MAP, CATEGORIES } from '../constants/data.js';
import JobCard from '../components/jobs/JobCard.jsx';
import Btn from '../components/ui/Btn.jsx';

const SearchTab = ({ jobs, apps, currentUser, onApply, onWithdraw, onOpenChat, onManage }) => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");
  const [wageMin, setWageMin] = useState("");
  const [wageType, setWageType] = useState("ทั้งหมด");
  const [days, setDays] = useState([]);
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [showDays, setShowDays] = useState(false);

  const handleReset = () => {
    setKeyword(""); setCategory("ทั้งหมด"); setWageMin(""); setWageType("ทั้งหมด");
    setDays([]); setTimeFrom(""); setTimeTo("");
  };

  const toggleDay = d => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const filtered = jobs
    .filter(j => j.status === "active")
    .filter(j => !keyword || j.title.toLowerCase().includes(keyword.toLowerCase()) || j.company.toLowerCase().includes(keyword.toLowerCase()))
    .filter(j => !category || category === "ทั้งหมด" || j.category === category)
    .filter(j => !wageMin || j.wage >= Number(wageMin))
    .filter(j => !wageType || wageType === "ทั้งหมด" || j.wageType === wageType)
    .filter(j => !days.length || days.every(d => j.days.includes(d)))
    .filter(j => !timeFrom || j.startTime >= timeFrom)
    .filter(j => !timeTo || j.endTime <= timeTo)
    .filter(j => currentUser.role !== 'employer' || j.employerId === currentUser.id);

  return (
    <div className="space-y-6">
      {currentUser.role !== 'employer' && (
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="ค้นหาตำแหน่งงาน..." className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={keyword} onChange={e => setKeyword(e.target.value)} />
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" placeholder="ค่าตอบแทนขั้นต่ำ (บาท)" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={wageMin} onChange={e => setWageMin(e.target.value)} />
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={wageType} onChange={e => setWageType(e.target.value)}>
              {["ทั้งหมด", "ชั่วโมง", "วัน", "งาน"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="relative z-10">
              <button onClick={() => setShowDays(!showDays)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220] flex justify-between items-center text-gray-600">
                {days.length ? `เลือก ${days.length} วัน` : "วันทำงาน (ทั้งหมด)"}
              </button>
              {showDays && (
                <div className="absolute top-14 left-0 w-full bg-white border border-gray-100 shadow-xl rounded-xl p-3 flex flex-wrap gap-2 z-20">
                  {Object.keys(DAY_MAP).map(d => (
                    <label key={d} className="flex items-center gap-2 w-[48%] text-sm cursor-pointer">
                      <input type="checkbox" checked={days.includes(d)} onChange={() => toggleDay(d)} className="accent-[#F58220]" />
                      {DAY_MAP[d]}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input type="time" className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={timeFrom} onChange={e => setTimeFrom(e.target.value)} />
              <input type="time" className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={timeTo} onChange={e => setTimeTo(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end pt-2 border-t border-gray-100">
            <Btn outline small onClick={handleReset}>🔄 รีเซ็ตตัวกรอง</Btn>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-bold text-gray-800 mb-4">พบ {filtered.length} ตำแหน่งงาน</h3>
        {filtered.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-gray-300 flex justify-center mb-3"><Search size={48} /></div>
            <p className="text-gray-500 font-medium">ไม่พบงานที่ตรงกับเงื่อนไข</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(job => (
              <JobCard key={job.id} job={job} myApp={apps.find(a => a.jobId === job.id && a.userId === currentUser.id)} isOwner={currentUser.id === job.employerId} onApply={onApply} onWithdraw={onWithdraw} onOpenChat={onOpenChat} onManage={onManage} currentUser={currentUser} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTab;
