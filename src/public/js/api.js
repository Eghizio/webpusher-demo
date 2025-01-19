import { HttpClient as Http } from "./httpclient.js";

export const Api = {
  subscribe: (subscription) => Http.post("/push/subscribe", { subscription }),
  unsubscribe: (subscription) =>
    Http.post("/push/unsubscribe", { subscription }),
  broadcast: (message) => Http.post("/push/broadcast", { message }),
  broadcastToUser: (userId, message) =>
    Http.post(`/push/broadcast/${userId}`, { message }),

  registerUser: (username) => Http.post("/users/register", { username }),
  getUsers: () => Http.get("/users/all"),
};
