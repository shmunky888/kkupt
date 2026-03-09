// src/tabs/PostTab.jsx
// Description: Tab for employers to create new job listings with location pinning.

import React, { useState } from 'react';
import { User } from 'lucide-react';
import { DAY_MAP, CATEGORIES } from '../constants/data.js';
import Btn from '../components/ui/Btn.jsx';
import MapPreview from '../components/ui/MapPreview.jsx';

const PostTab = ({ currentUser, jobs, syncJobs, showToast }) => {
  const [form, setForm] = useState({
    company: currentUser?.name || "", title: "", category: "เด็กเสิร์ฟ", desc: "",
    location: "", mapLink: "", lat: null, lng: null,
    days: [], startTime: "", endTime: "", wage: "", wageType: "ชั่วโมง"
  });

  if (currentUser?.role !== "employer") {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center px-4">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4"><User size={32} /></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">ฟีเจอร์นี้สำหรับนายจ้างเท่านั้น</h2>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">เฉพาะบัญชีนายจ้าง</span>
      </div>
    );
  }

  const toggleDay = d => setForm(prev => ({ ...prev, days: prev.days.includes(d) ? prev.days.filter(x => x !== d) : [...prev.days, d] }));

  const handlePin = () => {
    if (!navigator.geolocation) return showToast("เบราว์เซอร์ไม่รองรับ GPS");
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm({ ...form, lat: pos.coords.latitude, lng: pos.coords.longitude });
        showToast("ดึงพิกัดสำเร็จ!");
      },
      () => showToast("ไม่สามารถดึงพิกัดได้")
    );
  };

  const handleSubmit = () => {
    if (!form.company || !form.title || !form.location || !form.startTime || !form.endTime || !form.wage) return showToast("กรุณากรอกข้อมูลที่มี * ให้ครบ");
    if (!form.days.length) return showToast("กรุณาเลือกอย่างน้อย 1 วัน");
    if (form.startTime >= form.endTime) return showToast("เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด");

    const newJob = { id: "j" + Date.now(), employerId: currentUser.id, ...form, status: "active", postedAt: Date.now() };
    syncJobs([newJob, ...jobs]);
    showToast("โพสต์งานสำเร็จ! 🎉");
    setForm({ company: currentUser.name, title: "", category: "เด็กเสิร์ฟ", desc: "", location: "", mapLink: "", lat: null, lng: null, days: [], startTime: "", endTime: "", wage: "", wageType: "ชั่วโมง" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">ลงประกาศงานใหม่</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div><label className="text-sm font-bold text-gray-700 mb-1 block">ชื่อบริษัท/ร้านค้า *</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={form.company} onChange={e => setForm({...form, company: e.target.value})} /></div>
          <div><label className="text-sm font-bold text-gray-700 mb-1 block">ชื่อตำแหน่งงาน *</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">หมวดหมู่งาน</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.filter(c => c !== "ทั้งหมด").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="text-sm font-bold text-gray-700 mb-1 block">รายละเอียดงาน</label><textarea rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} /></div>

          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-bold text-gray-800 mb-3">วันและเวลาทำงาน</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {Object.keys(DAY_MAP).map(d => (
                <label key={d} className={`flex items-center justify-center py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors border ${form.days.includes(d) ? 'bg-orange-50 border-[#F58220] text-[#F58220]' : 'bg-white border-gray-200 text-gray-600'}`}>
                  <input type="checkbox" checked={form.days.includes(d)} onChange={() => toggleDay(d)} className="hidden" />
                  {DAY_MAP[d]}
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              <div className="flex-1"><label className="text-xs font-bold text-gray-500 mb-1 block">เวลาเริ่ม *</label><input type="time" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} /></div>
              <div className="flex-1"><label className="text-xs font-bold text-gray-500 mb-1 block">เวลาสิ้นสุด *</label><input type="time" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} /></div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-bold text-gray-800 mb-3">ค่าตอบแทน</h4>
            <div className="flex gap-4">
              <div className="flex-1"><input type="number" placeholder="ตัวเลข *" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={form.wage} onChange={e => setForm({...form, wage: e.target.value})} /></div>
              <div className="flex-1"><select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={form.wageType} onChange={e => setForm({...form, wageType: e.target.value})}><option value="ชั่วโมง">ชั่วโมง</option><option value="วัน">วัน</option><option value="งาน">งาน</option></select></div>
            </div>
          </div>

          <Btn full color="#F58220" onClick={handleSubmit}>โพสต์ประกาศงาน</Btn>
        </div>

        <div className="flex-1 space-y-4 md:max-w-xs">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-bold text-gray-800">สถานที่ทำงาน</h4>
            <div><label className="text-xs font-bold text-gray-500 mb-1 block">ชื่อสถานที่ *</label><input type="text" placeholder="เช่น อาคาร A ชั้น 3" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
            <div><label className="text-xs font-bold text-gray-500 mb-1 block">Google Maps URL</label><input type="text" placeholder="วางลิงก์ (ไม่บังคับ)" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={form.mapLink} onChange={e => setForm({...form, mapLink: e.target.value})} /></div>
            <Btn outline full small onClick={handlePin}>📍 ปักหมุดปัจจุบัน</Btn>
            {form.lat && form.lng && <div className="text-xs text-green-600 bg-green-50 p-2 rounded-lg text-center font-mono">📌 lat: {form.lat.toFixed(4)}, lng: {form.lng.toFixed(4)}</div>}
            {(form.lat || form.mapLink) && <MapPreview lat={form.lat} lng={form.lng} mapLink={form.mapLink} locationName={form.location || "ตรวจพิกัดแผนที่"} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostTab;
