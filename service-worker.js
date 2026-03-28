// service-worker.js

// Importa a versão do config.js
const APP_VERSION = "1.0.0";

// Detecta localhost/Live Server (/) ou GitHub Pages (/Raycasting/)
const isDev = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
const BASE_PATH = isDev ? '/' : '/STM/';
const CACHE_PREFIX = 'STM-';
const CACHE_NAME = CACHE_PREFIX + 'v' + APP_VERSION;
const ASSETS_TO_CACHE = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'style.css',
  BASE_PATH + 'app.js',
  BASE_PATH + 'storage.js',
];

// Evento de instalação - faz cache de todos os arquivos
self.addEventListener('install', event => {
  console.log('Service worker instalado - iniciando cache');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto, adicionando arquivos');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // ativa imediatamente
  );
});

// Evento de ativação - limpa caches antigos
self.addEventListener('activate', event => {
  console.log('Service worker ativado');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName =>
            cacheName.startsWith(CACHE_PREFIX) &&
            cacheName !== CACHE_NAME
          )
          .map(cacheName => {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta requisições (fetch) - estratégia cache-first
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se encontrou no cache, retorna
        if (response) {
          return response;
        }
        
        // Senão, tenta buscar da rede
        return fetch(event.request)
          .then(response => {
            // Se a requisição foi bem-sucedida, adiciona ao cache
            if (!response || response.status !== 200) {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Se falhar na rede, retorna um fallback (se houver)
            console.log('Offline:', event.request.url);
            return caches.match(BASE_PATH + 'index.html');
          });
      })
  );
});