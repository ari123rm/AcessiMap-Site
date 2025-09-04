/* eslint-disable no-restricted-globals */

// Este código é executado em um ambiente de worker, separado da sua aplicação.

// Importa os scripts do Workbox (fornecidos pelo Google)
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// Este comando inicializa o Workbox
workbox.setConfig({
  debug: false, // Mude para true para ver logs detalhados no console
});

// O Workbox gerencia o ciclo de vida do Service Worker
workbox.precaching.precacheAndRoute([]);
workbox.core.clientsClaim();
self.skipWaiting();

// --- ESTRATÉGIAS DE CACHE ---

// 1. Cache para a página principal e arquivos de "casca" do app (HTML, JS, CSS)
// Estratégia: NetworkFirst - Tenta buscar na rede primeiro, se falhar, usa o cache.
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages-cache',
  })
);

// 2. Cache para assets estáticos (CSS, JS)
// Estratégia: StaleWhileRevalidate - Usa o cache imediatamente e atualiza em segundo plano.
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === 'style' || request.destination === 'script',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources-cache',
  })
);

// 3. Cache para imagens
// Estratégia: CacheFirst - Se a imagem estiver em cache, usa ela. Se não, busca na rede.
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60, // Guarda até 60 imagens
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
      }),
    ],
  })
);