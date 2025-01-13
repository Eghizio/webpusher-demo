import { Request, Response } from "express";
import { WebPush } from "../../lib/webpush.js";
import * as UsersRepository from "../users/repository.js";

// Todo: Error handling xd.
// Todo: Logger. To Console + File. Morgan + ApplicationLogger.

// Todo: Welcome Push message.
export const subscribe = async (req: Request, res: Response) => {
  const subscription = req.body.subscription ?? null;
  const id = req.cookies["u"];

  const sub = await UsersRepository.setUserSubscription(id, subscription);

  res.sendStatus(201);
};

export const unsubscribe = async (req: Request, res: Response) => {
  const id = req.cookies["u"];

  await UsersRepository.setUserSubscription(id, null);

  res.sendStatus(204);
};

// Todo: /push/broadcast/:userId?message=or_payload_in_body
// Send directly to user.
// Middleware for protecting endpoints via API_KEY. Singular Admin Key?
// (Generating multiple API keys? + Application Cache?)
export const broadcast = async (req: Request, res: Response) => {
  const message = req.body.message;
  const id = req.cookies["u"];

  const payload = JSON.stringify({ title: message });

  const subs = await UsersRepository.getAllSubscribedUsers();

  const pushes = subs.map(({ subscription }) => {
    return subscription
      ? WebPush.send(subscription, payload)
      : Promise.resolve();
  });

  // console.log(await Promise.all(pushes));

  res.sendStatus(200);
};
