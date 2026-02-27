self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("aethera-cache").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/app.js",
        "/manifest.json"
      ]);
    })
  );
});
