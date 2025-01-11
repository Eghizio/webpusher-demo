import { MySqlPool } from "../../infrastructure/database/client.js";
import type { UserEntity, WebPushSubscription } from "../../models.js";

const INSERT_USER = `INSERT INTO users (id, username, subscription, user_agent) VALUES (?,?,?,?)`;
const UPDATE_USER_SUBSCRIPTION = `UPDATE users SET subscription = ? WHERE id = ?`;
const SELECT_USERS = `SELECT * FROM users`;
const SELECT_SUBSCRIBED_USERS = `SELECT * FROM users WHERE subscription IS NOT NULL`;
const SELECT_USER = `SELECT * FROM users WHERE id = ?`;

export const registerGuestUser = async (
  username: string,
  userAgent: string | null
): Promise<string> => {
  const id = crypto.randomUUID();
  const values = [id, username, null, userAgent];
  await MySqlPool.execute(INSERT_USER, values);
  return id;
};

export const setUserSubscription = async (
  id: string,
  subscription: WebPushSubscription | null
): Promise<WebPushSubscription | null> => {
  const values = [JSON.stringify(subscription), id];
  await MySqlPool.execute(UPDATE_USER_SUBSCRIPTION, values);
  return subscription;
};

const toUserEntity = (row: any): UserEntity => ({
  id: row.id,
  username: row.username,
  subscription: JSON.parse(row.subscription),
  user_agent: row.user_agent,
  created_at: row.created_at,
});

export const getAllUsers = async (): Promise<UserEntity[]> => {
  const [rows] = await MySqlPool.execute(SELECT_USERS);

  //@ts-ignore
  return Array.from(rows).map(toUserEntity);
};

export const getAllSubscribedUsers = async (): Promise<UserEntity[]> => {
  const [rows] = await MySqlPool.execute(SELECT_SUBSCRIBED_USERS);
  //@ts-ignore
  return Array.from(rows).map(toUserEntity);
};

export const getUserById = async (id: string): Promise<UserEntity | null> => {
  const values = [id];
  const [rows] = await MySqlPool.execute(SELECT_USER, values);

  //@ts-ignore
  return Array.from(rows).length ? toUserEntity(rows[0]) : null;
};
