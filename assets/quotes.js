(function(){
"use strict";
const root=document.getElementById("pb-quotes");
if(!root||root.dataset.ready==="1")return;
root.dataset.ready="1";
const RAW="https://raw.githubusercontent.com/rajeshpalshetkar/prasiddh-bharat-quotes/main/";
const INDEX_URL=RAW+"data/quotes-index.json?v=3";
const PAGE_SIZE=20;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const status=root.querySelector(".pb-status"),list=root.querySelector(".pb-list"),detail=root.querySelector(".pb-detail"),search=root.querySelector(".pb-search"),category=root.querySelector(".pb-category");
let quotes=[],visible=PAGE_SIZE,articleCache={};
function go(slug){location.hash=slug?"quote/"+encodeURIComponent(slug):""}
function filteredQuotes(){
 const term=(search.value||"").trim().toLocaleLowerCase("mr-IN"),cat=category.value;
 return quotes.filter(q=>(!cat||q.category===cat)&&(!term||[q.title,q.quote,q.category,...(q.tags||[])].join(" ").toLocaleLowerCase("mr-IN").includes(term)));
}
function renderList(){
 detail.hidden=true;list.hidden=false;list.replaceChildren();
 const found=filteredQuotes(),shown=found.slice(0,visible);
 if(!found.length){list.append(el("div","pb-empty","या शोधासाठी कोणतेही सुविचार सापडले नाहीत."));return}
 const grid=el("div","pb-grid");
 shown.forEach(q=>{
  const card=el("article","pb-card");
  card.append(el("div","pb-meta",(q.category||"सुविचार")+" • "+(q.author||"Prasiddh Bharat")));
  card.append(el("blockquote","",q.quote||q.title));
  (q.tags||[]).slice(0,4).forEach(t=>card.append(el("span","pb-tag",t)));
  const actions=el("div","");actions.style.marginTop="14px";
  const btn=el("button","pb-primary","पूर्ण लेख वाचा");btn.type="button";btn.addEventListener("click",()=>go(q.slug));
  actions.append(btn);card.append(actions);grid.append(card);
 });
 list.append(grid);
 if(shown.length<found.length){
  const moreWrap=el("div","pb-more-wrap");const more=el("button","pb-primary pb-load-more","आणखी सुविचार पहा");
  more.type="button";more.addEventListener("click",()=>{visible+=PAGE_SIZE;renderList()});
  moreWrap.append(more);list.append(moreWrap);
 }
}
async function loadArticle(q){
 if(articleCache[q.articleFile])return articleCache[q.articleFile];
 const response=await fetch(RAW+q.articleFile,{cache:"no-store"});
 if(!response.ok)throw new Error("लेख फाइल उपलब्ध नाही ("+response.status+")");
 const data=await response.json();articleCache[q.articleFile]=data.articles||[];return articleCache[q.articleFile];
}
async function renderDetail(){
 const slug=decodeURIComponent((location.hash.split("/")[1]||"").trim()),q=quotes.find(x=>x.slug===slug);
 if(!q){renderList();return}
 list.hidden=true;detail.hidden=false;detail.replaceChildren();
 const back=el("button","pb-back","← सर्व सुविचारांकडे परत");back.type="button";back.addEventListener("click",()=>go(""));detail.append(back);
 detail.append(el("div","pb-meta",(q.category||"सुविचार")+" • "+(q.author||"Prasiddh Bharat")));
 detail.append(el("h2","",q.title||q.quote));
 const quote=el("blockquote","",q.quote);quote.style.cssText="font-size:20px;font-weight:700;color:#101b36;line-height:1.8";detail.append(quote);
 const loading=el("p","pb-status","लेख लोड होत आहे...");detail.append(loading);
 try{
  const articles=await loadArticle(q),article=articles.find(a=>a.id===q.id);
  if(!article||!article.content)throw new Error("या सुविचाराचा लेख उपलब्ध नाही.");
  loading.remove();const c=article.content;
  [["प्रस्तावना","introduction"],["सुविचाराचा अर्थ","meaning"],["वास्तविक उदाहरण","story"],["स्पष्टीकरण आणि शिकवण","takeaway"]].forEach(([heading,key])=>{if(c[key]){detail.append(el("h3","",heading));detail.append(el("p","",c[key]))}});\n  if(Array.isArray(c.ways)&&c.ways.length){detail.append(el("h3","","ध्येय साध्य करण्यासाठी १० कृतीशील मार्ग"));const ol=el("ol","pb-ways");c.ways.forEach((way)=>{const li=el("li","");li.append(el("strong","",way.title));li.append(el("p","",way.description));ol.append(li)});detail.append(ol)}\n  if(c.callToAction){detail.append(el("h3","","शेवटचा विचार"));detail.append(el("p","",c.callToAction))}
  const actions=el("div","");actions.style.marginTop="20px";
  const copy=el("button","pb-primary","सुविचार कॉपी करा");copy.type="button";copy.addEventListener("click",()=>{const text=q.title+"\n"+q.quote+"\n"+location.href;if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(()=>copy.textContent="कॉपी झाले").catch(()=>copy.textContent="कॉपी करता आले नाही")});
  const share=el("button","pb-secondary","शेअर करा");share.type="button";share.addEventListener("click",()=>{if(navigator.share)navigator.share({title:q.title,text:q.quote,url:location.href}).catch(()=>{});else window.open("https://wa.me/?text="+encodeURIComponent(q.title+" "+location.href),"_blank","noopener")});
  actions.append(copy,share);detail.append(actions);
  document.title=(q.seo&&q.seo.title)||q.title;
 }catch(error){loading.textContent="लेख लोड करता आला नाही. कृपया पुन्हा प्रयत्न करा.";loading.title=error.message}
}
function populateCategories(){[...new Set(quotes.map(q=>q.category).filter(Boolean))].sort().forEach(c=>{const o=document.createElement("option");o.value=c;o.textContent=c;category.append(o)})}
search.addEventListener("input",()=>{visible=PAGE_SIZE;renderList()});
category.addEventListener("change",()=>{visible=PAGE_SIZE;renderList()});
window.addEventListener("hashchange",renderDetail);
fetch(INDEX_URL,{cache:"no-store"}).then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).then(data=>{
 quotes=Array.isArray(data.quotes)?data.quotes.filter(q=>q.publication&&q.publication.status==="published"):[];
 status.hidden=true;populateCategories();renderDetail();
}).catch(error=>{status.textContent="सुविचार लोड होत नाहीत. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.";status.title=error.message});
})();