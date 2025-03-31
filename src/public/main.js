import { Api } from "./js/api.js";
import * as WebPush from "./js/webpush.js";
import { renderUsers } from "./js/render.js";

const refreshUsersList = () => Api.getUsers().then(renderUsers);

const init = async () => {
  await Api.registerUser("Guest").then(() => console.log("Registered")); // what if already registered.

  await WebPush.registerServiceWorker().then(() =>
    console.log("Service Worker registered.")
  );

  WebPush.getCurrentSubscription().then((sub) => {
    console.log(sub);
    console.log(JSON.stringify(sub));
  });

  WebPush.subscribe().then(Api.subscribe).then(refreshUsersList);

  refreshUsersList();
};

init();

document
  .querySelector("form#broadcast")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = event.target.elements["message"].value;
    console.log(`Broadcasting: "${message}"`);
    await Api.broadcast(message);

    event.target.reset();
  });

document
  .querySelector("form#subscribe")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    console.log(`Subscribing...`);
    await WebPush.subscribe().then(Api.subscribe);
    refreshUsersList();
  });

document
  .querySelector("form#unsubscribe")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    console.log(`Unsubscribing...`);
    const subscription = await WebPush.getCurrentSubscription();
    console.log("Unsubscribing subscription:", { subscription });
    await WebPush.unsubscribe().then(() => Api.unsubscribe(subscription));
    refreshUsersList();
  });
