import type { PushSubscription } from "web-push";

export type WebPushSubscription = PushSubscription;
// export type WebPushSubscription = {
//   endpoint: string;
//   expirationTime: null;
//   keys: {
//     p256dh: string;
//     auth: string;
//   };
// };

export type UserEntity = {
  id: string;
  username: string;
  subscription: WebPushSubscription | null;
  user_agent: string | null;
  created_at: Date;
};

export type UserDto = {
  id: string;
  username: string;
  subscribed: boolean;
  createdAt: Date;
};

type Headers = Record<string, string>;
export class ApplicationError extends Error {
  readonly statusCode: number;
  readonly headers?: Headers;

  constructor(message: string, statusCode: number, headers?: Headers) {
    super(message);

    this.name = "ApplicationError";

    // Might be too broad and too specific for Http Error.
    // Some errors ex. Domain Error could be mapped to some HttpError which would be handled in the end.
    this.statusCode = statusCode;
    this.headers = headers;
  }
}
// Could create subclasses with configured names (Domain, Http, Persistence Error etc.).
