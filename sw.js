// Service worker: salva l'app sul telefono così funziona anche senza internet.
// Se modifichi index.html, cambia il numero di VERSIONE qui sotto per forzare l'aggiornamento.
var VERSIONE = "magazzino-v1";
var FILE = ["./", "./index.html", "./manifest.webmanifest", "./icon-512.png"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(VERSIONE).then(function(c){ return c.addAll(FILE); }));
  self.skipWaiting();
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(chiavi){
      return Promise.all(chiavi.filter(function(k){ return k !== VERSIONE; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function(trovato){
      if (trovato) return trovato;
      return fetch(e.request).catch(function(){ return caches.match("./index.html"); });
    })
  );
});
