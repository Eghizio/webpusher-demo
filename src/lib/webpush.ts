import webpush from "web-push";
import { config } from "../Config.js";
import { WebPushSubscription } from "../models.js";

// Pass webpush as client to constructor. Setup Vapid Details in constructor.
webpush.setVapidDetails(
  `mailto:${config.secrets.vapidSubject}`,
  config.secrets.vapidKeyPublic,
  config.secrets.vapidKeyPrivate
);

export const WebPush = {
  async send(subscription: WebPushSubscription, payload: any) {
    try {
      return await webpush.sendNotification(subscription, payload);
    } catch (error) {
      const data = JSON.stringify(payload, null, 2);
      const sub = JSON.stringify(subscription, null, 2);

      console.error(
        `Failed to send WebPush with payload: ${data} for subscription: ${sub}`,
        error
      );
    }
  },
};
