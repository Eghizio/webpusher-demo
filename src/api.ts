import { Router } from "express";
import * as WebPushController from "./modules/push/controller.js";
import * as UsersController from "./modules/users/controller.js";

export const apiRouter = Router();

apiRouter.get("/ping", (req, res) => {
  res.send("Pong");
});

apiRouter.post("/push/subscribe", WebPushController.subscribe);
apiRouter.post("/push/unsubscribe", WebPushController.unsubscribe);
apiRouter.post("/push/broadcast", WebPushController.broadcast);

apiRouter.get("/users/register", UsersController.registerGuestUser);
apiRouter.get("/users/all", UsersController.getAllUsers);
apiRouter.get("/users/subscribed", UsersController.getAllSubscribedUsers);
