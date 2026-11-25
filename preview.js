"use strict";
const variants = {
 panorama:{title:"Панорамное остекление",src:"assets/panorama-clean.png",position:"65% 52%",mobile:"74% 45%"},
 terrace:{title:"Открытая терраса",src:"assets/terrace-clean.png",position:"65% 52%",mobile:"72% 45%"},
 "long-terrace":{title:"Терраса вдоль фасада",src:"assets/long-terrace-clean.png",position:"65% 52%",mobile:"72% 45%"}
};
const photo=document.querySelector(".a__photo"),status=document.querySelector("#experiment-status"),source=document.querySelector("#source-link"),buttons=[...document.querySelectorAll("[data-house]")];
let selected="panorama", requestId=0;
const images=new Map();
function load(key){if(!images.has(key)){images.set(key,new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=variants[key].src;}));}return images.get(key);}
function position(){photo.style.backgroundPosition=matchMedia("(max-width:780px)").matches?variants[selected].mobile:variants[selected].position;}
async function select(key){if(!variants[key])return;const id=++requestId;status.textContent="Загружаем изображение…";photo.setAttribute("aria-busy","true");try{await load(key);if(id!==requestId)return;selected=key;photo.style.backgroundImage=`url("${variants[key].src}")`;position();photo.setAttribute("aria-label",variants[key].title+", вечерний вариант");buttons.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.house===key)));status.textContent=variants[key].title;source.href=`assets/${key}-source.webp`;const url=new URL(location.href);url.searchParams.set("house",key);history.replaceState(null,"",url);}catch{if(id===requestId)status.textContent="Не удалось загрузить изображение. Нажмите на вариант ещё раз.";}finally{if(id===requestId)photo.removeAttribute("aria-busy");}}
buttons.forEach(b=>b.addEventListener("click",()=>select(b.dataset.house)));
addEventListener("resize",position);
select(new URLSearchParams(location.search).get("house")||"panorama");
if("requestIdleCallback" in window)requestIdleCallback(()=>Object.keys(variants).forEach(k=>load(k).catch(()=>{})));
