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
const I18N={vi:{shelf_heading:"Hành trình khám phá của chúng ta ✈️",create_btn_text:"Thêm chuyến đi",empty_text:"Chưa có hành trình nào — Tạo chuyến đi đầu tiên thôi!",completed_trips_summary:"Chúng ta đã hoàn thành {count} chuyến đi",archived_heading:"Chuyến đi đã lưu trữ 📁",filter_all:"Tất cả chuyến đi",filter_planning:"Đang lên kế hoạch",filter_active:"Đang diễn ra",filter_completed:"Đã hoàn thành",filter_archived:"Đã lưu trữ",sort_newest:"Mới nhất",sort_oldest:"Cũ nhất",sort_name:"Theo tên",tab_documents:"Hồ sơ",tab_budget:"Chi phí",tab_packing:"Hành lý",tab_itinerary:"Lịch trình",budget_col_item:"Hạng mục",budget_col_cost:"Chi phí",budget_col_currency:"Tiền tệ",budget_col_paid:"Đã thanh toán",budget_col_note:"Ghi chú",modal_title_new:"Chuyến đi mới",modal_title_rename:"Đổi tên chuyến đi",modal_title_duplicate:"Nhân bản chuyến đi",modal_label_name:"Tên chuyến đi",modal_label_start:"Ngày bắt đầu",modal_label_end:"Ngày kết thúc",modal_btn_save:"Lưu",modal_btn_cancel:"Hủy",error_duplicate_name:"Tên chuyến đi đã tồn tại",error_empty_name:"Tên chuyến đi không được để trống",menu_rename:"Đổi tên",menu_duplicate:"Nhân bản",menu_archive:"Lưu trữ",menu_reopen:"Mở lại",menu_delete:"Xóa",search_placeholder:"Tìm kiếm hành trình...",no_documents:"Chưa có hồ sơ nào",no_budget:"Chưa có chi phí nào",no_packing:"Chưa có hành lý nào",no_itinerary:"Chưa có lịch trình nào",doc_heading:"Hồ sơ & Giấy tờ",budget_heading:"Chi phí ước tính",itinerary_heading:"Lịch trình",placeholder_name:"Ví dụ: Đài Loan 5N4Đ",btn_saving:"Đang lưu...",untitled:"Chuyến đi chưa đặt tên",no_dates:"Chưa xác định ngày",progress_label:"Tiến độ",card_menu_tooltip:"Tùy chọn",btn_add:"Thêm",btn_edit:"Sửa",btn_duplicate:"Nhân bản",btn_delete:"Xóa",item_name:"Tên mục",item_cost:"Chi phí",item_pic:"Người phụ trách",item_start_date:"Ngày bắt đầu",item_end_date:"Ngày kết thúc",item_notes:"Ghi chú",item_status:"Trạng thái",item_paid:"Đã thanh toán",item_link:"Liên kết",item_category:"Danh mục",item_item:"Vật phẩm",item_date:"Ngày",item_time:"Giờ",item_title:"Tiêu đề",item_location:"Địa điểm",add_doc:"Thêm hồ sơ",edit_doc:"Sửa hồ sơ",add_budget:"Thêm chi phí",edit_budget:"Sửa chi phí",add_packing:"Thêm hành lý",edit_packing:"Sửa hành lý",add_itin:"Thêm lịch trình",edit_itin:"Sửa lịch trình",total:"Tổng",paid_total:"Đã thanh toán",add_member:"Thêm thành viên",member_name:"Tên thành viên",remove_member:"Xóa thành viên",status_draft:"Bản nháp",status_in_progress:"Đang tiến hành",status_ready:"Sẵn sàng",status_done:"Hoàn thành",status_unpaid:"Chưa thanh toán",status_partial:"Một phần",status_paid:"Đã thanh toán",status_not_started:"Chưa chuẩn bị",status_partially_packed:"Đang chuẩn bị",status_packed:"Đã xếp xong",status_planned:"Lên kế hoạch",status_confirmed:"Đã xác nhận",status_completed:"Đã hoàn thành",status_cancelled:"Đã hủy",tab_packing_outbound:"Lượt đi",tab_packing_return:"Lượt về",btn_copy_outbound:"Sao chép từ lượt đi",copy_outbound_tip:"Chặng về chưa có hành lý. Sao chép danh sách từ chặng đi để chuẩn bị nhanh hơn?",no_packing_stage:"Chưa có hành lý nào cho chặng này",no_archived:"Không có chuyến đi lưu trữ nào phù hợp."},en:{shelf_heading:"Our Journey of Discovery ✈️",create_btn_text:"Add trip",empty_text:"No journeys yet — Create your first trip!",completed_trips_summary:"We've completed {count} trips",archived_heading:"Archived Trips 📁",filter_all:"All Trips",filter_planning:"Planning",filter_active:"Ongoing",filter_completed:"Completed",filter_archived:"Archived",sort_newest:"Newest",sort_oldest:"Oldest",sort_name:"By Name",tab_documents:"Documents",tab_budget:"Budget",tab_packing:"Packing",tab_itinerary:"Itinerary",budget_col_item:"Item",budget_col_cost:"Cost",budget_col_currency:"Currency",budget_col_paid:"Paid",budget_col_note:"Notes",modal_title_new:"New Trip",modal_title_rename:"Rename Trip",modal_title_duplicate:"Duplicate Trip",modal_label_name:"Trip Name",modal_label_start:"Start Date",modal_label_end:"End Date",modal_btn_save:"Save",modal_btn_cancel:"Cancel",error_duplicate_name:"Trip name already exists",error_empty_name:"Trip name cannot be empty",menu_rename:"Rename",menu_duplicate:"Duplicate",menu_archive:"Archive",menu_reopen:"Reopen",menu_delete:"Delete",search_placeholder:"Search journeys...",no_documents:"No documents yet",no_budget:"No budget items",no_packing:"No packing items",no_itinerary:"No itinerary items yet",doc_heading:"Documents & Papers",budget_heading:"Estimated Budget",itinerary_heading:"Itinerary",placeholder_name:"e.g. Taiwan 5D4N",btn_saving:"Saving...",untitled:"Untitled",no_dates:"No dates",progress_label:"Progress",card_menu_tooltip:"Options",btn_add:"Add",btn_edit:"Edit",btn_duplicate:"Duplicate",btn_delete:"Delete",item_name:"Item name",item_cost:"Cost",item_pic:"Assignee",item_start_date:"Start date",item_end_date:"End date",item_notes:"Notes",item_status:"Status",item_paid:"Paid",item_link:"Link",item_category:"Category",item_item:"Item",item_date:"Date",item_time:"Time",item_title:"Title",item_location:"Location",add_doc:"Add document",edit_doc:"Edit document",add_budget:"Add budget item",edit_budget:"Edit budget item",add_packing:"Add packing item",edit_packing:"Edit packing item",add_itin:"Add itinerary",edit_itin:"Edit itinerary",total:"Total",paid_total:"Paid",add_member:"Add member",member_name:"Member name",remove_member:"Remove member",status_draft:"Draft",status_in_progress:"In progress",status_ready:"Ready",status_done:"Done",status_unpaid:"Unpaid",status_partial:"Partial",status_paid:"Paid",status_not_started:"Not started",status_partially_packed:"Partially packed",status_packed:"Packed",status_planned:"Planned",status_confirmed:"Confirmed",status_completed:"Completed",status_cancelled:"Cancelled",tab_packing_outbound:"Outbound",tab_packing_return:"Return",btn_copy_outbound:"Copy from outbound",copy_outbound_tip:"No items on the return stage yet. Copy checklist from outbound to quickly prepare?",no_packing_stage:"No packing items for this stage",no_archived:"No matching archived trips found."}};

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

