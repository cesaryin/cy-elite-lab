// CY Elite Lab: el service worker de la app (generado por src/generador/og.py).
// SIN CACHE A PROPOSITO: no hay manejador de 'fetch', asi que nunca guarda ni sirve una
// pagina vieja. Solo existe para los avisos al celular.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { cuerpo: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'CY Elite Lab', {
    body: d.cuerpo || '', icon: '/icono-v1-192.png', badge: '/icono-v1-192.png',
    tag: d.tag || 'cy-elite', data: { url: d.url || '/' }
  }));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (ws) {
    for (var i = 0; i < ws.length; i++) {
      if ('focus' in ws[i]) { ws[i].navigate(url); return ws[i].focus(); }
    }
    return self.clients.openWindow(url);
  }));
});
