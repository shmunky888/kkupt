// src/constants/data.js
// Description: Application-wide constants, seed data and day/category mappings.

export const DAY_MAP = {
  Mon: "จันทร์", Tue: "อังคาร", Wed: "พุธ", Thu: "พฤหัสบดี",
  Fri: "ศุกร์", Sat: "เสาร์", Sun: "อาทิตย์"
};

export const CATEGORIES = ["ทั้งหมด","เด็กเสิร์ฟ","ถ่ายรูป","อีเวนต์","พนักงานร้านกาแฟ","งานออฟฟิศ","รับส่งเอกสาร","อื่นๆ"];

export const MOCK_USERS = [
  { id:"u1",   name:"สมชาย ใจดี",         email:"somchai@kku.ac.th", password:"1234", role:"employee", skills:["บริการลูกค้า","ถ่ายรูป"], avatar:"SC" },
  { id:"emp1", name:"ร้านกาแฟ Amazon KKU", email:"amazon@kku.ac.th",  password:"1234", role:"employer", skills:[], avatar:"AZ" },
  { id:"emp2", name:"KKU Photo Studio",    email:"photo@kku.ac.th",   password:"1234", role:"employer", skills:[], avatar:"PS" },
  { id:"emp3", name:"KKU Event Team",      email:"event@kku.ac.th",   password:"1234", role:"employer", skills:[], avatar:"ET" },
  { id:"emp4", name:"ร้านอาหาร KKU",       email:"food@kku.ac.th",    password:"1234", role:"employer", skills:[], avatar:"RK" },
  { id:"emp5", name:"ร้านเครื่องเขียน KKU",email:"stationery@kku.ac.th",password:"1234",role:"employer",skills:[],avatar:"KW" },
  { id:"emp6", name:"KKU Office Support",  email:"office@kku.ac.th",  password:"1234", role:"employer", skills:[], avatar:"OS" }
];

export const MOCK_JOBS = [
  { id:"j1", employerId:"emp1", company:"ร้านกาแฟ Amazon KKU",  title:"เด็กเสิร์ฟ",      category:"เด็กเสิร์ฟ",         location:"อาคารเรียนรวม 1",     mapLink:"", lat:16.4419, lng:102.8359, days:["Mon","Tue","Wed"], startTime:"08:00", endTime:"14:00", wage:60,  wageType:"ชั่วโมง", desc:"รับนักศึกษาขยัน ยิ้มแย้ม บริการดี",              status:"active",    postedAt: Date.now()-86400000*3 },
  { id:"j2", employerId:"emp2", company:"KKU Photo Studio",     title:"ช่างภาพอีเวนต์",  category:"ถ่ายรูป",             location:"ศูนย์กีฬา KKU",       mapLink:"", lat:16.4480, lng:102.8300, days:["Sat","Sun"],           startTime:"09:00", endTime:"17:00", wage:500, wageType:"วัน",     desc:"ถ่ายงานบัณฑิต งานเลี้ยง มีประสบการณ์ดีมาก",     status:"active",    postedAt: Date.now()-86400000*2 },
  { id:"j3", employerId:"emp3", company:"KKU Event Team",       title:"Staff อีเวนต์",   category:"อีเวนต์",             location:"หอประชุม KKU",         mapLink:"", lat:16.4450, lng:102.8350, days:["Fri","Sat"],           startTime:"13:00", endTime:"22:00", wage:350, wageType:"วัน",     desc:"ช่วยงานอีเวนต์ ติดตั้งเวที ดูแลผู้เข้าร่วม",    status:"active",    postedAt: Date.now()-86400000*1 },
  { id:"j4", employerId:"emp4", company:"ร้านอาหาร KKU",        title:"พนักงานเสิร์ฟ",   category:"เด็กเสิร์ฟ",         location:"ถนนมิตรภาพ",          mapLink:"", lat:16.4400, lng:102.8400, days:["Thu","Fri","Sat"],      startTime:"17:00", endTime:"23:00", wage:65,  wageType:"ชั่วโมง", desc:"ร้านอาหารพื้นเมือง รับนักศึกษา ไม่ต้องมีประสบการณ์", status:"active", postedAt: Date.now()-3600000*5 },
  { id:"j5", employerId:"emp5", company:"ร้านเครื่องเขียน KKU", title:"พนักงานสต็อกสินค้า",category:"อื่นๆ",             location:"หน้าประตูมหาวิทยาลัย",mapLink:"", lat:16.4430, lng:102.8320, days:["Mon","Wed","Fri"],      startTime:"10:00", endTime:"16:00", wage:300, wageType:"วัน",     desc:"ขนและจัดเรียงสินค้า งานไม่หนัก",                status:"completed", postedAt: Date.now()-86400000*30 },
  { id:"j6", employerId:"emp6", company:"KKU Office Support",   title:"ผู้ช่วยงานออฟฟิศ",category:"งานออฟฟิศ",           location:"อาคารบริหาร",         mapLink:"", lat:16.4460, lng:102.8370, days:["Tue","Thu"],           startTime:"09:00", endTime:"15:00", wage:280, wageType:"วัน",     desc:"รับโทรศัพท์ ถ่ายเอกสาร จัดแฟ้ม",                status:"active",    postedAt: Date.now()-3600000*2 }
];

export const MOCK_APPS = [
  { id:"a1", jobId:"j1", userId:"u1", employerId:"emp1", applicationStatus:"pending",  workStatus:"pending",   appliedAt:Date.now()-3600000*3,  completedAt:null, employeeReview:null, employerReview:null },
  { id:"a2", jobId:"j5", userId:"u1", employerId:"emp5", applicationStatus:"accepted", workStatus:"completed", appliedAt:Date.now()-86400000*25, completedAt:Date.now()-86400000*5,
    employerReview:{ rating:5, text:"ทำงานขยันมาก มาตรงเวลาทุกวัน แนะนำเลย!" },
    employeeReview:null }
];

export const MOCK_CHATS = [
  { id:"ch1", participants:["u1","emp1"], jobId:"j1",
    messages:[
      { id:"m1", from:"emp1", text:"สวัสดีครับ สนใจสมัครงานกับเราไหม?", type:"text", time:Date.now()-3600000*2 },
      { id:"m2", from:"u1",   text:"สวัสดีครับ สนใจมากเลยครับ",          type:"text", time:Date.now()-3600000*1 }
    ]}
];

export const MOCK_NOTIFS = [
  { id:"n1", userId:"emp1", type:"new_application", jobId:"j1",
    text:"สมชาย ใจดี สมัครงานเด็กเสิร์ฟ", read:false, time:Date.now()-3600000*3 }
];