const GRADIENTS=['linear-gradient(135deg,#fbcfe8 0%,#ccfbf1 100%)','linear-gradient(135deg,#fef3c7 0%,#fbcfe8 100%)','linear-gradient(135deg,#ccfbf1 0%,#fdba74 100%)','linear-gradient(135deg,#e0f2fe 0%,#fbcfe8 100%)'];

function fmtCurrency(v,cur){const n=parseFloat(String(v).replace(/[^\d.-]/g,''));if(isNaN(n))return'—';try{return new Intl.NumberFormat(state.lang==='vi'?'vi-VN':'en-US',{style:'currency',currency:cur}).format(n);}catch(e){return n.toLocaleString()+' '+cur;}}
function fmtDate(s){if(!s)return'';try{const d=new Date(s);if(isNaN(d))return s;return d.toLocaleDateString(state.lang==='vi'?'vi-VN':'en-US',{day:'numeric',month:'numeric',year:'numeric'});}catch(e){return s;}}
function fmtTripDates(s){if(!s)return t('no_dates');const p=s.split(' – ');return p.length===2?fmtDate(p[0])+' – '+fmtDate(p[1]):fmtDate(s);}
function fmtTime24(ts){if(!ts)return'';ts=ts.trim().toUpperCase();const pm=ts.includes('PM')||ts.includes('CH');const am=ts.includes('AM')||ts.includes('SA');let c=ts.replace(/[^\d:]/g,'');const p=c.split(':');if(!p[0])return ts;let h=parseInt(p[0],10),m=parseInt(p[1]||'0',10);if(isNaN(h))return ts;if(isNaN(m))m=0;if(pm&&h<12)h+=12;if(am&&h===12)h=0;return String(h%24).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}

function getTripStatus(trip){if(trip.status==='archived')return'archived';const itin=safeParse(trip.itinerary,[]);if(itin.length){const c=itin.filter(i=>i.status==='completed'||i.checked).length;if(c===itin.length)return'completed';if(c>0)return'active';}return trip.status||'planning';}

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
Object.entries(sr).forEach(([g,items])=>{if(!Array.isArray(items))return;const ci=items.filter(it=>{if(!it.id)it.id=genId();const k=`${g.toLowerCase()}||${(it.item||'').toLowerCase()}`;if(seenIds.has(it.id)||seenK.has(k))return false;seenIds.add(it.id);seenK.add(k);return true;});if(ci.length)cleaned[g]=ci;});
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
c.innerHTML=`<div class="flex items-center justify-between text-xs text-gray-500 mb-1 font-medium"><span>${t('progress_label')}</span><span>${p}% (${done}/${total})</span></div><div class="w-full h-2 rounded-full bg-gray-100 overflow-hidden border border-pink-50"><div class="h-full rounded-full bg-gradient-to-r from-pink-300 to-emerald-400 transition-all duration-300" style="width:${p}%"></div></div>`;
}

// -- Action buttons for list items
function actBtns(idx){return`<div class="item-actions flex items-center gap-1 flex-shrink-0"><button type="button" class="act-edit p-1 rounded hover:bg-emerald-50" data-idx="${idx}" aria-label="${t('btn_edit')}"><i data-lucide="pencil" class="w-3.5 h-3.5 text-gray-400"></i></button><button type="button" class="act-dup p-1 rounded hover:bg-blue-50" data-idx="${idx}" aria-label="${t('btn_duplicate')}"><i data-lucide="copy" class="w-3.5 h-3.5 text-gray-400"></i></button><button type="button" class="act-del p-1 rounded hover:bg-red-50" data-idx="${idx}" aria-label="${t('btn_delete')}"><i data-lucide="trash-2" class="w-3.5 h-3.5 text-red-400"></i></button></div>`;}

// -- Tab bar
function renderTabBar(){
const tabs=[{id:'documents',key:'tab_documents'},{id:'budget',key:'tab_budget'},{id:'packing',key:'tab_packing'},{id:'itinerary',key:'tab_itinerary'}];
const bar=$('tab-bar');
bar.innerHTML=tabs.map((td,i)=>`<button type="button" class="tab-btn ${i===0?'active':'text-gray-400'} px-4 py-2 text-sm font-medium" data-tab="${td.id}" role="tab" aria-selected="${i===0}" data-i18n="${td.key}">${t(td.key)}</button>`).join('');
}

// -- Bookshelf (home)
function renderBookshelf(){
const search=$('search-input').value.toLowerCase();
const filter=$('status-filter').value;
const sort=$('sort-select').value;
const shelf=$('bookshelf');
const archivedSection=$('archived-section');
const archivedShelf=$('archived-bookshelf');
const carousel=$('carousel-container');
const summaryEl=$('trip-completed-summary');

// Summary
const cc=state.trips.filter(tr=>{const it=safeParse(tr.itinerary,[]);return it.length&&it.every(i=>i.status==='completed'||i.checked);}).length;
if(summaryEl)summaryEl.innerHTML=t('completed_trips_summary').replace('{count}',cc)+' <i data-lucide="heart" class="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block align-middle ml-1"></i>';

const active=state.trips.filter(x=>getTripStatus(x)!=='archived');
const archived=state.trips.filter(x=>getTripStatus(x)==='archived');
const matchSearch=x=>!search||x.trip_name.toLowerCase().includes(search);
const sortFn=(a,b)=>sort==='newest'?(b.created_at||'').localeCompare(a.created_at||''):sort==='oldest'?(a.created_at||'').localeCompare(b.created_at||''):(a.trip_name||'').localeCompare(b.trip_name||'');

if(filter==='archived'){
carousel.classList.add('hidden');
archivedSection.classList.remove('hidden');
const filtered=archived.filter(matchSearch).sort(sortFn);
if(filtered.length){archivedShelf.innerHTML=filtered.map(renderArchivedCard).join('');}
else{archivedShelf.innerHTML=`<div class="col-span-full text-center py-8 text-gray-400 text-sm italic">${t('no_archived')}</div>`;}
}else{
archivedSection.classList.add('hidden');
carousel.classList.remove('hidden');
let filtered=active.filter(x=>{if(!matchSearch(x))return false;if(filter!=='all'&&getTripStatus(x)!==filter)return false;return true;}).sort(sortFn);
const prev=$('carousel-prev'),next=$('carousel-next');
if(!filtered.length){
prev.classList.add('opacity-30','pointer-events-none');next.classList.add('opacity-30','pointer-events-none');
shelf.innerHTML=`<div class="w-72 sm:w-80 h-[218px] rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/10 flex flex-col items-center justify-center text-center p-6 shrink-0 anim-slide-up"><i data-lucide="map" class="w-10 h-10 text-pink-300 mb-3 animate-pulse"></i><p class="text-sm font-medium text-gray-500 px-2">${t('empty_text')}</p></div><div class="w-72 sm:w-80 h-[218px] rounded-2xl border border-dashed border-pink-100 bg-pink-50/5 flex items-center justify-center shrink-0 opacity-60"><i data-lucide="plane" class="w-8 h-8 text-pink-200/50"></i></div>`;
}else{
prev.classList.remove('opacity-30','pointer-events-none');next.classList.remove('opacity-30','pointer-events-none');
shelf.innerHTML=filtered.map((x,i)=>renderTripCard(x,i)).join('');
}}
lucide.createIcons();
}

