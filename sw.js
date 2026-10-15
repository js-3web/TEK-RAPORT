// Cache only the public shell. Never intercept API or account data.
const CACHE='tek-raport-shell-13c2e1d586dd7cd0';
const FILES=['./','./index.html','./TEK-ADMIN.html','./app-logo.svg','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil((async()=>{
 const c=await caches.open(CACHE);
 await c.addAll(FILES.map(f=>new Request(new URL(f,self.location),{cache:'reload'})));
 await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
 await Promise.all((await caches.keys()).filter(k=>k.startsWith('tek-raport-shell-')&&k!==CACHE).map(k=>caches.delete(k)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
 const key=FILES.map(f=>new URL(f,self.location).href).find(f=>f===u.origin+u.pathname);
 if(!key)return;
 e.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const response=await fetch(new Request(e.request,{cache:'no-cache'}));
   if(!response.ok)throw new Error('Shell unavailable');
   await cache.put(key,response.clone());
   return response;
  }catch(error){const saved=await cache.match(key);if(saved)return saved;throw error}
 })());
});
