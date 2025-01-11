import { HttpClient as Http } from "./httpclient.js";

export const Api = {
  subscribe: (subscription) => Http.post("/push/subscribe", subscription),
  unsubscribe: (subscription) => Http.post("/push/unsubscribe", subscription),
  broadcast: (message) => Http.post("/push/broadcast", { message }),

  registerGuestUser: () => Http.get("/users/register"),
  getUsers: () => Http.get("/users/all"),
};