function renderTripCard(x,idx){
const cover=x.trip_image?`<img src="${x.trip_image}" class="w-full h-36 object-cover" loading="lazy">`:`<div class="w-full h-36 flex items-center justify-center relative overflow-hidden" style="background:${GRADIENTS[idx%4]}"><i data-lucide="plane" class="w-10 h-10 text-pink-500/60 relative z-10 pointer-events-none"></i></div>`;
return`<div class="book-spine rounded-2xl overflow-hidden border border-pink-100 bg-white shadow-md text-left anim-slide-up relative group cursor-pointer w-72 sm:w-80 shrink-0 snap-start pulse-card" data-id="${x.__backendId}"><div class="relative">${cover}<button type="button" class="menu-btn absolute top-2 right-2 p-2 rounded-full bg-white border border-pink-200 shadow-md z-30 hover:bg-pink-50 transition-colors" data-id="${x.__backendId}" aria-label="${t('card_menu_tooltip')}"><i data-lucide="more-vertical" class="w-4 h-4 text-gray-700 pointer-events-none"></i></button></div><div class="p-3"><h3 class="font-display font-bold text-gray-800 text-sm leading-tight">${esc(x.trip_name||t('untitled'))}</h3><p class="text-xs text-gray-400 mt-1">${fmtTripDates(x.trip_dates)}</p></div></div>`;
}

function renderArchivedCard(x){
const cover=x.trip_image?`<img src="${x.trip_image}" class="w-full h-36 object-cover opacity-60 grayscale" loading="lazy">`:`<div class="w-full h-36 flex items-center justify-center bg-gray-100"><i data-lucide="archive" class="w-10 h-10 text-gray-400 pointer-events-none"></i></div>`;
return`<div class="book-spine rounded-2xl overflow-hidden border border-gray-200 bg-gray-50/85 shadow-sm text-left anim-slide-up relative group cursor-pointer opacity-75" data-id="${x.__backendId}"><div class="relative">${cover}<button type="button" class="menu-btn absolute top-2 right-2 p-2 rounded-full bg-white border border-gray-200 shadow-md z-30 hover:bg-gray-100 transition-colors" data-id="${x.__backendId}" aria-label="${t('card_menu_tooltip')}"><i data-lucide="more-vertical" class="w-4 h-4 text-gray-500 pointer-events-none"></i></button><span class="absolute bottom-2 left-2 px-2 py-0.5 bg-gray-800/70 text-white rounded text-[10px] uppercase font-semibold tracking-wider">${t('filter_archived')}</span></div><div class="p-3"><h3 class="font-display font-bold text-gray-500 text-sm leading-tight line-through">${esc(x.trip_name||t('untitled'))}</h3><p class="text-xs text-gray-400 mt-1">${fmtTripDates(x.trip_dates)}</p></div></div>`;
}

// -- Detail view
function renderDetail(){
if(!state.currentTrip)return;
$('detail-trip-name').textContent=state.currentTrip.trip_name||t('untitled');
renderDocs();renderBudget();renderMembers();renderPacking();renderItin();
}

function renderDocs(){
const docs=getDocs(state.currentTrip);
const done=docs.filter(d=>d.status==='done'||d.checked).length;
renderProgress('doc-progress-container',docs.length,done);
const el=$('doc-list');
if(!docs.length){el.innerHTML=`<p class="text-sm text-gray-400 italic text-center py-4">${t('no_documents')}</p>`;return;}
el.innerHTML=docs.map((d,i)=>{const st=d.status||(d.checked?'done':'draft');const isDone=st==='done';return`<div class="checklist-row flex items-start gap-3 p-3 rounded-lg ${isDone?'checked-row':''}" data-idx="${i}"><button type="button" class="doc-check mt-0.5 w-5 h-5 rounded-full border-2 ${isDone?'bg-emerald-500 border-emerald-500':'border-pink-300'} flex items-center justify-center flex-shrink-0 transition-colors" aria-label="Toggle done">${isDone?'<i data-lucide="check" class="w-3 h-3 text-white"></i>':''}</button><div class="flex-1 min-w-0"><span class="cl-text text-sm text-gray-800">${esc(d.name||'')}</span><div class="flex flex-wrap gap-3 mt-1 text-xs text-gray-400 items-center"><span class="status-badge bg-emerald-50 text-emerald-700">${t('status_'+st)}</span>${d.cost?'<span class="text-amber-600 font-medium>'+esc(d.cost)+'</span>':''}${d.pic?'<span>'+esc(d.pic)+'</span>':''}${d.start_date||d.end_date?'<span>'+fmtDate(d.start_date)+(d.end_date?' – '+fmtDate(d.end_date):'')+'</span>':''}${d.notes?'<span class="italic">'+esc(d.notes)+'</span>':''}</div></div>${actBtns(i)}</div>`;}).join('');
lucide.createIcons();
}

function renderBudget(){
const budget=getBudget(state.currentTrip);
const paid=budget.filter(b=>b.status==='paid'||b.paid).length;
renderProgress('budget-progress-container',budget.length,paid);
const el=$('budget-body');const sumEl=$('budget-summary');
if(!budget.length){el.innerHTML=`<tr><td colspan="6" class="text-center text-gray-400 text-sm py-4 italic">${t('no_budget')}</td></tr>`;sumEl.innerHTML='';return;}
el.innerHTML=budget.map((b,i)=>{const st=b.status||(b.paid?'paid':'unpaid');const isPaid=st==='paid';const cur=b.currency||'VND';return`<tr class="border-t border-pink-50 budget-row hover:bg-pink-50/30" data-idx="${i}"><td class="px-4 py-2">${esc(b.name||'')}</td><td class="px-4 py-2 text-right font-medium">${fmtCurrency(b.cost,cur)}</td><td class="px-4 py-2 text-center text-xs font-semibold text-gray-500">${cur}</td><td class="px-4 py-2 text-center"><button type="button" class="budget-check-btn px-2.5 py-1 rounded-full text-xs font-semibold ${isPaid?'bg-emerald-100 text-emerald-800':'bg-amber-100 text-amber-800'} transition-colors" data-idx="${i}">${t('status_'+st)}</button></td><td class="px-4 py-2 text-xs text-gray-400 italic max-w-[150px] truncate">${esc(b.note||'')}${b.link?` <a href="${esc(b.link)}" target="_blank" rel="noopener noreferrer" class="text-emerald-500 underline">🔗</a>`:''}</td><td class="px-2 py-2">${actBtns(i)}</td></tr>`;}).join('');
const totals={},paidTotals={};budget.forEach(b=>{const cur=b.currency||'VND';const n=parseFloat(String(b.cost||'0').replace(/[^\d.-]/g,''))||0;totals[cur]=(totals[cur]||0)+n;if(b.status==='paid'||(!b.status&&b.paid))paidTotals[cur]=(paidTotals[cur]||0)+n;});
sumEl.innerHTML=Object.keys(totals).map(cur=>`<div class="mt-1">${t('total')} (${cur}): <strong>${fmtCurrency(totals[cur],cur)}</strong> <span class="mx-2">|</span> ${t('paid_total')}: <strong class="text-emerald-600">${fmtCurrency(paidTotals[cur]||0,cur)}</strong></div>`).join('');
lucide.createIcons();
}

