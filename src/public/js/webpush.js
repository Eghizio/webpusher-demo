import { publicVapidKey } from "../config.js";

if (!("serviceWorker" in navigator))
  throw new Error("Service Worker not supported.");

if (!("PushManager" in window)) throw new Error("Push not supported.");

export const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator))
    throw new Error("Service Worker not supported.");

  /* Service Worker file needs versioning for caching & invalidation. */
  await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
  });
};

export const updateServiceWorker = async () => {
  if (!("serviceWorker" in navigator))
    throw new Error("Service Worker not supported.");

  const register = await navigator.serviceWorker.getRegistration();
  await register.update();
};

const askPermission = () => {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    if (permissionResult !== "granted") {
      throw new Error("We weren't granted permission.");
    }
  });
};

export const getCurrentSubscription = async () =>
  navigator.serviceWorker
    .getRegistration()
    .then((register) => register.pushManager.getSubscription());

export const unsubscribe = async () =>
  getCurrentSubscription().then((sub) => sub?.unsubscribe()); // Handle No subscription.

export const subscribe = async () => {
  const register = await navigator.serviceWorker.getRegistration();
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  return subscription;
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
