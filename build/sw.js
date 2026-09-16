/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "assets/images/avatars-0f8cf8266f.jpg"
  },
  {
    "url": "assets/images/logo-120-7a0c0f7a38.png"
  },
  {
    "url": "assets/images/logo-64-64a63307c9.png"
  },
  {
    "url": "assets/images/logo-e8acd7e9bf.png"
  },
  {
    "url": "assets/images/logo-gray-7d4473f069.png"
  },
  {
    "url": "assets/images/logo-large-ef5e56ccc9.png"
  },
  {
    "url": "assets/images/logo-small-770b141d9d.png"
  },
  {
    "url": "assets/images/pony-541b24abea.png"
  },
  {
    "url": "assets/images/pony2-a176e755fd.png"
  },
  {
    "url": "assets/images/pony2a-a6292b4e18.png"
  },
  {
    "url": "assets/scripts/bootstrap-f93549dbd8.js"
  },
  {
    "url": "assets/styles/style-293640591b.css"
  },
  {
    "url": "/",
    "revision": "5fef301af0d83c9ac1f382444c216b4d"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  "directoryIndex": "/"
});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/"), {
  
  blacklist: [/^\/((a(pi(\d?|-tools)|uth|dm(in)?)|(bl|m)ep)|tools|reload)\/|\.html|^\/sw\.js$/],
});

workbox.routing.registerRoute(/^\/((a(pi(\d?|-tools)|uth|dm(in)?)|(bl|m)ep)|tools|reload)\/|\.html|^\/sw\.js$/, new workbox.strategies.NetworkOnly(), 'GET');
workbox.routing.registerRoute(/^\/assets\/music/, new workbox.strategies.CacheOnly({ "cacheName":"music-cache", plugins: [new workbox.expiration.Plugin({ maxAgeSeconds: 2592000000, purgeOnQuotaError: false })] }), 'GET');
