import { useState, useEffect, useRef, useCallback } from "react";

// ===================== SETTINGS =====================
const DEFAULT_SETTINGS = {
  theme: "dark", language: "vi", sound: true, music: false,
  volume: 70, gameSpeed: "normal", notifications: true,
  fontSize: "medium", colorBlind: false, autoSave: true,
};

const T = {
  vi: {
    appName:"FactUp", menu:"Menu", simulation:"Mô phỏng", practice:"Luyện tập",
    missions:"Nhiệm vụ", tools:"Công cụ", profile:"Hồ sơ", settings:"Cài đặt",
    back:"← Quay lại", streak:"STREAK", gem:"GEM", ticket:"TICKET",
    gemShop:"Cửa hàng Gem", gemShopDesc:"Mua Khung avatar, Background hồ sơ, Danh hiệu, Style ghi chú, Huy hiệu",
    gacha:"Quay vật phẩm", gachaDesc:"Dùng Ticket để quay: Skin icon MXH, Theme bản đồ",
    settingsTitle:"Cài đặt", appearance:"Giao diện", themeLabel:"Chế độ màu",
    dark:"Tối", light:"Sáng", languageLabel:"Ngôn ngữ", fontSizeLabel:"Cỡ chữ",
    small:"Nhỏ", medium:"Vừa", large:"Lớn", colorBlindLabel:"Hỗ trợ màu mù",
    audio:"Âm thanh", soundLabel:"Hiệu ứng âm thanh", musicLabel:"Nhạc nền", volumeLabel:"Âm lượng",
    gameplay:"Gameplay", gameSpeedLabel:"Tốc độ game",
    slow:"Chậm", normal:"Thường", fast:"Nhanh",
    notificationsLabel:"Thông báo sự kiện", autoSaveLabel:"Tự động lưu tiến trình",
    account:"Tài khoản & Dữ liệu", resetProgress:"Đặt lại tiến trình",
    resetProgressDesc:"Xóa toàn bộ dữ liệu game, về trạng thái mới tinh",
    resetBtn:"Đặt lại ngay", resetConfirmTxt:"Bạn có chắc? Không thể hoàn tác!",
    resetDoneTxt:"✅ Đã đặt lại về mới tinh!", saveSettings:"Lưu cài đặt", saved:"✅ Đã lưu!",
    day:"Ngày", ap:"AP", spreadProgress:"Lan truyền", zoneStatus:"Tình trạng",
    spreadSpeed:"Tốc độ lan", influence:"Mức ảnh hưởng", control:"Độ kiểm soát", pressure:"Áp lực",
    skills:"Kỹ năng", investigate:"🔍 Điều tra nguồn", clarify:"📢 Đính chính", boost:"🛡 Tăng kiểm soát",
    globalStatus:"Toàn hệ thống", socialInfluence:"Ảnh hưởng xã hội", globalSpeed:"Tốc độ toàn cục",
    publicPressure:"Áp lực dư luận", systemStatus:"Hệ thống kiểm soát", zones:"Các khu vực",
    eventLog:"📋 Lịch sử sự kiện", newAlert:"⚠️ Tin mới", fake:"Tin giả", real:"Thật",
    win:"Chiến thắng!", lose:"Thất bại!", winMsg:"Bạn đã kiểm soát toàn bộ tin giả!",
    loseMsg:"Tin giả đã tràn ngập toàn hệ thống MXH!", playAgain:"Chơi lại",
    notEnoughAP:"Không đủ AP!", practiceTitle:"Luyện tập", confirm:"Xác nhận",
    next:"Tiếp theo ▶▶", finish:"Hoàn thành 🎉", correct:"✅ Chính xác!", wrong:"❌ Chưa đúng.",
    playerLabel:"Người chơi", uid:"UID", level:"Level", achievements:"Thành tựu",
    chain:"Chuỗi", medals:"Huy chương", preview:"XEM TRƯỚC",
    colorBlindDesc:"Thay màu xanh lá bằng xanh dương",
    gameSpeedDesc:"Ảnh hưởng tốc độ lan truyền tin giả",
    notifDesc:"Hiện popup khi có tin mới khẩn cấp",
    autoSaveDesc:"Tự động lưu tiến trình mỗi 60 giây",
  },
  en: {
    appName:"FactUp", menu:"Menu", simulation:"Simulation", practice:"Practice",
    missions:"Missions", tools:"Tools", profile:"Profile", settings:"Settings",
    back:"← Back", streak:"STREAK", gem:"GEM", ticket:"TICKET",
    gemShop:"Gem Shop", gemShopDesc:"Buy avatar frames, profile backgrounds, titles, note styles, badges",
    gacha:"Spin Items", gachaDesc:"Use Tickets to spin: Social media skins, Map themes",
    settingsTitle:"Settings", appearance:"Appearance", themeLabel:"Color Mode",
    dark:"Dark", light:"Light", languageLabel:"Language", fontSizeLabel:"Font Size",
    small:"Small", medium:"Medium", large:"Large", colorBlindLabel:"Color Blind Mode",
    audio:"Audio", soundLabel:"Sound Effects", musicLabel:"Background Music", volumeLabel:"Volume",
    gameplay:"Gameplay", gameSpeedLabel:"Game Speed",
    slow:"Slow", normal:"Normal", fast:"Fast",
    notificationsLabel:"Event Notifications", autoSaveLabel:"Auto-save Progress",
    account:"Account & Data", resetProgress:"Reset Progress",
    resetProgressDesc:"Clear all game data and start fresh",
    resetBtn:"Reset Now", resetConfirmTxt:"Are you sure? Cannot be undone!",
    resetDoneTxt:"✅ Progress has been reset!", saveSettings:"Save Settings", saved:"✅ Saved!",
    day:"Day", ap:"AP", spreadProgress:"Spread", zoneStatus:"Status",
    spreadSpeed:"Spread Speed", influence:"Influence", control:"Control", pressure:"Pressure",
    skills:"Skills", investigate:"🔍 Investigate", clarify:"📢 Clarify", boost:"🛡 Boost Control",
    globalStatus:"Global Status", socialInfluence:"Social Influence", globalSpeed:"Global Speed",
    publicPressure:"Public Pressure", systemStatus:"Control System", zones:"Zones",
    eventLog:"📋 Event Log", newAlert:"⚠️ New Alert", fake:"Fake", real:"Real",
    win:"Victory!", lose:"Defeat!", winMsg:"You controlled all fake news!",
    loseMsg:"Fake news has flooded all social media!", playAgain:"Play Again",
    notEnoughAP:"Not enough AP!", practiceTitle:"Practice", confirm:"Confirm",
    next:"Next ▶▶", finish:"Finish 🎉", correct:"✅ Correct!", wrong:"❌ Incorrect.",
    playerLabel:"Player", uid:"UID", level:"Level", achievements:"Achievements",
    chain:"Streak", medals:"Medals", preview:"PREVIEW",
    colorBlindDesc:"Replace green with blue for accessibility",
    gameSpeedDesc:"Affects how fast fake news spreads",
    notifDesc:"Show popup when urgent news appears",
    autoSaveDesc:"Auto-save progress every 60 seconds",
  }
};

