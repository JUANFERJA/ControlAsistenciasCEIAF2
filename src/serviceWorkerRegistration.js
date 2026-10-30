const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(window.location.hostname)
);

export function register() {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

      if (isLocalhost) {
        navigator.serviceWorker.ready
          .then((registration) => {
            registration.unregister().then(() => {
              navigator.serviceWorker.register(swUrl);
            });
          })
          .catch(() => {
            navigator.serviceWorker.register(swUrl);
          });
        return;
      }

      navigator.serviceWorker.register(swUrl).catch((error) => {
        console.error('Error al registrar el service worker:', error);
      });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => registration.unregister());
  }
}
