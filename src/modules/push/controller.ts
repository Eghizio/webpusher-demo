import { Request, Response } from "express";
import { WebPush } from "../../lib/webpush.js";
import { WebPushSubscription } from "../../models.js";
import * as UsersRepository from "../users/repository.js";

export const subscribe = async (req: Request, res: Response) => {
  const subscription = req.body ?? null;
  const id = req.cookies["u"];

  // console.log({ id });

  const sub = await UsersRepository.setUserSubscription(id, subscription);

  res.sendStatus(201);
};

export const unsubscribe = async (req: Request, res: Response) => {
  const subscription = req.body;
  const id = req.cookies["u"];

  // console.log({ id });

  await UsersRepository.setUserSubscription(id, null);

  res.sendStatus(204);
};

export const broadcast = async (req: Request, res: Response) => {
  const message = req.body.message;
  const id = req.cookies["u"];
  // console.log({ id });

  const payload = JSON.stringify({ title: message });

  const subs = await UsersRepository.getAllSubscribedUsers();
  // console.log({ subs });

  const pushes = subs.map(({ subscription }) => {
    return subscription
      ? WebPush.send(subscription, payload)
      : Promise.resolve();
  });

  // console.log(await Promise.all(pushes));

  res.sendStatus(200);
};
