import { Request, Response } from "express";
import * as UsersRepository from "./repository.js";
import { WebPush } from "../../lib/webpush.js";
import type { UserDto, UserEntity } from "../../models.js";

// Cookie expiration.
const YEAR = 365 * 24 * 60 * 60 * 1_000; // Milliseconds.

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict",
  maxAge: YEAR,
  //   signed: true,
  //   secure: config.environment === "production",
} as const;

const toUserAgent = (ua: string | string[] | undefined): string | null => {
  return Array.isArray(ua) ? ua.toString() : ua || null;
};

export const registerGuestUser = async (req: Request, res: Response) => {
  // todo: get `username` from request.
  const username = "Guest";

  const userAgent = toUserAgent(req.headers["user-agent"]);
  const id: string | null = req.cookies["u"] ?? null;

  if (id) {
    const user = await UsersRepository.getUserById(id);

    if (user) {
      // Already registered. Throw an error?

      if (user.subscription) {
        // Todo: Change Welcome Back message to middleware on `/` entry.
        const payload = JSON.stringify({
          title: `Welcome back ${user.username} 😊`,
        });
        WebPush.send(user.subscription, payload);
      }

      res.sendStatus(400);
      return;
    }
  }

  const generatedId = await UsersRepository.registerGuestUser(
    username,
    userAgent
  );

  res.cookie("u", generatedId, COOKIE_OPTIONS);
  res.sendStatus(201);
};

// Todo: Get Username from frontend to identify the user and display in list to push.

const toDto = (user: UserEntity): UserDto => ({
  id: user.id,
  username: user.username,
  subscribed: Boolean(user.subscription),
  createdAt: user.created_at,
});

export const getAllUsers = async (req: Request, res: Response) => {
  const allUsers = await UsersRepository.getAllUsers();

  const users = allUsers.map(toDto);

  res.json(users);
};

export const getAllSubscribedUsers = async (req: Request, res: Response) => {
  const allSubscribedUsers = await UsersRepository.getAllSubscribedUsers();

  const users = allSubscribedUsers.map(toDto);

  res.json(users);
};
