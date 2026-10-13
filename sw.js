// Buforuje wyłącznie publiczny interfejs; NIGDY API, sesje ani odpowiedzi zdjęć.
const CACHE='tek-raport-shell-v05-3';
const FILES=['./','./index.html','./TEK-ADMIN.html','./app-logo.svg','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('tek-raport-shell-')&&k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
 const allowed=FILES.some(f=>new URL(f,self.location).href===u.href);if(!allowed)return;
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)));
});


