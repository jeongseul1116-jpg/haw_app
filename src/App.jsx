import { useState, useRef, useEffect } from “react”;

const R  = “#FF3B30”;
const KR = “‘Noto Sans KR’, sans-serif”;
const ADMIN_PW = “haw2024”;

const HABITS = [
{ label: “독서”,      emoji: “📖” },
{ label: “운동”,      emoji: “🏃‍♀️” },
{ label: “기상루틴”,  emoji: “☀️” },
{ label: “다이어트”,  emoji: “🥗”, sub: [
{ label:“식단관리”,  emoji:“🍱” },
{ label:“운동”,      emoji:“💪” },
{ label:“간헐적단식”,emoji:“⏰” },
]},
{ label: “공부”,      emoji: “✏️”, sub: [
{ label:“외국어”,    emoji:“🌍” },
{ label:“자격증”,    emoji:“📋” },
{ label:“승진시험”,  emoji:“🎯” },
]},
{ label: “명상·일기”, emoji: “🧘‍♀️” },
{ label: “무탈라이프”,emoji: “🏠”, sub: [
{ label:“청소”,    emoji:“🧹” },
{ label:“빨래”,    emoji:“👕” },
{ label:“설거지”,  emoji:“🍽️” },
{ label:“정리정돈”,emoji:“📦” },
]},
{ label: “기타”,      emoji: “✦” },
];

