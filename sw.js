self.addEventListener('install', e=>{
  e.waitUntil(caches.open('fops-v2-1-4').then(c=>c.addAll(['./','./index.html?v=2.1.4','./404.html','./style.css?v=2.1.4','./app.js?v=2.1.4','./data.js','./manifest.json?v=2.1.4'])));
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});