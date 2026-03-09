// src/tabs/ChatTab.jsx
// Description: Real-time-like chat tab with conversation list, message bubbles, and file/image sharing.

import React, { useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import AvatarCircle from '../components/ui/AvatarCircle.jsx';
import Btn from '../components/ui/Btn.jsx';

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

export default ChatTab;
