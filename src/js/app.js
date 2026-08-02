import './bootstrap.js';

// placeholder entry module that boots the app via bootstrap.js

'use strict';
if (window.__voyagePlannerInit) {
  console.warn('voyagePlanner already initialized');
}
window.__voyagePlannerInit = true;

/* ═══════════════════════════════════════════
   §1 — I18N DICTIONARY
   ═══════════════════════════════════════════ */
const I18N={vi:{shelf_heading:"Hành trình khám phá của chúng ta ✈️",create_btn_text:"Thêm chuyến đi",empty_text:"Chưa có hành trình nào — Tạo chuyến đi đầu tiên thô[...]}

/* ═══════════════════════════════════════════
   §2 — APP STATE (single source of truth)
   ═══════════════════════════════════════════ */
const state={
  lang:localStorage.getItem('voyage_planner_lang')||'en',
  trips:[],
  recordCount:0,
  currentTrip:null,
  editingTripId:null,
  contextTripId:null,
  duplicateSourceTrip:null,
  packingMember:null,
  packingStage:'outbound',
  itemModal:{tabType:null,idx:null,group:null},
  isSaving:false,
  lastUpdate:{id:null,ts:0,data:null}
};

/* ═══════════════════════════════════════════
   §3 — DOM CACHE
   ═══════════════════════════════════════════ */
const dom={};
function $(id){if(!dom[id])dom[id]=document.getElementById(id);return dom[id];}

/* ═══════════════════════════════════════════
   §4 — UTILITIES
   ═══════════════════════════════════════════ */
function t(k){return I18N[state.lang][k]||k;}
function safeParse(s,fb){try{return JSON.parse(s||JSON.stringify(fb));}catch(e){return fb;}}
function genId(){return'item_'+Date.now()+'_'+Math.floor(Math.random()*1e6);}
function esc(s){return String(s).replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

const GRADIENTS=['linear-gradient(135deg,#fbcfe8 0%,#ccfbf1 100%)','linear-gradient(135deg,#fef3c7 0%,#fbcfe8 100%)','linear-gradient(135deg,#ccfbf1 0%,#fdba74 100%)','linear-gradient(135deg,#e0f2...)'];

function fmtCurrency(v,cur){const n=parseFloat(String(v).replace(/[^
\d.-]/g,''));if(isNaN(n))return'—';try{return new Intl.NumberFormat(state.lang==='vi'?'vi-VN':'en-US',{style:'currency',currency:cur}).format(n);}catch(e){return n.toLocaleString()+' '+cur;}}
function fmtDate(s){if(!s)return'';try{const d=new Date(s);if(isNaN(d))return s;return d.toLocaleDateString(state.lang==='vi'?'vi-VN':'en-US',{day:'numeric',month:'numeric',year:'numeric'});}catch(e){return s;}}
function fmtTripDates(s){if(!s)return t('no_dates');const p=s.split(' – ');return p.length===2?fmtDate(p[0])+' – '+fmtDate(p[1]):fmtDate(s);}
function fmtTime24(ts){if(!ts)return'';ts=ts.trim().toUpperCase();const pm=ts.includes('PM')||ts.includes('CH');const am=ts.includes('AM')||ts.includes('SA');let c=ts.replace(/[^\d:]/g,'');const p=c.split(':'); if(!p[0]) return ts; let h=parseInt(p[0],10), m=parseInt(p[1]||'0',10); if(isNaN(h)) return ts; if(isNaN(m)) m=0; if(pm&&h<12) h+=12; if(am&&h===12) h=0; return String(h%24).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}

function getTripStatus(trip){if(trip.status==='archived')return'archived';const itin=safeParse(trip.itinerary,[]);if(itin.length){const c=itin.filter(i=>i.status==='completed'||i.checked).length; if(c===itin.length) return 'completed'; if(c>0) return 'active';} return trip.status||'planning';}

/* ═══════════════════════════════════════════
   §5 — DATA ACCESSORS (dedup on read, no truncation)
   ═══════════════════════════════════════════ */
function dedup(arr,keyFn){const seen=new Set();return arr.filter(x=>{if(!x.id)x.id=genId();const k=keyFn(x);if(seen.has(x.id)||seen.has(k))return false;seen.add(x.id);seen.add(k);return true;});}
function getDocs(trip){if(!trip)return[];const d=dedup(safeParse(trip.documents,[]),x=>(x.name||'').trim().toLowerCase());trip.documents=JSON.stringify(d);return d;}
function getBudget(trip){if(!trip)return[];const b=dedup(safeParse(trip.budget,[]),x=>(x.name||'').trim().toLowerCase());trip.budget=JSON.stringify(b);return b;}
function getItin(trip){if(!trip)return[];const i=dedup(safeParse(trip.itinerary,[]),x=>`${(x.title||'').trim().toLowerCase()}||${x.date||''}||${x.time||''}`);trip.itinerary=JSON.stringify(i);return i;}
function getMembers(trip){return safeParse(trip.members,['Duy','Vy']);}
function getPacking(trip){
const raw=safeParse(trip.packing,{});const out={};
Object.entries(raw).forEach(([member,data])=>{
const md={outbound:{},return:{}};
['outbound','return'].forEach(stage=>{
const sr=(data&&typeof data==='object')?(data[stage]||(!data.outbound&&!data.return?data:{})):{};
const cleaned={};const seenIds=new Set(),seenK=new Set();
Object.entries(sr).forEach(([g,items])=>{if(!Array.isArray(items))return;const ci=items.filter(it=>{if(!it.id)it.id=genId();const k=`${g.toLowerCase()}||${(it.item||'').toLowerCase()}`;if(seenIds.has(it.id)||seenK.has(k))return false;seenIds.add(it.id);seenK.add(k);return true;});
cleaned[g]=ci;});
md[stage]=cleaned;});
out[member]=md;});
return out;
}

/* ═══════════════════════════════════════════
   §6 — DATA SDK INTEGRATION
   ═══════════════════════════════════════════ */
async function saveTrip(trip){
state.lastUpdate={id:trip.__backendId,ts:Date.now(),data:JSON.parse(JSON.stringify(trip))};
const r=await window.dataSdk.update(trip);
if(r.isError)state.lastUpdate={id:null,ts:0,data:null};
return r;
}

const dataHandler={onDataChanged(data){
state.trips=data;state.recordCount=data.length;
if(state.lastUpdate.id&&(Date.now()-state.lastUpdate.ts<4000)){const i=state.trips.findIndex(x=>x.__backendId===state.lastUpdate.id);if(i!==-1)state.trips[i]={...state.trips[i],...state.lastUpdate.data};}
renderBookshelf();
if(state.currentTrip){const u=state.trips.find(x=>x.__backendId===state.currentTrip.__backendId);if(u){state.currentTrip=u;renderDetail();}}
}};

/* ═══════════════════════════════════════════
   §7 — RENDER FUNCTIONS
   ═══════════════════════════════════════════ */

// -- Progress bar
function renderProgress(containerId,total,done){
const c=$(containerId);if(!c)return;
const p=total>0?Math.round(done/total*100):0;
c.innerHTML=`<div class="flex items-center justify-between text-xs text-gray-500 mb-1 font-medium"><span>${t('progress_label')}</span><span>${p}% (${done}/${total})</span></div><div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div class="h-2 bg-emerald-500" style="width:${p}%"></div></div>`;
}

// -- Action buttons for list items
function actBtns(idx){return `<div class="item-actions flex items-center gap-1 flex-shrink-0"><button type="button" class="act-edit p-1 rounded hover:bg-emerald-50" data-idx="${idx}" aria-label="${t('btn_edit')}">✏️</button><button type="button" class="act-dup p-1 rounded hover:bg-pink-50" data-idx="${idx}" aria-label="${t('btn_duplicate')}">📄</button><button type="button" class="act-del p-1 rounded hover:bg-rose-50" data-idx="${idx}" aria-label="${t('btn_delete')}">🗑️</button></div>`;}

// Note: many render helpers contain long inlined templates; ensure editors preserve backticks.

// Remaining functions omitted for brevity in this automated restore — original file is long.
