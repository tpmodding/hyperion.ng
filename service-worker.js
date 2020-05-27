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

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "228274ba6854519855c47dffda3a5b8a"
  },
  {
    "url": "assets/css/0.styles.83e9b54b.css",
    "revision": "7e79518fc38022b193001d03e78fb6af"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.23f56594.js",
    "revision": "e4760a4f14c44341b2858a849266aae0"
  },
  {
    "url": "assets/js/11.f9d93b39.js",
    "revision": "ca1a25693e643561117f8c36a3b059d3"
  },
  {
    "url": "assets/js/12.d089833a.js",
    "revision": "a741c9624f3d8a0e411b643afff76835"
  },
  {
    "url": "assets/js/13.6f012652.js",
    "revision": "d08d06c62f194b2129a576680172e05e"
  },
  {
    "url": "assets/js/14.9ef182a3.js",
    "revision": "dd76a90b1c6de4e9b0f05f774b3c8793"
  },
  {
    "url": "assets/js/15.ac53e7e0.js",
    "revision": "729d9dd40a9002381ca46e7087d0be2f"
  },
  {
    "url": "assets/js/16.d48b21fc.js",
    "revision": "fd1ed6af3cdc963c7dcaf78de9dc7d3d"
  },
  {
    "url": "assets/js/17.9ec82d3f.js",
    "revision": "f443634bdd08032a107fadc31e74c8c4"
  },
  {
    "url": "assets/js/18.70f7fe92.js",
    "revision": "dbd546bd176ff8538813e4e58bf27b58"
  },
  {
    "url": "assets/js/19.f0c828a3.js",
    "revision": "597a7d31efe5aaf10cd4e3129a882e03"
  },
  {
    "url": "assets/js/2.16f09a8a.js",
    "revision": "a504f9f01bc0d3179efde3b3981f4aad"
  },
  {
    "url": "assets/js/20.f8a7213c.js",
    "revision": "b70aad0c9d918951c032a9f6d4e22f05"
  },
  {
    "url": "assets/js/21.e7e6de69.js",
    "revision": "94e63189da06c93290a6f38043dcb7a6"
  },
  {
    "url": "assets/js/22.8e0cabd1.js",
    "revision": "714a086961bc46b0360998c9e42ae533"
  },
  {
    "url": "assets/js/23.0aa9488e.js",
    "revision": "b24ecce161cc8e528c943778e15de6fa"
  },
  {
    "url": "assets/js/24.5f7b667f.js",
    "revision": "236551fdb2650428086b37e874c12396"
  },
  {
    "url": "assets/js/25.ccefedff.js",
    "revision": "0359cf2407afe20e7de7ce409a1338d6"
  },
  {
    "url": "assets/js/26.edc2a867.js",
    "revision": "e6ecd81d96136e1aae5309cabc1c9ac4"
  },
  {
    "url": "assets/js/27.e6ea72f6.js",
    "revision": "3a5198e14568bc64e3779e31ccd5f442"
  },
  {
    "url": "assets/js/28.6af3c074.js",
    "revision": "67d5af5e203f2e676b7825f149df7d61"
  },
  {
    "url": "assets/js/29.473d6f8f.js",
    "revision": "33bfa4b8686db8a59c5f37e3c43f5955"
  },
  {
    "url": "assets/js/3.d2a9a079.js",
    "revision": "ea74496abc2f6e3640be769782209858"
  },
  {
    "url": "assets/js/30.81b5c05b.js",
    "revision": "d210bf7a441a900436d05deec7e95e07"
  },
  {
    "url": "assets/js/31.983dc35c.js",
    "revision": "0e46fb81e274470dcbe72a336b3ddd1f"
  },
  {
    "url": "assets/js/32.48c0800f.js",
    "revision": "9c0042519a6494ede311d0e65c83878d"
  },
  {
    "url": "assets/js/4.a333783b.js",
    "revision": "128f774d010919dc013857a7047074af"
  },
  {
    "url": "assets/js/5.47840f41.js",
    "revision": "a5d6b56f09fd5a5b1268be5c75fe4f48"
  },
  {
    "url": "assets/js/6.9367514b.js",
    "revision": "8a995a5da7354f5f14e80fefd9f13cf1"
  },
  {
    "url": "assets/js/7.b7ccec3b.js",
    "revision": "b3b28897d718335993b9c941ef122c30"
  },
  {
    "url": "assets/js/8.926dd2a7.js",
    "revision": "246ae2298ac408cc28d222180b5e93fa"
  },
  {
    "url": "assets/js/9.131f33d8.js",
    "revision": "76db65c8f4fc644723a12eb0b9006869"
  },
  {
    "url": "assets/js/app.85f98d2c.js",
    "revision": "0bbc989b971b25bb86c27b5bff530f2c"
  },
  {
    "url": "de/index.html",
    "revision": "b613562fe83123f1adfde7e26e6e0037"
  },
  {
    "url": "en/addons/API.html",
    "revision": "dc86e4416cbae2ecd1d10e011ba5ba40"
  },
  {
    "url": "en/addons/index.html",
    "revision": "82a517ffdc1b6588db265f540d138539"
  },
  {
    "url": "en/addons/OurFirstAddon.html",
    "revision": "0c5267ea8458eb70d4cc7c258e6bdb99"
  },
  {
    "url": "en/api/Detect.html",
    "revision": "5638a53c8b49584201aa1e597f68972d"
  },
  {
    "url": "en/api/Guidelines.html",
    "revision": "bc55f501388a5f0b37c4459ac2914fc2"
  },
  {
    "url": "en/api/Ui.html",
    "revision": "8ece02ab6c0e96a2460c953000dabfda"
  },
  {
    "url": "en/effects/API.html",
    "revision": "69f24a7446b77c39bd6548c6eb37aa34"
  },
  {
    "url": "en/effects/index.html",
    "revision": "675c0722e5fa4b378221ce10abc6a534"
  },
  {
    "url": "en/effects/OurFirstEffect.html",
    "revision": "75e4f9720ec611d52e3029a542dc2ed0"
  },
  {
    "url": "en/json/Authorization.html",
    "revision": "6a84de921ba6be5d995db46dccf84710"
  },
  {
    "url": "en/json/Control.html",
    "revision": "9de375d39736525997b610896b078385"
  },
  {
    "url": "en/json/index.html",
    "revision": "88b7269df0a4362e95f92dd113a024e0"
  },
  {
    "url": "en/json/ServerInfo.html",
    "revision": "a9a8a9ac5792505f6b6694cdb94939d8"
  },
  {
    "url": "en/json/Subscribe.html",
    "revision": "a3f7c67c04b0f14e3f83af87e19a6464"
  },
  {
    "url": "en/user/advanced/Advanced.html",
    "revision": "4d847e00acc2e22f1b6f6fcf21ebff72"
  },
  {
    "url": "en/user/advanced/Support.html",
    "revision": "c6603d96b30578b54ef9e7c20aa6f3dd"
  },
  {
    "url": "en/user/Configuration.html",
    "revision": "118ccd01c676d65ab6bf948965bd3779"
  },
  {
    "url": "en/user/HyperBian.html",
    "revision": "2ec11162513a858787438f96cbaf3a06"
  },
  {
    "url": "en/user/index.html",
    "revision": "c16844bf2fef6be8ee5cc348066522ae"
  },
  {
    "url": "en/user/Installation.html",
    "revision": "5b39f8094b27f762bc6067c8a950abcd"
  },
  {
    "url": "en/user/LedDevices.html",
    "revision": "fbbb76a735ef7c8699e5741178a3ab3d"
  },
  {
    "url": "hyperion-logo.png",
    "revision": "7b45f0e37b11274a222268811f6e821b"
  },
  {
    "url": "icons/apple-icon-120x120.png",
    "revision": "5310363c781b9c15c4f3ac59a73e3b63"
  },
  {
    "url": "icons/apple-icon-152x152.png",
    "revision": "58629194b92a3ad0de995f82e24af904"
  },
  {
    "url": "icons/apple-icon-167x167.png",
    "revision": "b10bfc94b3eb0fba64c2a11c940b9e17"
  },
  {
    "url": "icons/apple-icon-180x180.png",
    "revision": "0d49293c63426ec5b6946f362b97a452"
  },
  {
    "url": "icons/apple-launch-1125x2436.png",
    "revision": "9f8f96dd6c8de9f853f8babad699b1c9"
  },
  {
    "url": "icons/apple-launch-1242x2208.png",
    "revision": "7eaccc1a59c4fcffe92a21bc53bfe9ee"
  },
  {
    "url": "icons/apple-launch-1242x2688.png",
    "revision": "f218f534f64bb4cadc26f69286466fe1"
  },
  {
    "url": "icons/apple-launch-1536x2048.png",
    "revision": "f5ab3ee8116e2345b2bf0e096c28f0d4"
  },
  {
    "url": "icons/apple-launch-1668x2224.png",
    "revision": "79c6d66cf0f62a8e4a0274b2b082a3d7"
  },
  {
    "url": "icons/apple-launch-1668x2388.png",
    "revision": "eccc0736edec7fc914b60fbb227cac4d"
  },
  {
    "url": "icons/apple-launch-2048x2732.png",
    "revision": "4a22dec3a72bcbb094f4b0d57a7db25f"
  },
  {
    "url": "icons/apple-launch-640x1136.png",
    "revision": "25b4e430d8b9547998da9b3f3463f722"
  },
  {
    "url": "icons/apple-launch-750x1334.png",
    "revision": "2375e4f7e1bed22f49886a8db7aadfdf"
  },
  {
    "url": "icons/apple-launch-828x1792.png",
    "revision": "268a96c9e5a1f9b91b42c83f2630c32f"
  },
  {
    "url": "icons/favicon-128x128.png",
    "revision": "7fde7bf4a277f4795367404b1218d124"
  },
  {
    "url": "icons/favicon-16x16.png",
    "revision": "167d760fcaaab2e1721103ea5f870d20"
  },
  {
    "url": "icons/favicon-32x32.png",
    "revision": "2e72cabfbdb490eb07e9e495c44e7864"
  },
  {
    "url": "icons/favicon-96x96.png",
    "revision": "e1da949fce8aeed88ea70b16eed30dc4"
  },
  {
    "url": "icons/icon-128x128.png",
    "revision": "7fde7bf4a277f4795367404b1218d124"
  },
  {
    "url": "icons/icon-192x192.png",
    "revision": "88e3e773614a52607ba9664c5236e4c7"
  },
  {
    "url": "icons/icon-256x256.png",
    "revision": "b76a964a2568f71e113b2d82092832ae"
  },
  {
    "url": "icons/icon-384x384.png",
    "revision": "140554afc213f539d78548dbbf9b3e41"
  },
  {
    "url": "icons/icon-512x512.png",
    "revision": "2fe9fb83d0f57d9a79a569f29c71d072"
  },
  {
    "url": "icons/ms-icon-144x144.png",
    "revision": "bbb850753c840119673d50cf9a6854ca"
  },
  {
    "url": "icons/safari-pinned-tab.svg",
    "revision": "146f0e1ea346388f72176e58d5f68177"
  },
  {
    "url": "images/en/avahi-browse.jpg",
    "revision": "03de1d29359b589003aff4b041a1f63b"
  },
  {
    "url": "images/en/http_jsonrpc.jpg",
    "revision": "c237320d34cbed2496fc836681b1605a"
  },
  {
    "url": "images/en/owneff_1.jpg",
    "revision": "cc2b1b0957e3a176a5ce9e450db233cb"
  },
  {
    "url": "images/en/owneff_2.jpg",
    "revision": "030d5b1e039cec2a6859313b4bbac2fe"
  },
  {
    "url": "images/en/owneff_3.gif",
    "revision": "a056840376aba4c22b240df2112250bb"
  },
  {
    "url": "images/en/owneff_4.gif",
    "revision": "03d9004e8bb5bd3014d2d17df0dd2af2"
  },
  {
    "url": "images/en/user_bbmodes.jpg",
    "revision": "1fd1fc941b0e875d8befc702fc427129"
  },
  {
    "url": "images/en/user_config_access.jpg",
    "revision": "e84efcf8139e2d837f7d7354187f5794"
  },
  {
    "url": "images/en/user_config_dash.jpg",
    "revision": "caa761bb871f030e674b6e8122bf3449"
  },
  {
    "url": "images/en/user_config_lang.jpg",
    "revision": "10a4d6094151277680cf71634262d301"
  },
  {
    "url": "images/en/user_gammacurve.png",
    "revision": "7e64a468b663f15dfc523cb14ca93c48"
  },
  {
    "url": "images/en/user_hyperbian_ssh.jpg",
    "revision": "e2e40a64836bb8ce19fad290223172ba"
  },
  {
    "url": "images/en/user_hyperbian_wpa_suppli1.jpg",
    "revision": "bd2b0056d9f4a4f450cc71a2613ca5f1"
  },
  {
    "url": "images/en/user_hyperbian_wpa_suppli2.jpg",
    "revision": "5b08f56e71e8c7592e37f8cacaacd61a"
  },
  {
    "url": "images/en/user_hyperbian_wpa_suppli3.jpg",
    "revision": "e2e40a64836bb8ce19fad290223172ba"
  },
  {
    "url": "images/en/user_ledlayout.jpg",
    "revision": "2815e5ab254a09a7c24af33d169c0e66"
  },
  {
    "url": "images/en/user_ledlayout1.jpg",
    "revision": "6da17c4ff33ca70b66709f4d924ae865"
  },
  {
    "url": "images/en/user_ledlayout2.jpg",
    "revision": "fa9d66601d016ac2ed520b93eff35bee"
  },
  {
    "url": "images/en/user_ledlayout3.jpg",
    "revision": "01d98f6f598d4ab018e58935bd0728c0"
  },
  {
    "url": "index.html",
    "revision": "55a7eac87749b847837cc90dbf897df4"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
