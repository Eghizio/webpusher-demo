export type WebPushSubscription = {
  endpoint: string;
  expirationTime: null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

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