function renderMembers(){
const members=getMembers(state.currentTrip);
if(!state.packingMember||!members.includes(state.packingMember))state.packingMember=members[0]||null;
const c=$('members-container');
c.innerHTML=members.map(m=>`<span class="member-chip ${m===state.packingMember?'active':''}" data-member="${esc(m)}"><span class="member-name-text">${esc(m)}</span><span class="member-remove" title="${t('remove_member')}">×</span></span>`).join('')+`<button type="button" class="member-chip add-member-chip" style="border:2px dashed #d1d5db;color:#6b7280" aria-label="${t('add_member')}"><i data-lucide="user-plus" class="w-3.5 h-3.5"></i></button>`;
lucide.createIcons();
}

function renderPacking(){
const packing=getPacking(state.currentTrip);
const md=packing[state.packingMember]||{outbound:{},return:{}};
// Progress
const count=(stage)=>{let t=0,d=0;Object.values(md[stage]||{}).forEach(items=>{if(Array.isArray(items)){t+=items.length;d+=items.filter(i=>i.status==='packed'||i.checked).length;}});return{t,d};};
const out=count('outbound'),ret=count('return');
const pc=$('packing-progress-container');
const pctO=out.t?Math.round(out.d/out.t*100):0;const pctR=ret.t?Math.round(ret.d/ret.t*100):0;
pc.innerHTML=`<div class="p-3 bg-pink-50/20 rounded-xl border border-pink-100/50"><div class="flex items-center justify-between text-xs text-gray-500 mb-1 font-medium"><span class="flex items-center gap-1"><i data-lucide="plane-takeoff" class="w-3.5 h-3.5 text-emerald-600"></i> ${t('tab_packing_outbound')}</span><span>${pctO}% (${out.d}/${out.t})</span></div><div class="w-full h-2 rounded-full bg-gray-100 overflow-hidden border border-pink-50"><div class="h-full rounded-full bg-gradient-to-r from-pink-300 to-emerald-400 transition-all duration-300" style="width:${pctO}%"></div></div></div><div class="p-3 bg-pink-50/20 rounded-xl border border-pink-100/50"><div class="flex items-center justify-between text-xs text-gray-500 mb-1 font-medium"><span class="flex items-center gap-1"><i data-lucide="plane-landing" class="w-3.5 h-3.5 text-emerald-600"></i> ${t('tab_packing_return')}</span><span>${pctR}% (${ret.d}/${ret.t})</span></div><div class="w-full h-2 rounded-full bg-gray-100 overflow-hidden border border-pink-50"><div class="h-full rounded-full bg-gradient-to-r from-pink-300 to-emerald-400 transition-all duration-300" style="width:${pctR}%"></div></div></div>`;

const activeData=md[state.packingStage]||{};
const hasItems=Object.keys(activeData).length>0;
const banner=$('packing-copy-banner');
const outHas=Object.keys(md.outbound||{}).length>0;
if(state.packingStage==='return'&&!hasItems&&outHas)banner.classList.remove('hidden');else banner.classList.add('hidden');

const el=$('packing-list-container');
if(!state.packingMember){el.innerHTML=`<p class="text-sm text-gray-400 italic text-center py-4">${t('no_packing')}</p>`;lucide.createIcons();return;}
if(!hasItems){el.innerHTML=`<p class="text-sm text-gray-400 italic text-center py-4">${t('no_packing_stage')}</p>`;lucide.createIcons();return;}
el.innerHTML=Object.entries(activeData).map(([group,items])=>`<div class="mb-5"><h4 class="text-xs uppercase tracking-wider text-emerald-600 font-semibold mb-2 flex items-center gap-1"><i data-lucide="tag" class="w-3 h-3"></i> ${esc(group)}</h4><div class="space-y-1">${items.map((it,i)=>{const st=it.status||(it.checked?'packed':'not_started');const packed=st==='packed';return`<div class="checklist-row flex items-center gap-3 p-2 rounded-lg ${packed?'checked-row':''}" data-group="${esc(group)}" data-idx="${i}"><button type="button" class="pack-check-btn w-5 h-5 rounded-full border-2 ${packed?'bg-emerald-500 border-emerald-500':'border-pink-300'} flex items-center justify-center flex-shrink-0 transition-colors" aria-label="Toggle packed">${packed?'<i data-lucide="check" class="w-3 h-3 text-white"></i>':''}</button><span class="cl-text text-sm text-gray-700 flex-1">${esc(it.item||'')}</span><span class="status-badge bg-pink-50 text-pink-700 mr-2">${t('status_'+st)}</span>${it.note?'<span class="text-xs text-amber-500 italic mr-2">'+esc(it.note)+'</span>':''}<div class="item-actions flex items-center gap-1 flex-shrink-0"><button type="button" class="pack-edit p-1 rounded hover:bg-emerald-50" data-group="${esc(group)}" data-idx="${i}" aria-label="${t('btn_edit')}"><i data-lucide="pencil" class="w-3.5 h-3.5 text-gray-400"></i></button><button type="button" class="pack-dup p-1 rounded hover:bg-blue-50" data-group="${esc(group)}" data-idx="${i}" aria-label="${t('btn_duplicate')}"><i data-lucide="copy" class="w-3.5 h-3.5 text-gray-400"></i></button><button type="button" class="pack-del p-1 rounded hover:bg-red-50" data-group="${esc(group)}" data-idx="${i}" aria-label="${t('btn_delete')}"><i data-lucide="trash-2" class="w-3.5 h-3.5 text-red-400"></i></button></div></div>`;}).join('')}</div></div>`).join('');
lucide.createIcons();
}

function renderItin(){
const itin=getItin(state.currentTrip);
const done=itin.filter(x=>x.status==='completed'||x.checked).length;
renderProgress('itinerary-progress-container',itin.length,done);
const el=$('itinerary-content');
if(!itin.length){el.innerHTML=`<p class="text-sm text-gray-400 italic text-center py-8">${t('no_itinerary')}</p>`;return;}
el.innerHTML=itin.map((x,i)=>{const st=x.status||(x.checked?'completed':'planned');const isC=st==='completed';return`<div class="itin-row border border-emerald-100 rounded-xl p-4 flex items-start gap-3 hover:border-emerald-300 transition-colors ${isC?'checked-row bg-emerald-50/10':''}" data-idx="${i}"><button type="button" class="itin-check-btn mt-1 w-5 h-5 rounded border-2 ${isC?'bg-emerald-500 border-emerald-500':'border-pink-300'} flex items-center justify-center flex-shrink-0 transition-colors" aria-label="Toggle completed">${isC?'<i data-lucide="check" class="w-3 h-3 text-white"></i>':''}</button><div class="flex-shrink-0 w-20 text-center"><div class="text-xs font-semibold text-emerald-600">${fmtDate(x.date)}</div><div class="text-xs text-gray-400">${fmtTime24(x.time)}</div></div><div class="flex-1 min-w-0"><div class="font-medium text-sm text-gray-800">${esc(x.title||'')}</div>${x.location?'<div class="text-xs text-gray-400 mt-0.5">📍 '+esc(x.location)+'</div>':''}${x.notes?'<div class="text-xs text-gray-400 mt-1 italic">'+esc(x.notes)+'</div>':''}</div><span class="status-badge bg-emerald-50 text-emerald-600">${t('status_'+st)}</span>${actBtns(i)}</div>`;}).join('');
lucide.createIcons();
}

