self.addEventListener('install', e=>{
  e.waitUntil(caches.open('fops-v2-1-1').then(c=>c.addAll(['./','./index.html?v=2.1.1','./404.html','./style.css?v=2.1.1','./app.js?v=2.1.1','./data.js','./manifest.json'])));
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});