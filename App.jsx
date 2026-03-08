import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, Search, PlusCircle, MessageCircle, User,
  MapPin, Eye, EyeOff, X, Bell, LogOut, Settings, Menu
} from 'lucide-react';

/* Font Loader */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
    body {
      font-family: 'Sarabun', sans-serif;
    }
    html.dark body { background-color: #111827; color: #f3f4f6; }
    html.dark .bg-white { background-color: #1f2937 !important; border-color: #374151 !important; color: #f9fafb !important; }
    html.dark .bg-gray-50 { background-color: #111827 !important; border-color: #374151 !important; color: #f9fafb !important; }
    html.dark .text-gray-800, html.dark .text-gray-900 { color: #f9fafb !important; }
    html.dark .text-gray-700 { color: #e5e7eb !important; }
    html.dark .text-gray-600 { color: #d1d5db !important; }
    html.dark .text-gray-500 { color: #9ca3af !important; }
    html.dark .border-gray-100, html.dark .border-gray-200, html.dark .border-gray-300 { border-color: #374151 !important; }
    html.dark input, html.dark select, html.dark textarea { background-color: #374151 !important; color: #f9fafb !important; border-color: #4b5563 !important; }
    html.dark .bg-orange-50 { background-color: rgba(245, 130, 32, 0.1) !important; border-color: rgba(245, 130, 32, 0.2) !important; color: #f9fafb !important; }
    html.dark .bg-blue-100 { background-color: #1e3a8a !important; color: #bfdbfe !important; }
    html.dark .text-blue-700 { color: #bfdbfe !important; }
    html.dark .bg-green-100 { background-color: #064e3b !important; color: #a7f3d0 !important; }
    html.dark .text-green-700 { color: #a7f3d0 !important; }
    html.dark .bg-red-100 { background-color: #7f1d1d !important; color: #fecaca !important; }
    html.dark .text-red-700 { color: #fecaca !important; }
    html.dark .bg-yellow-100 { background-color: #713f12 !important; color: #fef08a !important; }
    html.dark .text-yellow-700 { color: #fef08a !important; }
  `}</style>
);

/* Constants & Data */
const DAY_MAP = {
  Mon: "จันทร์", Tue: "อังคาร", Wed: "พุธ", Thu: "พฤหัสบดี",
  Fri: "ศุกร์", Sat: "เสาร์", Sun: "อาทิตย์"
};

const CATEGORIES = ["ทั้งหมด","เด็กเสิร์ฟ","ถ่ายรูป","อีเวนต์","พนักงานร้านกาแฟ","งานออฟฟิศ","รับส่งเอกสาร","อื่นๆ"];

const MOCK_USERS = [
  { id:"u1",   name:"สมชาย ใจดี",         email:"somchai@kku.ac.th", password:"1234", role:"employee", skills:["บริการลูกค้า","ถ่ายรูป"], avatar:"SC" },
  { id:"emp1", name:"ร้านกาแฟ Amazon KKU", email:"amazon@kku.ac.th",  password:"1234", role:"employer", skills:[], avatar:"AZ" },
  { id:"emp2", name:"KKU Photo Studio",    email:"photo@kku.ac.th",   password:"1234", role:"employer", skills:[], avatar:"PS" },
  { id:"emp3", name:"KKU Event Team",      email:"event@kku.ac.th",   password:"1234", role:"employer", skills:[], avatar:"ET" },
  { id:"emp4", name:"ร้านอาหาร KKU",       email:"food@kku.ac.th",    password:"1234", role:"employer", skills:[], avatar:"RK" },
  { id:"emp5", name:"ร้านเครื่องเขียน KKU",email:"stationery@kku.ac.th",password:"1234",role:"employer",skills:[],avatar:"KW" },
  { id:"emp6", name:"KKU Office Support",  email:"office@kku.ac.th",  password:"1234", role:"employer", skills:[], avatar:"OS" }
];

const MOCK_JOBS = [
  { id:"j1", employerId:"emp1", company:"ร้านกาแฟ Amazon KKU",  title:"เด็กเสิร์ฟ",      category:"เด็กเสิร์ฟ",         location:"อาคารเรียนรวม 1",     mapLink:"", lat:16.4419, lng:102.8359, days:["Mon","Tue","Wed"], startTime:"08:00", endTime:"14:00", wage:60,  wageType:"ชั่วโมง", desc:"รับนักศึกษาขยัน ยิ้มแย้ม บริการดี",              status:"active",    postedAt: Date.now()-86400000*3 },
  { id:"j2", employerId:"emp2", company:"KKU Photo Studio",     title:"ช่างภาพอีเวนต์",  category:"ถ่ายรูป",             location:"ศูนย์กีฬา KKU",       mapLink:"", lat:16.4480, lng:102.8300, days:["Sat","Sun"],           startTime:"09:00", endTime:"17:00", wage:500, wageType:"วัน",     desc:"ถ่ายงานบัณฑิต งานเลี้ยง มีประสบการณ์ดีมาก",     status:"active",    postedAt: Date.now()-86400000*2 },
  { id:"j3", employerId:"emp3", company:"KKU Event Team",       title:"Staff อีเวนต์",   category:"อีเวนต์",             location:"หอประชุม KKU",         mapLink:"", lat:16.4450, lng:102.8350, days:["Fri","Sat"],           startTime:"13:00", endTime:"22:00", wage:350, wageType:"วัน",     desc:"ช่วยงานอีเวนต์ ติดตั้งเวที ดูแลผู้เข้าร่วม",    status:"active",    postedAt: Date.now()-86400000*1 },
  { id:"j4", employerId:"emp4", company:"ร้านอาหาร KKU",        title:"พนักงานเสิร์ฟ",   category:"เด็กเสิร์ฟ",         location:"ถนนมิตรภาพ",          mapLink:"", lat:16.4400, lng:102.8400, days:["Thu","Fri","Sat"],      startTime:"17:00", endTime:"23:00", wage:65,  wageType:"ชั่วโมง", desc:"ร้านอาหารพื้นเมือง รับนักศึกษา ไม่ต้องมีประสบการณ์", status:"active", postedAt: Date.now()-3600000*5 },
  { id:"j5", employerId:"emp5", company:"ร้านเครื่องเขียน KKU", title:"พนักงานสต็อกสินค้า",category:"อื่นๆ",             location:"หน้าประตูมหาวิทยาลัย",mapLink:"", lat:16.4430, lng:102.8320, days:["Mon","Wed","Fri"],      startTime:"10:00", endTime:"16:00", wage:300, wageType:"วัน",     desc:"ขนและจัดเรียงสินค้า งานไม่หนัก",                status:"completed", postedAt: Date.now()-86400000*30 },
  { id:"j6", employerId:"emp6", company:"KKU Office Support",   title:"ผู้ช่วยงานออฟฟิศ",category:"งานออฟฟิศ",           location:"อาคารบริหาร",         mapLink:"", lat:16.4460, lng:102.8370, days:["Tue","Thu"],           startTime:"09:00", endTime:"15:00", wage:280, wageType:"วัน",     desc:"รับโทรศัพท์ ถ่ายเอกสาร จัดแฟ้ม",                status:"active",    postedAt: Date.now()-3600000*2 }
];

const MOCK_APPS = [
  { id:"a1", jobId:"j1", userId:"u1", employerId:"emp1", applicationStatus:"pending",  workStatus:"pending",   appliedAt:Date.now()-3600000*3,  completedAt:null, employeeReview:null, employerReview:null },
  { id:"a2", jobId:"j5", userId:"u1", employerId:"emp5", applicationStatus:"accepted", workStatus:"completed", appliedAt:Date.now()-86400000*25, completedAt:Date.now()-86400000*5,
    employerReview:{ rating:5, text:"ทำงานขยันมาก มาตรงเวลาทุกวัน แนะนำเลย!" },
    employeeReview:null }
];

const MOCK_CHATS = [
  { id:"ch1", participants:["u1","emp1"], jobId:"j1",
    messages:[
      { id:"m1", from:"emp1", text:"สวัสดีครับ สนใจสมัครงานกับเราไหม?", type:"text", time:Date.now()-3600000*2 },
      { id:"m2", from:"u1",   text:"สวัสดีครับ สนใจมากเลยครับ",          type:"text", time:Date.now()-3600000*1 }
    ]}
];

const MOCK_NOTIFS = [
  { id:"n1", userId:"emp1", type:"new_application", jobId:"j1",
    text:"สมชาย ใจดี สมัครงานเด็กเสิร์ฟ", read:false, time:Date.now()-3600000*3 }
];

/* Storage Helpers */
const LS = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch(e) { console.error("LS set failed:", e); } }
};

/* Reusable Components */

const Btn = ({ children, onClick, color, outline, small, full, disabled, type = "button" }) => {
  const baseClasses = `font-semibold active:scale-95 flex justify-center items-center transition-all ${small ? 'px-3 py-1.5 text-xs rounded-lg' : 'px-4 py-2.5 text-sm rounded-xl'} ${full ? 'w-full' : ''}`;
  
  if (disabled) {
    return (
      <button type={type} disabled className={`${baseClasses} opacity-50 cursor-not-allowed bg-gray-300 text-gray-600`}>
        {children}
      </button>
    );
  }

  if (outline) {
    return (
      <button type={type} onClick={onClick} className={`${baseClasses} border-2 bg-transparent ${color ? '' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`} style={color ? { borderColor: color, color: color } : {}}>
        {children}
      </button>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${baseClasses} text-white ${color ? '' : 'bg-gray-800 focus:bg-gray-900'}`} style={color ? { backgroundColor: color } : {}}>
      {children}
    </button>
  );
};

const StarRating = ({ value, onChange, readonly, size = 20 }) => {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(star => (
        <svg 
          key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          width={size} height={size} viewBox="0 0 24 24" 
          fill={star <= value ? "#F58220" : "#D1D5DB"}
          className={readonly ? "" : "cursor-pointer"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
};

const Toast = ({ msg, onDismiss }) => {
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => onDismiss(), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg, onDismiss]);

  if (!msg) return null;

  return (
    <div className="fixed z-50 bottom-20 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-6 md:right-6 bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-xl transition-all">
      {msg}
    </div>
  );
};

const Modal = ({ title, onClose, wide, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()} 
        className={`bg-white w-full md:rounded-2xl rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh] ${wide ? 'md:max-w-xl' : 'md:max-w-md'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
};

const AvatarCircle = ({ name = "?", size = 40 }) => {
  const char = name.substring(0, 2).toUpperCase();
  const bgColor = stringToColor(name);
  return (
    <div 
      className="rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
      style={{ width: size, height: size, backgroundColor: bgColor, fontSize: size > 30 ? '14px' : '10px' }}
    >
      {char}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  let cls = "";
  let label = status;
  if (status === "pending") { cls = "bg-yellow-100 text-yellow-700"; label = "รอดำเนินการ"; }
  else if (status === "accepted") { cls = "bg-green-100 text-green-700"; label = "ตอบรับแล้ว"; }
  else if (status === "rejected") { cls = "bg-red-100 text-red-600"; label = "ปฏิเสธ"; }
  else if (status === "completed") { cls = "bg-blue-100 text-blue-700"; label = "เสร็จสิ้น"; }
  else if (status === "active") { cls = "bg-green-100 text-green-700"; label = "เปิดรับสมัคร"; }
  else { cls = "bg-gray-100 text-gray-700"; }
  
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${cls}`}>{label}</span>;
};

const MapPreview = ({ lat, lng, mapLink, locationName }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="mt-2">
      <button onClick={() => setShow(!show)} className="flex items-center gap-1 text-sm text-[#F58220] hover:underline mb-2">
        <MapPin size={16} /> <span>{locationName}</span>
      </button>
      
      {show && (
        <div className="rounded-xl overflow-hidden border border-gray-200 mt-2">
          {lat && lng ? (
            <div>
              <iframe
                title="map"
                width="100%"
                height="200"
                className="border-0"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`}
              />
              <div className="bg-gray-50 p-2 text-center text-sm border-t border-gray-200">
                <a href={`https://maps.google.com/?q=${lat},${lng}`} target="_blank" rel="noreferrer" style={{color: "#F58220"}} className="font-semibold px-4 py-1 inline-block">นำทาง</a>
              </div>
            </div>
          ) : mapLink ? (
            <div className="p-4 bg-gray-50 text-center">
              <a href={mapLink} target="_blank" rel="noreferrer" style={{color: "#F58220"}} className="font-semibold underline">ดูแผนที่</a>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 text-center text-gray-500 text-sm">
              ไม่มีข้อมูลแผนที่
            </div>
          )}
        </div>
      )}
    </div>
  );
};


/* JobCard Component */
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


/* Auth Screen */
const PolicyModal = ({ onAccept }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-orange-100 text-[#F58220] rounded-full flex items-center justify-center mb-4">
        <Home size={32} />
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">นโยบายการใช้งาน</h3>
      <p className="text-sm text-gray-600 mb-6">
        ข้อตกลงการใช้งาน KKU PART-TIME ห้ามนำข้อมูลไปใช้ในทางที่ผิด ห้ามกลั่นแกล้งหรือโพสต์ข้อมูลเท็จ
        ผู้ใช้ต้องรับผิดชอบต่อข้อมูลของตนเอง
      </p>
      <Btn full color="#F58220" onClick={onAccept}>ยอมรับและเข้าใช้งาน</Btn>
    </div>
  </div>
);

const AuthScreen = ({ users, setUsers, onLoginSuccess, showToast }) => {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  
  // Register fields
  const [name, setName] = useState("");
  const [role, setRole] = useState("employee");

  const [showPolicy, setShowPolicy] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const handleLogin = () => {
    const u = users.find(u => u.email === email && u.password === password);
    if (u) {
      setPendingUser(u);
      setShowPolicy(true);
    } else {
      showToast("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleRegister = () => {
    if (!name || !email || !password) return showToast("กรุณากรอกข้อมูลให้ครบ");
    if (users.find(u => u.email === email)) return showToast("อีเมลนี้ถูกใช้งานแล้ว");
    
    const newUser = {
      id: "u" + Date.now(),
      name, email, password, role,
      skills: [], avatar: name.substring(0, 2).toUpperCase()
    };
    const newUsers = [...users, newUser];
    setUsers(newUsers);
    LS.set("kku_users", newUsers);
    
    setPendingUser(newUser);
    setShowPolicy(true);
  };

  const handleForgot = () => {
    if (!email) return showToast("กรุณากรอกอีเมล");
    showToast("ส่งลิงก์ไปยังอีเมลแล้ว (mock)");
    setView("login");
  };

  const changeView = (newView) => {
    setView(newView);
    setEmail("");
    setPassword("");
    setName("");
    setRole("employee");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {showPolicy && <PolicyModal onAccept={() => onLoginSuccess(pendingUser)} />}
      
      <div className="w-full max-w-sm bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3" style={{backgroundColor: "#F58220"}}>
            <span className="text-white font-bold text-xl tracking-wider">KKU<br/>PT</span>
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-gray-800">PART-TIME</h1>
        </div>

        {view === "login" && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div>
              <input type="email" placeholder="อีเมล" autoComplete="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#F58220] transition-colors outline-none" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="relative">
              <input type={showPwd ? "text" : "password"} placeholder="รหัสผ่าน" autoComplete="current-password" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#F58220] transition-colors outline-none pr-12" value={password} onChange={e => setPassword(e.target.value)} />
              <button 
                type="button"
                onClick={() => setShowPwd(!showPwd)} 
                className="absolute right-3 top-3.5 text-gray-400 p-1 hover:text-gray-600"
              >
                {showPwd ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
            <Btn type="submit" full color="#F58220">เข้าสู่ระบบ</Btn>
            <div className="flex justify-between items-center text-sm pt-2">
              <button type="button" onClick={() => changeView("register")} className="text-gray-500 hover:text-gray-800">สมัครสมาชิก</button>
              <button type="button" onClick={() => changeView("forgot")} className="text-[#F58220] hover:underline">ลืมรหัสผ่าน?</button>
            </div>
          </form>
        )}

        {view === "register" && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
            <input type="text" placeholder="ชื่อ-นามสกุล" autoComplete="name" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={name} onChange={e => setName(e.target.value)} />
            <input type="email" placeholder="อีเมล" autoComplete="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="รหัสผ่าน" autoComplete="new-password" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={password} onChange={e => setPassword(e.target.value)} />
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={role} onChange={e => setRole(e.target.value)}>
              <option value="employee">หางาน (นักศึกษา)</option>
              <option value="employer">ประกาศงาน (นายจ้าง)</option>
            </select>
            <Btn type="submit" full color="#F58220">สมัครสมาชิก</Btn>
            <div className="text-center pt-2">
              <button type="button" onClick={() => changeView("login")} className="text-sm text-gray-500 hover:text-gray-800">มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</button>
            </div>
          </form>
        )}

        {view === "forgot" && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleForgot(); }}>
            <p className="text-sm text-gray-600 mb-2">กรุณากรอกอีเมลเพื่อรับลิงก์รีเซ็ตรหัสผ่าน</p>
            <input type="email" placeholder="อีเมล" autoComplete="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={email} onChange={e => setEmail(e.target.value)} />
            <Btn type="submit" full color="#F58220">ส่งลิงก์รีเซ็ต</Btn>
            <div className="text-center pt-2">
               <button type="button" onClick={() => changeView("login")} className="text-sm text-gray-500 hover:text-gray-800">กลับไปหน้าเข้าสู่ระบบ</button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};


/* Modals */

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

const SettingsModal = ({ currentUser, users, syncUsers, onClose, onLogout, notifsEnabled, setNotifsEnabled, showToast }) => {
  const [pwd, setPwd] = useState({ current: "", new: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [showPolicy, setShowPolicy] = useState(false);

  const handleSavePwd = () => {
    if (pwd.current !== currentUser.password) return showToast("รหัสผ่านปัจจุบันไม่ถูกต้อง");
    if (pwd.new.length < 6) return showToast("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
    if (pwd.new !== pwd.confirm) return showToast("รหัสผ่านใหม่ไม่ตรงกัน");

    const newUsers = users.map(u => u.id === currentUser.id ? { ...u, password: pwd.new } : u);
    syncUsers(newUsers);
    showToast("เปลี่ยนรหัสผ่านสำเร็จ!");
    setPwd({ current: "", new: "", confirm: "" });
  };

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  if (showPolicy) return (
    <Modal title="นโยบายการใช้งาน" onClose={() => setShowPolicy(false)}>
      <div className="space-y-4 text-sm text-gray-600 p-2">
        <p>1. ห้ามโพสต์งานที่ผิดกฎหมายหรือศีลธรรมอันดี</p>
        <p>2. การติดต่อสื่อสารต้องสุภาพและให้เกียรติซึ่งกันและกัน</p>
        <p>3. แพลตฟอร์มเป็นเพียงสื่อกลาง ไม่รับผิดชอบต่อความเสียหายใดๆ</p>
      </div>
    </Modal>
  );

  return (
    <Modal title="การตั้งค่า" onClose={onClose} wide>
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-4">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowPwd(!showPwd)}>
            <h4 className="font-bold text-gray-800">เปลี่ยนรหัสผ่าน</h4>
            <span className="text-sm text-[#F58220]">{showPwd ? "ปิด" : "เปิด"}</span>
          </div>
          {showPwd && (
            <div className="space-y-3 pt-2">
              <input type="password" placeholder="รหัสผ่านปัจจุบัน" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F58220]" value={pwd.current} onChange={e => setPwd({...pwd, current: e.target.value})} />
              <input type="password" placeholder="รหัสผ่านใหม่ (อักขระ 6 ตัวขึ้นไป)" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F58220]" value={pwd.new} onChange={e => setPwd({...pwd, new: e.target.value})} />
              <input type="password" placeholder="ยืนยันรหัสผ่านใหม่" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F58220]" value={pwd.confirm} onChange={e => setPwd({...pwd, confirm: e.target.value})} />
              <Btn full color="#F58220" onClick={handleSavePwd} disabled={!pwd.current || !pwd.new || !pwd.confirm}>บันทึกรหัสผ่าน</Btn>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-800 px-2">การแสดงผล & การแจ้งเตือน</h4>
          <label className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-50">
            <span className="font-medium text-gray-700">โหมดกลางคืน (Dark Mode)</span>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-[#F58220]' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
            <input type="checkbox" className="hidden" checked={isDark} onChange={toggleDark} />
          </label>
          <label className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-50">
            <span className="font-medium text-gray-700">การแจ้งเตือน ({notifsEnabled ? "เปิด" : "ปิด"})</span>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${notifsEnabled ? 'bg-[#F58220]' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notifsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
            <input type="checkbox" className="hidden" checked={notifsEnabled} onChange={e => { setNotifsEnabled(e.target.checked); LS.set("kku_notifications_enabled", e.target.checked); }} />
          </label>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <Btn full outline onClick={() => setShowPolicy(true)}>นโยบายการใช้งาน</Btn>
          <Btn full color="#EF4444" outline onClick={onLogout}>ออกจากระบบ</Btn>
        </div>
      </div>
    </Modal>
  );
};

const EditProfileModal = ({ currentUser, users, syncUsers, setCurrentUser, onClose, showToast }) => {
  const [data, setData] = useState({ name: currentUser.name, email: currentUser.email, skills: currentUser.skills.join(", ") });
  
  const handleSave = () => {
    if (!data.name || !data.email) return showToast("กรุณากรอกชื่อและอีเมล");
    const updatedSkills = currentUser.role === "employee" ? data.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
    
    const updatedUser = { ...currentUser, name: data.name, email: data.email, skills: updatedSkills };
    syncUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    showToast("บันทึกข้อมูลสำเร็จ!");
    onClose();
  };

  return (
    <Modal title="แก้ไขโปรไฟล์" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">ชื่อ-นามสกุล</label>
          <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">อีเมล</label>
          <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
        </div>
        {currentUser.role === "employee" && (
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">ทักษะของคุณ (คั่นด้วยจุลภาค)</label>
            <input type="text" placeholder="เช่น สื่อสาร, ถ่ายรูป" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={data.skills} onChange={e => setData({...data, skills: e.target.value})} />
          </div>
        )}
        <div className="pt-4 border-t border-gray-100">
          <Btn full color="#F58220" onClick={handleSave}>บันทึกโปรไฟล์</Btn>
        </div>
      </div>
    </Modal>
  );
};

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

const ManageJobModal = ({ job, apps, users, syncApps, addNotif, showToast, onClose, handleDeleteJob }) => {
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
          <div className="text-right"><p className="text-sm font-bold text-gray-700">ผู้สมัครทั้งหมด</p><p className="text-[#F58220] font-bold text-xl">{jobApps.length} คน</p></div>
        </div>
        
        <h4 className="font-bold text-gray-800">รายชื่อผู้สมัคร</h4>
        {jobApps.length === 0 ? <p className="text-gray-500 text-sm text-center py-6 border border-dashed border-gray-200 rounded-2xl">ยังไม่มีผู้สมัคร</p> : jobApps.map(a => {
          const u = users.find(x => x.id === a.userId);
          if (!u) return null;
          return (
            <div key={a.id} className="p-4 border border-gray-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AvatarCircle name={u.name} size={40} />
                <div>
                  <div className="font-bold text-gray-800 text-sm">{u.name}</div>
                  <div className="text-xs text-gray-500">สมัครเมื่อ {new Date(a.appliedAt).toLocaleDateString('th-TH')}</div>
                  {u.skills.length > 0 && <div className="text-xs text-blue-500 mt-1">{u.skills.join(', ')}</div>}
                </div>
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
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">เสร็จสิ้น</span>
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

const ReportModal = ({ targetUserId, targetName, showToast, onClose }) => {
  const [reason, setReason] = useState("พฤติกรรมไม่เหมาะสม");
  const [detail, setDetail] = useState("");
  
  return (
    <Modal title={`รายงาน ${targetName}`} onClose={onClose}>
      <div className="space-y-4">
        <label className="text-sm font-bold text-gray-700 mb-1 block">ระบุเหตุผลในการรายงาน</label>
        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220]" value={reason} onChange={e => setReason(e.target.value)}>
          {["พฤติกรรมไม่เหมาะสม","ข้อมูลเท็จ","ไม่จ่ายค่าจ้าง","การคุกคาม","อื่นๆ"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <textarea rows="4" placeholder="อธิบายเพิ่มเติม..." className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#F58220] resize-none" value={detail} onChange={e => setDetail(e.target.value)} />
        <div className="pt-4 border-t border-gray-100">
          <Btn full color="#F58220" onClick={() => { showToast("ส่งรายงานเรียบร้อยแล้ว ขอบคุณ"); onClose(); }}>ส่งรายงาน</Btn>
        </div>
      </div>
    </Modal>
  );
};


/* Layout Components */
const Sidebar = ({ currentTab, setTab, currentUser, onLogout, isOpen, onClose }) => (
  <>
    {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
    <div className={`flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-200 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100">
        <div className="text-[#F58220] font-black text-xl tracking-wider">KKU <span className="text-gray-800">PT</span></div>
        <button className="text-gray-400 hover:text-gray-600" onClick={onClose}><X size={20}/></button>
      </div>
    <div className="flex-1 py-4 space-y-1">
      {[
        { id: "home", icon: Home, label: "หน้าแรก" },
        { id: "search", icon: Search, label: "ค้นหา" },
        { id: "post", icon: PlusCircle, label: "ลงประกาศ" },
        { id: "chat", icon: MessageCircle, label: "ข้อความ" },
        { id: "profile", icon: User, label: "โปรไฟล์" }
      ].filter(t => currentUser.role === 'employer' ? t.id !== 'search' : t.id !== 'post').map(t => (
        <button 
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`w-full flex items-center px-6 py-3 font-medium transition-colors ${currentTab === t.id ? 'bg-orange-50 text-[#F58220] border-l-4' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
          style={currentTab === t.id ? { borderColor: "#F58220", color: "#F58220" } : {}}
        >
          <t.icon size={20} className="mr-3" />
          {t.label}
        </button>
      ))}
    </div>
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <AvatarCircle name={currentUser.name} size={40} />
        <div className="overflow-hidden">
          <div className="font-bold text-sm text-gray-800 truncate">{currentUser.name}</div>
          <div className="text-xs text-gray-500">{currentUser.role === 'employer' ? 'นายจ้าง' : 'นักศึกษา'}</div>
        </div>
      </div>
      <button onClick={onLogout} className="flex items-center text-red-500 font-medium text-sm hover:underline">
        <LogOut size={16} className="mr-2" /> ออกจากระบบ
      </button>
    </div>
  </div>
  </>
);

const TopNavbar = ({ keyword, setKeyword, unreadCount, toggleNotifs, currentUser, onLogout, toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div className="hidden md:flex h-14 bg-white border-b border-gray-200 sticky top-0 z-20 items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-1 text-gray-500 hover:text-gray-800 transition-colors">
          <Menu size={20} />
        </button>
        <div className="text-[#F58220] font-black text-lg tracking-wider">KKU PT</div>
        <div className="text-gray-500 text-sm font-semibold tracking-wider border-l border-gray-200 pl-4 hidden md:block">PART-TIME</div>
      </div>
      {currentUser.role !== 'employer' && (
        <div className="flex-1 max-w-md relative mx-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="ค้นหางาน, บริษัท..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:border-[#F58220] transition-colors"
          />
        </div>
      )}
      <div className="flex items-center gap-4">
        <button onClick={toggleNotifs} className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
          {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full text-[0px]">unread</span>}
        </button>
        <div className="flex items-center gap-2 cursor-pointer relative" onClick={() => setShowDropdown(!showDropdown)}>
          <AvatarCircle name={currentUser.name} size={32} />
          {showDropdown && (
            <div className="absolute right-0 top-10 w-48 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden block transition-all z-50">
              <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2" onClick={() => window.alert("เปิด EditProfileModal")}><User size={16}/> โปรไฟล์</button>
              <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2" onClick={() => window.alert("เปิด SettingsModal")}><Settings size={16}/> ตั้งค่า</button>
              <div className="border-t border-gray-100"></div>
              <button onClick={onLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"><LogOut size={16}/> ออกจากระบบ</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MobileHeader = ({ unreadCount, toggleNotifs, toggleSidebar }) => (
  <div className="md:hidden h-14 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-4">
    <div className="flex items-center gap-3">
      <button onClick={toggleSidebar} className="p-1 text-gray-600">
        <Menu size={24} />
      </button>
      <div className="text-[#F58220] font-black text-lg tracking-wider">KKU <span className="text-gray-800 text-base">PART-TIME</span></div>
    </div>
    <button onClick={toggleNotifs} className="relative p-2 text-gray-600">
      <Bell size={24} />
      {unreadCount > 0 && <span className="absolute top-1 right-1.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full text-[0px]">unread</span>}
    </button>
  </div>
);

const BottomTabBar = ({ currentTab, setTab, currentUser }) => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-30 flex items-center justify-around pb-1">
    {[
      { id: "home", icon: Home, label: "หน้าแรก" },
      { id: "search", icon: Search, label: "ค้นหา" },
      { id: "post", icon: PlusCircle, label: "ลงประกาศ" },
      { id: "chat", icon: MessageCircle, label: "ข้อความ" },
      { id: "profile", icon: User, label: "โปรไฟล์" }
    ].filter(t => currentUser.role === 'employer' ? t.id !== 'search' : t.id !== 'post').map(t => (
      <button 
        key={t.id}
        onClick={() => setTab(t.id)}
        className="flex flex-col items-center justify-center w-full h-full space-y-1"
        style={currentTab === t.id ? { color: "#F58220" } : { color: "#6B7280" }}
      >
        <t.icon size={22} className={currentTab === t.id ? "fill-orange-50" : ""} />
        <span className="text-[10px] font-medium">{t.label}</span>
      </button>
    ))}
  </div>
);


/* Home Tab */
const HomeTab = ({ jobs, apps, currentUser, activeCat, setActiveCat, keyword, onApply, onWithdraw, onOpenChat, onManage }) => {
  const filtered = jobs
    .filter(j => j.status === "active")
    .filter(j => activeCat === "ทั้งหมด" || j.category === activeCat)
    .filter(j => !keyword || j.title.toLowerCase().includes(keyword.toLowerCase()) || j.company.toLowerCase().includes(keyword.toLowerCase()))
    .filter(j => currentUser.role !== 'employer' || j.employerId === currentUser.id)
    .sort((a, b) => b.postedAt - a.postedAt);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Categories */}
      {currentUser.role !== 'employer' && (
        <div className="md:w-48 shrink-0">
          <h3 className="font-bold text-gray-800 mb-3 hidden md:block">หมวดหมู่งาน</h3>
          <div className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar md:overflow-visible pb-2 md:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full md:rounded-xl text-sm font-medium transition-colors md:text-left ${
                  activeCat === cat 
                    ? "shadow-sm text-white" 
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
                style={activeCat === cat ? { backgroundColor: "#F58220", borderColor: "#F58220" } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-10 bg-white rounded-2xl border border-gray-100">
              <div className="text-gray-400 mb-2 flex justify-center"><Search size={32} /></div>
              <p className="text-gray-500">ไม่พบงานที่ตรงกับเงื่อนไข</p>
            </div>
          ) : (
            filtered.map(job => (
              <JobCard 
                key={job.id}
                job={job}
                myApp={apps.find(a => a.jobId === job.id && a.userId === currentUser.id)}
                isOwner={currentUser.id === job.employerId}
                onApply={onApply}
                onWithdraw={onWithdraw}
                onOpenChat={onOpenChat}
                onManage={onManage}
                currentUser={currentUser}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};




/* Search Tab */
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

/* Post Tab */
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


/* Chat Tab */
const ChatTab = ({ currentUser, chats, users, activeChatId, setActiveChatId, syncChats, showToast, apps }) => {
  const [text, setText] = useState("");

  const activeChat = chats.find(c => c.id === activeChatId);

  const canReport = (targetId) => {
    if (currentUser.role === "employee") {
      return !!apps.find(a => a.userId === currentUser.id && a.employerId === targetId && ["accepted", "completed"].includes(a.applicationStatus));
    }
    return !!apps.find(a => a.employerId === currentUser.id && a.userId === targetId && a.applicationStatus === "accepted");
  };

  const handleSendFile = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) return showToast("ไฟล์ใหญ่เกินไป (สูงสุด 500KB)");
    const reader = new FileReader();
    reader.onload = ev => handleSendMsg(activeChatId, "", type, file.name, ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleSendMsg = (chatId, msgText, type = "text", fileName = "", fileUrl = "") => {
    const msg = { id: "m" + Date.now(), from: currentUser.id, text: msgText, type, fileName, fileUrl, time: Date.now() };
    const updated = chats.map(c => c.id === chatId ? { ...c, messages: [...c.messages, msg].slice(-20) } : c);
    syncChats(updated);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Left List */}
      <div className={`w-full md:w-72 flex flex-col border-r border-gray-100 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-3">ข้อความ</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="ค้นหาการสนทนา..." className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#F58220]" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.filter(c => c.participants.includes(currentUser.id)).map(c => {
            const otherPartyId = c.participants.find(p => p !== currentUser.id);
            const otherUser = users.find(u => u.id === otherPartyId);
            const lastMsg = c.messages[c.messages.length - 1];
            return (
              <div key={c.id} onClick={() => setActiveChatId(c.id)} className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${activeChatId === c.id ? 'bg-orange-50/50' : ''}`}>
                <AvatarCircle name={otherUser?.name} size={48} />
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="font-bold text-gray-800 text-sm truncate">{otherUser?.name || "ไม่ทราบชื่อ"}</div>
                    {lastMsg && <div className="text-[10px] text-gray-400 shrink-0 ml-2">{new Date(lastMsg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{lastMsg ? (lastMsg.type === "text" ? lastMsg.text : `[${lastMsg.type}]`) : "ยังไม่มีข้อความ"}</div>
                </div>
                {lastMsg && lastMsg.from !== currentUser.id && <div className="w-2 h-2 rounded-full bg-[#F58220] shrink-0"></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className={`flex-1 flex-col bg-gray-50 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageCircle size={48} className="mb-4 opacity-50" />
            <p>เลือกการสนทนา</p>
          </div>
        ) : (() => {
          const otherPartyId = activeChat.participants.find(p => p !== currentUser.id);
          const otherUser = users.find(u => u.id === otherPartyId);
          return (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <button className="md:hidden text-gray-500 p-1" onClick={() => setActiveChatId(null)}>❮</button>
                  <AvatarCircle name={otherUser?.name} size={40} />
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{otherUser?.name}</div>
                    <div className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> ออนไลน์</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => window.alert("กำลังโทร... (จำลอง)")} className="w-10 h-10 rounded-full bg-orange-50 text-[#F58220] flex items-center justify-center hover:bg-orange-100 transition-colors">📞</button>
                  {canReport(otherPartyId) && (
                    <button onClick={() => window.alert("เปิด Report Modal สำหรับ: " + otherPartyId)} className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors">🚩</button>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeChat.messages.length === 0 && <div className="text-center text-gray-400 my-10 text-sm">เริ่มส่งข้อความ...</div>}
                {activeChat.messages.map(m => {
                  const isMe = m.from === currentUser.id;
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`p-3 text-sm ${isMe ? 'bg-[#F58220] text-white rounded-2xl rounded-tr-sm shadow-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm'}`}>
                          {m.type === "text" && <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>}
                          {m.type === "image" && <img src={m.fileUrl} style={{ maxWidth: 200 }} className="rounded-xl cursor-pointer" alt="attachment" />}
                          {m.type === "file" && <a href={m.fileUrl} download={m.fileName} className="flex items-center gap-2 underline"><span className="text-xl">📎</span> {m.fileName}</a>}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 px-1">{new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-gray-100 flex items-end gap-2">
                <input type="file" id="img-upload" accept="image/*" className="hidden" onChange={e => handleSendFile(e, "image")} />
                <input type="file" id="file-upload" accept="*/*" className="hidden" onChange={e => handleSendFile(e, "file")} />
                
                <div className="flex gap-1 pb-2 shrink-0">
                  <label htmlFor="img-upload" className="w-9 h-9 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center cursor-pointer hover:bg-gray-100">🖼</label>
                  <label htmlFor="file-upload" className="w-9 h-9 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center cursor-pointer hover:bg-gray-100">📎</label>
                </div>
                
                <textarea
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#F58220] resize-none max-h-32 min-h-[44px]"
                  placeholder="พิมพ์ข้อความ..." rows="1"
                  value={text} onChange={e => setText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (text.trim()) { handleSendMsg(activeChat.id, text.trim()); setText(""); }
                    }
                  }}
                />
                <Btn color="#F58220" disabled={!text.trim()} onClick={() => { handleSendMsg(activeChat.id, text.trim()); setText(""); }} className="pb-2">ส่ง</Btn>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};


/* Profile Tab */
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


/* App Root */
export default function App() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [chats, setChats] = useState([]);
  const [notifs, setNotifs] = useState([]);
  
  const [inited, setInited] = useState(false);
  const [screen, setScreen] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  
  const [tab, setTab] = useState("home");
  const [keyword, setKeyword] = useState("");
  const [activeCat, setActiveCat] = useState("ทั้งหมด");
  const [notifsEnabled, setNotifsEnabled] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals & UI states
  const [toastMsg, setToastMsg] = useState("");
  const showToast = useCallback((msg) => setToastMsg(msg), []);
  const [showConfirm, setShowConfirm] = useState(null);
  
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  
  const [reviewAppId, setReviewAppId] = useState(null);
  const [reviewJobTitle, setReviewJobTitle] = useState("");
  
  const [manageJobId, setManageJobId] = useState(null);
  const [reportTarget, setReportTarget] = useState(null); // { id, name }
  const [activeChatId, setActiveChatId] = useState(null);
  const [viewJob, setViewJob] = useState(null);

  useEffect(() => {
    const v1 = LS.get("kku_v1");
    if (!v1) {
      LS.set("kku_users", MOCK_USERS);
      LS.set("kku_jobs", MOCK_JOBS);
      LS.set("kku_apps", MOCK_APPS);
      LS.set("kku_chats", MOCK_CHATS);
      LS.set("kku_notifs", MOCK_NOTIFS);
      LS.set("kku_v1", true);
      LS.set("kku_notifications_enabled", true);
    }
    
    setUsers(LS.get("kku_users") || MOCK_USERS);
    setJobs(LS.get("kku_jobs") || MOCK_JOBS);
    setApps(LS.get("kku_apps") || MOCK_APPS);
    setChats(LS.get("kku_chats") || MOCK_CHATS);
    setNotifs(LS.get("kku_notifs") || MOCK_NOTIFS);
    setNotifsEnabled(LS.get("kku_notifications_enabled") ?? true);
    
    setInited(true);

    // Override alert after init to handle mock interactions
    const originalAlert = window.alert;
    window.alert = (msg) => {
      if (msg === "เปิด EditProfileModal") setShowEditProfileModal(true);
      else if (msg === "เปิด SettingsModal") setShowSettingsModal(true);
      else if (msg.startsWith("เปิด ReviewModal:")) setReviewAppId(msg.split(":")[1].trim());
      else if (msg === "เปิด ManageJobModal") showToast("กรุณากดจัดการที่หน้าโปรไฟล์ (mock alert caught)");
      else if (msg.startsWith("เปิด Report Modal สำหรับ:")) setReportTarget({ id: msg.split(":")[1].trim(), name: "User" });
      else originalAlert(msg);
    };
    return () => { window.alert = originalAlert; };
  }, [showToast]);

  const syncUsers = useCallback((v) => { setUsers(v); LS.set("kku_users", v); }, []);
  const syncJobs = useCallback((v) => { setJobs(v); LS.set("kku_jobs", v); }, []);
  const syncApps = useCallback((v) => { setApps(v); LS.set("kku_apps", v); }, []);
  const syncChats = useCallback((v) => { setChats(v); LS.set("kku_chats", v); }, []);
  const syncNotifs = useCallback((v) => { setNotifs(v); LS.set("kku_notifs", v); }, []);
  
  const addNotif = useCallback(({ userId, type, jobId, text }) => {
    if (!notifsEnabled) return;
    const n = { id:"n"+Date.now(), userId, type, jobId, text, read:false, time:Date.now() };
    syncNotifs([...notifs, n]);
  }, [notifs, notifsEnabled, syncNotifs]);
  
  const handleApply = useCallback((job) => {
    if (apps.find(a => a.jobId === job.id && a.userId === currentUser.id)) return;
    const newApp = { 
      id: "a" + Date.now(), jobId: job.id, userId: currentUser.id, employerId: job.employerId,
      applicationStatus: "pending", workStatus: "pending", appliedAt: Date.now(),
      completedAt: null, employeeReview: null, employerReview: null 
    };
    syncApps([...apps, newApp]);
    
    let existingChat = chats.find(c =>
      c.participants.includes(currentUser.id) &&
      c.participants.includes(job.employerId) && c.jobId === job.id
    );
    if (!existingChat) {
      existingChat = { id: "ch" + Date.now(), participants: [currentUser.id, job.employerId], jobId: job.id, messages: [] };
      syncChats([...chats, existingChat]);
    }
    
    addNotif({ userId: job.employerId, type: "new_application", jobId: job.id, text: `${currentUser.name} สมัครงาน ${job.title}` });
    showToast("สมัครงานเรียบร้อยแล้ว!");
  }, [apps, chats, currentUser, addNotif, syncApps, syncChats, showToast]);

  const handleWithdraw = useCallback((appId) => {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    if (app.applicationStatus === "accepted") {
      setShowConfirm({ title: "ไม่สามารถยกเลิกได้", msg: "กรุณาติดต่อผู้โพสต์เพื่อขอยกเลิก", onConfirm: null });
      return;
    }
    setShowConfirm({
      title: "ยืนยันยกเลิกการสมัคร", msg: "คุณต้องการยกเลิกการสมัครงานนี้ใช่ไหม?",
      onConfirm: () => {
        syncApps(apps.filter(a => a.id !== appId));
        syncNotifs(notifs.filter(n => !(n.type === "new_application" && n.jobId === app.jobId && n.userId === app.userId)));
        showToast("ยกเลิกการสมัครเรียบร้อยแล้ว");
        setShowConfirm(null);
      }
    });
  }, [apps, notifs, syncApps, syncNotifs, showToast]);

  const handleDeleteJob = useCallback((jobId) => {
    setShowConfirm({
      title: "ลบประกาศงาน",
      msg: "การกระทำนี้จะลบประกาศงาน แต่จะยังคงอยู่ในประวัติของผู้ที่ทำงานเสร็จสิ้นแล้ว",
      confirmLabel: "ลบ",
      onConfirm: () => {
        const hasCompletedApps = apps.some(a => a.jobId === jobId && a.workStatus === "completed");
        
        if (hasCompletedApps) {
          syncJobs(jobs.map(j => j.id === jobId ? { ...j, status: "deleted" } : j));
          syncApps(apps.filter(a => a.jobId !== jobId || a.workStatus === "completed"));
        } else {
          syncJobs(jobs.filter(j => j.id !== jobId));
          syncApps(apps.filter(a => a.jobId !== jobId));
        }
        
        syncNotifs(notifs.filter(n => n.jobId !== jobId));
        showToast("ลบประกาศงานแล้ว");
        setManageJobId(null);
        setShowConfirm(null);
      }
    });
  }, [jobs, apps, notifs, syncJobs, syncApps, syncNotifs, showToast]);

  const handleOpenChat = useCallback((job) => {
    let chat = chats.find(c => c.participants.includes(currentUser.id) && c.participants.includes(job.employerId) && c.jobId === job.id);
    if (!chat) {
      chat = { id: "ch" + Date.now(), participants: [currentUser.id, job.employerId], jobId: job.id, messages: [] };
      syncChats([...chats, chat]);
    }
    setActiveChatId(chat.id);
    setTab("chat");
  }, [chats, currentUser, syncChats]);

  const handleLoginSuccess = useCallback((user) => {
    setCurrentUser(user); setScreen("main"); setTab("home");
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null); setScreen("login");
  }, []);

  // State sync and effects handled in useEffect above
  if (!inited) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>;
  if (screen === "login" || !currentUser) {
    return <AuthScreen users={users} setUsers={syncUsers} onLoginSuccess={handleLoginSuccess} showToast={showToast} />;
  }

  const myUnreadNotifs = notifs.filter(n => n.userId === currentUser.id && !n.read);

  return (
    <>
      <FontLoader />
      <Toast msg={toastMsg} onDismiss={() => setToastMsg("")} />
      
      {showConfirm && (
        <Modal title={showConfirm.title} onClose={() => setShowConfirm(null)}>
          <p className="text-gray-600 mb-6">{showConfirm.msg}</p>
          <div className="flex gap-3">
            <Btn full outline onClick={() => setShowConfirm(null)}>ยกเลิก</Btn>
            {showConfirm.onConfirm && (
              <Btn full color="#EF4444" onClick={showConfirm.onConfirm}>{showConfirm.confirmLabel || "ยืนยัน"}</Btn>
            )}
          </div>
        </Modal>
      )}

      {showNotifModal && <NotifModal notifs={notifs} onClose={() => setShowNotifModal(false)} onClearAll={(uid) => { syncNotifs(notifs.filter(n => n.userId !== uid)); setShowNotifModal(false); }} currentUser={currentUser} syncNotifs={syncNotifs} />}
      {showSettingsModal && <SettingsModal currentUser={currentUser} users={users} syncUsers={syncUsers} onClose={() => setShowSettingsModal(false)} onLogout={handleLogout} notifsEnabled={notifsEnabled} setNotifsEnabled={setNotifsEnabled} showToast={showToast} />}
      {showEditProfileModal && <EditProfileModal currentUser={currentUser} users={users} syncUsers={syncUsers} setCurrentUser={setCurrentUser} onClose={() => setShowEditProfileModal(false)} showToast={showToast} />}
      {reviewAppId && <ReviewModal appId={reviewAppId} jobTitle={jobs.find(j => j.id === apps.find(a => a.id === reviewAppId)?.jobId)?.title || ""} apps={apps} syncApps={syncApps} onClose={() => setReviewAppId(null)} showToast={showToast} />}
      {manageJobId && <ManageJobModal job={jobs.find(j => j.id === manageJobId)} apps={apps} users={users} syncApps={syncApps} addNotif={addNotif} showToast={showToast} onClose={() => setManageJobId(null)} handleDeleteJob={handleDeleteJob} />}
      {reportTarget && <ReportModal targetUserId={reportTarget.id} targetName={reportTarget.name} showToast={showToast} onClose={() => setReportTarget(null)} />}
      {viewJob && (
        <Modal title="รายละเอียดงาน" onClose={() => setViewJob(null)}>
          <JobCard 
            job={viewJob} 
            myApp={apps.find(a => a.jobId === viewJob.id && a.userId === currentUser.id)} 
            isOwner={currentUser.id === viewJob.employerId}
            onApply={handleApply}
            onWithdraw={handleWithdraw}
            onOpenChat={handleOpenChat}
            onManage={(j) => setManageJobId(j.id)}
            currentUser={currentUser}
          />
        </Modal>
      )}

      <div className="flex flex-col md:flex-row min-h-[100dvh] bg-gray-50">
        <Sidebar currentTab={tab} setTab={(t) => { setTab(t); setIsSidebarOpen(false); }} currentUser={currentUser} onLogout={handleLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <TopNavbar 
            keyword={keyword} setKeyword={setKeyword} 
            unreadCount={myUnreadNotifs.length} 
            toggleNotifs={() => setShowNotifModal(true)} 
            currentUser={currentUser}
            onLogout={handleLogout}
            toggleSidebar={() => setIsSidebarOpen(true)}
          />
          <MobileHeader 
            unreadCount={myUnreadNotifs.length} 
            toggleNotifs={() => setShowNotifModal(true)} 
            toggleSidebar={() => setIsSidebarOpen(true)}
          />

          {notifsEnabled && myUnreadNotifs.length > 0 && (
            <div 
              onClick={() => setShowNotifModal(true)}
              className="sticky md:top-[56px] top-[56px] z-20 text-white text-center text-sm py-2 cursor-pointer transition-colors shadow-sm"
              style={{ backgroundColor: "#F58220" }}
            >
              {currentUser.role === 'employer' 
                ? "มีผู้สมัครงานใหม่! แตะเพื่อดู →" 
                : "APPLICATION UPDATED! แตะเพื่อดู →"}
            </div>
          )}

          <main className="flex-1 overflow-y-auto px-4 py-6 md:p-6 max-w-5xl md:mx-auto w-full pb-[80px] md:pb-6 relative">
            {tab === "home" && (
              <HomeTab 
                jobs={jobs} apps={apps} currentUser={currentUser}
                activeCat={activeCat} setActiveCat={setActiveCat} keyword={keyword}
                onApply={handleApply} onWithdraw={handleWithdraw}
                onOpenChat={handleOpenChat}
                onManage={(job) => setManageJobId(job.id)}
              />
            )}
            {tab === "search" && (
              <SearchTab jobs={jobs} apps={apps} currentUser={currentUser} onApply={handleApply} onWithdraw={handleWithdraw} onOpenChat={handleOpenChat} onManage={(job) => setManageJobId(job.id)} />
            )}
            {tab === "post" && (
              <PostTab currentUser={currentUser} jobs={jobs} syncJobs={syncJobs} showToast={showToast} />
            )}
            {tab === "chat" && (
              <ChatTab currentUser={currentUser} chats={chats} users={users} apps={apps} activeChatId={activeChatId} setActiveChatId={setActiveChatId} syncChats={syncChats} showToast={showToast} />
            )}
            {tab === "profile" && (
              <ProfileTab currentUser={currentUser} jobs={jobs} apps={apps} onWithdraw={handleWithdraw} handleDeleteJob={handleDeleteJob} onManage={(jobId) => setManageJobId(jobId)} onViewDetails={setViewJob} />
            )}
          </main>
          
          <BottomTabBar currentTab={tab} setTab={setTab} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
}