function getTheme(mode) {
  if (mode === "light") return {
    bg:"#f0eff8", surface:"#ffffff", surface2:"#f5f3ff", border:"#e2dff5",
    border2:"#ccc8ee", text:"#1a1530", text2:"#4a4070", text3:"#8b84a8",
    accent:"#7c3aed", accent2:"#db2777", accentBg:"#7c3aed15",
    headerBg:"#ffffff", mapBg:"#ece8ff", mapDot:"#7c3aed12",
    toggleOff:"#d5d0ef", inputBg:"#f5f3ff",
  };
  return {
    bg:"#0f0e1a", surface:"#18172b", surface2:"#1e1d32", border:"#2d2d4e",
    border2:"#3d3d5e", text:"#e2e8f0", text2:"#c4b5fd", text3:"#6b7280",
    accent:"#a78bfa", accent2:"#f472b6", accentBg:"#a78bfa22",
    headerBg:"#18172b", mapBg:"#0a0918", mapDot:"#2d2d4e22",
    toggleOff:"#2d2d4e", inputBg:"#0f0e1a",
  };
}

// ===================== DATA =====================
const ZONES = {
  facebook:  {id:"facebook",  name:"Facebook",  icon:"📘", x:22, y:28},
  tiktok:    {id:"tiktok",    name:"TikTok",    icon:"🎵", x:65, y:18},
  instagram: {id:"instagram", name:"Instagram", icon:"📸", x:72, y:62},
  youtube:   {id:"youtube",   name:"YouTube",   icon:"▶️", x:28, y:68},
};

const FAKE_NEWS = [
  {id:1, title:"Uống nước chanh lúc 6h sáng chữa được ung thư!", platform:"facebook", verdict:"fake"},
  {id:2, title:"Tuần tới thành phố cho học sinh nghỉ học vì dịch bệnh.", platform:"tiktok", verdict:"fake"},
  {id:3, title:"NASA xác nhận: Trái Đất sẽ tối 3 ngày vào tháng 12!", platform:"instagram", verdict:"fake"},
  {id:4, title:"Bộ Y tế ra thông báo về lịch tiêm vaccine mới.", platform:"youtube", verdict:"real"},
  {id:5, title:"Chính phủ tăng lương tối thiểu 6% từ tháng 7.", platform:"facebook", verdict:"real"},
  {id:6, title:"5G gây ung thư — Hãy chia sẻ ngay cho người thân!!!", platform:"tiktok", verdict:"fake"},
  {id:7, title:"Ăn tỏi mỗi ngày ngăn ngừa COVID-19 hoàn toàn!", platform:"instagram", verdict:"fake"},
  {id:8, title:"Bộ Giáo dục công bố lịch thi tốt nghiệp THPT 2026.", platform:"youtube", verdict:"real"},
];

const PRACTICE_QS = [
  {
    type:"identify_flags",
    title:"Tìm dấu hiệu đáng ngờ trong đoạn tin",
    content:"🔥 CẢNH BÁO KHẨN!!!\nTheo một nguồn tin đáng tin cậy, uống nước X mỗi ngày sẽ giúp tăng IQ.\nNhiều người đã thử và thành công!\nHãy chia sẻ ngay cho người thân!!!",
    options:[
      {text:'"Theo một nguồn tin đáng tin cậy" → mơ hồ', correct:true},
      {text:'"Tăng IQ" → tuyên bố phi thực tế', correct:true},
      {text:'"Hãy chia sẻ ngay" → kêu gọi lan truyền', correct:true},
      {text:'Nội dung có logo chính thức', correct:false},
    ],
    explanation:"Tin giả thường dùng nguồn mơ hồ, tuyên bố phi thực tế và kêu gọi lan truyền gấp.",
  },
  {
    type:"choose_source",
    title:"Chọn nguồn tin uy tín",
    scenario:'Bạn nghe tin: "Tuần tới thành phố sẽ cho học sinh nghỉ học vì dịch bệnh."',
    sources:[
      {name:'Fanpage "Tin Nóng 24/7"', details:['Nhiều lượt share','Không ghi nguồn gốc'], correct:false},
      {name:'Website Sở Giáo dục thành phố', details:['Có thông báo chính thức','Cập nhật thời gian rõ ràng'], correct:true},
      {name:'Video TikTok của một người lạ', details:['Giọng khẳng định chắc chắn','Không dẫn chứng'], correct:false},
    ],
  },
  {
    type:"verify_methods",
    title:"Chọn cách kiểm chứng thông tin",
    scenario:'Bạn nghe tin: "Tuần tới thành phố sẽ cho học sinh nghỉ học vì dịch bệnh."',
    methods:[
      {text:'Tìm website cơ quan chính thức', correct:true},
      {text:'Kiểm tra báo chính thống', correct:true},
      {text:'Xem bình luận MXH', correct:false},
      {text:'Hỏi bạn bè trong nhóm chat', correct:false},
    ],
  },
  {
    type:"classify_post",
    title:"Phân loại bài đăng này",
    post:{image:"👩‍💻", caption:"Đây là sự thật bạn cần biết ngay!\nKhoa học vừa chứng minh: Ngủ ít hơn 5 tiếng mỗi ngày giúp não hoạt động tốt hơn!\nHãy thử và chia sẻ kết quả nhé! 💪🔥"},
    flags:["Giật tít/đánh vào cảm xúc","Không có nguồn gốc","Gây hiểu lầm"],
    verdict_options:["Tin giả","Thật","Không liên quan"],
    correct_verdict:"Tin giả",
    correct_flags:["Giật tít/đánh vào cảm xúc","Không có nguồn gốc","Gây hiểu lầm"],
  },
];

// ===================== HELPERS =====================
const toSpread = (v,l) => {
  const vi=["Rất chậm","Chậm","Trung bình","Nhanh","Bùng phát"];
  const en=["Very slow","Slow","Moderate","Fast","Outbreak"];
  const c=["#22c55e","#86efac","#facc15","#f97316","#ef4444"];
  const i=v<=20?0:v<=40?1:v<=60?2:v<=80?3:4;
  return {label:(l==="en"?en:vi)[i],color:c[i]};
};
const toInfluence = (v,l) => {
  const vi=["Nhỏ","Vừa","Rộng","Nghiêm trọng"]; const en=["Minor","Moderate","Wide","Critical"];
  const c=["#22c55e","#facc15","#f97316","#ef4444"]; const i=v<=25?0:v<=50?1:v<=75?2:3;
  return {label:(l==="en"?en:vi)[i],color:c[i]};
};
const toControl = (v,l) => {
  const vi=["Yếu","Không ổn định","Ổn định","Tốt","Kiểm soát tốt"]; const en=["Weak","Unstable","Stable","Good","Full Control"];
  const c=["#ef4444","#f97316","#facc15","#86efac","#22c55e"]; const i=v<=20?0:v<=40?1:v<=60?2:v<=80?3:4;
  return {label:(l==="en"?en:vi)[i],color:c[i]};
};
const toPressure = (v,l) => {
  const vi=["Thấp","Tăng dần","Cao","Rất cao"]; const en=["Low","Rising","High","Critical"];
  const c=["#22c55e","#facc15","#f97316","#ef4444"]; const i=v<=25?0:v<=50?1:v<=75?2:3;
  return {label:(l==="en"?en:vi)[i],color:c[i]};
};
const zoneColor = (s,cb) => {
  if (cb) return s<35?"#3b82f6":s<65?"#f59e0b":"#ef4444";
  return s<35?"#22c55e":s<65?"#eab308":"#ef4444";
};

