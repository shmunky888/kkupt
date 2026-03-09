// src/MainApp.jsx
// Description: Root application component containing all global state, handlers, and the main layout tree.

import React, { useState, useEffect, useCallback } from 'react';

// Constants & Services
import { MOCK_USERS, MOCK_JOBS, MOCK_APPS, MOCK_CHATS, MOCK_NOTIFS } from './constants/data.js';
import { LS } from './services/storage.js';

// UI Primitives
import FontLoader from './components/ui/FontLoader.jsx';
import Toast from './components/ui/Toast.jsx';
import Modal from './components/ui/Modal.jsx';
import Btn from './components/ui/Btn.jsx';
import JobCard from './components/jobs/JobCard.jsx';

// Auth
import AuthScreen from './components/auth/AuthScreen.jsx';

// Modals
import NotifModal from './components/modals/NotifModal.jsx';
import SettingsModal from './components/modals/SettingsModal.jsx';
import EditProfileModal from './components/modals/EditProfileModal.jsx';
import ReviewModal from './components/modals/ReviewModal.jsx';
import ManageJobModal from './components/modals/ManageJobModal.jsx';
import ReportModal from './components/modals/ReportModal.jsx';

// Layout
import Sidebar from './components/layout/Sidebar.jsx';
import TopNavbar from './components/layout/TopNavbar.jsx';
import MobileHeader from './components/layout/MobileHeader.jsx';
import BottomTabBar from './components/layout/BottomTabBar.jsx';

// Tabs
import HomeTab from './tabs/HomeTab.jsx';
import SearchTab from './tabs/SearchTab.jsx';
import PostTab from './tabs/PostTab.jsx';
import ChatTab from './tabs/ChatTab.jsx';
import ProfileTab from './tabs/ProfileTab.jsx';

function MainApp() {
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
  const [notifsEnabled, setNotifsEnabled] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

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

  if (!inited) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>;
  if (screen === "login" || !currentUser) {
    return (
      <>
        <Toast msg={toastMsg} onDismiss={() => setToastMsg("")} />
        <FontLoader />
        <AuthScreen users={users} setUsers={syncUsers} onLoginSuccess={handleLoginSuccess} showToast={showToast} />
      </>
    );
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

      <TopNavbar
        keyword={keyword} setKeyword={setKeyword}
        unreadCount={myUnreadNotifs.length}
        toggleNotifs={() => setShowNotifModal(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        toggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />
      <MobileHeader
        unreadCount={myUnreadNotifs.length}
        toggleNotifs={() => setShowNotifModal(true)}
        toggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      <div className="flex flex-col md:flex-row min-h-[100dvh] pt-14 bg-gray-50">
        <Sidebar currentTab={tab} setTab={(t) => { setTab(t); setIsSidebarOpen(window.innerWidth >= 768); }} currentUser={currentUser} onLogout={handleLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className={`flex-1 flex flex-col transition-all duration-300 w-full ${isSidebarOpen ? 'md:ml-60' : 'ml-0'}`}>

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
                keyword={keyword}
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

export default MainApp;