const GS = {
“잘함”:   { color: “#FF3B30”,               bg: “rgba(255,59,48,.15)” },
“보통”:   { color: “rgba(255,255,255,.55)”,  bg: “rgba(255,255,255,.07)” },
“아쉬움”: { color: “rgba(255,255,255,.25)”,  bg: “rgba(255,255,255,.03)” },
};

const DAYS = [“월”,“화”,“수”,“목”,“금”,“토”,“일”];

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+SC:wght@900&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} button{cursor:pointer;border:none;} input,textarea{outline:none;border:none;} @keyframes fadeup{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}} @keyframes glow{0%,100%{text-shadow:0 0 0 #FF3B30}50%{text-shadow:0 0 28px rgba(255,59,48,.7)}} @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}} @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}} .fade{animation:fadeup .35s ease forwards;} .float{animation:float 5s ease-in-out infinite;} .glow{animation:glow 3s ease-in-out infinite;} .spin{animation:spin 1s linear infinite;} .btn-red{background:#FF3B30;color:#fff;width:100%;padding:16px;font-size:13px;font-family:'Noto Sans KR',sans-serif;font-weight:500;letter-spacing:.15em;transition:all .2s;cursor:pointer;} .btn-red:hover{background:#e02e23;} .btn-white{background:transparent;color:rgba(255,255,255,.5);width:100%;padding:16px;font-size:13px;font-family:'Noto Sans KR',sans-serif;font-weight:300;letter-spacing:.15em;border:1px solid rgba(255,255,255,.15);transition:all .2s;cursor:pointer;} .btn-white:hover{border-color:rgba(255,255,255,.4);color:rgba(255,255,255,.8);} .btn-text{background:transparent;color:rgba(255,255,255,.2);font-size:11px;font-family:'Noto Sans KR',sans-serif;letter-spacing:.08em;padding:8px;border:none;cursor:pointer;} .btn-text:hover{color:rgba(255,59,48,.6);} .btn-ghost{background:transparent;color:rgba(255,255,255,.35);font-size:12px;font-family:'Noto Sans KR',sans-serif;padding:6px 10px;border:1px solid rgba(255,255,255,.1);cursor:pointer;transition:all .2s;} .btn-ghost:hover{border-color:rgba(255,59,48,.4);color:#FF3B30;} .ifield{background:#111;border:1px solid rgba(255,255,255,.3);color:#fff;width:100%;padding:14px 16px;font-size:13px;font-family:'Noto Sans KR',sans-serif;font-weight:300;} .ifield:focus{border-color:#FF3B30;} .ifield::placeholder{color:rgba(255,255,255,.4);} .tfield{background:#111;border:1px solid rgba(255,255,255,.2);color:#fff;width:100%;padding:10px 12px;font-size:12px;font-family:'Noto Sans KR',sans-serif;font-weight:300;resize:none;line-height:1.6;} .tfield:focus{border-color:#FF3B30;} .tfield::placeholder{color:rgba(255,255,255,.35);} .htag{display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 8px;font-size:10px;font-family:'Noto Sans KR',sans-serif;cursor:pointer;border:1px solid rgba(255,255,255,.08);background:#0f0f0f;color:rgba(255,255,255,.35);transition:all .2s;} .htag:hover{border-color:rgba(255,59,48,.4);color:rgba(255,255,255,.7);} .htag.on{border-color:#FF3B30;background:rgba(255,59,48,.1);color:#FF3B30;} .cal-day{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 4px;border:1px solid rgba(255,255,255,.05);background:#0f0f0f;min-height:72px;cursor:pointer;transition:border .15s;} .cal-day:hover{border-color:rgba(255,59,48,.3);} .cal-day.today{border-color:rgba(255,59,48,.2);} .cal-day.selected{border-color:#FF3B30!important;} .card{background:#111;border:1px solid rgba(255,255,255,.06);padding:14px;} /* 반응형 */ .app-container{width:100%;max-width:480px;margin:0 auto;padding:0 20px;} .app-wide{width:100%;max-width:720px;margin:0 auto;padding:0 40px;} @media(max-width:600px){ .app-wide{padding:0 20px;} .two-col{grid-template-columns:1fr!important;} } @media(min-width:900px){ .app-container{max-width:560px;} .certify-slots{max-width:480px!important;} }`;

// ── 유틸 ──
function fmtDate(d) { return `${d.getMonth()+1}/${d.getDate()}`; }
function isToday(d) {
const t = new Date();
return d.getDate()===t.getDate() && d.getMonth()===t.getMonth() && d.getFullYear()===t.getFullYear();
}
function getWeekDates(offset=0) {
const today = new Date();
const day = today.getDay();
const mon = new Date(today);
mon.setDate(today.getDate() - (day===0?6:day-1) + offset*7);
return Array.from({length:7}, (_,i) => { const d=new Date(mon); d.setDate(mon.getDate()+i); return d; });
}
function daysSince(dateStr) {
if (!dateStr) return null;
const [m,d] = dateStr.split(”/”).map(Number);
return Math.floor((new Date() - new Date(new Date().getFullYear(),m-1,d)) / 86400000);
}
function getStatus(lastSubmit) {
if (!lastSubmit)  return { label:“미제출”,       color:“rgba(255,255,255,.2)” };
const n = daysSince(lastSubmit);
if (n===0) return { label:“오늘 제출”,           color:”#4CAF50” };
if (n===1) return { label:“어제 제출”,           color:”#8BC34A” };
if (n<=2)  return { label:`${n}일 전`,           color:”#FF9800” };
return           { label:`${n}일 전 🚨`,         color:R };
}

// ── 이미지 변환 ──
function toJpeg(file) {
return new Promise(resolve => {
const reader = new FileReader();
reader.onload = ev => {
const img = new Image();
img.onload = () => {
const MAX=800; let w=img.naturalWidth, h=img.naturalHeight;
if (w>MAX||h>MAX) { if(w>h){h=Math.round(h*MAX/w);w=MAX;}else{w=Math.round(w*MAX/h);h=MAX;} }
const c=document.createElement(“canvas”); c.width=w; c.height=h;
c.getContext(“2d”).drawImage(img,0,0,w,h);
const dataUrl = c.toDataURL(“image/jpeg”,0.85);
resolve({ b64: dataUrl.split(”,”)[1], dataUrl });
};
img.onerror = () => {
const dataUrl = ev.target.result;
resolve({ b64: dataUrl.split(”,”)[1]||””, dataUrl });
};
img.src = ev.target.result;
};
reader.readAsDataURL(file);
});
}

// ── Claude API ──
async function analyzeImage(b64, memo) {
const memoHint = memo
? `【사용자 메모 — 최우선 참고】 "${memo}"\n→ 이 메모에 습관 키워드가 있으면 반드시 habit 분류에 우선 반영.\n\n`
: “”;
const prompt = [
memoHint + “이 사진을 보고 JSON으로만 답해줘. 다른 텍스트 없이 JSON만.”,
‘{“is_real”:true,“fake_reason”:null,“habit”:“다이어트”,“sub_habit”:“식단관리”,“habit_reason”:“건강한 식단”,“grade”:“잘함”,“grade_reason”:“균형잡힌 식사”,“feedback”:“잘하셨어요!”}’,
“habit 분류 — 사진에서 아래 단서를 찾아 판단해:”,
“독서: 책표지/책페이지/글자가 빽빽한 텍스트/전자책화면/손에 책 든 사진 → 무조건 독서”,
“운동: 헬스기구/덤벨/매트/러닝트랙/등산/산/트레킹/운동복/땀/타이머(스톱워치) → 운동”,
“기상루틴: 아침 햇빛/물 한 잔/이불정리/알람화면/아침 하늘”,
“다이어트: 음식사진/도시락/식단/체중계/줄자 → sub_habit: 식단관리|운동|간헐적단식|체중기록”,
“공부·자격증: 교재/문제집/노트필기/강의화면/공부책상 → sub_habit: 외국어|자격증|승진시험”,
“명상·일기: 다이어리/일기장/빈 노트에 글쓰기/명상앱”,
“무탈라이프: 청소도구/빨래/설거지/정리된공간/쓰레기봉투 → sub_habit: 청소|빨래|설거지|정리정돈”,
“새로운 취미: 악기/그림/뜨개질/요리/사진/댄스/etc 새롭게 배우거나 즐기는 모든 것”,
“기타: 위 어디에도 해당 없는 경우만”,
“⚠️ sub_habit 없으면 null | 사진이 애매하면 메모 힌트 우선”,
“grade: 잘함(충분한증거 또는 메모에 충분히 했다고 명시) | 보통 | 아쉬움”,
“is_real: 완전무관사진만 false | JSON만 반환.”,
].join(”\n”);
const res = await fetch(“https://api.anthropic.com/v1/messages”, {
method:“POST”, headers:{“Content-Type”:“application/json”},
body:JSON.stringify({
model:“claude-sonnet-4-20250514”, max_tokens:300,
messages:[{role:“user”,content:[
{type:“image”,source:{type:“base64”,media_type:“image/jpeg”,data:b64}},
{type:“text”,text:prompt},
]}],
}),
});
const data = await res.json();
if (data.error) throw new Error(data.error.message);
const raw = data.content?.[0]?.text || “”;
const match = raw.match(/{[\s\S]*}/);
if (!match) throw new Error(raw.slice(0,50));
const j = JSON.parse(match[0]);
return {
is_real:j.is_real!==false, fake_reason:j.fake_reason||null,
habit:j.habit||“기타”, sub_habit:j.sub_habit||null, habit_reason:j.habit_reason||””,
grade:j.grade||“보통”, grade_reason:j.grade_reason||””,
feedback:j.feedback||“오늘도 수고했어요”,
};
}

// ── Storage ──
const store = {
async get(k, shared=false)   { try { const r=await window.storage.get(k, shared); return r?JSON.parse(r.value):null; } catch{return null;} },
async set(k, v, shared=false){ try { await window.storage.set(k, JSON.stringify(v), shared); } catch{} },
async del(k, shared=false)   { try { await window.storage.delete(k, shared); } catch{} },
};

// ── 공통 스타일 ──
const NAV_BTN = (active) => ({
background: active ? “rgba(255,59,48,.15)” : “transparent”,
color: active ? R : “rgba(255,255,255,.7)”,
fontSize:11, fontFamily:KR, letterSpacing:”.08em”,
padding:“6px 14px”,
border:`1px solid ${active ? "rgba(255,59,48,.5)" : "rgba(255,255,255,.25)"}`,
cursor:“pointer”, transition:“all .2s”,
});

export default function App() {
const [screen,  setScreen]  = useState(“loading”);
const [user,    setUser]    = useState(null);
const [mode,    setMode]    = useState(null);
const [records, setRecords] = useState([]);

// 회원가입
const [sName,     setSName]     = useState(””);
const [sEmail,    setSEmail]    = useState(””);
const [sError,    setSError]    = useState(””);
const [sStep,     setSStep]     = useState(“login”);

// 인증
const [slots,      setSlots]      = useState([{url:null,b64:null,memo:””}]);
const [activeSlot, setActiveSlot] = useState(0);
const [converting, setConverting] = useState(false);
const [certStep,   setCertStep]   = useState(“upload”);
const [aiResult,   setAiResult]   = useState(null);
const [habit,      setHabit]      = useState(””);
const [subHabit,   setSubHabit]   = useState(””);
const [custom,     setCustom]     = useState(””);

// 기록
const [weekOffset,  setWeekOffset]  = useState(0);
const [selectedDay, setSelectedDay] = useState(null);

// 관리자
const [adminOpen,   setAdminOpen]   = useState(false);
const [maintainPage, setMaintainPage] = useState(0); // 0: for you, 1: why PC
const [adminPw,     setAdminPw]     = useState(””);
const [adminPwErr,  setAdminPwErr]  = useState(false);
const [members,     setMembers]     = useState([]);

const fileRef = useRef();
const isLoaded = useRef(false);
const [isNewUser, setIsNewUser] = useState(false); // 자동로그인 완료 후에만 records 저장

const finalHabit =
habit===“기타”       ? (custom||“기타”) :
(HABITS.find(h=>h.label===habit)?.sub && subHabit) ? `${habit}·${subHabit}` :
habit;

// 자동 로그인
useEffect(() => {
(async () => {
const saved = await store.get(“haw:user”);
if (saved) {
const recs = await store.get(`haw:records:${saved.email}`) || [];
setUser(saved); setMode(saved.mode); setRecords(recs);
setScreen(“certify”);
} else {
setScreen(“landing”);
}
isLoaded.current = true;
})();
}, []);

// records 저장 — 자동로그인 완료 후에만
useEffect(() => {
if (user && isLoaded.current) store.set(`haw:records:${user.email}`, records);
}, [records]);

// ── 인증 헬퍼 ──
const resetCert = () => {
setSlots([{url:null,b64:null,memo:””}]); setActiveSlot(0);
setAiResult(null); setHabit(””); setSubHabit(””); setCustom(””);
setCertStep(“upload”); setConverting(false);
};

const saveRecord = (item) => {
const today = fmtDate(new Date());
setRecords(prev => {
const exists = prev.find(r => r.date===today);
if (exists) return prev.map(r => r.date===today ? {…r,items:[…r.items,item]} : r);
return […prev, {date:today,items:[item]}];
});
};

const handleFile = async (e) => {
const file = e.target.files[0]; if (!file) return;
setConverting(true);
const { b64, dataUrl } = await toJpeg(file);
// dataUrl을 미리보기에 사용 (blob URL보다 안정적)
setSlots(prev => prev.map((s,i) => i===activeSlot ? {…s, url:dataUrl, b64} : s));
setConverting(false);
};

const analyzeAll = async () => {
const filled = slots.filter(s => s.b64); if (!filled.length) return;
setCertStep(“analyzing”);
if (filled.length===1) {
try {
const r = await analyzeImage(filled[0].b64, filled[0].memo);
setAiResult(r);
if (r.is_real) {
setHabit(r.habit);
if (r.sub_habit) setSubHabit(r.sub_habit);
if (r.habit===“기타”) setCustom(””);
setCertStep(“result”);
}
else setCertStep(“fake”);
} catch(err) {
setAiResult({is_real:true,habit:“기타”,habit_reason:(err.message||””).slice(0,50),grade:“보통”,grade_reason:“직접 선택해주세요”,feedback:“직접 선택해주세요”});
setHabit(“기타”); setCertStep(“result”);
}
} else {
for (const slot of filled) {
try {
const r = await analyzeImage(slot.b64, slot.memo);
saveRecord({habit:r.is_real?r.habit:“기타”,grade:r.grade,grade_reason:r.grade_reason,feedback:r.feedback,message:slot.memo});
} catch {
saveRecord({habit:“기타”,grade:“보통”,grade_reason:””,feedback:””,message:slot.memo});
}
}
resetCert(); setCertStep(“alldone”);
}
};

const confirmCert = () => {
saveRecord({habit:finalHabit,grade:aiResult?.grade||“보통”,grade_reason:aiResult?.grade_reason||””,feedback:aiResult?.feedback||””,message:slots[0]?.memo||””});
resetCert(); setCertStep(“alldone”);
};

// ── 로그인/가입 ──
const handleLogin = async () => {
const name = sName.trim(), email = sEmail.trim().toLowerCase();
if (!name) { setSError(“이름을 입력해주세요”); return; }
if (!/^[^\s@]+@[^\s@]+.[^\s@]{2,}$/.test(email)) { setSError(“올바른 이메일을 입력해주세요”); return; }
const saved = await store.get(“haw:user”);
if (saved?.email===email) {
const recs = await store.get(`haw:records:${email}`) || [];
setUser(saved); setMode(saved.mode); setRecords(recs); setScreen(“certify”); return;
}
await handleSignup(“new”);
};

const handleSignup = async (selectedMode) => {
const name=sName.trim(), email=sEmail.trim().toLowerCase();
const newUser = {name,email,mode:selectedMode};
const recs = await store.get(`haw:records:${email}`) || [];
// 공유 저장소에 회원 추가
let mbs = [];
try { mbs = await store.get(“haw:members”, true) || []; } catch(e) { mbs = []; }
if (!mbs.find(m => m.email===email)) {
mbs.push({name,email,joinedAt:fmtDate(new Date())});
const result = await store.set(“haw:members”, mbs, true);
console.log(“회원 저장 결과:”, result, “총 회원:”, mbs.length);
}
await store.set(“haw:user”, newUser);
setUser(newUser); setMode(selectedMode); setRecords(recs);
setIsNewUser(true);
setScreen(“certify”); setSStep(“login”);
};

const handleLogout = async () => {
await store.del(“haw:user”);
setUser(null); setMode(null); setRecords([]);
setSName(””); setSEmail(””); setScreen(“landing”);
};

// ── Nav ──
const Nav = () => (
<nav style={{position:“sticky”,top:0,zIndex:100,height:56,padding:“0 clamp(16px,4vw,48px)”,display:“flex”,alignItems:“center”,justifyContent:“space-between”,background:“rgba(10,10,10,.97)”,borderBottom:“1px solid rgba(255,255,255,.05)”,backdropFilter:“blur(20px)”}}>
<button onClick={() => { resetCert(); setScreen(“landing”); }}
style={{display:“flex”,alignItems:“center”,gap:10,background:“none”,border:“none”,cursor:“pointer”,padding:0}}>
<div className=“glow” style={{fontSize:22,fontWeight:900,color:R,fontFamily:“Noto Serif SC,serif”,lineHeight:1}}>火</div>
<div style={{textAlign:“left”}}>
<div style={{fontSize:6,letterSpacing:”.3em”,color:R,fontFamily:KR,fontWeight:500}}>HABIT WOMEN ACADEMY</div>
<div style={{fontSize:13,letterSpacing:”.12em”,fontWeight:600,color:”#fff”}}>HAW</div>
</div>
</button>
<div style={{display:“flex”,alignItems:“center”,gap:6}}>
<button style={NAV_BTN(screen===“intro”)} onClick={() => setScreen(“intro”)}>서비스 소개</button>
{user
? <button style={{background:“transparent”,color:“rgba(255,255,255,.35)”,fontSize:11,fontFamily:KR,padding:“6px 12px”,border:“1px solid rgba(255,255,255,.12)”,cursor:“pointer”}} onClick={handleLogout}>로그아웃</button>
: <button className=“btn-red” style={{width:“auto”,padding:“7px 16px”,fontSize:11}} onClick={() => setScreen(“signup”)}>로그인</button>
}
</div>
</nav>
);

// ══════════════════════
// 화면 렌더
// ══════════════════════

if (screen===“loading”) return (
<div style={{background:”#0a0a0a”,minHeight:“100vh”,display:“flex”,alignItems:“center”,justifyContent:“center”}}>
<style>{CSS}</style>
<div className=“glow” style={{fontSize:56,fontWeight:900,color:R,fontFamily:“Noto Serif SC,serif”,animation:“pulse 1.5s ease-in-out infinite”}}>火</div>
</div>
);

if (screen===“landing”) return (
<div style={{background:”#0a0a0a”,color:”#fff”,minHeight:“100vh”,fontFamily:“Cormorant Garamond,serif”}}>
<style>{CSS}</style>
<Nav />
<section style={{padding:“clamp(40px,8vh,100px) clamp(20px,5vw,80px) 60px”,maxWidth:“min(520px,90%)”,margin:“0 auto”,textAlign:“center”}}>
<div className="float" style={{marginBottom:24}}>
<div className=“glow” style={{fontSize:“clamp(80px,18vw,130px)”,fontWeight:900,color:R,fontFamily:“Noto Serif SC,serif”,lineHeight:1}}>火</div>
</div>
<p style={{fontSize:10,letterSpacing:”.3em”,color:R,fontFamily:KR,fontWeight:500,marginBottom:14}}>HABIT WOMEN ACADEMY</p>
<h1 style={{fontSize:“clamp(28px,6vw,50px)”,fontWeight:300,lineHeight:1.2,fontStyle:“italic”,marginBottom:14}}>혼자서는 어렵습니다.</h1>
<div style={{width:36,height:1,background:R,margin:“0 auto 20px”}} />
<p style={{fontSize:15,fontFamily:KR,fontWeight:300,color:“rgba(255,255,255,.45)”,lineHeight:2,marginBottom:8}}>습관은 의지가 아니라 관리입니다.</p>
<p style={{fontSize:13,fontFamily:KR,fontWeight:300,color:“rgba(255,255,255,.22)”,lineHeight:2,marginBottom:52}}>우리는 그 습관을 함께 만들어갑니다.</p>
<div style={{display:“flex”,flexDirection:“column”,gap:10,maxWidth:280,margin:“0 auto”}}>
<button className=“btn-red” onClick={() => setScreen(“signup”)}>생활습관 바꾸기</button>
<button className=“btn-white” onClick={() => setScreen(“maintain”)}>현재 습관 유지하기</button>
</div>
</section>
<div style={{borderTop:“1px solid rgba(255,255,255,.04)”,borderBottom:“1px solid rgba(255,255,255,.04)”,padding:“11px 0”,overflow:“hidden”}}>
<div style={{display:“flex”,animation:“mq 22s linear infinite”,whiteSpace:“nowrap”}}>
{Array(6).fill([“독서”,“운동”,“기상루틴”,“다이어트”,“공부”,“외국어”,“명상”,“일기”]).flat().map((t,i) => (
<span key={i} style={{fontSize:10,letterSpacing:”.3em”,color:“rgba(255,255,255,.1)”,marginRight:36,fontFamily:KR}}>· {t}</span>
))}
</div>
</div>
<footer style={{padding:“18px 24px”,display:“flex”,justifyContent:“flex-end”,alignItems:“center”,borderTop:“1px solid rgba(255,255,255,.04)”,marginTop:40,gap:16}}>
<span style={{fontSize:9,color:“rgba(255,255,255,.08)”,fontFamily:KR}}>© 2025 HABIT WOMEN ACADEMY</span>
<button onClick={() => setScreen(“admin”)} style={{background:“none”,border:“none”,cursor:“pointer”,fontSize:8,color:“rgba(255,255,255,.06)”,fontFamily:KR,padding:0}}>···</button>
</footer>
</div>
);

if (screen===“maintain”) return (
<div style={{background:”#0a0a0a”,color:”#fff”,minHeight:“100vh”,fontFamily:“Cormorant Garamond,serif”}}>
<style>{CSS}</style>
<Nav />
<section style={{padding:“clamp(32px,5vh,60px) clamp(20px,5vw,60px) 100px”,maxWidth:“min(680px,100%)”,margin:“0 auto”}}>

```
    {/* 점 네비게이션 */}
    <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:48}}>
      {[0,1].map(i => (
        <button key={i} onClick={() => setMaintainPage(i)}
          style={{width:i===maintainPage?24:8,height:8,borderRadius:4,background:i===maintainPage?R:"rgba(255,255,255,.2)",border:"none",cursor:"pointer",transition:"all .3s",padding:0}} />
      ))}
    </div>

    {maintainPage===0 && <div className="fade">

    {/* 헤더 */}
    <p style={{fontSize:10,letterSpacing:".4em",color:R,fontFamily:KR,fontWeight:500,marginBottom:14}}>FOR YOU</p>
    <h2 style={{fontSize:"clamp(24px,5vw,42px)",fontWeight:300,fontStyle:"italic",lineHeight:1.3,marginBottom:14}}>
      우리는 '갓생'을<br/>만들고 싶지 않습니다.
    </h2>
    <div style={{width:36,height:1,background:R,margin:"0 0 32px"}} />

    {/* 본문 */}
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {[
        "이미 멋지게 잘 살고 있는 사람들에게 더 잘하라고 말하는 서비스도 아닙니다.",
        "그보다 우리는, 힘들게 하루를 버티고 있는 사람들이 '무너지지 않는 하루'를 보내는 걸 돕고 싶습니다.",
      ].map((t,i) => (
        <p key={i} style={{fontSize:15,fontFamily:KR,fontWeight:300,color:"rgba(255,255,255,.55)",lineHeight:2}}>{t}</p>
      ))}
    </div>

    {/* 이야기 박스 */}
    <div style={{margin:"36px 0",borderLeft:`3px solid rgba(255,59,48,.4)`,paddingLeft:20,display:"flex",flexDirection:"column",gap:16}}>
      {[
        "저는 한동안 밥을 먹고도 설거지를 하지 못했고, 다 먹은 컵라면이 1~2주씩 자리를 차지했고, 바닥에는 옷과 머리카락이 쌓여 있었습니다.",
        "시간이 없어서가 아니라, 할 수 있는 상태가 아니었기 때문입니다.",
        "그렇게 지내다 보면 문제는 단순히 '집이 더러워지는 것'이 아니라, 그 상태를 계속 보면서 스스로를 더 싫어하게 된다는 점이었습니다.",
        "그래서 저는 결국 돈을 내고 청소를 맡기고, 쓰레기를 대신 버려주는 서비스를 이용했습니다. 삶은 분명 나아졌습니다. 하지만 동시에 생각했습니다. '이게 정상적인 방식일까?' '우리는 이걸 스스로 관리할 수 없는 걸까?'",
      ].map((t,i) => (
        <p key={i} style={{fontSize:13,fontFamily:KR,fontWeight:300,color:"rgba(255,255,255,.4)",lineHeight:2}}>{t}</p>
      ))}
    </div>

    <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:36}}>
      {[
        "바꿀 수 있습니다. 하지만 항상 바꿀 수 있는 건 아닙니다.",
        "어떤 날은 그냥 지금 상태를 유지하는 것만으로도 충분히 잘한 날입니다.",
        "그리고 어떤 날은 조금만 바꿔도 훨씬 나아질 수 있는 날입니다.",
        "그래서 우리는 '무조건 바꾸라'고 말하지 않습니다.",
      ].map((t,i) => (
        <p key={i} style={{fontSize:15,fontFamily:KR,fontWeight:300,color:"rgba(255,255,255,.55)",lineHeight:2}}>{t}</p>
      ))}
    </div>

    {/* 두 가지 이유 카드 */}
    <p style={{fontSize:13,fontFamily:KR,fontWeight:400,color:"rgba(255,255,255,.6)",marginBottom:16,textAlign:"center"}}>대신 묻습니다.</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,marginBottom:36}}>
      <div style={{background:"#111",padding:"22px 18px"}}>
        <div style={{fontSize:10,letterSpacing:".2em",color:"rgba(255,255,255,.3)",fontFamily:KR,marginBottom:14}}>지금 이대로도 괜찮은 이유</div>
        {[
          "지금도 버티고 있다는 것 자체가 대단한 일이에요",
          "억지로 바꾸려다 더 무너질 수 있어요",
          "쉬는 것도 회복이에요",
          "완벽하지 않아도 삶은 계속돼요",
        ].map((t,i) => (
          <div key={i} style={{display:"flex",gap:8,marginBottom:10,alignItems:"flex-start"}}>
            <span style={{color:"rgba(255,255,255,.2)",fontSize:11,marginTop:2,flexShrink:0}}>·</span>
            <p style={{fontSize:12,fontFamily:KR,fontWeight:300,color:"rgba(255,255,255,.4)",lineHeight:1.7}}>{t}</p>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(255,59,48,.06)",border:"1px solid rgba(255,59,48,.15)",padding:"22px 18px"}}>
        <div style={{fontSize:10,letterSpacing:".2em",color:R,fontFamily:KR,marginBottom:14}}>조금만 바꾸면 나아질 수 있는 이유</div>
        {[
          "작은 행동 하나가 '내가 할 수 있다'는 감각을 돌려줘요",
          "환경이 바뀌면 기분도 조금씩 바뀌어요",
          "습관은 의지가 아니라 구조예요",
          "오늘 하나만 해도 충분해요",
        ].map((t,i) => (
          <div key={i} style={{display:"flex",gap:8,marginBottom:10,alignItems:"flex-start"}}>
            <span style={{color:"rgba(255,59,48,.5)",fontSize:11,marginTop:2,flexShrink:0}}>·</span>
            <p style={{fontSize:12,fontFamily:KR,fontWeight:300,color:"rgba(255,255,255,.5)",lineHeight:1.7}}>{t}</p>
          </div>
        ))}
      </div>
    </div>

    {/* 마무리 */}
    <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:48}}>
      {[
        "이 서비스는 의지를 강요하지 않습니다. 의지가 없어서 무너지는 게 아니라, 이미 너무 많은 걸 버티고 있기 때문이라고 생각합니다.",
        "우리는 당신이 완벽해지길 바라지 않습니다. 대신 오늘 하루를 조금 덜 무너뜨리고, 조금 더 괜찮게 끝낼 수 있기를 바랍니다.",
      ].map((t,i) => (
        <p key={i} style={{fontSize:15,fontFamily:KR,fontWeight:300,color:"rgba(255,255,255,.55)",lineHeight:2}}>{t}</p>
      ))}
    </div>

    {/* 마지막 문장 */}
    <div style={{textAlign:"center",padding:"32px 24px",background:"#111",marginBottom:40}}>
      <p style={{fontSize:14,fontFamily:KR,fontWeight:300,color:"rgba(255,255,255,.4)",lineHeight:2,marginBottom:8}}>
        '대단한 하루'가 아니라 '스스로에게 덜 미안한 하루'
      </p>
      <p style={{fontSize:13,fontFamily:KR,fontWeight:300,color:"rgba(255,255,255,.3)",lineHeight:2,marginBottom:16}}>
        그걸 만드는 서비스입니다.
      </p>
      <p style={{fontSize:16,fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",color:"rgba(255,255,255,.6)",lineHeight:1.8}}>
        '오늘, 나 나쁘지 않았다.'
      </p>
    </div>

    <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:280,margin:"0 auto",textAlign:"center"}}>
      <button className="btn-red" onClick={() => setScreen("signup")}>함께 시작하기</button>
      <button className="btn-text" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={() => setMaintainPage(1)}>
        다음 이야기 →
      </button>
    </div>
    </div>}

    {maintainPage===1 && <div className="fade">
      <p style={{fontSize:10,letterSpacing:".4em",color:R,fontFamily:KR,fontWeight:500,marginBottom:14}}>OUR CHOICE</p>
      <h2 style={{fontSize:"clamp(20px,4.5vw,38px)",fontWeight:300,fontStyle:"italic",lineHeight:1.35,marginBottom:14}}>
        왜 우리는<br/>PC 모드를 고집할까요
      </h2>
      <div style={{width:36,height:1,background:R,margin:"0 0 32px"}} />

      <p style={{fontSize:15,fontFamily:KR,fontWeight:300,color:"rgba(255,255,255,.55)",lineHeight:2,marginBottom:32}}>
        우리는 일부러 불편한 선택을 했습니다.<br/>
        요즘 대부분의 서비스는 더 빠르게, 더 쉽게, 더 편하게 사용하는 방향으로 만들어집니다.<br/>
        하지만 우리는 그 흐름을 그대로 따르지 않았습니다.
      </p>

      {[
        { title:"가계부를 예로 들어보겠습니다.",
          body:"사람들은 엑셀보다 더 편한 모바일 가계부 앱을 사용합니다. 자동으로 연동되고, 언제 어디서든 쉽게 확인할 수 있습니다. 그런데 정말로 그 가계부를 자주 들여다보고 있나요? 편해진 만큼 오히려 덜 확인하게 되고, 결국 돈의 흐름을 놓치게 됩니다." },
        { title:"태블릿도 비슷합니다.",
          body:"처음에는 공부를 위해 샀지만, 결국 많은 경우 영상과 콘텐츠를 소비하는 기기로 바뀝니다. 편한 방향으로만 사용되기 때문입니다." },
      ].map((item,i) => (
        <div key={i} style={{borderLeft:`3px solid rgba(255,59,48,.3)`,paddingLeft:20,marginBottom:28}}>
          <p style={{fontSize:13,fontFamily:KR,fontWeight:500,color:"rgba(255,255,255,.6)",marginBottom:8}}>{item.title}</p>
          <p style={{fontSize:13,fontFamily:KR,fontWeight:300,color:"rgba(255,255,255,.38)",lineHeight:2}}>{item.body}</p>
        </div>
      ))}

      <div style={{background:"#111",padding:"24px",margin:"28px 0",textAlign:"center"}}>
        <p style={{fontSize:15,fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",color:"rgba(255,255,255,.7)",lineHeight:1.8}}>
          "편함이 항상 좋은 결과를 만들지는 않는다"
        </p>
      </div>

      {[
        "그래서 우리는 PC 환경을 선택했습니다. 바로 사용할 수 없고, 접속해야 하고, 조금은 번거로운 방식.",
        "하지만 그 불편함이 사용자를 '행동하게' 만듭니다. 무의식적으로 스쳐 지나가는 사용이 아니라, 의식적으로 들어오고, 한 번 더 생각하고, 실제로 움직이게 만듭니다.",
        "우리 서비스는 편의를 극대화하는 서비스가 아닙니다. 행동을 만들어내는 서비스입니다.",
        "불편함을 줄이기보다, 필요한 순간에 당신을 움직이게 하는 것. 그게 우리가 PC 모드를 고집하는 이유입니다.",
      ].map((t,i) => (
        <p key={i} style={{fontSize:14,fontFamily:KR,fontWeight:300,color:"rgba(255,255,255,.5)",lineHeight:2.1,marginBottom:20}}>{t}</p>
      ))}

      <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:280,margin:"40px auto 0",textAlign:"center"}}>
        <button className="btn-red" onClick={() => setScreen("signup")}>함께 시작하기</button>
        <button className="btn-text" onClick={() => setMaintainPage(0)}>← 이전 이야기</button>
      </div>
    </div>}

  </section>
</div>
```

);

if (screen===“intro”) return (
<div style={{background:”#0a0a0a”,color:”#fff”,minHeight:“100vh”,fontFamily:“Cormorant Garamond,serif”}}>
<style>{CSS}</style>
<Nav />
<section style={{padding:“clamp(32px,5vh,60px) clamp(20px,5vw,60px)”,maxWidth:“min(680px,100%)”,margin:“0 auto”}}>
{/* 공지 배너 */}
<div style={{background:“rgba(255,59,48,.07)”,border:“1px solid rgba(255,59,48,.2)”,padding:“12px 16px”,marginBottom:32,display:“flex”,gap:10,alignItems:“flex-start”}}>
<span style={{fontSize:12,flexShrink:0}}>📢</span>
<div>
<div style={{fontSize:10,letterSpacing:”.15em”,color:R,fontFamily:KR,fontWeight:500,marginBottom:4}}>서비스 안내</div>
<p style={{fontSize:12,fontFamily:KR,fontWeight:300,color:“rgba(255,255,255,.5)”,lineHeight:1.8}}>
현재 7일 연속 미완료 회원에게는 <strong style={{color:“rgba(255,255,255,.7)”,fontWeight:500}}>이메일로 코치 연락</strong>을 드리고 있습니다.<br/>
추후 서비스가 성장하면 <strong style={{color:“rgba(255,255,255,.7)”,fontWeight:500}}>전화 코칭</strong>으로 전환될 예정입니다.
</p>
</div>
</div>

```
    <p style={{fontSize:10,letterSpacing:".4em",color:R,fontFamily:KR,fontWeight:500,marginBottom:14}}>SERVICE</p>
    <h2 style={{fontSize:"clamp(26px,5vw,46px)",fontWeight:300,fontStyle:"italic",lineHeight:1.2,marginBottom:14}}>
      습관은 의지가<br/>아니라 관리입니다.
    </h2>
    <div style={{width:36,height:1,background:R,margin:"0 0 40px"}} />

    <p style={{fontSize:10,letterSpacing:".4em",color:R,fontFamily:KR,fontWeight:500,marginBottom:20}}>HOW IT WORKS</p>
    {[
      { n:"01", t:"가입 & 모드 선택",
        d:"이름과 이메일만 입력하면 바로 시작할 수 있어요. HAW는 지금의 습관을 바꾸고 싶은 분을 위한 서비스예요." },
      { n:"02", t:"사진 + 메모로 인증",
        d:"오늘 실천한 습관을 사진으로 찍어 올려주세요. 책 페이지, 운동 중 사진, 식단 사진 어떤 것이든 괜찮아요. 메모를 함께 남기면 AI가 더 정확하게 평가해요." },
      { n:"03", t:"Claude AI 자동 분석",
        d:"사진을 올리면 Claude AI가 어떤 습관인지 자동으로 분류하고, 잘함 / 보통 / 아쉬움으로 평가해요. 분류가 다르면 직접 수정할 수 있어요." },
      { n:"04", t:"하루 여러 습관 인증 가능",
        d:"독서도 하고 운동도 했다면, 슬롯을 추가해서 한 번에 여러 습관을 인증할 수 있어요. 각 습관마다 따로 사진과 메모를 남겨주세요." },
      { n:"05", t:"주간 캘린더로 기록 확인",
        d:"기록 내역 화면에서 이번 주 실천을 한눈에 확인할 수 있어요. 날짜를 클릭하면 그날의 평가 근거와 AI 피드백을 볼 수 있어요." },
      { n:"06", t:"코치 연결",
        d:"7일 연속 미완료 시 코치가 먼저 연락합니다. 현재는 이메일로 독려 중이며, 추후 전화 코칭으로 전환될 예정입니다." },
    ].map((item,i) => (
      <div key={i} style={{display:"grid",gridTemplateColumns:"44px 1fr",gap:18,padding:"22px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
        <div style={{fontSize:10,color:R,fontFamily:KR,paddingTop:2}}>{item.n}</div>
        <div>
          <div style={{fontSize:15,fontWeight:500,marginBottom:6}}>{item.t}</div>
          <div style={{fontSize:13,fontFamily:KR,fontWeight:300,color:"rgba(255,255,255,.35)",lineHeight:1.85}}>{item.d}</div>
        </div>
      </div>
    ))}

    <div style={{marginTop:40}}>
      <p style={{fontSize:10,letterSpacing:".4em",color:R,fontFamily:KR,fontWeight:500,marginBottom:20}}>HABIT CATEGORIES</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1}}>
        {[
          {emoji:"📖",label:"독서"},
          {emoji:"🏃‍♀️",label:"운동"},
          {emoji:"☀️",label:"기상루틴"},
          {emoji:"🥗",label:"다이어트",sub:"식단·운동·간헐적단식"},
          {emoji:"✏️",label:"공부",sub:"외국어·자격증·승진시험"},
          {emoji:"🧘‍♀️",label:"명상·일기"},
          {emoji:"🏠",label:"무탈라이프",sub:"청소·빨래·설거지·정리"},
          {emoji:"✨",label:"새로운 취미"},
          {emoji:"✦",label:"기타"},
        ].map((h,i) => (
          <div key={i} style={{background:"#111",padding:"16px 10px",textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:6}}>{h.emoji}</div>
            <div style={{fontSize:11,fontFamily:KR,color:"rgba(255,255,255,.55)",fontWeight:500}}>{h.label}</div>
            {h.sub && <div style={{fontSize:9,fontFamily:KR,color:"rgba(255,255,255,.2)",marginTop:3,lineHeight:1.6}}>{h.sub}</div>}
          </div>
        ))}
      </div>
    </div>

    <div style={{marginTop:48,textAlign:"center"}}>
      <button className="btn-red" style={{maxWidth:280}} onClick={() => setScreen("signup")}>지금 시작하기</button>
    </div>
  </section>
</div>
```

);

if (screen===“signup”) return (
<div style={{background:”#0a0a0a”,color:”#fff”,minHeight:“100vh”,fontFamily:“Cormorant Garamond,serif”}}>
<style>{CSS}</style>
<Nav />
<section style={{padding:“clamp(40px,8vh,80px) clamp(20px,5vw,40px)”,maxWidth:“min(400px,90%)”,margin:“0 auto”,textAlign:“center”}}>
<div className=“glow” style={{fontSize:48,fontWeight:900,color:R,fontFamily:“Noto Serif SC,serif”,marginBottom:20}}>火</div>
<h2 style={{fontSize:32,fontWeight:300,fontStyle:“italic”,marginBottom:6}}>
{sStep===“login” ? “로그인 / 가입” : “모드 선택”}
</h2>
<div style={{width:30,height:1,background:“rgba(255,59,48,.35)”,margin:“0 auto 32px”}} />
<div className="fade">
<p style={{fontSize:12,fontFamily:KR,color:“rgba(255,255,255,.3)”,marginBottom:28,lineHeight:1.8}}>처음이면 가입, 기존 회원이면 바로 로그인돼요</p>
<div style={{display:“flex”,flexDirection:“column”,gap:8,marginBottom:8}}>
<input className=“ifield” placeholder=“이름” value={sName} onChange={e=>{setSName(e.target.value);setSError(””);}} onKeyDown={e=>e.key===“Enter”&&handleLogin()} />
<input className=“ifield” placeholder=“이메일” type=“email” value={sEmail} onChange={e=>{setSEmail(e.target.value);setSError(””);}} onKeyDown={e=>e.key===“Enter”&&handleLogin()} />
</div>
{sError && <div style={{fontSize:11,fontFamily:KR,color:R,marginBottom:8}}>{sError}</div>}
<button className="btn-red" onClick={handleLogin} style={{marginBottom:12}}>로그인 / 가입</button>
<button className=“btn-text” onClick={() => setScreen(“landing”)}>← 돌아가기</button>
</div>
</section>
</div>
);

if (screen===“certify”) return (
<div style={{background:”#0a0a0a”,color:”#fff”,minHeight:“100vh”,fontFamily:“Cormorant Garamond,serif”,display:“flex”,flexDirection:“column”}}>
<style>{CSS}</style>
<Nav />
<div style={{flex:1,display:“flex”,flexDirection:“column”,alignItems:“center”,padding:“32px 24px”,textAlign:“center”}}>
<div style={{fontSize:28,fontWeight:900,color:R,fontFamily:“Noto Serif SC,serif”}}>火</div>
<h2 style={{fontSize:24,fontWeight:300,fontStyle:“italic”,marginTop:8,marginBottom:4}}>오늘의 인증</h2>
<div style={{width:26,height:1,background:“rgba(255,59,48,.3)”,margin:“0 auto 20px”}} />
{isNewUser && (
<div className=“fade” style={{width:“100%”,maxWidth:340,background:“rgba(255,59,48,.08)”,border:“1px solid rgba(255,59,48,.25)”,padding:“12px 16px”,marginBottom:16,textAlign:“left”}}>
<div style={{fontSize:10,color:R,fontFamily:KR,letterSpacing:”.15em”,marginBottom:6}}>🎉 가입을 환영해요!</div>
<p style={{fontSize:12,fontFamily:KR,color:“rgba(255,255,255,.5)”,lineHeight:1.8}}>
관리자에게 가입 사실을 알려주세요.<br/>
<span style={{color:“rgba(255,255,255,.7)”,fontWeight:500}}>이메일: haw@habitwomen.com</span>
</p>
<button onClick={() => setIsNewUser(false)} style={{marginTop:8,background:“transparent”,border:“none”,color:“rgba(255,255,255,.3)”,fontSize:10,fontFamily:KR,cursor:“pointer”,padding:0}}>닫기</button>
</div>
)}

```
    {certStep==="upload" && (
      <div className="fade" style={{width:"100%",maxWidth:"clamp(320px,90%,480px)",display:"flex",flexDirection:"column",gap:8}}>
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile} />
        {slots.map((slot,idx) => (
          <div key={idx} style={{background:"#111",border:`1px solid ${slot.b64?"rgba(255,59,48,.3)":"rgba(255,255,255,.15)"}`,padding:12}}>
            <div style={{display:"flex",gap:10}}>
              <div onClick={() => { setActiveSlot(idx); fileRef.current.click(); }}
                style={{width:80,height:80,flexShrink:0,background:"#0a0a0a",border:`1px dashed ${slot.b64?"transparent":"rgba(255,255,255,.25)"}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                {slot.url
                  ? <img src={slot.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                  : <div style={{textAlign:"center",color:"rgba(255,255,255,.45)",fontSize:11,fontFamily:KR,lineHeight:2}}>
                      <div style={{fontSize:20}}>📷</div>
                      {idx===0?"필수":"선택"}
                    </div>
                }
              </div>
              <textarea className="tfield" rows={3} style={{flex:1,fontSize:11}}
                placeholder={idx===0?"오늘 어떻게 했는지 남겨주세요 (선택)":"추가 메모 (선택)"}
                value={slot.memo}
                onChange={e => setSlots(prev => prev.map((s,i) => i===idx?{...s,memo:e.target.value}:s))} />
            </div>
            {idx>0 && (
              <button onClick={() => setSlots(prev => prev.filter((_,i) => i!==idx))}
                style={{background:"transparent",border:"none",color:"rgba(255,255,255,.2)",fontSize:10,fontFamily:KR,cursor:"pointer",marginTop:6,padding:0}}>
                ✕ 삭제
              </button>
            )}
          </div>
        ))}
        {slots.length<4 && (
          <button onClick={() => setSlots(prev => [...prev,{url:null,b64:null,memo:""}])}
            style={{background:"transparent",border:"1px dashed rgba(255,255,255,.12)",color:"rgba(255,255,255,.3)",fontFamily:KR,fontSize:12,padding:"10px",cursor:"pointer"}}>
            + 인증 항목 추가
          </button>
        )}
        {converting && <p style={{fontSize:11,fontFamily:KR,color:"rgba(255,59,48,.5)",animation:"pulse 1s ease-in-out infinite"}}>사진 준비 중...</p>}
        {slots[0]?.b64 && !converting && <button className="btn-red" onClick={analyzeAll}>AI 분석 시작</button>}
        <button className="btn-text" onClick={() => setScreen("history")}>기록 내역 보기</button>
        <button onClick={() => {
          const today = fmtDate(new Date());
          setRecords(prev => prev.find(r=>r.date===today) ? prev : [...prev,{date:today,items:[]}]);
          resetCert(); setCertStep("alldone");
        }} style={{background:"transparent",border:"none",color:"rgba(255,255,255,.15)",fontSize:11,fontFamily:KR,cursor:"pointer",padding:"4px 0"}}>
          오늘 아무것도 안 했어요
        </button>
      </div>
    )}

    {certStep==="analyzing" && (
      <div className="fade" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
        {slots[0]?.url && <img src={slots[0].url} alt="" style={{width:140,height:140,objectFit:"cover",opacity:.35}} />}
        <div style={{width:26,height:26,border:`2px solid ${R}`,borderTopColor:"transparent",borderRadius:"50%"}} className="spin" />
        <p style={{fontFamily:KR,fontSize:12,color:"rgba(255,255,255,.3)",animation:"pulse 1.5s ease-in-out infinite"}}>Claude가 분석하고 있어요...</p>
      </div>
    )}

    {certStep==="fake" && (
      <div className="fade" style={{width:"100%",maxWidth:300,display:"flex",flexDirection:"column",gap:12,alignItems:"center"}}>
        {slots[0]?.url && <img src={slots[0].url} alt="" style={{width:"100%",maxHeight:180,objectFit:"cover",filter:"grayscale(60%) opacity(.4)"}} />}
        <div style={{background:"rgba(255,59,48,.07)",border:"1px solid rgba(255,59,48,.2)",padding:"14px 16px",width:"100%",textAlign:"left"}}>
          <div style={{fontSize:10,color:R,fontFamily:KR,marginBottom:4}}>⚠ 인증 확인 필요</div>
          <p style={{fontSize:12,fontFamily:KR,color:"rgba(255,255,255,.4)",lineHeight:1.8}}>{aiResult?.fake_reason||"습관과 관련된 사진인지 확인이 어렵습니다."}</p>
        </div>
        <button className="btn-red" onClick={resetCert}>다시 올리기</button>
      </div>
    )}

    {certStep==="result" && aiResult && (
      <div className="fade" style={{width:"100%",maxWidth:"clamp(280px,90%,420px)",display:"flex",flexDirection:"column",gap:10}}>
        {slots[0]?.url && <img src={slots[0].url} alt="" style={{width:"100%",maxHeight:140,objectFit:"cover"}} />}
        {slots[0]?.memo && (
          <div style={{background:"#0f0f0f",borderLeft:`2px solid rgba(255,59,48,.3)`,padding:"8px 12px",textAlign:"left"}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,.25)",fontFamily:KR,marginBottom:2}}>내 메모</div>
            <div style={{fontSize:12,fontFamily:KR,color:"rgba(255,255,255,.4)"}}>{slots[0].memo}</div>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:1}}>
          <div style={{background:"#111",padding:"13px",textAlign:"left"}}>
            <div style={{fontSize:8,letterSpacing:".2em",color:R,fontFamily:KR,marginBottom:6}}>습관 분류</div>
            <div style={{fontSize:16,fontWeight:600,marginBottom:3}}>{aiResult.habit}</div>
            <div style={{fontSize:10,fontFamily:KR,color:"rgba(255,255,255,.28)",lineHeight:1.5}}>{aiResult.habit_reason}</div>
          </div>
          <div style={{background:GS[aiResult.grade]?.bg||"#111",border:`1px solid ${GS[aiResult.grade]?.color||"rgba(255,255,255,.08)"}`,padding:"13px",textAlign:"left"}}>
            <div style={{fontSize:8,letterSpacing:".2em",color:R,fontFamily:KR,marginBottom:6}}>오늘 평가</div>
            <div style={{fontSize:16,fontWeight:700,color:GS[aiResult.grade]?.color,marginBottom:3}}>{aiResult.grade}</div>
            <div style={{fontSize:10,fontFamily:KR,color:"rgba(255,255,255,.28)",lineHeight:1.5}}>{aiResult.grade_reason}</div>
          </div>
        </div>
        {aiResult.feedback && (
          <div style={{borderLeft:`2px solid ${R}`,padding:"8px 12px"}}>
            <p style={{fontSize:12,fontFamily:KR,color:"rgba(255,255,255,.4)",lineHeight:1.7,fontStyle:"italic"}}>"{aiResult.feedback}"</p>
          </div>
        )}
        <div style={{textAlign:"left"}}>
          <div style={{fontSize:9,color:"rgba(255,255,255,.2)",fontFamily:KR,marginBottom:8}}>다르면 직접 선택하세요</div>
          {/* 메인 카테고리 — 2열 크게 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6}}>
            {HABITS.map(h => (
              <button key={h.label} className={`htag${habit===h.label?" on":""}`}
                style={{padding:"14px 10px",flexDirection:"row",gap:8,justifyContent:"flex-start"}}
                onClick={() => { setHabit(h.label); setSubHabit(""); if(h.label!=="기타") setCustom(""); }}>
                <span style={{fontSize:18}}>{h.emoji}</span>
                <div style={{textAlign:"left"}}>
                  <div style={{fontSize:12,fontWeight:600}}>{h.label}</div>
                  {h.sub && <div style={{fontSize:9,opacity:.5,marginTop:1}}>{h.sub.map(s=>s.label).join(" · ")}</div>}
                </div>
              </button>
            ))}
          </div>
          {/* 세부 항목 — sub 있는 카테고리 선택 시 */}
          {HABITS.find(h=>h.label===habit)?.sub && (
            <div style={{marginTop:8,background:"rgba(255,59,48,.05)",border:"1px solid rgba(255,59,48,.15)",padding:"12px"}}>
              <div style={{fontSize:9,color:R,fontFamily:KR,letterSpacing:".15em",marginBottom:8}}>
                {habit} 세부 항목 {aiResult?.sub_habit ? `— AI 추천: ${aiResult.sub_habit}` : ""}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
                {HABITS.find(h=>h.label===habit).sub.map(s => (
                  <button key={s.label} className={`htag${subHabit===s.label?" on":""}`}
                    style={{padding:"10px 6px"}}
                    onClick={() => setSubHabit(s.label)}>
                    <span style={{fontSize:16}}>{s.emoji}</span>
                    <span style={{fontSize:10}}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {habit==="기타" && (
            <div style={{marginTop:8}}>
              <input className="ifield" placeholder="어떤 습관인지 입력해주세요" value={custom} onChange={e=>setCustom(e.target.value)} autoFocus />
            </div>
          )}
        </div>
        <button className="btn-red" onClick={confirmCert}
          style={{opacity:(habit==="기타"&&!custom)||(HABITS.find(h=>h.label===habit)?.sub&&!subHabit)?.4:1}}
          disabled={(habit==="기타"&&!custom)||(HABITS.find(h=>h.label===habit)?.sub&&!subHabit)}>
          인증 완료
        </button>
        <button className="btn-text" onClick={() => setCertStep("upload")}>← 다시 올리기</button>
      </div>
    )}

    {certStep==="alldone" && (
      <div className="fade" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,width:"100%",maxWidth:300}}>
        <div style={{width:56,height:56,border:`1px solid ${R}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:R}}>✓</div>
        <p style={{fontFamily:KR,fontSize:14,fontWeight:500,marginTop:4}}>인증 완료!</p>
        {aiResult?.feedback && <p style={{fontFamily:KR,fontSize:12,color:"rgba(255,255,255,.3)",fontStyle:"italic",maxWidth:240,lineHeight:1.7}}>"{aiResult.feedback}"</p>}
        <button className="btn-red" style={{marginTop:8}} onClick={() => { resetCert(); setCertStep("upload"); }}>한 번 더 인증하기</button>
        <button className="btn-text" onClick={() => setScreen("history")}>기록 내역 보기</button>
      </div>
    )}
  </div>
</div>
```

);

if (screen===“history”) {
const weekDates  = getWeekDates(weekOffset);
const selDateStr = selectedDay ? fmtDate(selectedDay) : null;
const selRecord  = selDateStr ? records.find(r => r.date===selDateStr) : null;
const totalOk    = weekDates.filter(d => { const r=records.find(r=>r.date===fmtDate(d)); return r&&r.items?.length>0; }).length;
return (
<div style={{background:”#0a0a0a”,color:”#fff”,minHeight:“100vh”,fontFamily:“Cormorant Garamond,serif”,display:“flex”,flexDirection:“column”}}>
<style>{CSS}</style>
<Nav />
<div style={{flex:1,padding:“32px 24px”}}>
<div style={{maxWidth:“min(480px,100%)”,margin:“0 auto”}}>
<div style={{textAlign:“center”,marginBottom:28}}>
<div style={{fontSize:34,fontWeight:900,color:R,fontFamily:“Noto Serif SC,serif”}}>火</div>
<h2 style={{fontSize:26,fontWeight:300,fontStyle:“italic”,marginTop:10,marginBottom:6}}>기록 내역</h2>
<div style={{width:26,height:1,background:“rgba(255,59,48,.35)”,margin:“0 auto”}} />
</div>
<div style={{display:“flex”,alignItems:“center”,justifyContent:“space-between”,marginBottom:14}}>
<button className=“btn-ghost” onClick={() => { setWeekOffset(w=>w-1); setSelectedDay(null); }}>← 이전</button>
<div style={{textAlign:“center”}}>
<div style={{fontSize:11,fontFamily:KR,color:“rgba(255,255,255,.4)”}}>{fmtDate(weekDates[0])} — {fmtDate(weekDates[6])}</div>
<div style={{fontSize:10,fontFamily:KR,color:R,marginTop:2}}>인증 {totalOk}일 / 7일</div>
</div>
<button className=“btn-ghost” onClick={() => { setWeekOffset(w=>w+1); setSelectedDay(null); }} disabled={weekOffset>=0} style={{opacity:weekOffset>=0?.4:1}}>다음 →</button>
</div>
<div style={{display:“grid”,gridTemplateColumns:“repeat(7,1fr)”,gap:1,marginBottom:1}}>
{DAYS.map((d,i) => <div key={i} style={{textAlign:“center”,fontSize:10,fontFamily:KR,color:“rgba(255,255,255,.25)”,padding:“5px 0”}}>{d}</div>)}
</div>
<div style={{display:“grid”,gridTemplateColumns:“repeat(7,1fr)”,gap:1,marginBottom:16}}>
{weekDates.map((date,i) => {
const ds=fmtDate(date), rec=records.find(r=>r.date===ds), items=rec?.items||[];
const isSel=selDateStr===ds, today=isToday(date);
return (
<div key={i} className={`cal-day${today?" today":""}${isSel?" selected":""}`} onClick={() => setSelectedDay(date)}>
<div style={{fontSize:11,fontFamily:KR,color:today?R:“rgba(255,255,255,.3)”,fontWeight:today?700:400}}>{date.getDate()}</div>
{rec && items.length===0
? <div style={{fontSize:12,color:“rgba(255,255,255,.2)”}}>✕</div>
: items.length>0
? <>
<div style={{display:“flex”,gap:1,flexWrap:“wrap”,justifyContent:“center”}}>
{items.slice(0,2).map((it,j) => <span key={j} style={{fontSize:12}}>{HABITS.find(h=>it.habit===h.label||it.habit?.startsWith(h.label))?.emoji||“✦”}</span>)}
{items.length>2 && <span style={{fontSize:9,color:“rgba(255,255,255,.3)”,fontFamily:KR}}>+{items.length-2}</span>}
</div>
<div style={{fontSize:8,fontFamily:KR,fontWeight:600,
color:items.some(it=>it.grade===“잘함”)?GS[“잘함”].color:items.some(it=>it.grade===“보통”)?GS[“보통”].color:GS[“아쉬움”].color}}>
{items.some(it=>it.grade===“잘함”)?“잘함”:items.some(it=>it.grade===“보통”)?“보통”:“아쉬움”}
</div>
</>
: <div style={{fontSize:11,color:“rgba(255,255,255,.07)”}}>—</div>
}
</div>
);
})}
</div>
{selectedDay && (
<div className="fade" style={{marginBottom:16}}>
<div style={{fontSize:10,fontFamily:KR,color:R,letterSpacing:”.1em”,marginBottom:8}}>
{selDateStr} · {selRecord?.items?.length||0}개 인증
</div>
{selRecord?.items?.length>0
? selRecord.items.map((item,i) => (
<div key={i} className="card" style={{marginBottom:4}}>
<div style={{display:“flex”,alignItems:“center”,gap:8,marginBottom:6}}>
<span style={{fontSize:18}}>{HABITS.find(h=>item.habit===h.label||item.habit?.startsWith(h.label))?.emoji||“✦”}</span>
<span style={{fontSize:14,fontWeight:600}}>{item.habit}</span>
<span style={{marginLeft:“auto”,fontSize:10,fontFamily:KR,fontWeight:700,color:GS[item.grade]?.color,background:GS[item.grade]?.bg,padding:“3px 9px”}}>{item.grade}</span>
</div>
{item.message && <div style={{background:“rgba(255,255,255,.03)”,padding:“7px 10px”,marginBottom:6}}><div style={{fontSize:9,color:“rgba(255,255,255,.25)”,fontFamily:KR,marginBottom:2}}>내 메모</div><div style={{fontSize:11,fontFamily:KR,color:“rgba(255,255,255,.4)”}}>{item.message}</div></div>}
{item.grade_reason && <div style={{marginBottom:4}}><div style={{fontSize:9,color:“rgba(255,59,48,.5)”,fontFamily:KR,marginBottom:2}}>평가 근거</div><div style={{fontSize:11,fontFamily:KR,color:“rgba(255,255,255,.4)”,lineHeight:1.6}}>{item.grade_reason}</div></div>}
{item.feedback && <div style={{borderLeft:`2px solid rgba(255,59,48,.3)`,paddingLeft:10}}><p style={{fontSize:11,fontFamily:KR,color:“rgba(255,255,255,.3)”,fontStyle:“italic”}}>”{item.feedback}”</p></div>}
</div>
))
: <div className="card"><div style={{fontSize:12,fontFamily:KR,color:“rgba(255,255,255,.2)”,textAlign:“center”}}>{selRecord?“오늘 아무것도 안 했어요 ✕”:“인증 기록이 없어요”}</div></div>
}
</div>
)}
<div style={{background:”#0f0f0f”,border:“1px solid rgba(255,255,255,.05)”,padding:“14px 18px”,marginBottom:24}}>
<div style={{fontSize:9,letterSpacing:”.25em”,color:R,fontFamily:KR,marginBottom:10}}>이번 주 요약</div>
<div style={{display:“flex”,justifyContent:“space-around”}}>
{[“잘함”,“보통”,“아쉬움”].map(g => {
const cnt=weekDates.reduce((acc,d) => { const r=records.find(r=>r.date===fmtDate(d)); return acc+(r?.items?.filter(it=>it.grade===g).length||0); },0);
return (
<div key={g} style={{textAlign:“center”}}>
<div style={{fontSize:22,fontWeight:700,color:GS[g]?.color}}>{cnt}</div>
<div style={{fontSize:10,fontFamily:KR,color:“rgba(255,255,255,.25)”,marginTop:3}}>{g}</div>
</div>
);
})}
</div>
</div>
<div style={{display:“flex”,justifyContent:“center”}}>
<button className=“btn-red” style={{width:220}} onClick={() => { resetCert(); setScreen(“certify”); }}>인증하기</button>
</div>
</div>
</div>
</div>
);
}

if (screen===“admin”) {
if (!adminOpen) return (
<div style={{background:”#0a0a0a”,color:”#fff”,minHeight:“100vh”,fontFamily:“Cormorant Garamond,serif”,display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”,padding:“40px 24px”,textAlign:“center”}}>
<style>{CSS}</style>
<div style={{fontSize:10,letterSpacing:”.35em”,color:R,fontFamily:KR,marginBottom:16}}>ADMIN</div>
<h2 style={{fontSize:28,fontWeight:300,fontStyle:“italic”,marginBottom:6}}>관리자 전용</h2>
<div style={{width:28,height:1,background:“rgba(255,59,48,.35)”,margin:“0 auto 32px”}} />
<div style={{width:“100%”,maxWidth:280,display:“flex”,flexDirection:“column”,gap:8}}>
<input className=“ifield” type=“password” placeholder=“비밀번호” value={adminPw}
onChange={e => { setAdminPw(e.target.value); setAdminPwErr(false); }}
onKeyDown={e => { if(e.key===“Enter”){ if(adminPw===ADMIN_PW){setAdminOpen(true);setAdminPw(””);}else setAdminPwErr(true); }}} />
{adminPwErr && <div style={{fontSize:11,fontFamily:KR,color:R}}>비밀번호가 틀렸습니다</div>}
<button className=“btn-red” onClick={() => { if(adminPw===ADMIN_PW){setAdminOpen(true);setAdminPw(””);}else setAdminPwErr(true); }}>확인</button>
</div>
<button className=“btn-text” style={{marginTop:24}} onClick={() => setScreen(“landing”)}>← 돌아가기</button>
</div>
);

```
return (
  <div style={{background:"#0a0a0a",color:"#fff",minHeight:"100vh",fontFamily:"Cormorant Garamond,serif",padding:"40px 24px"}}>
    <style>{CSS}</style>
    <AdminPanel
      store={store} R={R} KR={KR} GS={GS}
      onExit={() => { setScreen("landing"); setAdminOpen(false); }}
    />
  </div>
);
```

}

return null;
}

// ── 관리자 패널 (별도 컴포넌트) ──
function AdminPanel({ store, R, KR, onExit }) {
const [members, setMembers] = useState([]);
const [confirmDelete, setConfirmDelete] = useState(null); // 삭제 확인할 email

const deleteMember = async (email) => {
// 멤버 목록에서 제거
const mbs = await store.get(“haw:members”, true) || [];
const updated = mbs.filter(m => m.email !== email);
await store.set(“haw:members”, updated, true);
// 해당 회원 기록도 삭제
await store.del(`haw:records:${email}`);
setMembers(prev => prev.filter(m => m.email !== email));
setConfirmDelete(null);
};

const loadMembers = async () => {
const mbs = await store.get(“haw:members”, true) || [];
console.log(“관리자 조회 회원수:”, mbs.length, mbs);
const enriched = await Promise.all(mbs.map(async m => {
const recs = await store.get(`haw:records:${m.email}`) || [];
const submitted = recs.filter(r => r.items?.length>0).map(r => r.date);
return {
…m,
lastSubmit: submitted.at(-1)||null,
submittedDays: submitted.length,
totalCount: recs.reduce((acc,r) => acc+(r.items?.length||0), 0),
};
}));
setMembers(enriched);
};

useEffect(() => { loadMembers(); }, []);

const needsContact = members.filter(m => !m.lastSubmit || daysSince(m.lastSubmit)>=7);

return (
<div style={{maxWidth:“min(480px,100%)”,margin:“0 auto”}}>
<div style={{display:“flex”,alignItems:“center”,justifyContent:“space-between”,marginBottom:28}}>
<div>
<div style={{fontSize:10,letterSpacing:”.35em”,color:R,fontFamily:KR,marginBottom:6}}>ADMIN</div>
<h2 style={{fontSize:26,fontWeight:300,fontStyle:“italic”}}>관리자 페이지</h2>
</div>
<div style={{display:“flex”,gap:8}}>
<button onClick={loadMembers}
style={{background:“transparent”,color:R,fontSize:11,fontFamily:KR,border:`1px solid rgba(255,59,48,.3)`,cursor:“pointer”,padding:“6px 12px”}}>
새로고침
</button>
<button style={{background:“transparent”,color:“rgba(255,255,255,.2)”,fontSize:11,fontFamily:KR,border:“none”,cursor:“pointer”,padding:“8px”}} onClick={onExit}>← 나가기</button>
</div>
</div>

```
  {needsContact.length>0 && (
    <div style={{background:"rgba(255,59,48,.08)",border:"1px solid rgba(255,59,48,.25)",padding:"14px 16px",marginBottom:20}}>
      <div style={{fontSize:10,color:R,fontFamily:KR,letterSpacing:".15em",marginBottom:8}}>🚨 연락 필요 ({needsContact.length}명)</div>
      {needsContact.map((m,i) => (
        <div key={i} style={{fontSize:12,fontFamily:KR,color:"rgba(255,255,255,.5)",lineHeight:2}}>
          {m.name} — {m.lastSubmit?`${daysSince(m.lastSubmit)}일째 미제출`:"제출 이력 없음"}
        </div>
      ))}
    </div>
  )}

  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,marginBottom:20}}>
    {[
      {label:"전체 회원", value:`${members.length}명`},
      {label:"오늘 제출", value:`${members.filter(m=>daysSince(m.lastSubmit)===0).length}명`},
      {label:"연락 필요", value:`${needsContact.length}명`, red:true},
    ].map((s,i) => (
      <div key={i} style={{background:"#111",padding:"16px 12px",textAlign:"center"}}>
        <div style={{fontSize:20,fontWeight:700,color:s.red?R:"#fff",marginBottom:4}}>{s.value}</div>
        <div style={{fontSize:9,fontFamily:KR,color:"rgba(255,255,255,.3)",letterSpacing:".1em"}}>{s.label}</div>
      </div>
    ))}
  </div>

  {members.length===0
    ? <div style={{background:"#111",padding:"40px",textAlign:"center"}}><div style={{fontSize:13,fontFamily:KR,color:"rgba(255,255,255,.25)",lineHeight:2}}>아직 가입한 회원이 없어요</div></div>
    : <>
        <div style={{fontSize:9,letterSpacing:".3em",color:"rgba(255,255,255,.3)",fontFamily:KR,marginBottom:8}}>MEMBER LIST</div>
        <div style={{display:"flex",flexDirection:"column",gap:1}}>
          {members.map((m,i) => {
            const st = getStatus(m.lastSubmit);
            return (
              <div key={i} style={{background:"#111",padding:"16px 18px"}}>
                {confirmDelete===m.email ? (
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{fontSize:12,fontFamily:KR,color:"rgba(255,255,255,.5)"}}>
                      <span style={{color:R,fontWeight:500}}>{m.name}</span> 회원을 삭제할까요?
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={() => deleteMember(m.email)}
                        style={{background:R,color:"#fff",border:"none",fontSize:11,fontFamily:KR,padding:"5px 12px",cursor:"pointer"}}>
                        삭제
                      </button>
                      <button onClick={() => setConfirmDelete(null)}
                        style={{background:"transparent",color:"rgba(255,255,255,.35)",border:"1px solid rgba(255,255,255,.15)",fontSize:11,fontFamily:KR,padding:"5px 12px",cursor:"pointer"}}>
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:500,marginBottom:2}}>{m.name}</div>
                      <div style={{fontSize:10,fontFamily:KR,color:"rgba(255,255,255,.25)"}}>{m.email}</div>
                      <div style={{fontSize:9,fontFamily:KR,color:"rgba(255,255,255,.15)",marginTop:2}}>가입 {m.joinedAt}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:11,fontFamily:KR,fontWeight:600,color:st.color}}>{st.label}</div>
                      <div style={{fontSize:9,fontFamily:KR,color:"rgba(255,255,255,.2)",marginTop:3}}>{m.submittedDays||0}일 · 총 {m.totalCount||0}회</div>
                      <button onClick={() => setConfirmDelete(m.email)}
                        style={{marginTop:8,background:"transparent",color:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.1)",fontSize:10,fontFamily:KR,padding:"3px 10px",cursor:"pointer"}}>
                        삭제
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>
  }
</div>
```

);
}
