

var cacheName = 'beta-project-com-step-6-1';

var a = self.registration.scope;
var b = self.location.origin;
var c = a.replace(b, "");

var filesToCache = [
    c
];
if(c == '/')
{
  filesToCache.push('./pub/offline.html');
}
console.log(filesToCache);

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});
self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request).catch(error => {
                // The catch is only triggered if fetch() throws an exception, which will most likely
                // happen due to the server being unreachable.
                // If fetch() returns a valid HTTP response with an response code in the 4xx or 5xx
                // range, the catch() will NOT be called. If you need custom handling for 4xx or 5xx
                // errors, see https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/fallback-response
                console.log('Fetch failed; returning offline page instead.', error);
                return caches.match('./pub/offline.html');
              });
        })
    );
});
