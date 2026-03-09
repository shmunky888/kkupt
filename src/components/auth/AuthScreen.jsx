// src/components/auth/AuthScreen.jsx
// Description: Login, register, and forgot-password screens with policy acceptance flow.

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { LS } from '../../services/storage.js';
import Btn from '../ui/Btn.jsx';
import PolicyModal from './PolicyModal.jsx';

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
    const safeEmail = email.trim().toLowerCase();
    const u = users.find(u => u.email.trim().toLowerCase() === safeEmail && u.password === password);
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

export default AuthScreen;
