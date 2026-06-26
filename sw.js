/* Infaq Santri – minimal SW agar PWA installable & dukung offline ringan */
const CACHE='isa-v3-1';
self.addEventListener('install',e=>{ self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  // Jangan cache request ke Google Apps Script (selalu live)
  if(url.hostname.includes('script.google.com')||url.hostname.includes('googleusercontent.com')) return;
  e.respondWith((async()=>{
    try{
      const net=await fetch(req);
      if(net && net.ok && (url.origin===location.origin)){
        const c=await caches.open(CACHE); c.put(req, net.clone());
      }
      return net;
    }catch(err){
      const c=await caches.open(CACHE); const hit=await c.match(req);
      if(hit) return hit;
      if(req.mode==='navigate'){ const idx=await c.match('./index_v3.html'); if(idx) return idx; }
      throw err;
    }
  })());
});