/* ═══════════════════════════════════════════
   §8 — LANGUAGE
   ═══════════════════════════════════════════ */
function setLang(lang){
state.lang=lang;localStorage.setItem('voyage_planner_lang',lang);
$('lang-vi').className=`text-xs font-semibold px-2 py-1 rounded-full transition-all ${lang==='vi'?'bg-emerald-600 text-white':'text-gray-500 hover:text-emerald-600'}`;
$('lang-en').className=`text-xs font-semibold px-2 py-1 rounded-full transition-all ${lang==='en'?'bg-emerald-600 text-white':'text-gray-500 hover:text-emerald-600'}`;
document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(I18N[lang][k])el.textContent=I18N[lang][k];});
$('search-input').placeholder=t('search_placeholder');
$('trip-name-input').placeholder=t('placeholder_name');
buildSelects();renderTabBar();bindTabBar();
renderBookshelf();if(state.currentTrip)renderDetail();
}

function buildSelects(){
$('status-filter').innerHTML=[['all','filter_all'],['planning','filter_planning'],['active','filter_active'],['completed','filter_completed'],['archived','filter_archived']].map(([v,k])=>`<option value="${v}">${t(k)}</option>`).join('');
$('sort-select').innerHTML=[['newest','sort_newest'],['oldest','sort_oldest'],['name','sort_name']].map(([v,k])=>`<option value="${v}">${t(k)}</option>`).join('');
}

/* ═══════════════════════════════════════════
   §9 — EVENT HANDLERS
   ═══════════════════════════════════════════ */

// Tab bar delegation
function bindTabBar(){
$('tab-bar').onclick=e=>{const btn=e.target.closest('.tab-btn');if(!btn)return;
$('tab-bar').querySelectorAll('.tab-btn').forEach(b=>{b.classList.remove('active');b.classList.add('text-gray-400');b.setAttribute('aria-selected','false');});
btn.classList.add('active');btn.classList.remove('text-gray-400');btn.setAttribute('aria-selected','true');
document.querySelectorAll('.tab-content').forEach(c=>c.classList.add('hidden'));
$('tab-'+btn.dataset.tab).classList.remove('hidden');};
}

// Bookshelf click delegation
function bindBookshelf(shelfId){
$(shelfId).addEventListener('click',e=>{
const mb=e.target.closest('.menu-btn');
if(mb){e.stopPropagation();showContextMenu(e,mb.dataset.id);return;}
const card=e.target.closest('[data-id]');
if(card)openTrip(card.dataset.id);
});
}

function openTrip(id){
state.currentTrip=state.trips.find(x=>x.__backendId===id);if(!state.currentTrip)return;
const members=getMembers(state.currentTrip);state.packingMember=members[0]||null;state.packingStage='outbound';updateStageUI();
$('home-view').classList.add('hidden');$('detail-view').classList.remove('hidden');
renderTabBar();bindTabBar();
// Reset to first tab
document.querySelectorAll('.tab-content').forEach((c,i)=>c.classList.toggle('hidden',i!==0));
renderDetail();lucide.createIcons();
}

function updateStageUI(){
const o=$('btn-stage-outbound'),r=$('btn-stage-return');
if(state.packingStage==='outbound'){o.className="px-4 py-1.5 rounded-full text-xs font-medium transition-all bg-emerald-600 text-white";r.className="px-4 py-1.5 rounded-full text-xs font-medium transition-all text-gray-500 hover:text-emerald-600";}
else{r.className="px-4 py-1.5 rounded-full text-xs font-medium transition-all bg-emerald-600 text-white";o.className="px-4 py-1.5 rounded-full text-xs font-medium transition-all text-gray-500 hover:text-emerald-600";}
}

// Item action delegation helper
function handleItemAction(e,tabType){
const eb=e.target.closest('.act-edit');if(eb){openItemModal(tabType,+eb.dataset.idx);return true;}
const db=e.target.closest('.act-dup');if(db){dupItem(tabType,+db.dataset.idx);return true;}
const dl=e.target.closest('.act-del');if(dl){delItem(tabType,+dl.dataset.idx);return true;}
return false;
}

// CRUD helpers
async function delItem(type,idx){
const trip=state.currentTrip;
if(type==='documents'){const a=getDocs(trip);a.splice(idx,1);trip.documents=JSON.stringify(a);} 
else if(type==='budget'){const a=getBudget(trip);a.splice(idx,1);trip.budget=JSON.stringify(a);} 
else if(type==='itinerary'){const a=getItin(trip);a.splice(idx,1);trip.itinerary=JSON.stringify(a);} 
renderDetail();await saveTrip(trip);
}
async function dupItem(type,idx){
const sfx=state.lang==='vi'?' (bản sao)':' (copy)';const trip=state.currentTrip;
if(type==='documents'){const a=getDocs(trip);const it={...a[idx],id:genId(),checked:false,status:'draft'};it.name=(it.name||'')+sfx;a.splice(idx+1,0,it);trip.documents=JSON.stringify(a);} 
else if(type==='budget'){const a=getBudget(trip);const it={...a[idx],id:genId(),paid:false,status:'unpaid'};it.name=(it.name||'')+sfx;a.splice(idx+1,0,it);trip.budget=JSON.stringify(a);} 
else if(type==='itinerary'){const a=getItin(trip);const it={...a[idx],id:genId(),checked:false,status:'planned'};it.title=(it.title||'')+sfx;a.splice(idx+1,0,it);trip.itinerary=JSON.stringify(a);} 
renderDetail();await saveTrip(trip);
}
async function delPackItem(g,i){
const trip=state.currentTrip;const pk=getPacking(trip);const md=pk[state.packingMember]||{outbound:{},return:{}};const sd=md[state.packingStage]||{};
if(sd[g]){sd[g].splice(i,1);if(!sd[g].length)delete sd[g];}
md[state.packingStage]=sd;pk[state.packingMember]=md;trip.packing=JSON.stringify(pk);renderPacking();await saveTrip(trip);
}
async function dupPackItem(g,i){
const sfx=state.lang==='vi'?' (bản sao)':' (copy)';const trip=state.currentTrip;const pk=getPacking(trip);const md=pk[state.packingMember]||{outbound:{},return:{}};const sd=md[state.packingStage]||{};
if(sd[g]&&sd[g][i]){const it={...sd[g][i],id:genId(),checked:false,status:'not_started'};it.item=(it.item||'')+sfx;sd[g].splice(i+1,0,it);} 
md[state.packingStage]=sd;pk[state.packingMember]=md;trip.packing=JSON.stringify(pk);renderPacking();await saveTrip(trip);
}

// Member prompt
function promptMember(existing){
const ov=document.createElement('div');ov.className='fixed inset-0 z-[60] modal-overlay flex items-center justify-center p-4';
ov.innerHTML=`<div class="bg-white rounded-2xl shadow-xl w-full max-w-xs p-5 anim-slide-up"><label class="text-sm font-medium text-gray-600 block mb-2" for="vp-member-inp">${t('member_name')}</label><input type="text" id="vp-member-inp" value="${esc(existing||'')}" class="w-full px-3 py-2 border border-pink-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 mb-3"><div class="flex gap-2"><button type="button" class="vp-ok flex-1 py-2 rounded-full bg-emerald-600 text-white text-sm font-medium">${t('modal_btn_save')}</button><button type="button" class="vp-cancel flex-1 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">${t('modal_btn_cancel')}</button></div></div>`;
document.body.appendChild(ov);const inp=ov.querySelector('#vp-member-inp');inp.focus();inp.select();
return new Promise(res=>{
function done(v){res(v);ov.remove();}
ov.querySelector('.vp-ok').onclick=()=>done(inp.value.trim());
ov.querySelector('.vp-cancel').onclick=()=>done('');
inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();done(inp.value.trim());}if(e.key==='Escape')done('');};
});
}

