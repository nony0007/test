
// --- app.js patched version ---

// Utility for creating elements
function el(tag, attrs, ...children) {
  const element = document.createElement(tag);
  for (let key in attrs || {}) {
    if (key.startsWith('on') && typeof attrs[key] === 'function') {
      element.addEventListener(key.substring(2), attrs[key]);
    } else if (key === 'class') {
      element.className = attrs[key];
    } else if (key === 'style') {
      element.style.cssText = attrs[key];
    } else {
      element.setAttribute(key, attrs[key]);
    }
  }
  for (let child of children) {
    if (typeof child === 'string') child = document.createTextNode(child);
    if (child) element.appendChild(child);
  }
  return element;
}

// Dialog helper
function panelDialog(title) {
  const dlg = el('div', {class: 'dialog'});
  dlg.appendChild(el('h2', {}, title));
  return dlg;
}

// Patched QR Label function with fallback
function openQrLabel(payload){
  const dlg = panelDialog('QR Label');
  const box = el('div',{style:'display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap;'});
  const canvas = el('canvas',{width:'240', height:'240'});
  const img = el('img',{width:'240', height:'240', style:'display:none;border:1px solid #e5e7eb;border-radius:8px;'});
  const meta   = el('div',{class:'small'}, JSON.stringify(payload));
  const actions = el('div',{class:'row'},[
    el('button',{class:'btn ghost', onclick:()=>window.print()},'Print'),
    el('button',{class:'btn', onclick:()=>dlg.remove()},'Close')
  ]);

  box.appendChild(canvas);
  box.appendChild(img);
  dlg.appendChild(box);
  dlg.appendChild(meta);
  dlg.appendChild(actions);
  document.body.prepend(dlg);

  const data = encodeURIComponent(JSON.stringify(payload));

  // 1) Try local canvas (uses qrcode library if present)
  const tryLocal = () => {
    try {
      if (window.QRCode && typeof QRCode.toCanvas === 'function') {
        QRCode.toCanvas(canvas, decodeURIComponent(data), { width: 240 }, err => {
          if (err) { console.error(err); tryRemote(); }
        });
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  // 2) Fallback: remote image QR (works even if scripts are blocked)
  const tryRemote = () => {
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${data}`;
    img.onload = () => { canvas.style.display = 'none'; img.style.display = 'block'; };
    img.onerror = () => { 
      meta.textContent = 'Could not render QR. Copied text to clipboard.'; 
      try{navigator.clipboard.writeText(decodeURIComponent(data));}catch{} 
    }
  };

  if (!tryLocal()) tryRemote();
}
