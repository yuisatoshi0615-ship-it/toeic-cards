// TOEIC単語帳 Service Worker
const CACHE_NAME = 'toeic-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// バックグラウンド同期：通知スケジュール受信
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFS') {
    const { targets, messages } = e.data;
    // 各時刻のタイマーをセット
    targets.forEach(({ hour, delay, msg }) => {
      if (delay > 0) {
        setTimeout(() => {
          self.registration.showNotification('📚 TOEIC単語帳', {
            body: msg,
            icon: '/toeic-cards/icon-192.png',
            badge: '/toeic-cards/icon-192.png',
            tag: `toeic-${hour}`,
            renotify: true,
            requireInteraction: false,
            data: { url: '/toeic-cards/' }
          });
        }, delay);
      }
    });
  }
});

// 通知クリックでアプリを開く
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const client of list) {
        if (client.url.includes('toeic-cards') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/toeic-cards/');
    })
  );
});
