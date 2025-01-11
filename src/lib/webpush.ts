import webpush from "web-push";
import { config } from "../Config.js";
import { WebPushSubscription } from "../models.js";

// Pass webpush as client to constructor. Setup Vapid Details in constructor.
webpush.setVapidDetails(
  "mailto:example@example.org",
  config.secrets.vapidKeyPublic,
  config.secrets.vapidKeyPrivate
);

export const WebPush = {
  async send(subscription: WebPushSubscription, payload: any) {
    return webpush.sendNotification(subscription, payload);
  },
};