// Context menu
function showContextMenu(event,id){
event.stopPropagation();event.preventDefault();
const menu=$('context-menu');
if(state.contextTripId===id&&!menu.classList.contains('hidden')){menu.classList.add('hidden');state.contextTripId=null;return;}
state.contextTripId=id;
const mb=event.currentTarget||event.target.closest('.menu-btn');
const r=mb.getBoundingClientRect();
menu.style.top=(r.bottom+4)+'px';menu.style.left=Math.min(r.left,window.innerWidth-200)+'px';
menu.classList.remove('hidden');
const trip=state.trips.find(x=>x.__backendId===id);
$('archive-menu-text').textContent=trip&&trip.status==='archived'?t('menu_reopen'):t('menu_archive');
}

// Trip modal helpers
function openTripModal(title,name,dates){
state.editingTripId=null;state.duplicateSourceTrip=null;
const err=$('trip-name-error');if(err){err.textContent='';err.classList.add('hidden');}
$('modal-title').textContent=title;
$('trip-name-input').value=name||'';
let start='',end='';
if(dates){const parts=dates.split(/ – | - |,/);start=(parts[0]||'').trim();end=(parts[1]||'').trim();
[ start,end ]=[start,end].map(s=>{if(s&&!/^\d{4}-\d{2}-\d{2}$/.test(s)){const d=new Date(s);return isNaN(d)?'':d.toISOString().split('T')[0];}return s;});}
$('trip-start-input').value=start;$('trip-end-input').value=end;
$('modal-overlay').classList.remove('hidden');$('trip-name-input').focus();
}

function closeTripModal(){
$('modal-overlay').classList.add('hidden');state.editingTripId=null;state.duplicateSourceTrip=null;}

// Item modal helpers
function openItemModal(tabType,idx){
state.itemModal={tabType:tabType,idx:idx,group:null};
const titleMap={documents:t('add_doc'),budget:t('add_budget'),itinerary:t('add_itin')};
$('item-modal-title').textContent=titleMap[tabType]||t('btn_add');
const form=$('item-form');form.innerHTML='';
const trip=state.currentTrip;const isNew=idx===null||idx===undefined;
if(tabType==='documents'){
const arr=getDocs(trip);const it=isNew?{name:'',pic:'',cost:'',start_date:'',end_date:'',notes:'',status:'draft'}:arr[idx];
form.innerHTML=`<div><label class="text-xs font-medium text-gray-600">${t('item_name')}</label><input name="name" value="${esc(it.name||'')}" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1"></div><div class="grid grid-cols-2 gap-3"><div><label class="text-xs font-medium text-gray-600">${t('item_pic')}</label><input name="pic" value="${esc(it.pic||'')}" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1"></div><div><label class="text-xs font-medium text-gray-600">${t('item_cost')}</label><input name="cost" value="${esc(it.cost||'')}" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1"></div></div><div><label class="text-xs font-medium text-gray-600">${t('item_notes')}</label><textarea name="notes" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1">${esc(it.notes||'')}</textarea></div>`;
}
else if(tabType==='budget'){
const arr=getBudget(trip);const it=isNew?{name:'',cost:'',currency:'VND',note:'',status:'unpaid'}:arr[idx];
form.innerHTML=`<div><label class="text-xs font-medium text-gray-600">${t('item_name')}</label><input name="name" value="${esc(it.name||'')}" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1"></div><div class="grid grid-cols-2 gap-3"><div><label class="text-xs font-medium text-gray-600">${t('item_cost')}</label><input name="cost" value="${esc(it.cost||'')}" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1"></div><div><label class="text-xs font-medium text-gray-600">${t('budget_col_currency')}</label><input name="currency" value="${esc(it.currency||'VND')}" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1"></div></div><div><label class="text-xs font-medium text-gray-600">${t('item_notes')}</label><textarea name="note" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1">${esc(it.note||'')}</textarea></div>`;
}
else if(tabType==='itinerary'){
const arr=getItin(trip);const it=isNew?{date:'',time:'',title:'',location:'',notes:'',status:'planned'}:arr[idx];
form.innerHTML=`<div class="grid grid-cols-2 gap-3"><div><label class="text-xs font-medium text-gray-600">${t('item_date')}</label><input name="date" type="date" value="${esc(it.date||'')}" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1"></div><div><label class="text-xs font-medium text-gray-600">${t('item_time')}</label><input name="time" value="${esc(it.time||'')}" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1"></div></div><div><label class="text-xs font-medium text-gray-600">${t('item_title')}</label><input name="title" value="${esc(it.title||'')}" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1"></div><div><label class="text-xs font-medium text-gray-600">${t('item_location')}</label><input name="location" value="${esc(it.location||'')}" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1"></div><div><label class="text-xs font-medium text-gray-600">${t('item_notes')}</label><textarea name="notes" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1">${esc(it.notes||'')}</textarea></div>`;
}
state.itemModal={tabType:tabType,idx:idx,group:null};
$('item-modal-overlay').classList.remove('hidden');
$('item-form').querySelectorAll('input,textarea').forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter'&&i.tagName!=='TEXTAREA'){e.preventDefault();$('item-save-btn').click();}}));
}

// Packing modal
function openPackingModal(group,idx){
state.itemModal={tabType:'packing',idx:idx,group:group};
$('item-modal-title').textContent=state.itemModal.idx===null?t('add_packing'):t('edit_packing');
const form=$('item-form');form.innerHTML='';
const pk=getPacking(state.currentTrip);const md=pk[state.packingMember]||{outbound:{},return:{}};const sd=md[state.packingStage]||{};const it=(group&&sd[group]&&sd[group][idx])||{item:'',note:'',status:'not_started'};
form.innerHTML=`<div><label class="text-xs font-medium text-gray-600">${t('item_item')}</label><input name="item" value="${esc(it.item||'')}" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1"></div><div><label class="text-xs font-medium text-gray-600">${t('item_notes')}</label><input name="note" value="${esc(it.note||'')}" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1"></div><div><label class="text-xs font-medium text-gray-600">${t('item_category')}</label><input name="category" value="${esc(group||'Other')}" class="w-full px-3 py-2 rounded-xl border border-pink-100 mt-1"></div>`;
$('item-modal-overlay').classList.remove('hidden');
}

/* ═══════════════════════════════════════════
   §10 — BINDINGS & BOOT
   ═══════════════════════════════════════════ */