const freshZones = () => ({
  facebook: {spread:0,control:100,influence:0,pressure:0,hasAlert:false},
  tiktok:   {spread:0,control:100,influence:0,pressure:0,hasAlert:false},
  instagram:{spread:0,control:100,influence:0,pressure:0,hasAlert:false},
  youtube:  {spread:0,control:100,influence:0,pressure:0,hasAlert:false},
});
const freshPlayer = () => ({streak:0,gems:0,tickets:0,level:1,xp:0,medals:[]});

// ===================== SMALL COMPONENTS =====================
function Toggle({value,onChange,th}) {
  return (
    <div onClick={()=>onChange(!value)} style={{width:44,height:24,borderRadius:99,cursor:"pointer",background:value?th.accent:th.toggleOff,position:"relative",transition:"background 0.3s",flexShrink:0}}>
      <div style={{position:"absolute",top:3,left:value?23:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.3s",boxShadow:"0 1px 4px #0005"}}/>
    </div>
  );
}
function SegBtn({active,label,onClick,th}) {
  return <button onClick={onClick} style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:active?th.accent:th.toggleOff,color:active?"#fff":th.text2,transition:"all 0.2s"}}>{label}</button>;
}
function SRow({label,desc,children,th}) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 0",borderBottom:`1px solid ${th.border}`}}>
      <div><div style={{color:th.text,fontSize:14,fontWeight:600}}>{label}</div>{desc&&<div style={{color:th.text3,fontSize:12,marginTop:2}}>{desc}</div>}</div>
      <div style={{flexShrink:0,marginLeft:16}}>{children}</div>
    </div>
  );
}
function Badge({label,color}) {
  return <span style={{background:color+"22",color,border:`1px solid ${color}55`,borderRadius:6,padding:"2px 10px",fontWeight:700,fontSize:13}}>{label}</span>;
}
function APBar({ap,maxAP,th}) {
  return <div style={{display:"flex",gap:4}}>{Array.from({length:maxAP}).map((_,i)=><div key={i} style={{width:12,height:12,borderRadius:3,background:i<ap?th.accent:th.border,border:`1px solid ${th.border2}`,transition:"background 0.3s"}}/>)}</div>;
}
function SectionHead({title,th}) {
  return <div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:th.accent,textTransform:"uppercase",marginBottom:10,marginTop:6}}>{title}</div>;
}
function Card({children,th,style={}}) {
  return <div style={{background:th.surface,borderRadius:16,border:`1px solid ${th.border}`,padding:"4px 20px",marginBottom:22,...style}}>{children}</div>;
}

// ===================== SETTINGS SCREEN =====================
function SettingsScreen({onBack,settings,onSave}) {
  const [local,setLocal]=useState({...settings});
  const [savedMsg,setSavedMsg]=useState(false);
  const [resetStep,setResetStep]=useState(0); // 0=idle,1=confirm,2=done
  const th=getTheme(local.theme);
  const t=T[local.language];
  const set=(k,v)=>setLocal(s=>({...s,[k]:v}));

  const handleSave=()=>{onSave(local);setSavedMsg(true);setTimeout(()=>setSavedMsg(false),2000);};
  const handleReset=()=>{
    if(resetStep===0){setResetStep(1);return;}
    onSave({...local,_reset:true});
    setResetStep(2);
    setTimeout(()=>setResetStep(0),3000);
  };

  return (
    <div style={{minHeight:"100vh",background:th.bg,fontFamily:"'Segoe UI',sans-serif",color:th.text}}>
      {/* Header */}
      <div style={{background:th.headerBg,borderBottom:`1px solid ${th.border}`,padding:"13px 24px",display:"flex",alignItems:"center",gap:14,position:"sticky",top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:th.surface2,border:`1px solid ${th.border}`,borderRadius:8,color:th.text2,padding:"7px 16px",cursor:"pointer",fontWeight:600,fontSize:13}}>{t.back}</button>
        <span style={{fontWeight:800,fontSize:18,color:th.text}}>{t.settingsTitle}</span>
        <div style={{flex:1}}/>
        {savedMsg&&<span style={{color:"#22c55e",fontWeight:700,fontSize:13}}>{t.saved}</span>}
        <button onClick={handleSave} style={{background:`linear-gradient(135deg,${th.accent},${th.accent2})`,border:"none",borderRadius:10,color:"#fff",padding:"9px 24px",fontWeight:700,fontSize:14,cursor:"pointer"}}>{t.saveSettings}</button>
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"30px 24px"}}>

        {/* APPEARANCE */}
        <SectionHead title={t.appearance} th={th}/>
        <Card th={th}>
          <SRow label={t.themeLabel} th={th}>
            <div style={{display:"flex",gap:6}}>
              <SegBtn active={local.theme==="dark"} label={"🌙 "+t.dark} onClick={()=>set("theme","dark")} th={th}/>
              <SegBtn active={local.theme==="light"} label={"☀️ "+t.light} onClick={()=>set("theme","light")} th={th}/>
            </div>
          </SRow>
          <SRow label={t.languageLabel} th={th}>
            <div style={{display:"flex",gap:6}}>
              <SegBtn active={local.language==="vi"} label="🇻🇳 Tiếng Việt" onClick={()=>set("language","vi")} th={th}/>
              <SegBtn active={local.language==="en"} label="🇬🇧 English" onClick={()=>set("language","en")} th={th}/>
            </div>
          </SRow>
          <SRow label={t.fontSizeLabel} th={th}>
            <div style={{display:"flex",gap:5}}>
              <SegBtn active={local.fontSize==="small"} label={t.small} onClick={()=>set("fontSize","small")} th={th}/>
              <SegBtn active={local.fontSize==="medium"} label={t.medium} onClick={()=>set("fontSize","medium")} th={th}/>
              <SegBtn active={local.fontSize==="large"} label={t.large} onClick={()=>set("fontSize","large")} th={th}/>
            </div>
          </SRow>
          <SRow label={t.colorBlindLabel} desc={t.colorBlindDesc} th={th}>
            <Toggle value={local.colorBlind} onChange={v=>set("colorBlind",v)} th={th}/>
          </SRow>
        </Card>

        {/* AUDIO */}
        <SectionHead title={t.audio} th={th}/>
        <Card th={th}>
          <SRow label={t.soundLabel} th={th}><Toggle value={local.sound} onChange={v=>set("sound",v)} th={th}/></SRow>
          <SRow label={t.musicLabel} th={th}><Toggle value={local.music} onChange={v=>set("music",v)} th={th}/></SRow>
          <SRow label={t.volumeLabel} th={th}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{color:th.text3,fontSize:12,minWidth:32,textAlign:"right"}}>{local.volume}%</span>
              <input type="range" min={0} max={100} value={local.volume} onChange={e=>set("volume",+e.target.value)}
                style={{width:120,accentColor:th.accent,cursor:"pointer"}}/>
            </div>
          </SRow>
        </Card>

        {/* GAMEPLAY */}
        <SectionHead title={t.gameplay} th={th}/>
        <Card th={th}>
          <SRow label={t.gameSpeedLabel} desc={t.gameSpeedDesc} th={th}>
            <div style={{display:"flex",gap:5}}>
              <SegBtn active={local.gameSpeed==="slow"} label={"🐢 "+t.slow} onClick={()=>set("gameSpeed","slow")} th={th}/>
              <SegBtn active={local.gameSpeed==="normal"} label={"▶ "+t.normal} onClick={()=>set("gameSpeed","normal")} th={th}/>
              <SegBtn active={local.gameSpeed==="fast"} label={"⚡ "+t.fast} onClick={()=>set("gameSpeed","fast")} th={th}/>
            </div>
          </SRow>
          <SRow label={t.notificationsLabel} desc={t.notifDesc} th={th}>
            <Toggle value={local.notifications} onChange={v=>set("notifications",v)} th={th}/>
          </SRow>
          <SRow label={t.autoSaveLabel} desc={t.autoSaveDesc} th={th}>
            <Toggle value={local.autoSave} onChange={v=>set("autoSave",v)} th={th}/>
          </SRow>
        </Card>

        {/* ACCOUNT */}
        <SectionHead title={t.account} th={th}/>
        <Card th={th}>
          <SRow label={t.resetProgress} desc={t.resetProgressDesc} th={th}>
            <button onClick={handleReset} style={{
              background:resetStep===1?"#ef444422":th.surface2,
              border:`1px solid ${resetStep===1?"#ef4444":th.border2}`,
              borderRadius:8,color:resetStep===1?"#ef4444":th.text2,
              padding:"7px 16px",cursor:"pointer",fontWeight:700,fontSize:13,transition:"all 0.2s",
            }}>{resetStep===1?t.resetConfirmTxt:t.resetBtn}</button>
          </SRow>
          {resetStep===2&&<div style={{padding:"10px 0",color:"#22c55e",fontWeight:700,fontSize:14}}>{t.resetDoneTxt}</div>}
        </Card>

        {/* PREVIEW */}
        <SectionHead title={t.preview} th={th}/>
        <div style={{background:th.surface,borderRadius:16,border:`1px solid ${th.border}`,padding:20,marginBottom:36}}>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            {(local.colorBlind?["#3b82f6","#f59e0b","#ef4444","#a78bfa","#f472b6"]:["#22c55e","#eab308","#ef4444","#a78bfa","#f472b6"]).map((c,i)=>(
              <div key={i} style={{width:34,height:34,borderRadius:8,background:c}}/>
            ))}
            <div style={{marginLeft:12,flex:1}}>
              <div style={{fontSize:local.fontSize==="small"?11:local.fontSize==="large"?18:14,color:th.text,fontWeight:600,marginBottom:4}}>Cỡ chữ hiện tại</div>
              <div style={{fontSize:11,color:th.text3}}>Chế độ: {local.theme==="dark"?"🌙 Tối":"☀️ Sáng"} · Tốc độ: {local.gameSpeed}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ===================== MENU SCREEN =====================
