// if (!("serviceWorker" in navigator))
//   throw new Error("Service Worker not supported.");

// if (!("PushManager" in window)) throw new Error("Push not supported.");

// export const registerServiceWorker = async () => {
//   if (!("serviceWorker" in navigator))
//     throw new Error("Service Worker not supported.");

//   /* Service Worker file needs versioning for caching & invalidation. */
//   await navigator.serviceWorker.register("/sw.js", {
//     scope: "/",
//   });
// };

// export const updateServiceWorker = async () => {
//   if (!("serviceWorker" in navigator))
//     throw new Error("Service Worker not supported.");

//   const register = await navigator.serviceWorker.getRegistration();
//   await register.update();
// };

/* https://www.youtube.com/watch?v=87RU7v6Y-bk */
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.getRegistrations().then((registrations) => {
//     for (let registration of registrations) {
//       registration
//         .unregister()
//         .then((unregistered) => console.log(unregistered));
//     }
//   });

//   navigator.serviceWorker
//     .register("/sw.js")
//     .then((registration) => {
//       console.log(
//         "Service worker registration successful with scope: ",
//         registration.scope
//       );
//     })
//     .catch((error) => {
//       console.log("Service worker registration failed: ", error);
//     });
// }