function bindEvents(){
// Carousel
$('carousel-prev').onclick=()=>$('bookshelf').scrollBy({left:-320,behavior:'smooth'});
$('carousel-next').onclick=()=>$('bookshelf').scrollBy({left:320,behavior:'smooth'});

// Bookshelf delegation
bindBookshelf('bookshelf');
bindBookshelf('archived-bookshelf');

// Back
$('back-btn').onclick=()=>{$('detail-view').classList.add('hidden');$('home-view').classList.remove('hidden');state.currentTrip=null;};

// Packing stage toggle
$('btn-stage-outbound').onclick=()=>{state.packingStage='outbound';updateStageUI();renderPacking();};
$('btn-stage-return').onclick=()=>{state.packingStage='return';updateStageUI();renderPacking();};

// Copy outbound
$('btn-copy-outbound').onclick=async()=>{
if(!state.currentTrip||!state.packingMember)return;
const pk=getPacking(state.currentTrip);const md=pk[state.packingMember]||{outbound:{},return:{}};
const rd={};Object.entries(md.outbound||{}).forEach(([g,items])=>{if(Array.isArray(items))rd[g]=items.map(it=>({item:it.item||'',note:it.note||'',status:'not_started',checked:false,id:genId()}));});
md.return=rd;pk[state.packingMember]=md;state.currentTrip.packing=JSON.stringify(pk);renderPacking();await saveTrip(state.currentTrip);
};

// Members delegation
$('members-container').addEventListener('click',async e=>{
const rm=e.target.closest('.member-remove');
if(rm){e.stopPropagation();const chip=rm.closest('.member-chip');const name=chip.dataset.member;const members=getMembers(state.currentTrip);if(members.length<=1)return;members.splice(members.indexOf(name),1);state.currentTrip.members=JSON.stringify(members);const pk=getPacking(state.currentTrip);delete pk[name];state.currentTrip.packing=JSON.stringify(pk);if(state.packingMember===name)state.packingMember=members[0]||null;renderDetail();await saveTrip(state.currentTrip);return;}
const add=e.target.closest('.add-member-chip');
if(add){const name=await promptMember('');if(!name)return;const members=getMembers(state.currentTrip);if(members.includes(name))return;members.push(name);state.currentTrip.members=JSON.stringify(members);state.packingMember=name;renderDetail();await saveTrip(state.currentTrip);return;}
const chip=e.target.closest('.member-chip[data-member]');
if(chip){state.packingMember=chip.dataset.member;renderMembers();renderPacking();}
});
$('members-container').addEventListener('dblclick',async e=>{
const chip=e.target.closest('.member-chip[data-member]');if(!chip)return;
const old=chip.dataset.member;const nw=await promptMember(old);if(!nw||nw===old)return;
const members=getMembers(state.currentTrip);if(members.includes(nw))return;
members[members.indexOf(old)]=nw;state.currentTrip.members=JSON.stringify(members);
const pk=getPacking(state.currentTrip);if(pk[old]){pk[nw]=pk[old];delete pk[old];}state.currentTrip.packing=JSON.stringify(pk);
if(state.packingMember===old)state.packingMember=nw;renderDetail();await saveTrip(state.currentTrip);
});

// Doc list
$('doc-list').addEventListener('click',async e=>{
const chk=e.target.closest('.doc-check');
if(chk){const row=chk.closest('[data-idx]');const idx=+row.dataset.idx;const docs=safeParse(state.currentTrip.documents,[]);docs[idx].checked=!docs[idx].checked;docs[idx].status=docs[idx].checked?'done':'draft';state.currentTrip.documents=JSON.stringify(docs);renderDocs();await saveTrip(state.currentTrip);return;}
handleItemAction(e,'documents');
});

// Budget
$('budget-body').addEventListener('click',async e=>{
const chk=e.target.closest('.budget-check-btn');
if(chk){const idx=+chk.dataset.idx;const b=safeParse(state.currentTrip.budget,[]);const ns=(b[idx].status||(b[idx].paid?'paid':'unpaid'))==='paid'?'unpaid':'paid';b[idx].status=ns;b[idx].paid=ns==='paid';state.currentTrip.budget=JSON.stringify(b);renderBudget();await saveTrip(state.currentTrip);return;} 
handleItemAction(e,'budget');
});

// Packing list
$('packing-list-container').addEventListener('click',async e=>{
const chk=e.target.closest('.pack-check-btn');
if(chk){const row=chk.closest('[data-group]');const g=row.dataset.group;const i=+row.dataset.idx;const pk=getPacking(state.currentTrip);const md=pk[state.packingMember]||{outbound:{},return:{}};const sd=md[state.packingStage]||{};if(sd[g]&&sd[g][i]){const ns=(sd[g][i].status||(sd[g][i].checked?'packed':'not_started'))==='packed'?'not_started':'packed';sd[g][i].status=ns;sd[g][i].checked=ns==='packed';md[state.packingStage]=sd;pk[state.packingMember]=md;state.currentTrip.packing=JSON.stringify(pk);renderPacking();await saveTrip(state.currentTrip);}return;}
const pe=e.target.closest('.pack-edit');if(pe){openPackingModal(pe.dataset.group,+pe.dataset.idx);return;}
const pd=e.target.closest('.pack-dup');if(pd){dupPackItem(pd.dataset.group,+pd.dataset.idx);return;}
const pde=e.target.closest('.pack-del');if(pde){delPackItem(pde.dataset.group,+pde.dataset.idx);return;}
});

// Itinerary
$('itinerary-content').addEventListener('click',async e=>{
const chk=e.target.closest('.itin-check-btn');
if(chk){const row=chk.closest('[data-idx]');const idx=+row.dataset.idx;const it=safeParse(state.currentTrip.itinerary,[]);const ns=(it[idx].status||(it[idx].checked?'completed':'planned'))==='completed'?'planned':'completed';it[idx].status=ns;it[idx].checked=ns==='completed';state.currentTrip.itinerary=JSON.stringify(it);renderItin();await saveTrip(state.currentTrip);return;} 
handleItemAction(e,'itinerary');
});

// Add buttons
$('add-doc-btn').onclick=()=>openItemModal('documents',null);
$('add-budget-btn').onclick=()=>openItemModal('budget',null);
$('add-packing-btn').onclick=()=>openPackingModal('',null);
$('add-itin-btn').onclick=()=>openItemModal('itinerary',null);

// Create trip
$('create-trip-btn').onclick=()=>openTripModal(t('modal_title_new'),'','');
$('modal-cancel-btn').onclick=closeTripModal;

// Trip form submit
$('trip-form').addEventListener('submit',async e=>{
e.preventDefault();
const name=$('trip-name-input').value.trim();const start=$('trip-start-input').value;const end=$('trip-end-input').value;
const dates=(start&&end)?`${start} – ${end}`:(start||end||'');
const errEl=$('trip-name-error');
if(!name){errEl.textContent=t('error_empty_name');errEl.classList.remove('hidden');return;}
const dup=state.trips.some(tr=>{if(state.editingTripId&&tr.__backendId===state.editingTripId)return false;return(tr.trip_name||'').trim().toLowerCase()===name.toLowerCase();});
if(dup){errEl.textContent=t('error_duplicate_name');errEl.classList.remove('hidden');return;}
errEl.classList.add('hidden');
const btn=$('modal-save-btn');btn.disabled=true;btn.textContent=t('btn_saving');

if(state.editingTripId){
const trip=state.trips.find(x=>x.__backendId===state.editingTripId);
if(trip){trip.trip_name=name;trip.trip_dates=dates;renderBookshelf();if(state.currentTrip&&state.currentTrip.__backendId===trip.__backendId){state.currentTrip=trip;renderDetail();}await saveTrip(trip);}
}else if(state.duplicateSourceTrip){
if(state.recordCount>=999){btn.disabled=false;btn.textContent=t('modal_btn_save');return;}
const src=state.duplicateSourceTrip;
await window.dataSdk.create({trip_name:name,trip_dates:dates,trip_image:src.trip_image||'',status:src.status||'planning',created_at:new Date().toISOString(),documents:src.documents||'[]',budget:src.budget||'[]',packing:src.packing||'{}',itinerary:src.itinerary||'[]',members:src.members||JSON.stringify(['Duy','Vy']),previous_status:src.previous_status||''});
}else{
if(state.recordCount>=999){btn.disabled=false;btn.textContent=t('modal_btn_save');return;}
await window.dataSdk.create({trip_name:name,trip_dates:dates,trip_image:'',status:'planning',created_at:new Date().toISOString(),documents:'[]',budget:'[]',packing:'{}',itinerary:'[]',members:JSON.stringify(['Duy','Vy']),previous_status:''});
}
btn.disabled=false;btn.textContent=t('modal_btn_save');closeTripModal();
});

// Item modal
$('item-cancel-btn').onclick=()=>$('item-modal-overlay').classList.add('hidden');
$('item-save-btn').onclick=async()=>{
if(state.isSaving)return;const btn=$('item-save-btn');const orig=btn.textContent;
state.isSaving=true;btn.disabled=true;btn.textContent=t('btn_saving');
try{
const form=$('item-form');const fd=new FormData(form);const v={};fd.forEach((val,k)=>v[k]=val);
const{tabType,idx,group}=state.itemModal;const isNew=idx===null||idx===undefined;const trip=state.currentTrip;

if(tabType==='documents'){const arr=getDocs(trip);const sv=v.status||'draft';const obj={id:isNew?genId():(arr[idx]?.id||genId()),name:v.name||'',pic:v.pic||'',cost:v.cost||'',start_date:v.start_date||'',end_date:v.end_date||'',notes:v.notes||'',status:sv,checked:sv==='done'};if(isNew)arr.push(obj);else arr[idx]=obj;trip.documents=JSON.stringify(arr);}
else if(tabType==='budget'){const arr=getBudget(trip);const sv=v.status||'unpaid';const obj={id:isNew?genId():(arr[idx]?.id||genId()),name:v.name||'',cost:String(v.cost||'').replace(/[^\d.]/g,''),currency:v.currency||'VND',status:sv,paid:sv==='paid',note:v.note||'',link:v.link||''};if(isNew)arr.push(obj);else arr[idx]=obj;trip.budget=JSON.stringify(arr);}
else if(tabType==='itinerary'){const arr=getItin(trip);const obj={id:isNew?genId():(arr[idx]?.id||genId()),date:v.date||'',time:fmtTime24(v.time||''),title:v.title||'',location:v.location||'',notes:v.notes||'',status:v.status||'planned',checked:v.status==='completed'};if(isNew)arr.push(obj);else arr[idx]=obj;trip.itinerary=JSON.stringify(arr);} 
else if(tabType==='packing'){const pk=getPacking(trip);const md=pk[state.packingMember]||{outbound:{},return:{}};const sd=md[state.packingStage]||{};const cat=v.category||'Other';const sv=v.status||'not_started';const obj={id:isNew?genId():((sd[group]&&sd[group][idx])?.id||genId()),item:v.item||'',note:v.note||'',status:sv,checked:sv==='packed'};
if(isNew){if(!sd[cat])sd[cat]=[];sd[cat].push(obj);} 
else{if(group!==cat){if(sd[group])sd[group].splice(idx,1);if(sd[group]&&!sd[group].length)delete sd[group];if(!sd[cat])sd[cat]=[];sd[cat].push(obj);}else sd[group][idx]=obj;}
md[state.packingStage]=sd;pk[state.packingMember]=md;trip.packing=JSON.stringify(pk);}

$('item-modal-overlay').classList.add('hidden');renderDetail();await saveTrip(trip);
}finally{btn.disabled=false;btn.textContent=orig;state.isSaving=false;}
};

// Context menu
$('context-menu').addEventListener('click',async e=>{
const btn=e.target.closest('[data-action]');if(!btn||!state.contextTripId)return;
const action=btn.dataset.action;const trip=state.trips.find(x=>x.__backendId===state.contextTripId);
if(!trip)return;$('context-menu').classList.add('hidden');

if(action==='rename'){
state.editingTripId=state.contextTripId;state.duplicateSourceTrip=null;
openTripModal(t('modal_title_rename'),trip.trip_name,trip.trip_dates);
state.editingTripId=state.contextTripId;
}else if(action==='duplicate'){
state.duplicateSourceTrip=trip;state.editingTripId=null;
const sfx=state.lang==='vi'?' (bản sao)':' (copy)';
openTripModal(t('modal_title_duplicate'),(trip.trip_name||'')+sfx,trip.trip_dates);
state.duplicateSourceTrip=trip;
}else if(action==='archive'){
if(trip.status==='archived'){trip.status=trip.previous_status||'planning';trip.previous_status='';}
else{trip.previous_status=trip.status||'planning';trip.status='archived';}
await saveTrip(trip);renderBookshelf();
if(state.currentTrip&&state.currentTrip.__backendId===trip.__backendId){state.currentTrip=trip;renderDetail();}
}else if(action==='delete'){
state.trips=state.trips.filter(x=>x.__backendId!==state.contextTripId);renderBookshelf();await window.dataSdk.delete(trip);
}
});

// Global dismiss
document.addEventListener('click',e=>{if(!e.target.closest('#context-menu')&&!e.target.closest('.menu-btn'))$('context-menu').classList.add('hidden');});
document.addEventListener('keydown',e=>{
if(e.key==='Escape'){
$('context-menu').classList.add('hidden');
if(!$('modal-overlay').classList.contains('hidden'))closeTripModal();
if(!$('item-modal-overlay').classList.contains('hidden'))$('item-modal-overlay').classList.add('hidden');
}
});


/* ═══════════════════════════════════════════
   §11 — SPLASH SCREEN
   ═══════════════════════════════════════════ */
function runSplash(){
const splash=$('splash-screen');if(!splash)return;
const progress=$('splash-progress'),plane=$('splash-plane'),city=$('splash-city');
let done=false;
function dismiss(){if(done)return;done=true;splash.style.transition='opacity .7s ease';splash.style.opacity='0';splash.style.pointerEvents='none';setTimeout(()=>splash.remove(),750);} 
setTimeout(()=>{if(plane){plane.style.transition='all 1.8s cubic-bezier(.25,1,.5,1)';plane.style.opacity='1';plane.style.transform='translate(110px,-10px) rotate(-5deg) scale(1.1)';}},200);
setTimeout(()=>{if(city){city.style.transition='all 1.2s cubic-bezier(.34,1.56,.64,1)';city.style.opacity='1';city.style.transform='translateY(0)';}},900);
setTimeout(()=>{if(plane){plane.style.transition='all 1.5s cubic-bezier(.55,0,1,1)';plane.style.transform='translate(360px,-40px) rotate(-15deg) scale(.8)';plane.style.opacity='0';}},2000);
const dur=3000,start=performance.now();
(function tick(now){if(done)return;const p=Math.min((now-start)/dur*100,100);if(progress)progress.style.width=p+'%';if(p>=100)dismiss();else requestAnimationFrame(tick);})(start);

/* ═══════════════════════════════════════════
   §12 — BOOTSTRAP
   ═══════════════════════════════════════════ */
async function boot(){
runSplash();
buildSelects();
renderTabBar();
bindTabBar();
bindEvents();
setLang(state.lang);
const r=await window.dataSdk.init(dataHandler);
if(!r.isOk)$('bookshelf').innerHTML='<p class="text-center text-red-400 text-sm py-4">Failed to load data.</p>';
lucide.createIcons();
}
boot();

