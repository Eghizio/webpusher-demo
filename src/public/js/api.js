import { HttpClient } from "./httpclient.js";

const API_URL = "/api/v1"; // "http://localhost:3000/api/v1"
const headers = { "Content-Type": "application/json" };

export const Http = new HttpClient(API_URL, headers);

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
