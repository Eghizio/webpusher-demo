import { Request, Response } from "express";
import { WebPush } from "../../lib/webpush.js";
import * as UsersRepository from "../users/repository.js";
import { UserCookie } from "../../lib/auth.js";

export const pokeUser = async (req: Request, res: Response) => {
  const id = UserCookie.getUserId(req);

  if (!id) {
    res.sendStatus(401);
    return;
  }

  const sender = await UsersRepository.getUserById(id);

  if (!sender) {
    res.sendStatus(400);
    return;
  }

  const userId = req.params["userId"];
  const target = await UsersRepository.getUserById(userId);

  if (!target || !target.subscription) {
    res.sendStatus(400);
    return;
  }

  const payload = JSON.stringify({ title: `${sender.username} has poked you` });
  WebPush.send(target.subscription, payload);

  res.sendStatus(200);
};