function MenuScreen({onNav,player,th,t}) {
  return (
    <div style={{minHeight:"100vh",background:th.bg,fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{display:"flex",justifyContent:"flex-end",padding:"13px 28px",gap:12,background:th.headerBg,borderBottom:`1px solid ${th.border}`}}>
        {[{icon:"🔥",k:"streak",c:"#fb923c"},{icon:"💎",k:"gems",c:"#38bdf8"},{icon:"🎫",k:"tickets",c:"#fbbf24"}].map(x=>(
          <div key={x.k} style={{display:"flex",alignItems:"center",gap:6,background:th.surface2,borderRadius:20,padding:"6px 16px",color:x.c,fontWeight:700,fontSize:13}}>
            {x.icon} {t[x.k==="streak"?"streak":x.k==="gems"?"gem":"ticket"]}: {player[x.k]}
          </div>
        ))}
      </div>
      <div style={{display:"flex"}}>
        {/* Sidebar */}
        <div style={{width:220,minHeight:"calc(100vh - 53px)",background:th.headerBg,borderRight:`1px solid ${th.border}`,padding:"30px 0",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{fontSize:32,fontWeight:900,color:th.accent,marginBottom:40,letterSpacing:-1}}>Fact<span style={{color:th.accent2}}>Up</span></div>
          {[
            {label:t.simulation,screen:"game",icon:"🗺️"},
            {label:t.practice,screen:"practice",icon:"🧠"},
            {label:t.missions,screen:"menu",icon:"📋"},
            {label:t.tools,screen:"menu",icon:"🔧"},
            {label:t.profile,screen:"profile",icon:"👤"},
            {label:t.settings,screen:"settings",icon:"⚙️"},
          ].map(item=>(
            <button key={item.label} onClick={()=>onNav(item.screen)} style={{
              width:"82%",marginBottom:10,padding:"12px 0",
              background:th.surface2,border:`1px solid ${th.border}`,borderRadius:10,
              color:th.text2,fontSize:14,fontWeight:600,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.background=th.accentBg;e.currentTarget.style.borderColor=th.accent;}}
              onMouseLeave={e=>{e.currentTarget.style.background=th.surface2;e.currentTarget.style.borderColor=th.border;}}
            >{item.icon} {item.label}</button>
          ))}
        </div>
        {/* Cards */}
        <div style={{flex:1,display:"flex",gap:24,padding:32,alignItems:"flex-start",justifyContent:"center",flexWrap:"wrap"}}>
          {[
            {icon:"💎",title:t.gemShop,desc:t.gemShopDesc,color:"#38bdf8",val:`${player.gems} Gem`},
            {icon:"🎫",title:t.gacha,desc:t.gachaDesc,color:"#f472b6",val:`${player.tickets} Ticket`},
          ].map(c=>(
            <div key={c.title} style={{flex:"1 1 280px",maxWidth:340,minHeight:380,background:th.surface,borderRadius:18,border:`1px solid ${th.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:14,padding:28,transition:"border-color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=c.color}
              onMouseLeave={e=>e.currentTarget.style.borderColor=th.border}
            >
              <div style={{fontSize:52}}>{c.icon}</div>
              <div style={{color:c.color,fontWeight:800,fontSize:18}}>{c.title}</div>
              <div style={{color:th.text3,textAlign:"center",fontSize:13,lineHeight:1.6}}>{c.desc}</div>
              <div style={{padding:"10px 24px",background:c.color+"18",border:`1px solid ${c.color}44`,borderRadius:10,color:c.color,fontWeight:700,fontSize:13}}>{c.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== PROFILE SCREEN =====================
function ProfileScreen({onBack,player,th,t}) {
  return (
    <div style={{minHeight:"100vh",background:th.bg,fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{padding:"13px 24px",background:th.headerBg,borderBottom:`1px solid ${th.border}`,display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onBack} style={{background:th.surface2,border:`1px solid ${th.border}`,borderRadius:8,color:th.text2,padding:"7px 16px",cursor:"pointer",fontWeight:600,fontSize:13}}>{t.back}</button>
        <span style={{fontWeight:800,fontSize:18,color:th.text}}>{t.profile}</span>
      </div>
      <div style={{padding:40,display:"flex",justifyContent:"center"}}>
        <div style={{background:th.surface,border:`1px solid ${th.border}`,borderRadius:20,padding:32,maxWidth:700,width:"100%"}}>
          <div style={{display:"flex",gap:20,alignItems:"center",marginBottom:22}}>
            <div style={{width:88,height:88,borderRadius:16,background:th.surface2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,border:`2px dashed ${th.accent}`,cursor:"pointer",flexShrink:0}}>👤</div>
            <div style={{flex:1}}>
              <div style={{color:th.text,fontWeight:800,fontSize:22}}>{t.playerLabel}</div>
              <div style={{color:th.text3,fontSize:13,marginTop:4}}>{t.uid}: FCT-00001</div>
              <div style={{color:th.accent,fontSize:13,marginTop:2}}>{t.level}: {player.level}</div>
            </div>
            <button style={{background:"#f59e0b22",border:"1px solid #f59e0b55",color:"#fbbf24",borderRadius:10,padding:"10px 18px",fontWeight:700,fontSize:13,cursor:"pointer"}}>🏆 {t.achievements}</button>
            <button style={{background:"#22c55e22",border:"1px solid #22c55e55",color:"#86efac",borderRadius:10,padding:"10px 18px",fontWeight:700,fontSize:13,cursor:"pointer"}}>🔥 {t.chain}: {player.streak}</button>
          </div>
          {/* XP */}
          <div style={{marginBottom:22}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:th.text3,fontSize:12}}>XP</span><span style={{color:th.text3,fontSize:12}}>{player.xp}/100</span>
            </div>
            <div style={{background:th.surface2,borderRadius:99,height:8}}>
              <div style={{height:"100%",width:`${player.xp}%`,background:`linear-gradient(90deg,${th.accent},${th.accent2})`,borderRadius:99,transition:"width 0.5s"}}/>
            </div>
          </div>
          {/* Medals */}
          <div style={{background:th.bg,borderRadius:16,padding:22}}>
            <div style={{color:th.text3,fontWeight:600,marginBottom:14,textAlign:"center",fontSize:13}}>{t.medals}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12}}>
              {["🥇","📜","✅","🏅","🌟","🎯"].map((icon,i)=>(
                <div key={i} style={{aspectRatio:"1/1",background:th.surface,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,border:`1px solid ${th.border}`,opacity:i<1?1:0.25}}>{icon}</div>
              ))}
            </div>
          </div>
          {/* Stats */}
          <div style={{display:"flex",gap:12,marginTop:18}}>
            {[{l:"GEM",v:player.gems,i:"💎",c:"#38bdf8"},{l:"TICKET",v:player.tickets,i:"🎫",c:"#fbbf24"},{l:"STREAK",v:player.streak,i:"🔥",c:"#fb923c"}].map(s=>(
              <div key={s.l} style={{flex:1,background:th.surface2,borderRadius:12,padding:14,textAlign:"center",border:`1px solid ${th.border}`}}>
                <div style={{fontSize:22,marginBottom:4}}>{s.i}</div>
                <div style={{color:s.c,fontWeight:800,fontSize:20}}>{s.v}</div>
                <div style={{color:th.text3,fontSize:11,marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== PRACTICE SCREEN =====================
function PracticeScreen({onBack,onXP,th,t}) {
  const [qi,setQi]=useState(0);
  const [sel,setSel]=useState([]);
  const [src,setSrc]=useState(null);
  const [verdict,setVerdict]=useState(null);
  const [flags,setFlags]=useState([]);
  const [methods,setMethods]=useState([]);
  const [checked,setChecked]=useState(false);
  const [fb,setFb]=useState(null);
  const q=PRACTICE_QS[qi];
  const total=PRACTICE_QS.length;

  const reset=()=>{setSel([]);setSrc(null);setVerdict(null);setFlags([]);setMethods([]);setChecked(false);setFb(null);};
  const next=()=>{if(qi<total-1){setQi(qi+1);reset();}else onBack();};
  const check=()=>{
    setChecked(true);
    let ok=false;
    if(q.type==="identify_flags") ok=sel.length===q.options.filter(o=>o.correct).length&&sel.every(i=>q.options[i].correct);
    if(q.type==="choose_source") ok=src!==null&&q.sources[src]?.correct;
    if(q.type==="verify_methods") ok=methods.length===q.methods.filter(m=>m.correct).length&&methods.every(i=>q.methods[i]?.correct);
    if(q.type==="classify_post") ok=verdict===q.correct_verdict;
    setFb(ok?"ok":"fail");
    if(ok) onXP(20);
  };

  const os=(isSel,isCorrect,show)=>{
    const bg=show?(isCorrect?"#22c55e22":isSel?"#ef444422":th.surface2):(isSel?th.accentBg:th.surface2);
    const bd=show?(isCorrect?"#22c55e":isSel?"#ef4444":th.border):(isSel?th.accent:th.border);
    return {background:bg,border:`1px solid ${bd}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",transition:"all 0.2s",marginBottom:8,display:"flex",alignItems:"flex-start",gap:10};
  };

  return (
    <div style={{minHeight:"100vh",background:th.bg,fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{background:th.headerBg,borderBottom:`1px solid ${th.border}`,padding:"12px 24px",display:"flex",alignItems:"center",gap:16,position:"sticky",top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:th.surface2,border:`1px solid ${th.border}`,borderRadius:8,color:th.text2,padding:"7px 16px",cursor:"pointer",fontWeight:600,fontSize:13}}>{t.back}</button>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:th.text3,marginBottom:4}}>{t.practiceTitle} — {qi+1}/{total}</div>
          <div style={{background:th.surface2,borderRadius:99,height:8,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(qi/total)*100}%`,background:`linear-gradient(90deg,${th.accent},${th.accent2})`,borderRadius:99,transition:"width 0.5s"}}/>
          </div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:32,minHeight:"calc(100vh - 80px)"}}>
        <div style={{background:th.surface,borderRadius:20,border:`1px solid ${th.border}`,padding:36,maxWidth:780,width:"100%"}}>
          <h2 style={{color:th.text,fontWeight:800,fontSize:21,marginBottom:24}}>{q.title}</h2>

          {q.type==="identify_flags"&&(
            <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
              <div style={{flex:"1 1 260px",background:th.bg,borderRadius:14,padding:20}}>
                <div style={{color:th.text2,fontSize:14,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{q.content}</div>
              </div>
              <div style={{flex:"1 1 260px"}}>
                <div style={{color:th.text3,fontSize:13,marginBottom:8}}>Tick các dấu hiệu đáng ngờ:</div>
                {q.options.map((opt,i)=>(
                  <label key={i} style={os(sel.includes(i),opt.correct,checked)}>
                    <input type="checkbox" checked={sel.includes(i)} onChange={()=>!checked&&setSel(s=>s.includes(i)?s.filter(x=>x!==i):[...s,i])} style={{accentColor:th.accent,marginTop:2,flexShrink:0}}/>
                    <span style={{color:th.text2,fontSize:14}}>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {q.type==="choose_source"&&(
            <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
              <div style={{flex:"1 1 200px",background:th.bg,borderRadius:14,padding:20}}>
                <div style={{color:th.text3,fontSize:13,marginBottom:8}}>Tình huống:</div>
                <div style={{color:th.text2,fontSize:14,lineHeight:1.7}}>{q.scenario}</div>
              </div>
              <div style={{flex:"2 1 340px"}}>
                {q.sources.map((s,i)=>(
                  <label key={i} style={{...os(src===i,s.correct,checked),flexDirection:"column",alignItems:"flex-start"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                      <input type="radio" name="src" checked={src===i} onChange={()=>!checked&&setSrc(i)} style={{accentColor:th.accent}}/>
                      <span style={{color:th.text,fontWeight:700,fontSize:14}}>{s.name}</span>
                      {checked&&s.correct&&<span style={{color:"#22c55e",fontSize:12}}>✓</span>}
                    </div>
                    <div style={{paddingLeft:22}}>{s.details.map((d,j)=><div key={j} style={{color:th.text3,fontSize:12}}>• {d}</div>)}</div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {q.type==="verify_methods"&&(
            <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
              <div style={{flex:"1 1 200px",background:th.bg,borderRadius:14,padding:20}}>
                <div style={{color:th.text3,fontSize:13,marginBottom:8}}>Tình huống:</div>
                <div style={{color:th.text2,fontSize:14,lineHeight:1.7}}>{q.scenario}</div>
              </div>
              <div style={{flex:"2 1 340px"}}>
                {q.methods.map((m,i)=>(
                  <label key={i} style={os(methods.includes(i),m.correct,checked)}>
                    <input type="checkbox" checked={methods.includes(i)} onChange={()=>!checked&&setMethods(s=>s.includes(i)?s.filter(x=>x!==i):[...s,i])} style={{accentColor:th.accent,flexShrink:0}}/>
                    <span style={{color:th.text2,fontSize:14}}>{m.text}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {q.type==="classify_post"&&(
            <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
              <div style={{flex:"1 1 240px",background:th.bg,borderRadius:14,padding:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:th.surface2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>👩</div>
                  <div style={{color:th.text3,fontSize:12}}>Người dùng · MXH</div><div style={{marginLeft:"auto",color:th.text3}}>•••</div>
                </div>
                <div style={{background:th.surface,borderRadius:10,padding:12,fontSize:32,textAlign:"center",marginBottom:10}}>{q.post.image}</div>
                <div style={{color:th.text2,fontSize:13,lineHeight:1.7}}>{q.post.caption}</div>
                <div style={{display:"flex",gap:10,marginTop:10,color:th.text3}}>❤️ 💬 ↗️ 🔖</div>
              </div>
              <div style={{flex:"1 1 260px",display:"flex",flexDirection:"column",gap:14}}>
                <div>
                  <div style={{color:th.text3,fontSize:13,marginBottom:8}}>Tick dấu hiệu đáng ngờ:</div>
                  {q.flags.map((flag,i)=>(
                    <label key={i} style={os(flags.includes(flag),q.correct_flags.includes(flag),checked)}>
                      <input type="checkbox" checked={flags.includes(flag)} onChange={()=>!checked&&setFlags(f=>f.includes(flag)?f.filter(x=>x!==flag):[...f,flag])} style={{accentColor:th.accent,flexShrink:0}}/>
                      <span style={{color:th.text2,fontSize:14}}>{flag}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <div style={{color:th.text3,fontSize:13,marginBottom:8}}>Kết luận:</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {q.verdict_options.map(v=>(
                      <button key={v} onClick={()=>!checked&&setVerdict(v)} style={{...os(verdict===v,v===q.correct_verdict,checked),marginBottom:0,padding:"8px 16px"}}>
                        <span style={{color:th.text2,fontSize:13,fontWeight:600}}>{v}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {fb&&(
            <div style={{marginTop:20,padding:16,borderRadius:12,background:fb==="ok"?"#22c55e22":"#ef444422",border:`1px solid ${fb==="ok"?"#22c55e":"#ef4444"}`,color:fb==="ok"?"#86efac":"#fca5a5",fontSize:14}}>
              {fb==="ok"?t.correct:t.wrong}{q.explanation?` ${q.explanation}`:""}
            </div>
          )}

          <div style={{display:"flex",justifyContent:"flex-end",marginTop:24,gap:12}}>
            {!checked&&<button onClick={check} style={{background:th.accent,border:"none",borderRadius:10,color:"#fff",padding:"11px 28px",fontWeight:700,fontSize:14,cursor:"pointer"}}>{t.confirm}</button>}
            {checked&&<button onClick={next} style={{background:`linear-gradient(90deg,${th.accent},${th.accent2})`,border:"none",borderRadius:10,color:"#fff",padding:"11px 28px",fontWeight:700,fontSize:14,cursor:"pointer"}}>{qi<total-1?t.next:t.finish}</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== GAME SCREEN =====================
function GameScreen({onBack,settings,onXP,th,t}) {
  const spd = settings.gameSpeed==="slow"?0.35:settings.gameSpeed==="fast"?2.5:1;
  const lang = settings.language;
  const cb = settings.colorBlind;

  const [date,setDate]=useState({d:1,m:1,y:2026});
  const [ap,setAP]=useState(10);
  const [zones,setZones]=useState(freshZones());
  const [selZ,setSelZ]=useState("facebook");
  const [log,setLog]=useState([]);
  const [news,setNews]=useState([]);
  const [over,setOver]=useState(false);
  const [won,setWon]=useState(false);
  const tick=useRef(0);
  const apT=useRef(0);
  const doneRef=useRef(false);

  const addLog=useCallback((msg)=>{
    setDate(d=>{setLog(l=>[...l.slice(-20),{date:`${d.d}/${d.m}`,msg}]);return d;});
  },[]);

  useEffect(()=>{
    if(over) return;
    const iv=setInterval(()=>{
      if(doneRef.current) return;
      tick.current++; apT.current++;
      if(apT.current>=30){apT.current=0;setAP(a=>Math.min(a+1,10));}
      if(tick.current%10===0) setDate(d=>{let{d:day,m:mo,y:yr}=d;day++;if(day>28){day=1;mo++;}if(mo>12){mo=1;yr++;}return{d:day,m:mo,y:yr};});
      setZones(prev=>{
        const nx={...prev};
        for(const id in nx){
          const z={...nx[id]};
          z.spread=Math.min(100,z.spread+(Math.random()*0.7*spd));
          z.influence=Math.min(100,z.influence+(Math.random()*0.45*spd));
          z.pressure=Math.min(100,z.pressure+(Math.random()*0.35*spd));
          z.control=Math.max(0,z.control-(Math.random()*0.18*spd));
          if(!z.hasAlert&&z.spread>55&&Math.random()<0.008) z.hasAlert=true;
          nx[id]=z;
        }
        if(!doneRef.current){
          if(Object.values(nx).every(z=>z.spread>=90)){doneRef.current=true;setOver(true);setWon(false);}
          if(Object.values(nx).every(z=>z.spread<=8)){doneRef.current=true;setOver(true);setWon(true);}
        }
        return nx;
      });
      if(tick.current%20===0&&Math.random()<0.55){
        const n=FAKE_NEWS[Math.floor(Math.random()*FAKE_NEWS.length)];
        setNews(a=>[...a.slice(-3),{...n,uid:Date.now()+Math.random()}]);
        addLog(`Tin mới xuất hiện tại ${n.platform}`);
      }
    },1000);
    return ()=>clearInterval(iv);
  },[over,spd,addLog]);

  const useSkill=(sk)=>{
    const costs={investigate:2,clarify:3,boost:4};
    const c=costs[sk];
    if(ap<c){addLog(t.notEnoughAP);return;}
    setAP(a=>a-c);
    setZones(prev=>{
      const nx={...prev};const z={...nx[selZ]};
      if(sk==="investigate") z.spread=Math.max(0,z.spread-10);
      if(sk==="clarify"){z.spread=Math.max(0,z.spread-16);z.influence=Math.max(0,z.influence-12);}
      if(sk==="boost"){z.control=Math.min(100,z.control+18);z.pressure=Math.max(0,z.pressure-12);}
      z.hasAlert=false;nx[selZ]=z;return nx;
    });
    addLog(`Dùng kỹ năng tại ${selZ}`);
    onXP(5);
  };

  const actNews=(n,v)=>{
    if(ap<2){addLog(t.notEnoughAP);return;}
    setAP(a=>a-2);
    const ok=v===n.verdict;
    setZones(prev=>{
      const nx={...prev};const z={...nx[n.platform]};
      if(ok){z.spread=Math.max(0,z.spread-18);z.influence=Math.max(0,z.influence-10);}
      else z.spread=Math.min(100,z.spread+12);
      nx[n.platform]=z;return nx;
    });
    if(ok){addLog(`✅ Xử lý đúng tin tại ${n.platform}`);onXP(15);}
    else addLog(`❌ Xử lý sai → ${n.platform} tăng lan`);
    setNews(a=>a.filter(x=>x.uid!==n.uid));
  };

  const restart=()=>{
    setZones(freshZones());setAP(10);setNews([]);setLog([]);
    setDate({d:1,m:1,y:2026});setOver(false);setWon(false);
    doneRef.current=false;tick.current=0;apT.current=0;
  };

  const sz=zones[selZ];
  const spreadL=toSpread(sz.spread,lang);
  const influL=toInfluence(sz.influence,lang);
  const ctrlL=toControl(sz.control,lang);
  const presL=toPressure(sz.pressure,lang);

  const gi=()=>{const avg=Object.values(zones).reduce((s,z)=>s+z.spread,0)/4;const vi=avg<=25?"Ổn định":avg<=50?"Lo ngại":avg<=75?"Bất an":"Khủng hoảng";const en=avg<=25?"Stable":avg<=50?"Concerning":avg<=75?"Anxious":"Crisis";return lang==="en"?en:vi;};
  const gs=()=>{const avg=Object.values(zones).reduce((s,z)=>s+z.spread,0)/4;const vi=avg<=30?"Kiểm soát được":avg<=55?"Đang tăng":avg<=75?"Lan rộng":"Mất kiểm soát";const en=avg<=30?"Contained":avg<=55?"Increasing":avg<=75?"Spreading":"Out of control";return lang==="en"?en:vi;};
  const gp=()=>{const r=Object.values(zones).filter(z=>z.spread>=65).length;const vi=r===0?"Bình thường":r===1?"Căng thẳng":"Rất căng thẳng";const en=r===0?"Normal":r===1?"Tense":"Very tense";return lang==="en"?en:vi;};
  const gss=()=>{const avg=Object.values(zones).reduce((s,z)=>s+z.control,0)/4;const vi=avg<=25?"Yếu":avg<=50?"Đang củng cố":avg<=75?"Ổn định":"Hiệu quả cao";const en=avg<=25?"Weak":avg<=50?"Consolidating":avg<=75?"Stable":"Highly effective";return lang==="en"?en:vi;};

  return (
    <div style={{height:"100vh",background:th.bg,fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {/* HEADER */}
      <div style={{background:th.headerBg,borderBottom:`1px solid ${th.border}`,padding:"9px 16px",display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
        <button onClick={onBack} style={{background:th.surface2,border:`1px solid ${th.border}`,borderRadius:8,color:th.text2,padding:"5px 12px",cursor:"pointer",fontWeight:600,fontSize:12}}>{t.back}</button>
        <div style={{color:th.accent,fontWeight:700,fontSize:13}}>📅 {t.day} {String(date.d).padStart(2,"0")}/{String(date.m).padStart(2,"0")}/{date.y}</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:th.accent2,fontWeight:700,fontSize:13}}>⚡ {t.ap}: {ap}/10</span>
          <APBar ap={ap} maxAP={10} th={th}/>
        </div>
        <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:th.text3,fontSize:11,whiteSpace:"nowrap"}}>{t.spreadProgress} {ZONES[selZ].name}:</span>
          <div style={{flex:1,background:th.surface2,borderRadius:99,height:9,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${sz.spread}%`,background:`linear-gradient(90deg,#22c55e,${spreadL.color})`,borderRadius:99,transition:"width 0.5s"}}/>
          </div>
          <span style={{color:spreadL.color,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{Math.round(sz.spread)}%</span>
        </div>
        <span style={{fontSize:11,fontWeight:700,color:settings.gameSpeed==="fast"?"#ef4444":settings.gameSpeed==="slow"?"#22c55e":th.accent,whiteSpace:"nowrap"}}>
          {settings.gameSpeed==="fast"?"⚡":settings.gameSpeed==="slow"?"🐢":"▶"} {settings.gameSpeed}
        </span>
      </div>

      {/* BODY */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* LEFT */}
        <div style={{width:190,background:th.surface,borderRight:`1px solid ${th.border}`,padding:14,display:"flex",flexDirection:"column",gap:10,overflowY:"auto"}}>
          <div style={{color:th.accent,fontWeight:700,fontSize:13,borderBottom:`1px solid ${th.border}`,paddingBottom:8}}>{ZONES[selZ].icon} {ZONES[selZ].name}</div>
          {[{l:t.spreadSpeed,v:spreadL},{l:t.influence,v:influL},{l:t.control,v:ctrlL},{l:t.pressure,v:presL}].map(item=>(
            <div key={item.l}><div style={{color:th.text3,fontSize:11,marginBottom:4}}>{item.l}</div><Badge label={item.v.label} color={item.v.color}/></div>
          ))}
          <div style={{borderTop:`1px solid ${th.border}`,paddingTop:11}}>
            <div style={{color:th.text3,fontSize:11,marginBottom:8}}>{t.skills}</div>
            {[{id:"investigate",l:t.investigate,c:2},{id:"clarify",l:t.clarify,c:3},{id:"boost",l:t.boost,c:4}].map(sk=>(
              <button key={sk.id} onClick={()=>useSkill(sk.id)} style={{
                width:"100%",marginBottom:7,padding:"8px 10px",
                background:ap>=sk.c?th.surface2:th.bg,border:`1px solid ${ap>=sk.c?th.border2:th.border}`,
                borderRadius:8,color:ap>=sk.c?th.text2:th.text3,fontSize:11,
                cursor:ap>=sk.c?"pointer":"not-allowed",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.2s",
              }}
                onMouseEnter={e=>ap>=sk.c&&(e.currentTarget.style.borderColor=th.accent)}
                onMouseLeave={e=>e.currentTarget.style.borderColor=ap>=sk.c?th.border2:th.border}
              ><span>{sk.l}</span><span style={{color:th.accent2,fontSize:10,fontWeight:700}}>{sk.c} AP</span></button>
            ))}
          </div>
        </div>

        {/* MAP */}
        <div style={{flex:1,position:"relative",overflow:"hidden",background:th.mapBg}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle,${th.mapDot} 1px,transparent 1px)`,backgroundSize:"44px 44px"}}/>
          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
            {[["facebook","tiktok"],["facebook","youtube"],["tiktok","instagram"],["youtube","instagram"]].map(([a,b])=>(
              <line key={a+b} x1={`${ZONES[a].x}%`} y1={`${ZONES[a].y}%`} x2={`${ZONES[b].x}%`} y2={`${ZONES[b].y}%`} stroke={th.border2} strokeWidth={1} strokeDasharray="6,6" opacity={0.4}/>
            ))}
          </svg>
          {Object.values(ZONES).map(zone=>{
            const z=zones[zone.id];
            const c=zoneColor(z.spread,cb);
            const isSel=selZ===zone.id;
            return (
              <div key={zone.id} onClick={()=>setSelZ(zone.id)} style={{
                position:"absolute",left:`${zone.x}%`,top:`${zone.y}%`,transform:"translate(-50%,-50%)",
                width:108,height:108,borderRadius:"50%",background:c+"2a",
                border:`3px solid ${isSel?th.text:c}`,
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",
                boxShadow:`0 0 ${Math.max(8,z.spread/2.5)}px ${c}66${isSel?`,0 0 0 5px ${c}30`:""}`,
                transition:"all 0.4s",zIndex:isSel?10:1,
              }}>
                <div style={{fontSize:26,marginBottom:2}}>{zone.icon}</div>
                <div style={{color:th.text,fontWeight:700,fontSize:12}}>{zone.name}</div>
                <div style={{color:c,fontSize:11,fontWeight:800}}>{Math.round(z.spread)}%</div>
                <div style={{width:"58%",height:4,borderRadius:99,background:th.surface2,marginTop:4}}>
                  <div style={{height:"100%",width:`${z.spread}%`,background:c,borderRadius:99,transition:"width 0.5s"}}/>
                </div>
                {z.hasAlert&&<div style={{position:"absolute",top:-6,right:-6,background:"#ef4444",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#fff",animation:"fu-pulse 1s infinite",boxShadow:"0 0 8px #ef4444"}}>!</div>}
              </div>
            );
          })}
          {/* News */}
          <div style={{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",display:"flex",gap:10,zIndex:20,flexWrap:"nowrap",maxWidth:"92%"}}>
            {news.map(n=>(
              <div key={n.uid} style={{background:th.surface,border:"1px solid #ef4444",borderRadius:14,padding:"12px 14px",maxWidth:226,boxShadow:"0 4px 24px #ef444433",animation:"fu-slide 0.3s ease",flexShrink:0}}>
                <div style={{color:"#fca5a5",fontSize:11,marginBottom:4}}>{t.newAlert} — {n.platform}</div>
                <div style={{color:th.text,fontSize:12,marginBottom:10,lineHeight:1.5}}>{n.title}</div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>actNews(n,"fake")} style={{flex:1,background:"#ef444422",border:"1px solid #ef4444",borderRadius:7,color:"#fca5a5",padding:"5px 0",cursor:"pointer",fontSize:12,fontWeight:700}}>{t.fake}</button>
                  <button onClick={()=>actNews(n,"real")} style={{flex:1,background:"#22c55e22",border:"1px solid #22c55e",borderRadius:7,color:"#86efac",padding:"5px 0",cursor:"pointer",fontSize:12,fontWeight:700}}>{t.real}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{width:180,background:th.surface,borderLeft:`1px solid ${th.border}`,padding:14,display:"flex",flexDirection:"column",gap:10,overflowY:"auto"}}>
          <div style={{color:th.accent2,fontWeight:700,fontSize:13,borderBottom:`1px solid ${th.border}`,paddingBottom:8}}>🌐 {t.globalStatus}</div>
          {[{l:t.socialInfluence,v:gi()},{l:t.globalSpeed,v:gs()},{l:t.publicPressure,v:gp()},{l:t.systemStatus,v:gss()}].map(item=>(
            <div key={item.l}><div style={{color:th.text3,fontSize:11,marginBottom:3}}>{item.l}</div><div style={{color:th.text2,fontWeight:700,fontSize:13}}>{item.v}</div></div>
          ))}
          <div style={{borderTop:`1px solid ${th.border}`,paddingTop:10}}>
            <div style={{color:th.text3,fontSize:11,marginBottom:8}}>{t.zones}</div>
            {Object.values(ZONES).map(zone=>{
              const z=zones[zone.id];const c=zoneColor(z.spread,cb);
              return (
                <div key={zone.id} onClick={()=>setSelZ(zone.id)} style={{display:"flex",alignItems:"center",gap:7,marginBottom:9,cursor:"pointer"}}>
                  <div style={{width:9,height:9,borderRadius:"50%",background:c,flexShrink:0,boxShadow:`0 0 4px ${c}88`}}/>
                  <span style={{color:th.text3,fontSize:12,flex:1}}>{zone.name}</span>
                  <span style={{color:c,fontSize:11,fontWeight:700}}>{Math.round(z.spread)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{height:80,background:th.surface,borderTop:`1px solid ${th.border}`,padding:"7px 16px",overflowY:"auto",flexShrink:0}}>
        <div style={{color:th.text3,fontSize:11,marginBottom:4}}>{t.eventLog}</div>
        {[...log].reverse().map((e,i)=>(
          <div key={i} style={{color:th.text3,fontSize:11,marginBottom:1}}>
            <span style={{color:th.accent,marginRight:7}}>[{e.date}]</span>{e.msg}
          </div>
        ))}
      </div>

      {over&&(
        <div style={{position:"fixed",inset:0,background:"#000a",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
          <div style={{background:th.surface,border:`2px solid ${won?"#22c55e":"#ef4444"}`,borderRadius:24,padding:48,textAlign:"center",maxWidth:380}}>
            <div style={{fontSize:64,marginBottom:16}}>{won?"🏆":"💀"}</div>
            <div style={{color:won?"#86efac":"#fca5a5",fontSize:28,fontWeight:900,marginBottom:10}}>{won?t.win:t.lose}</div>
            <div style={{color:th.text3,marginBottom:28,fontSize:14}}>{won?t.winMsg:t.loseMsg}</div>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button onClick={restart} style={{background:th.accent,border:"none",borderRadius:12,color:"#fff",padding:"12px 28px",fontWeight:700,fontSize:15,cursor:"pointer"}}>{t.playAgain}</button>
              <button onClick={onBack} style={{background:th.surface2,border:`1px solid ${th.border}`,borderRadius:12,color:th.text2,padding:"12px 28px",fontWeight:700,fontSize:15,cursor:"pointer"}}>{t.menu}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fu-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.25)}}
        @keyframes fu-slide{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
      `}</style>
    </div>
  );
}

// ===================== ROOT APP =====================
export default function App() {
  const [settings,setSettings]=useState({...DEFAULT_SETTINGS});
  const [player,setPlayer]=useState(freshPlayer());
  const [screen,setScreen]=useState("menu");
  const th=getTheme(settings.theme);
  const t=T[settings.language];

  const saveSettings=(s)=>{
    if(s._reset){
      setPlayer(freshPlayer());
      const clean={...s};delete clean._reset;
      setSettings(clean);
    } else setSettings(s);
  };

  const earnXP=(amt)=>{
    setPlayer(p=>{
      let xp=p.xp+amt,level=p.level,gems=p.gems;
      if(xp>=100){xp-=100;level++;gems+=50;}
      return {...p,xp,level,gems};
    });
  };

  const nav=s=>setScreen(s);

  if(screen==="settings") return <SettingsScreen onBack={()=>nav("menu")} settings={settings} onSave={saveSettings}/>;
  if(screen==="game") return <GameScreen onBack={()=>nav("menu")} settings={settings} onXP={earnXP} th={th} t={t}/>;
  if(screen==="practice") return <PracticeScreen onBack={()=>nav("menu")} onXP={earnXP} th={th} t={t}/>;
  if(screen==="profile") return <ProfileScreen onBack={()=>nav("menu")} player={player} th={th} t={t}/>;
  return <MenuScreen onNav={nav} player={player} th={th} t={t}/>;
}
