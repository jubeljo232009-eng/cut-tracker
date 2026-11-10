const C="cut-tracker-v1";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
 const url=new URL(e.request.url);
 if(url.origin===location.origin&&(e.request.mode==="navigate"||url.pathname.endsWith("index.html"))){
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put("./index.html",cp));return r}).catch(()=>caches.match("./index.html")));return}
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok||r.type==="opaque"){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r})))});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:"window"}).then(w=>w.length?w[0].focus():self.clients.openWindow("./")))});
