import { Router } from "express";
import * as WebPushController from "./modules/push/controller.js";
import * as UsersController from "./modules/users/controller.js";
import * as PokeController from "./modules/poke/controller.js";

export const apiRouter = Router();

apiRouter.get("/ping", (req, res) => {
  res.send("Pong");
});

apiRouter.post("/push/subscribe", WebPushController.subscribe);
apiRouter.post("/push/unsubscribe", WebPushController.unsubscribe);
apiRouter.post("/push/broadcast", WebPushController.broadcast);
apiRouter.post("/push/broadcast/:userId", WebPushController.broadcastToUser);

apiRouter.post("/users/register", UsersController.registerUser);
apiRouter.get("/users/me", UsersController.getCurrentUser); // Todo: Rename temp.

apiRouter.get("/users/all", UsersController.getAllUsers);
apiRouter.get("/users/subscribed", UsersController.getAllSubscribedUsers);

// Features
apiRouter.post("/pokes/:userId", PokeController.pokeUser);

// Todo: Assign user an Avatar based on the id hash/modulo.
