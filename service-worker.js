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
    "revision": "09b785d86f78e97dffa7db050fb9978e"
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
    "url": "assets/js/10.e3c33dd8.js",
    "revision": "d2b59718b1c7395a72920222ff8202ef"
  },
  {
    "url": "assets/js/11.88eb31a4.js",
    "revision": "172c50c73a4a81780c8684c83730b822"
  },
  {
    "url": "assets/js/12.301ebb86.js",
    "revision": "636f7f57ae3421e73a3edb2137b08e29"
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
    "url": "assets/js/16.62974ac2.js",
    "revision": "cfe24c211bbb0b72c6307256928a842a"
  },
  {
    "url": "assets/js/17.a62863f6.js",
    "revision": "b50c2e76a1e245159aaa9e7bb12c1474"
  },
  {
    "url": "assets/js/18.b24bc64c.js",
    "revision": "2a02c602f31bba0a4de59ab304d0b1d4"
  },
  {
    "url": "assets/js/19.4474ba5d.js",
    "revision": "24b1a1697a5d733800259e701a25f6b9"
  },
  {
    "url": "assets/js/2.9cb22fe9.js",
    "revision": "a504f9f01bc0d3179efde3b3981f4aad"
  },
  {
    "url": "assets/js/20.a1d8605a.js",
    "revision": "37477ebffc3ec016a5cc1859e4a1d2f1"
  },
  {
    "url": "assets/js/21.e7e6de69.js",
    "revision": "94e63189da06c93290a6f38043dcb7a6"
  },
  {
    "url": "assets/js/22.afb739b0.js",
    "revision": "f8c7d4c79c0afc56b2432436efc9c229"
  },
  {
    "url": "assets/js/23.2e478a8c.js",
    "revision": "6044148ede489bf8e064ea424399aaf5"
  },
  {
    "url": "assets/js/24.d7d58906.js",
    "revision": "72181fcee69a4e1ff1cf5eb074eda23a"
  },
  {
    "url": "assets/js/25.dae9bc55.js",
    "revision": "7db8f83926d3cbc16cd9a633e1a19b6d"
  },
  {
    "url": "assets/js/26.ae36c541.js",
    "revision": "4061548f4dc22ad207829428afc21c26"
  },
  {
    "url": "assets/js/27.4f1feab9.js",
    "revision": "7286dd631eab332b7c4518c99c52e6a2"
  },
  {
    "url": "assets/js/28.9890476e.js",
    "revision": "b85036f5aeb11a0750c54b76318f7b0a"
  },
  {
    "url": "assets/js/29.473d6f8f.js",
    "revision": "33bfa4b8686db8a59c5f37e3c43f5955"
  },
  {
    "url": "assets/js/3.803b45c9.js",
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
    "url": "assets/js/9.c2aa7dd6.js",
    "revision": "614c8fb316c6fc195ca1072ddc088e8f"
  },
  {
    "url": "assets/js/app.1077b095.js",
    "revision": "cd64e301cbd2deca08a0d4157241c84d"
  },
  {
    "url": "de/index.html",
    "revision": "fe94207b4eece9bfe9f925c43bd5791c"
  },
  {
    "url": "en/addons/API.html",
    "revision": "2e78a42c6710c56efc9318cc28e040e3"
  },
  {
    "url": "en/addons/index.html",
    "revision": "5012e4e71224f3213252043e291c9609"
  },
  {
    "url": "en/addons/OurFirstAddon.html",
    "revision": "6600b2d17d7316829c66005589ac5e99"
  },
  {
    "url": "en/api/Detect.html",
    "revision": "ec6bd18059ab2adb7ac36b40ec37c133"
  },
  {
    "url": "en/api/Guidelines.html",
    "revision": "580f3b94a656718da01c90c04eed71d2"
  },
  {
    "url": "en/api/Ui.html",
    "revision": "48b75b0bec95addb61efccfd472cf73d"
  },
  {
    "url": "en/effects/API.html",
    "revision": "8451570fea8b771bc03faa236ee8e983"
  },
  {
    "url": "en/effects/index.html",
    "revision": "4a992a61f883f726a1094d2aa0a3057c"
  },
  {
    "url": "en/effects/OurFirstEffect.html",
    "revision": "3b2ba60450e4a24e47f78286f3c44ccf"
  },
  {
    "url": "en/json/Authorization.html",
    "revision": "a1553fd603a01279c346c5c115b23abb"
  },
  {
    "url": "en/json/Control.html",
    "revision": "4c59048fd1be9da98a6a45727f88c7b1"
  },
  {
    "url": "en/json/index.html",
    "revision": "3b0cf3f4ee52b22f3b0f180e694d2384"
  },
  {
    "url": "en/json/ServerInfo.html",
    "revision": "dc5b5773df4254960bd9912247a50800"
  },
  {
    "url": "en/json/Subscribe.html",
    "revision": "83b4e5a5da80fd1d031895af73c5ebb0"
  },
  {
    "url": "en/user/advanced/Advanced.html",
    "revision": "a834ace4699349d374aa5b4cd8f81a7a"
  },
  {
    "url": "en/user/advanced/Support.html",
    "revision": "89f550c793b11bd527d77bea6a74b98f"
  },
  {
    "url": "en/user/Configuration.html",
    "revision": "705139d54797cb4c464c6d014967f4e6"
  },
  {
    "url": "en/user/HyperBian.html",
    "revision": "8b644b1504276ca23da5a6b6efb346a7"
  },
  {
    "url": "en/user/index.html",
    "revision": "968e7b1c44ba38b6cf17b9f00d337029"
  },
  {
    "url": "en/user/Installation.html",
    "revision": "f00b03784b68d8a8df2dc4fc64765f34"
  },
  {
    "url": "en/user/LedDevices.html",
    "revision": "b9fa6bf86cf49cb2d1763f82d66e8c13"
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
    "revision": "2a557fe6583e6b8d6bec389e74ccb3b1"
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
