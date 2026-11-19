(function(){
"use strict";
const root=document.getElementById("pb-quotes");if(!root||root.dataset.ready==="1")return;root.dataset.ready="1";
const DATA_URL="https://raw.githubusercontent.com/rajeshpalshetkar/prasiddh-bharat-quotes/main/data/quotes.json";
const esc=s=>String(s??"");
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const status=root.querySelector(".pb-status"),list=root.querySelector(".pb-list"),detail=root.querySelector(".pb-detail"),search=root.querySelector(".pb-search"),category=root.querySelector(".pb-category");
let quotes=[];
function go(slug){location.hash=slug?"quote/"+encodeURIComponent(slug):""}
function renderList(){
 detail.hidden=true;list.hidden=false;list.replaceChildren();
 const term=(search.value||"").trim().toLocaleLowerCase("mr-IN"),cat=category.value;
 const filtered=quotes.filter(q=>(!cat||q.category===cat)&&(!term||[q.title,q.quote,q.category,...(q.tags||[])].join(" ").toLocaleLowerCase("mr-IN").includes(term)));
 if(!filtered.length){list.append(el("div","pb-empty","या शोधासाठी कोणतेही सुविचार सापडले नाहीत."));return}
 const grid=el("div","pb-grid");
 filtered.forEach(q=>{const card=el("article","pb-card");card.append(el("div","pb-meta",(q.category||"सुविचार")+" • "+(q.author||"Prasiddh Bharat")));card.append(el("blockquote","",q.quote||q.title));(q.tags||[]).slice(0,4).forEach(t=>card.append(el("span","pb-tag",t)));const btn=el("button","pb-primary","पूर्ण लेख वाचा");btn.type="button";btn.addEventListener("click",()=>go(q.slug));card.append(el("div","", ""));card.lastChild.style.marginTop="14px";card.lastChild.append(btn);grid.append(card)});
 list.append(grid);
}
function renderDetail(){
 const slug=decodeURIComponent((location.hash.split("/")[1]||"").trim()),q=quotes.find(x=>x.slug===slug);
 if(!q){renderList();return}
 list.hidden=true;detail.hidden=false;detail.replaceChildren();
 const back=el("button","pb-back","← सर्व सुविचारांकडे परत");back.type="button";back.addEventListener("click",()=>go(""));detail.append(back);
 detail.append(el("div","pb-meta",(q.category||"सुविचार")+" • "+(q.author||"Prasiddh Bharat")));
 detail.append(el("h2","",q.title||q.quote));
 const quote=el("blockquote","",q.quote);quote.style.cssText="font-size:20px;font-weight:700;color:#101b36;line-height:1.8";detail.append(quote);
 const c=q.content||{};
 [["प्रस्तावना","introduction"],["सुविचाराचा अर्थ","meaning"],["वास्तविक उदाहरण","story"],["स्पष्टीकरण आणि शिकवण","takeaway"],["अधिक वाचा","callToAction"]].forEach(([heading,key])=>{if(c[key]){detail.append(el("h3","",heading));detail.append(el("p","",c[key]))}});
 const actions=el("div","");actions.style.marginTop="20px";
 const copy=el("button","pb-primary","सुविचार कॉपी करा");copy.type="button";copy.addEventListener("click",()=>{const text=q.title+"\n"+q.quote+"\n"+(location.href);if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(()=>copy.textContent="कॉपी झाले").catch(()=>copy.textContent="कॉपी करता आले नाही")}else copy.textContent="या ब्राउझरमध्ये कॉपी उपलब्ध नाही"});
 const share=el("button","pb-secondary","शेअर करा");share.type="button";share.addEventListener("click",()=>{if(navigator.share)navigator.share({title:q.title,text:q.quote,url:location.href}).catch(()=>{});else{const u="https://wa.me/?text="+encodeURIComponent(q.title+" "+location.href);window.open(u,"_blank","noopener")}});actions.append(copy,share);detail.append(actions);
 document.title=(q.seo&&q.seo.title)||q.title;
}
function populateCategories(){[...new Set(quotes.map(q=>q.category).filter(Boolean))].sort().forEach(c=>{const o=document.createElement("option");o.value=c;o.textContent=c;category.append(o)})}
search.addEventListener("input",renderList);category.addEventListener("change",renderList);window.addEventListener("hashchange",renderDetail);
fetch(DATA_URL,{cache:"no-store"}).then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).then(data=>{quotes=Array.isArray(data.quotes)?data.quotes.filter(q=>q.publication?.status!=="draft"):[];status.hidden=true;populateCategories();renderDetail();}).catch(err=>{status.textContent="सुविचार लोड होत नाहीत. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.";status.title=err.message});
})();